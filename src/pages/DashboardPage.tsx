import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Target, 
  Users, 
  BookOpen, 
  Briefcase, 
  Network,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  persona: string | null;
  progress_percentage: number | null;
  full_name: string | null;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string | null;
  category: string;
  step_order: number;
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

const DashboardPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [peerActivity, setPeerActivity] = useState<PeerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await Promise.all([
      loadProfile(user.id),
      loadJourneySteps(user.id),
      loadUserBadges(user.id),
      loadPeerActivity()
    ]);
    
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("persona, progress_percentage, full_name")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      return;
    }

    setProfile(data);
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

    await loadProfile(user.id);
    await loadJourneySteps(user.id);

    toast({
      title: "Welcome to your PM journey! 🚀",
      description: "Your personalized dashboard is ready",
    });
  };

  const loadJourneySteps = async (userId: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("persona")
      .eq("user_id", userId)
      .single();

    if (!profileData?.persona) return;

    const { data: steps, error: stepsError } = await supabase
      .from("pm_journey_steps")
      .select("*")
      .eq("persona", profileData.persona)
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

    setJourneySteps(stepsWithProgress);
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
    const { data, error } = await supabase
      .from("user_progress")
      .select(`
        completed_at,
        pm_journey_steps (title),
        profiles (full_name)
      `)
      .eq("completed", true)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error loading peer activity:", error);
      return;
    }

    const activities = data?.map(activity => ({
      user_name: (activity.profiles as any)?.full_name || "Anonymous",
      step_title: (activity.pm_journey_steps as any)?.title || "Unknown",
      completed_at: activity.completed_at || ""
    })) || [];

    setPeerActivity(activities);
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
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
      return;
    }

    await loadJourneySteps(user.id);
    await loadProfile(user.id);

    if (!currentStatus) {
      toast({
        title: "Step Completed! 🎉",
        description: "Keep up the great work on your PM journey!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const personaLabels = {
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
                <CardDescription className="text-base">
                  First, tell us where you are in your PM journey so we can personalize your experience
                </CardDescription>
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

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Welcome back, {profile?.full_name}! 👋</h1>
          <p className="text-muted-foreground">
            Your PM Journey: {profile?.persona && personaLabels[profile.persona as keyof typeof personaLabels]}
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Your Progress
            </CardTitle>
            <CardDescription>
              You're {profile?.progress_percentage}% through your PM journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={profile?.progress_percentage || 0} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {journeySteps.filter(s => s.completed).length} of {journeySteps.length} steps completed
              </span>
              <span className="font-semibold text-primary">
                Keep going! 🚀
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Journey Steps */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your PM Journey Checklist
                </CardTitle>
                <CardDescription>
                  Complete these steps to master product management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {journeySteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      step.completed 
                        ? "bg-primary/5 border-primary/30" 
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={step.completed}
                        onCheckedChange={() => toggleStepCompletion(step.id, step.completed || false)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                                {index + 1}. {step.title}
                              </span>
                              {step.completed && <CheckCircle2 className="h-4 w-4 text-primary" />}
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Badges & Social */}
          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Your Badges
                </CardTitle>
                <CardDescription>
                  {userBadges.length} badge{userBadges.length !== 1 ? "s" : ""} earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userBadges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {userBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-1"
                      >
                        <div className="text-3xl">{badge.icon}</div>
                        <p className="text-xs font-semibold">{badge.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Complete steps to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Peer Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Activity
                </CardTitle>
                <CardDescription>
                  See what your peers are working on
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {peerActivity.length > 0 ? (
                  peerActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {activity.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user_name}</span>
                          {" completed "}
                          <span className="text-muted-foreground">{activity.step_title}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Be the first to complete a step!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Share Your Success Story</h3>
                  <p className="text-sm text-muted-foreground">
                    Inspire others by sharing your PM journey and achievements
                  </p>
                </div>
                <Button className="w-full" onClick={() => navigate("/contact")}>
                  Share Your Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
