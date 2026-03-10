import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Users, Crown } from "lucide-react";

interface DirectoryProfile {
  recruiting_stage: string | null;
  target_roles: string[];
  linkedin_url: string | null;
  bio: string | null;
  is_visible_in_directory: boolean;
  is_alumni: boolean;
  open_to_coffee_chats: boolean;
  current_company: string | null;
}

const RECRUITING_STAGES = [
  { value: "exploring", label: "Exploring PM" },
  { value: "applying", label: "Actively Applying" },
  { value: "interviewing", label: "Currently Interviewing" },
  { value: "offer", label: "Received Offer" },
  { value: "not_looking", label: "Not Looking" },
];

const TARGET_ROLE_OPTIONS = [
  "Product Manager",
  "Associate Product Manager",
  "Product Manager Intern",
  "Technical PM",
  "Product Marketing Manager",
  "Product Analyst",
  "UX/Product Designer",
  "Growth PM",
];

const ProfilePage = () => {
  const { user, profile, loading, isGuest, isAdmin, isSuperAdmin, isBlocked, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [directoryProfile, setDirectoryProfile] = useState<DirectoryProfile>({
    recruiting_stage: null,
    target_roles: [],
    linkedin_url: null,
    bio: null,
    is_visible_in_directory: true,
    is_alumni: false,
    open_to_coffee_chats: false,
    current_company: null,
  });
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [saving, setSaving] = useState(false);

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && user && isBlocked) {
      navigate("/blocked");
    } else if (!loading && user && isPmaMember) {
      void loadDirectoryProfile();
    }
  }, [loading, user, isBlocked, isPmaMember, navigate]);

  const loadDirectoryProfile = async () => {
    if (!user) return;
    setLoadingDirectory(true);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("recruiting_stage, target_roles, linkedin_url, bio, is_visible_in_directory, is_alumni, open_to_coffee_chats, current_company")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error loading directory profile:", error);
    } else if (data) {
      setDirectoryProfile({
        recruiting_stage: data.recruiting_stage,
        target_roles: data.target_roles ?? [],
        linkedin_url: data.linkedin_url,
        bio: data.bio,
        is_visible_in_directory: data.is_visible_in_directory ?? true,
        is_alumni: data.is_alumni ?? false,
        open_to_coffee_chats: data.open_to_coffee_chats ?? false,
        current_company: data.current_company,
      });
    }
    setLoadingDirectory(false);
  };

  const saveDirectoryProfile = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        recruiting_stage: directoryProfile.recruiting_stage,
        target_roles: directoryProfile.target_roles,
        linkedin_url: directoryProfile.linkedin_url,
        bio: directoryProfile.bio,
        is_visible_in_directory: directoryProfile.is_visible_in_directory,
        is_alumni: directoryProfile.is_alumni,
        open_to_coffee_chats: directoryProfile.open_to_coffee_chats,
        current_company: directoryProfile.current_company,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your directory profile has been saved.",
      });
    }
    setSaving(false);
  };

  const toggleTargetRole = (role: string) => {
    setDirectoryProfile((prev) => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter((r) => r !== role)
        : [...prev.target_roles, role],
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User exists but profile failed to load - show error with retry
  if (user && !profile) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Profile unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We couldn't load your profile. This can happen right after signup—please try again. If the problem persists, contact PMA support.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => refreshProfile()}>
                Try again
              </Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null; // useEffect will redirect to /auth
  }

  const roleLabel = (profile?.role ?? "guest").toUpperCase();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-3xl mx-auto space-y-6">
        {isGuest && (
          <Card className="border-yellow-400/60 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="py-4">
              <p className="text-sm">
                You currently have <span className="font-semibold">guest</span> access.{" "}
                To become a full PMA member user, please email the PMA leadership email or{" "}
                <a
                  href="mailto:justmax@byu.edu"
                  className="underline font-medium"
                >
                  justmax@byu.edu
                </a>{" "}
                using your <span className="font-mono">@byu.edu</span> address.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{profile?.full_name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-mono">{profile?.email || user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>{roleLabel}</Badge>
              {profile?.is_pma_member && (
                <Badge variant="outline" className="ml-1">
                  PMA Member
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Directory Profile Section - PMA Members Only */}
        {isPmaMember && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Member Directory Profile
              </CardTitle>
              <CardDescription>
                This information is visible to other PMA members in the directory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingDirectory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="visible" className="text-base font-medium">
                        Visible in Directory
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow other PMA members to see your profile
                      </p>
                    </div>
                    <Switch
                      id="visible"
                      checked={directoryProfile.is_visible_in_directory}
                      onCheckedChange={(checked) =>
                        setDirectoryProfile({ ...directoryProfile, is_visible_in_directory: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <Label htmlFor="is_alumni" className="text-base font-medium">
                        I am a BYU Alumni
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Identify yourself as a graduated active member
                      </p>
                    </div>
                    <Switch
                      id="is_alumni"
                      checked={directoryProfile.is_alumni}
                      onCheckedChange={(checked) =>
                        setDirectoryProfile({ ...directoryProfile, is_alumni: checked })
                      }
                    />
                  </div>

                  {directoryProfile.is_alumni && (
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div>
                        <Label htmlFor="coffee_chats" className="text-base font-medium">
                          Open to Coffee Chats
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow students to reach out for a quick chat
                        </p>
                      </div>
                      <Switch
                        id="coffee_chats"
                        checked={directoryProfile.open_to_coffee_chats}
                        onCheckedChange={(checked) =>
                          setDirectoryProfile({ ...directoryProfile, open_to_coffee_chats: checked })
                        }
                      />
                    </div>
                  )}

                  <div className="pb-4 border-b border-border">
                    <Label htmlFor="current_company" className="text-sm font-medium">
                      Current Company
                    </Label>
                    <Input
                      id="current_company"
                      placeholder="e.g. Google, Microsoft, Startup"
                      value={directoryProfile.current_company ?? ""}
                      onChange={(e) =>
                        setDirectoryProfile({ ...directoryProfile, current_company: e.target.value || null })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="pt-2">
                    <Label htmlFor="recruiting_stage" className="text-sm font-medium">
                      Recruiting Stage
                    </Label>
                    <Select
                      value={directoryProfile.recruiting_stage ?? ""}
                      onValueChange={(value) =>
                        setDirectoryProfile({ ...directoryProfile, recruiting_stage: value || null })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your current stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECRUITING_STAGES.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Target Roles</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Select the roles you're interested in
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TARGET_ROLE_OPTIONS.map((role) => (
                        <Badge
                          key={role}
                          variant={directoryProfile.target_roles.includes(role) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTargetRole(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-sm font-medium">
                      LinkedIn URL
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={directoryProfile.linkedin_url ?? ""}
                      onChange={(e) =>
                        setDirectoryProfile({ ...directoryProfile, linkedin_url: e.target.value || null })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell other members about yourself..."
                      value={directoryProfile.bio ?? ""}
                      onChange={(e) =>
                        setDirectoryProfile({ ...directoryProfile, bio: e.target.value || null })
                      }
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={saveDirectoryProfile} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Directory Profile
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Non-member CTA */}
        {!isPmaMember && !isGuest && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-6 flex items-center gap-4">
              <Crown className="w-8 h-8 text-amber-500" />
              <div className="flex-1">
                <h3 className="font-semibold">Become a PMA Member</h3>
                <p className="text-sm text-muted-foreground">
                  Join PMA to access the member directory, job alerts, and more.
                </p>
              </div>
              <Button
                onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", "_blank")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                Join PMA
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          {isPmaMember && (
            <Button variant="outline" asChild>
              <Link to="/members">View Directory</Link>
            </Button>
          )}
          {(isAdmin || isSuperAdmin) && (
            <Button onClick={() => navigate("/admin")}>
              Open Admin Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

