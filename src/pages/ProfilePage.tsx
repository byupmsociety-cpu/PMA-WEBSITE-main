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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Crown, Mail, Shield, ShieldCheck, Briefcase, UserCircle, Settings, Lock } from "lucide-react";

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
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 max-w-full space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your profile information and visibility preferences.</p>
        </div>

        {isGuest && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400/60 rounded-xl p-4 flex gap-4">
            <div className="flex-1">
              <p className="text-[13px] md:text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                You currently have <span className="font-semibold">guest</span> access.{" "}
                To become a full user, please email leadership or{" "}
                <a href="mailto:byupmsociety@gmail.com" className="font-bold underline hover:text-yellow-900 transition-colors">
                  byupmsociety@gmail.com
                </a>{" "}
                using your <span className="font-mono bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-xs">@byu.edu</span> address.
              </p>
            </div>
          </div>
        )}

        {!isPmaMember && !isGuest && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300">Unlock Full Access</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                Join PMA to access the member directory, job alerts, and premium content.
              </p>
            </div>
            <Button
              onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", "_blank")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-sm whitespace-nowrap mt-2 sm:mt-0 w-fit"
            >
              Join PMA
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Profile Summary */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-border/50 shadow-sm relative">
              {/* Cover Banner */}
              <div className="h-28 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
              </div>
              
              <CardContent className="px-6 pb-6 pt-0 relative">
                <div className="flex justify-center -mt-12 mb-4 relative z-10">
                  <Avatar className="h-24 w-24 border-4 border-card bg-muted shadow-sm">
                    <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                      {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : <UserCircle className="h-12 w-12 text-primary-foreground/50"/>}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="text-center space-y-1 mb-6">
                  <h2 className="text-xl font-bold tracking-tight">{profile?.full_name || "Anonymous User"}</h2>
                  <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{profile?.email || user?.email}</span>
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 relative z-0">
                  <div className="flex items-center justify-between text-sm py-2.5 px-3 bg-muted/40 rounded-md border border-border/50">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Account Role
                    </span>
                    <Badge variant="secondary" className="capitalize text-xs font-semibold">{roleLabel}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm py-2.5 px-3 bg-muted/40 rounded-md border border-border/50">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-500" /> Membership
                    </span>
                    {profile?.is_pma_member ? (
                      <Badge variant="default" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-0 text-xs font-semibold">Active Member</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-xs">Inactive</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/30 px-5 pt-4">
                <CardTitle className="text-[11px] font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                  <Settings className="w-3.5 h-3.5" /> Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm h-9 hover:bg-muted/60 font-medium" onClick={() => navigate("/dashboard")}>
                  Return to Dashboard
                </Button>
                {isPmaMember && (
                  <Button variant="ghost" className="w-full justify-start text-sm h-9 hover:bg-muted/60 font-medium" asChild>
                    <Link to="/members">View Member Directory</Link>
                  </Button>
                )}
                {(isAdmin || isSuperAdmin) && (
                  <Button variant="ghost" className="w-full justify-start text-sm h-9 hover:bg-muted/60 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400" onClick={() => navigate("/admin")}>
                    Admin Dashboard
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Configuration Forms */}
          <div className="lg:col-span-2">
            
            {isPmaMember ? (
              <div className="space-y-6">
                
                {loadingDirectory ? (
                  <div className="flex items-center justify-center p-12 bg-card rounded-xl border border-border/50 shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
                  </div>
                ) : (
                  <>
                    {/* Privacy & Networking section */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                      <div className="bg-muted/30 border-b border-border/50 px-6 py-4 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Privacy & Discovery</CardTitle>
                          <CardDescription className="text-xs mt-0.5">Control how others interact with you in the directory.</CardDescription>
                        </div>
                      </div>
                      
                      <CardContent className="p-0">
                        <div className="px-6 py-5 flex items-start justify-between hover:bg-muted/20 transition-colors">
                          <div className="flex-1 pr-6 flex flex-col justify-center">
                            <Label htmlFor="visible" className="text-sm font-semibold cursor-pointer">Visible in Directory</Label>
                            <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">Allow other PMA members to discover your profile and view your details on the Member Directory page.</p>
                          </div>
                          <Switch id="visible" className="mt-1" checked={directoryProfile.is_visible_in_directory} onCheckedChange={(checked) => setDirectoryProfile({ ...directoryProfile, is_visible_in_directory: checked })} />
                        </div>
                        
                        <div className="px-6 py-5 flex items-start justify-between border-t border-border/50 hover:bg-muted/20 transition-colors">
                          <div className="flex-1 pr-6 flex flex-col justify-center">
                            <Label htmlFor="is_alumni" className="text-sm font-semibold cursor-pointer">I am a BYU Alumni</Label>
                            <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">Check this if you have graduated. You will be badged as Alumni in the directory.</p>
                          </div>
                          <Switch id="is_alumni" className="mt-1" checked={directoryProfile.is_alumni} onCheckedChange={(checked) => setDirectoryProfile({ ...directoryProfile, is_alumni: checked })} />
                        </div>

                        {directoryProfile.is_alumni && (
                          <div className="px-6 py-5 flex items-start justify-between border-t border-amber-200/40 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors">
                            <div className="flex-1 pr-6">
                              <Label htmlFor="coffee_chats" className="text-sm font-semibold cursor-pointer text-amber-900 dark:text-amber-300">Open to Coffee Chats</Label>
                              <p className="text-[13px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed mt-1">Let current students know you're open to brief informational interviews and mentorship.</p>
                            </div>
                            <Switch id="coffee_chats" className="mt-1" checked={directoryProfile.open_to_coffee_chats} onCheckedChange={(checked) => setDirectoryProfile({ ...directoryProfile, open_to_coffee_chats: checked })} />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Professional Journey section */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                      <div className="bg-muted/30 border-b border-border/50 px-6 py-4 flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Background & Status</CardTitle>
                          <CardDescription className="text-xs mt-0.5">Your current status and external professional links.</CardDescription>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2.5">
                            <Label htmlFor="current_company" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Current Company</Label>
                            <Input id="current_company" className="h-10 border-border/60" placeholder="e.g. Google, Sandbox, Startup" value={directoryProfile.current_company ?? ""} onChange={(e) => setDirectoryProfile({ ...directoryProfile, current_company: e.target.value || null })} />
                          </div>
                          <div className="space-y-2.5">
                            <Label htmlFor="recruiting_stage" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Recruiting Stage</Label>
                            <Select value={directoryProfile.recruiting_stage ?? ""} onValueChange={(value) => setDirectoryProfile({ ...directoryProfile, recruiting_stage: value || null })}>
                              <SelectTrigger id="recruiting_stage" className="h-10 border-border/60">
                                <SelectValue placeholder="Select your stage" />
                              </SelectTrigger>
                              <SelectContent>
                                {RECRUITING_STAGES.map((stage) => (
                                  <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <Label htmlFor="linkedin" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">LinkedIn URL</Label>
                          <Input id="linkedin" className="h-10 border-border/60" placeholder="https://linkedin.com/in/yourprofile" value={directoryProfile.linkedin_url ?? ""} onChange={(e) => setDirectoryProfile({ ...directoryProfile, linkedin_url: e.target.value || null })} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* About You section */}
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                      <div className="bg-muted/30 border-b border-border/50 px-6 py-4 flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                          <UserCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">About You</CardTitle>
                          <CardDescription className="text-xs mt-0.5">Help others understand your background and goals.</CardDescription>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 space-y-7">
                        <div className="space-y-2.5">
                          <Label htmlFor="bio" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Professional Bio</Label>
                          <Textarea id="bio" placeholder="Tell other members about yourself, your background, and what you're passionate about..." value={directoryProfile.bio ?? ""} onChange={(e) => setDirectoryProfile({ ...directoryProfile, bio: e.target.value || null })} rows={4} className="resize-none border-border/60 focus-visible:ring-1" />
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Target Roles</Label>
                            <p className="text-[13px] text-muted-foreground leading-snug">Select the product management roles you are primarily interested in pursuing.</p>
                          </div>
                          <div className="flex flex-wrap gap-2.5 pt-2">
                            {TARGET_ROLE_OPTIONS.map((role) => (
                              <Badge key={role} variant={directoryProfile.target_roles.includes(role) ? "default" : "outline"} className={`cursor-pointer px-4 py-1.5 transition-all text-sm font-medium border-border/60 ${directoryProfile.target_roles.includes(role) ? 'bg-primary/90 hover:bg-primary shadow-sm border-transparent' : 'hover:bg-muted/50 text-foreground'}`} onClick={() => toggleTargetRole(role)}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      
                      <div className="bg-muted/20 border-t border-border/50 px-6 py-5 flex justify-end items-center">
                        <Button onClick={saveDirectoryProfile} disabled={saving} className="min-w-40 shadow-sm font-semibold" size="lg">
                          {saving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            ) : (
              <Card className="border-border/50 shadow-sm flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Directory Locked</h3>
                <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">Public directory profiles are an exclusive feature available only to verified PMA members.</p>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

