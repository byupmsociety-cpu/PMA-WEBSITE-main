import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Trophy, 
  Target, 
  Users, 
  BookOpen, 
  Briefcase, 
  Network,
  CheckCircle2,
  Sparkles,
  Camera,
  Mail,
  UserCircle,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  persona: string | null;
  progress_percentage: number | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  school_year: string | null;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string | null;
  category: string;
  step_order: number;
  persona: string;
  completed?: boolean;
}

interface UserBadge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  earned_at: string | null;
}

interface PeerActivity {
  user_name: string;
  step_title: string;
  persona: string;
  completed_at: string;
}

const categoryIcons = {
  learning: <BookOpen className="h-4 w-4" />,
  networking: <Network className="h-4 w-4" />,
  practice: <Target className="h-4 w-4" />,
  applying: <Briefcase className="h-4 w-4" />,
};

const categoryColors = {
  learning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  networking: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  practice: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  applying: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const sectionColors = {
  curious: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  starting: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  recruiting: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
};

const personaLabels = {
  curious: "Exploring PM",
  starting: "Starting PM Path",
  recruiting: "Recruiting for PM",
};

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allSteps, setAllSteps] = useState<JourneyStep[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [peerActivity, setPeerActivity] = useState<PeerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSchoolYear, setEditedSchoolYear] = useState("");
  const [editedPersona, setEditedPersona] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes and redirect if signed out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await Promise.all([
      loadProfile(user.id),
      loadAllJourneySteps(user.id),
      loadUserBadges(user.id),
      loadPeerActivity()
    ]);
    
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("persona, progress_percentage, full_name, email, avatar_url, school_year")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      return;
    }

    setProfile(data);
    setEditedName(data.full_name || "");
    setEditedSchoolYear(data.school_year || "");
    setEditedPersona(data.persona || "");
  };

  const loadAllJourneySteps = async (userId: string) => {
    // Load all steps from all personas
    const { data: steps, error: stepsError } = await supabase
      .from("pm_journey_steps")
      .select("*")
      .order("persona")
      .order("step_order");

    if (stepsError) {
      console.error("Error loading steps:", stepsError);
      return;
    }

    const { data: progress } = await supabase
      .from("user_progress")
      .select("step_id, completed")
      .eq("user_id", userId);

    const progressMap = new Map(progress?.map(p => [p.step_id, p.completed]) || []);
    
    const stepsWithProgress = steps?.map(step => ({
      ...step,
      completed: progressMap.get(step.id) || false
    })) || [];

    setAllSteps(stepsWithProgress);
  };

  const loadUserBadges = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_badges")
      .select(`
        id,
        earned_at,
        badges (
          name,
          description,
          icon
        )
      `)
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) {
      console.error("Error loading badges:", error);
      return;
    }

    const formattedBadges = data?.map(ub => ({
      id: ub.id,
      name: (ub.badges as any).name,
      description: (ub.badges as any).description,
      icon: (ub.badges as any).icon,
      earned_at: ub.earned_at
    })) || [];

    setUserBadges(formattedBadges);
  };

  const loadPeerActivity = async () => {
    // Get current user to filter them out
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: progressData, error } = await supabase
      .from("user_progress")
      .select("user_id, step_id, completed_at")
      .eq("completed", true)
      .not("completed_at", "is", null)
      .neq("user_id", user.id) // Exclude current user
      .order("completed_at", { ascending: false })
      .limit(15);

    if (error) {
      console.error("Error loading peer activity:", error);
      return;
    }

    if (!progressData || progressData.length === 0) {
      console.log("No peer activity found");
      return;
    }

    // Get user profiles and steps separately
    const userIds = [...new Set(progressData.map(p => p.user_id))];
    const stepIds = [...new Set(progressData.map(p => p.step_id))];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name, persona, school_year")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Error loading profiles:", profilesError);
    }

    const { data: steps } = await supabase
      .from("pm_journey_steps")
      .select("id, title, persona")
      .in("id", stepIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, { name: p.full_name, persona: p.persona, school_year: p.school_year }]) || []);
    const stepMap = new Map(steps?.map(s => [s.id, { title: s.title, persona: s.persona }]) || []);

    const activities = progressData
      .map(activity => {
        const stepInfo = stepMap.get(activity.step_id);
        const userInfo = profileMap.get(activity.user_id);
        return {
          user_name: userInfo?.name || "Anonymous",
          step_title: stepInfo?.title || "Unknown",
          persona: stepInfo?.persona || "curious",
          completed_at: activity.completed_at || ""
        };
      })
      .filter(activity => activity.user_name !== "Anonymous"); // Filter out users with no profile

    console.log("Loaded peer activity:", activities.length, "activities");
    setPeerActivity(activities);
  };

  const updatePersona = async (persona: "curious" | "starting" | "recruiting") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ persona, onboarding_completed: true })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update persona",
        variant: "destructive"
      });
      return;
    }

    // Award previous section badges based on selected persona
    await awardPreviousSectionBadges(user.id, persona);

    await loadProfile(user.id);
    await loadAllJourneySteps(user.id);

    toast({
      title: "Welcome to your PM journey! 🚀",
      description: "Your personalized dashboard is ready",
    });
  };

  const awardPreviousSectionBadges = async (userId: string, persona: string) => {
    const badgesToAward: string[] = [];

    // Get badge IDs
    const { data: badges } = await supabase
      .from("badges")
      .select("id, name")
      .in("name", ["Exploring PM Complete", "Starting PM Complete"]);

    const badgeMap = new Map(badges?.map(b => [b.name, b.id]) || []);

    // If starting or recruiting, award Exploring PM Complete
    if (persona === "starting" || persona === "recruiting") {
      const exploringBadgeId = badgeMap.get("Exploring PM Complete");
      if (exploringBadgeId) badgesToAward.push(exploringBadgeId);
    }

    // If recruiting, also award Starting PM Complete
    if (persona === "recruiting") {
      const startingBadgeId = badgeMap.get("Starting PM Complete");
      if (startingBadgeId) badgesToAward.push(startingBadgeId);
    }

    // Award the badges
    for (const badgeId of badgesToAward) {
      await supabase
        .from("user_badges")
        .upsert({
          user_id: userId,
          badge_id: badgeId
        }, {
          onConflict: "user_id,badge_id",
          ignoreDuplicates: true
        });
    }

    if (badgesToAward.length > 0) {
      await loadUserBadges(userId);
    }
  };

  const checkAndAwardBadges = async (userId: string) => {
    // Check section completion
    const curiousComplete = curiousSteps.every(s => s.completed);
    const startingComplete = startingSteps.every(s => s.completed);
    const recruitingComplete = recruitingSteps.every(s => s.completed);

    const badgesToAward: string[] = [];

    // Get badge IDs
    const { data: badges } = await supabase
      .from("badges")
      .select("id, name")
      .in("name", ["Exploring PM Complete", "Starting PM Complete", "Recruiting PM Complete"]);

    const badgeMap = new Map(badges?.map(b => [b.name, b.id]) || []);

    // Check which badges to award
    if (curiousComplete) badgesToAward.push(badgeMap.get("Exploring PM Complete")!);
    if (startingComplete) badgesToAward.push(badgeMap.get("Starting PM Complete")!);
    if (recruitingComplete) badgesToAward.push(badgeMap.get("Recruiting PM Complete")!);

    // Award badges that aren't already earned
    for (const badgeId of badgesToAward) {
      if (!badgeId) continue;
      
      const { error } = await supabase
        .from("user_badges")
        .upsert({
          user_id: userId,
          badge_id: badgeId
        }, {
          onConflict: "user_id,badge_id",
          ignoreDuplicates: true
        });

      if (!error) {
        await loadUserBadges(userId);
      }
    }

    // Check for PMA Champion badge
    const { data: allUserBadges } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId);

    const { data: allBadges } = await supabase
      .from("badges")
      .select("id, name")
      .not("name", "eq", "PMA Champion");

    if (allUserBadges && allBadges && allUserBadges.length >= allBadges.length - 1) {
      const { data: championBadge } = await supabase
        .from("badges")
        .select("id")
        .eq("name", "PMA Champion")
        .single();

      if (championBadge) {
        await supabase
          .from("user_badges")
          .upsert({
            user_id: userId,
            badge_id: championBadge.id
          }, {
            onConflict: "user_id,badge_id",
            ignoreDuplicates: true
          });

        toast({
          title: "🏆 PMA Champion! 🏆",
          description: "You've earned all badges! Contact PMA leadership for your merch!",
        });
      }
    }
  };

  const toggleStepCompletion = async (stepId: string, currentStatus: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: user.id,
        step_id: stepId,
        completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null
      }, {
        onConflict: "user_id,step_id"
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
      return;
    }

    await loadAllJourneySteps(user.id);
    await loadProfile(user.id);
    await checkAndAwardBadges(user.id);

    if (!currentStatus) {
      toast({
        title: "Step Completed! 🎉",
        description: "Keep up the great work on your PM journey!",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await loadProfile(user.id);
      toast({
        title: "Avatar Updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates: any = { 
      full_name: editedName,
      school_year: editedSchoolYear
    };

    // If persona changed, award previous badges
    if (editedPersona !== profile?.persona) {
      updates.persona = editedPersona;
      await awardPreviousSectionBadges(user.id, editedPersona);
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return;
    }

    await loadProfile(user.id);
    await loadAllJourneySteps(user.id);
    setEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const profileLabels = {
    curious: "Curious About PM",
    starting: "Starting My PM Path",
    recruiting: "Actively Recruiting for PM"
  };

  // Show persona selection if not set
  if (!profile?.persona) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl">Welcome to Your Dashboard, {profile?.full_name}! 🎉</CardTitle>
                <p className="text-muted-foreground text-base">
                  First, tell us where you are in your PM journey so we can personalize your experience
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <button
                  onClick={() => updatePersona("curious")}
                  className="p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left space-y-2 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Curious About PM</h3>
                      <p className="text-sm text-muted-foreground">Just exploring what product management is all about</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => updatePersona("starting")}
                  className="p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left space-y-2 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Starting My PM Path</h3>
                      <p className="text-sm text-muted-foreground">Building skills and preparing for a PM career</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => updatePersona("recruiting")}
                  className="p-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left space-y-2 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Actively Recruiting for PM</h3>
                      <p className="text-sm text-muted-foreground">Ready to apply and land a PM role</p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Organize steps by persona
  const curiousSteps = allSteps.filter(s => s.persona === "curious");
  const startingSteps = allSteps.filter(s => s.persona === "starting");
  const recruitingSteps = allSteps.filter(s => s.persona === "recruiting");

  // Determine which sections should be marked as completed
  const userPersona = profile.persona;
  const isCuriousCompleted = userPersona === "starting" || userPersona === "recruiting";
  const isStartingCompleted = userPersona === "recruiting";

  const renderStepSection = (title: string, steps: JourneyStep[], sectionCompleted: boolean, icon: React.ReactNode, colorClass: string) => (
    <Collapsible defaultOpen={true}>
      <div className={`space-y-4 p-6 rounded-lg border-2 ${colorClass}`}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                sectionCompleted ? "bg-primary/20" : "bg-muted"
              }`}>
                {sectionCompleted ? <CheckCircle2 className="h-5 w-5 text-primary" /> : icon}
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {title}
                  {sectionCompleted && <Badge variant="secondary">Completed</Badge>}
                </h2>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border transition-all ${
                  step.completed || sectionCompleted
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={step.completed || sectionCompleted}
                    onCheckedChange={() => toggleStepCompletion(step.id, step.completed || false)}
                    disabled={sectionCompleted}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${(step.completed || sectionCompleted) ? "line-through text-muted-foreground" : ""}`}>
                            {index + 1}. {step.title}
                          </span>
                          {(step.completed || sectionCompleted) && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <Badge className={categoryColors[step.category as keyof typeof categoryColors]}>
                        <span className="flex items-center gap-1">
                          {categoryIcons[step.category as keyof typeof categoryIcons]}
                          {step.category}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Collapsible defaultOpen={true}>
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Profile</CardTitle>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || <UserCircle className="h-12 w-12" />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {editingProfile && (
                      <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                        {uploadingAvatar ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Camera className="h-4 w-4 text-white" />
                        )}
                      </label>
                    )}
                  </div>
                  {editingProfile ? (
                    <div className="w-full space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schoolYear">School Year</Label>
                        <select
                          id="schoolYear"
                          value={editedSchoolYear}
                          onChange={(e) => setEditedSchoolYear(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="">Select year</option>
                          <option value="Freshman">Freshman</option>
                          <option value="Sophomore">Sophomore</option>
                          <option value="Junior">Junior</option>
                          <option value="Senior">Senior</option>
                          <option value="Graduate">Graduate</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="persona">PM Journey Stage</Label>
                        <select
                          id="persona"
                          value={editedPersona}
                          onChange={(e) => setEditedPersona(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="curious">Curious About PM</option>
                          <option value="starting">Starting My PM Path</option>
                          <option value="recruiting">Actively Recruiting for PM</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveProfile} className="flex-1">Save</Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setEditingProfile(false);
                            setEditedName(profile?.full_name || "");
                            setEditedSchoolYear(profile?.school_year || "");
                            setEditedPersona(profile?.persona || "");
                          }} 
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{profile?.full_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
                          <Mail className="h-3 w-3" />
                          {profile?.email}
                        </p>
                        {profile?.school_year && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {profile.school_year}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setEditingProfile(true)} className="w-full">
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Journey Stage</span>
                      <Badge variant="secondary">{profileLabels[userPersona as keyof typeof profileLabels]}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{profile?.progress_percentage}%</span>
                    </div>
                  </div>
                </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Tabs for Badges, Connect, Share */}
            <Collapsible defaultOpen={true}>
              <Card>
                <CollapsibleTrigger className="w-full px-6 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Activity</h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Tabs defaultValue="badges" className="w-full pt-4">
                    <TabsList className="w-full grid grid-cols-3 mx-6" style={{ width: 'calc(100% - 3rem)' }}>
                      <TabsTrigger value="badges" className="text-xs">Badges</TabsTrigger>
                      <TabsTrigger value="connect" className="text-xs">Connect</TabsTrigger>
                      <TabsTrigger value="share" className="text-xs">Share</TabsTrigger>
                    </TabsList>
                
                <TabsContent value="badges" className="p-4 space-y-3">
                  {userBadges.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {userBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-1"
                        >
                          <div className="text-2xl">{badge.icon}</div>
                          <p className="text-xs font-semibold">{badge.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Trophy className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p className="text-xs">Complete steps to earn badges!</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="connect" className="p-4 space-y-3">
                  {peerActivity.length > 0 ? (
                    peerActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {activity.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-semibold">{activity.user_name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            completed <span className="font-medium text-foreground">{activity.step_title}</span>
                          </p>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-1">
                            {personaLabels[activity.persona as keyof typeof personaLabels]}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                      <p className="text-xs">Be the first to complete a step!</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="share" className="p-4 space-y-3">
                  <div className="text-center space-y-3">
                    <Sparkles className="h-10 w-10 mx-auto text-primary" />
                    <div>
                      <h4 className="font-semibold text-sm">Share Your Story</h4>
                      <p className="text-xs text-muted-foreground">Inspire others by sharing your PM journey</p>
                    </div>
                    <Button size="sm" className="w-full" onClick={() => navigate("/contact")}>
                      Submit Your Story
                    </Button>
                  </div>
                </TabsContent>
                  </Tabs>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Main Content - Journey Checklist */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Your PM Journey</h1>
              <p className="text-muted-foreground">
                Track your progress through the complete PM career path
              </p>
            </div>

            {renderStepSection("Exploring PM", curiousSteps, isCuriousCompleted, <BookOpen className="h-5 w-5 text-primary" />, sectionColors.curious)}
            {renderStepSection("Starting PM Path", startingSteps, isStartingCompleted, <Target className="h-5 w-5 text-primary" />, sectionColors.starting)}
            {renderStepSection("Recruiting for PM", recruitingSteps, false, <Briefcase className="h-5 w-5 text-primary" />, sectionColors.recruiting)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
