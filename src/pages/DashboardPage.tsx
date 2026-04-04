import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Target,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  DashboardHeader,
  ProfileSummaryCard,
  JobsAlertCard,
  RoadmapProgressCard,
  PMJourneySection,
  CommunityActivityCard,
  BadgesCard,
  MemberBenefitsCard,
  UpcomingEventsCard,
} from "@/components/dashboard";

const DashboardPage = () => {
  const { isGuest, isBlocked, loading: authLoading, user } = useAuth();
  const isGuestRestricted = isGuest && !authLoading;
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    profile,
    isPmaMember,
    newJobsCount,
    savedJobsCount,
    featuredJob,
    hasJobPreferences,
    roadmapProgress,
    nextRoadmapItem,
    hasRoadmap,
    roadmapCompletedCount,
    roadmapTotalCount,
    upcomingEvents,
    journeySteps,
    peerActivity,
    memberCount,
    earnedBadges,
    loading,
    toggleStepCompletion,
  } = useDashboardData();

  useEffect(() => {
    if (!authLoading && isBlocked) {
      navigate("/blocked");
      return;
    }

    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [authLoading, isBlocked, user, navigate]);

  const updatePersona = async (persona: "curious" | "starting" | "recruiting") => {
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

    await awardPreviousSectionBadges(user.id, persona);

    toast({
      title: "Welcome to your PM journey! 🚀",
      description: "Your personalized dashboard is ready",
    });

    window.location.reload();
  };

  const awardPreviousSectionBadges = async (userId: string, persona: string) => {
    const badgesToAward: string[] = [];

    const { data: badges } = await supabase
      .from("badges")
      .select("id, name")
      .in("name", ["Exploring PM Complete", "Starting PM Complete"]);

    const badgeMap = new Map(badges?.map(b => [b.name, b.id]) || []);

    if (persona === "starting" || persona === "recruiting") {
      const exploringBadgeId = badgeMap.get("Exploring PM Complete");
      if (exploringBadgeId) badgesToAward.push(exploringBadgeId);
    }

    if (persona === "recruiting") {
      const startingBadgeId = badgeMap.get("Starting PM Complete");
      if (startingBadgeId) badgesToAward.push(startingBadgeId);
    }

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
  };

  const handleToggleStep = async (stepId: string, currentStatus: boolean) => {
    if (isGuestRestricted) return;

    await toggleStepCompletion(stepId, currentStatus);

    if (!currentStatus) {
      toast({
        title: "Step Completed! 🎉",
        description: "Keep up the great work on your PM journey!",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile?.persona) {
    return (
      <div className="py-12 px-6">
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
                  onClick={() => !isGuestRestricted && updatePersona("curious")}
                  disabled={isGuestRestricted}
                  className={`p-6 rounded-lg border-2 border-border transition-all text-left space-y-2 group ${isGuestRestricted ? "opacity-60 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"
                    }`}
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
                  onClick={() => !isGuestRestricted && updatePersona("starting")}
                  disabled={isGuestRestricted}
                  className={`p-6 rounded-lg border-2 border-border transition-all text-left space-y-2 group ${isGuestRestricted ? "opacity-60 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"
                    }`}
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
                  onClick={() => !isGuestRestricted && updatePersona("recruiting")}
                  disabled={isGuestRestricted}
                  className={`p-6 rounded-lg border-2 border-border transition-all text-left space-y-2 group ${isGuestRestricted ? "opacity-60 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"
                    }`}
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

  const journeyProgress = profile?.progress_percentage || 0;

  return (
    <div className="py-8">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="space-y-6">
          <DashboardHeader
            fullName={profile?.full_name || null}
            isPmaMember={isPmaMember}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <RoadmapProgressCard
              progress={roadmapProgress}
              nextItem={nextRoadmapItem}
              hasRoadmap={hasRoadmap}
              completedCount={roadmapCompletedCount}
              totalCount={roadmapTotalCount}
            />
            {isPmaMember && (
              <JobsAlertCard
                newJobsCount={newJobsCount}
                savedJobsCount={savedJobsCount}
                featuredJob={featuredJob}
                hasPreferences={hasJobPreferences}
              />
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <UpcomingEventsCard events={upcomingEvents} />

              <PMJourneySection
                steps={journeySteps}
                userPersona={profile?.persona || null}
                onToggleStep={handleToggleStep}
                disabled={isGuestRestricted}
                defaultCollapsed={isPmaMember}
              />
            </div>

            <div className="space-y-6">
              <ProfileSummaryCard
                fullName={profile?.full_name || null}
                email={profile?.email || null}
                avatarUrl={profile?.avatar_url || null}
                schoolYear={profile?.school_year || null}
                recruitingStage={profile?.recruiting_stage || null}
                isPmaMember={isPmaMember}
                journeyProgress={journeyProgress}
              />

              {isPmaMember ? (
                <>
                  <CommunityActivityCard
                    peerActivity={peerActivity}
                    memberCount={memberCount}
                  />
                  <BadgesCard badges={earnedBadges} />
                </>
              ) : (
                <>
                  <MemberBenefitsCard />
                  <BadgesCard badges={earnedBadges} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
