import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface JourneyStep {
  id: string;
  title: string;
  description: string | null;
  category: string;
  step_order: number;
  persona: string;
  completed?: boolean;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  earned_at: string | null;
}

export interface PeerActivity {
  user_name: string;
  step_title: string;
  persona: string;
  completed_at: string;
}

export interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  job_type: string | null;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  start_time: string;
  location: string | null;
}

export interface DashboardProfile {
  persona: string | null;
  progress_percentage: number | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  school_year: string | null;
  recruiting_stage: string | null;
}

export interface DashboardData {
  profile: DashboardProfile | null;
  isPmaMember: boolean;
  
  // Jobs data (PMA members only)
  newJobsCount: number;
  savedJobsCount: number;
  featuredJob: FeaturedJob | null;
  hasJobPreferences: boolean;
  
  // Roadmap data (PMA members only)
  roadmapProgress: number;
  nextRoadmapItem: string | null;
  hasRoadmap: boolean;
  roadmapCompletedCount: number;
  roadmapTotalCount: number;
  
  // Events data
  upcomingEvents: UpcomingEvent[];
  
  // Journey data
  journeySteps: JourneyStep[];
  
  // Community data
  peerActivity: PeerActivity[];
  memberCount: number;
  
  // Badges
  earnedBadges: UserBadge[];
  
  // Loading states
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData & {
  toggleStepCompletion: (stepId: string, currentStatus: boolean) => Promise<void>;
  refreshData: () => Promise<void>;
} {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const isPmaMember = authProfile?.is_pma_member === true;

  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [peerActivity, setPeerActivity] = useState<PeerActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  
  // PMA member specific data
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [featuredJob, setFeaturedJob] = useState<FeaturedJob | null>(null);
  const [hasJobPreferences, setHasJobPreferences] = useState(false);
  const [roadmapProgress, setRoadmapProgress] = useState(0);
  const [nextRoadmapItem, setNextRoadmapItem] = useState<string | null>(null);
  const [hasRoadmap, setHasRoadmap] = useState(false);
  const [roadmapCompletedCount, setRoadmapCompletedCount] = useState(0);
  const [roadmapTotalCount, setRoadmapTotalCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("persona, progress_percentage, full_name, email, avatar_url, school_year, recruiting_stage")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      return null;
    }
    return data;
  };

  const loadJourneySteps = async (userId: string) => {
    const { data: steps, error: stepsError } = await supabase
      .from("pm_journey_steps")
      .select("*")
      .order("persona")
      .order("step_order");

    if (stepsError) {
      console.error("Error loading steps:", stepsError);
      return [];
    }

    const { data: progress } = await supabase
      .from("user_progress")
      .select("step_id, completed")
      .eq("user_id", userId);

    const progressMap = new Map(progress?.map(p => [p.step_id, p.completed]) || []);
    
    return steps?.map(step => ({
      ...step,
      completed: progressMap.get(step.id) || false
    })) || [];
  };

  const loadBadges = async (userId: string) => {
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
      return [];
    }

    return data?.map(ub => ({
      id: ub.id,
      name: (ub.badges as any).name,
      description: (ub.badges as any).description,
      icon: (ub.badges as any).icon,
      earned_at: ub.earned_at
    })) || [];
  };

  const loadPeerActivity = async (userId: string) => {
    const { data: progressData, error } = await supabase
      .from("user_progress")
      .select("user_id, step_id, completed_at")
      .eq("completed", true)
      .not("completed_at", "is", null)
      .neq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(15);

    if (error || !progressData || progressData.length === 0) {
      return [];
    }

    const userIds = [...new Set(progressData.map(p => p.user_id))];
    const stepIds = [...new Set(progressData.map(p => p.step_id))];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, persona")
      .in("user_id", userIds);

    const { data: steps } = await supabase
      .from("pm_journey_steps")
      .select("id, title, persona")
      .in("id", stepIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, { name: p.full_name, persona: p.persona }]) || []);
    const stepMap = new Map(steps?.map(s => [s.id, { title: s.title, persona: s.persona }]) || []);

    return progressData
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
      .filter(activity => activity.user_name !== "Anonymous");
  };

  const loadUpcomingEvents = async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("events")
      .select("id, title, start_time, location")
      .gte("start_time", now)
      .eq("is_public", true)
      .order("start_time", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error loading events:", error);
      return [];
    }

    return data || [];
  };

  const loadMemberCount = async () => {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_pma_member", true)
      .eq("is_visible_in_directory", true);

    if (error) {
      console.error("Error loading member count:", error);
      return 0;
    }

    return count || 0;
  };

  // PMA member specific loaders
  const loadJobsData = async (userId: string) => {
    // Get new jobs count (active jobs not yet viewed)
    const { data: allJobs } = await supabase
      .from("job_postings")
      .select("id")
      .eq("is_active", true);

    const { data: viewedJobs } = await supabase
      .from("job_notifications")
      .select("job_id")
      .eq("user_id", userId)
      .not("viewed_at", "is", null);

    const viewedJobIds = new Set(viewedJobs?.map(j => j.job_id) || []);
    const newCount = allJobs?.filter(j => !viewedJobIds.has(j.id)).length || 0;

    // Get saved jobs count
    const { count: savedCount } = await supabase
      .from("job_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("saved", true);

    // Get featured job
    const { data: featured } = await supabase
      .from("job_postings")
      .select("id, title, company, job_type")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Check if user has job preferences
    const { data: prefs } = await supabase
      .from("job_preferences")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      newJobsCount: newCount,
      savedJobsCount: savedCount || 0,
      featuredJob: featured || null,
      hasJobPreferences: !!prefs
    };
  };

  const loadRoadmapData = async (userId: string) => {
    const { data: roadmapProfile } = await supabase
      .from("roadmap_profiles")
      .select("generated_roadmap")
      .eq("user_id", userId)
      .maybeSingle();

    if (!roadmapProfile?.generated_roadmap) {
      return {
        hasRoadmap: false,
        roadmapProgress: 0,
        nextRoadmapItem: null,
        roadmapCompletedCount: 0,
        roadmapTotalCount: 0
      };
    }

    const roadmap = roadmapProfile.generated_roadmap as Record<string, string[]>;
    
    // Count total items
    let totalItems = 0;
    const allItems: { section: string; index: number; title: string }[] = [];
    
    Object.entries(roadmap).forEach(([section, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item, index) => {
          totalItems++;
          allItems.push({ section, index, title: item });
        });
      }
    });

    // Get completed items
    const { data: progress } = await supabase
      .from("roadmap_progress")
      .select("roadmap_section, item_id")
      .eq("user_id", userId);

    const completedSet = new Set(
      progress?.map(p => `${p.roadmap_section}-${p.item_id}`) || []
    );

    const completedCount = completedSet.size;
    const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Find next uncompleted item
    const nextItem = allItems.find(item => !completedSet.has(`${item.section}-${item.index}`));

    return {
      hasRoadmap: true,
      roadmapProgress: progressPercent,
      nextRoadmapItem: nextItem?.title || null,
      roadmapCompletedCount: completedCount,
      roadmapTotalCount: totalItems
    };
  };

  const loadAllData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Load common data in parallel
      const [
        profileData,
        stepsData,
        badgesData,
        activityData,
        eventsData,
        memberCountData
      ] = await Promise.all([
        loadProfile(user.id),
        loadJourneySteps(user.id),
        loadBadges(user.id),
        loadPeerActivity(user.id),
        loadUpcomingEvents(),
        loadMemberCount()
      ]);

      setProfile(profileData);
      setJourneySteps(stepsData);
      setEarnedBadges(badgesData);
      setPeerActivity(activityData);
      setUpcomingEvents(eventsData);
      setMemberCount(memberCountData);

      // Load PMA member specific data
      if (isPmaMember) {
        const [jobsData, roadmapData] = await Promise.all([
          loadJobsData(user.id),
          loadRoadmapData(user.id)
        ]);

        setNewJobsCount(jobsData.newJobsCount);
        setSavedJobsCount(jobsData.savedJobsCount);
        setFeaturedJob(jobsData.featuredJob);
        setHasJobPreferences(jobsData.hasJobPreferences);
        setRoadmapProgress(roadmapData.roadmapProgress);
        setNextRoadmapItem(roadmapData.nextRoadmapItem);
        setHasRoadmap(roadmapData.hasRoadmap);
        setRoadmapCompletedCount(roadmapData.roadmapCompletedCount);
        setRoadmapTotalCount(roadmapData.roadmapTotalCount);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = async (stepId: string, currentStatus: boolean) => {
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
      console.error("Error toggling step:", error);
      return;
    }

    // Update local state
    setJourneySteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: !currentStatus } : step
      )
    );

    // Reload badges to check for new awards
    const badgesData = await loadBadges(user.id);
    setEarnedBadges(badgesData);
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadAllData();
    }
  }, [authLoading, user, isPmaMember]);

  return {
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
    loading: loading || authLoading,
    error,
    toggleStepCompletion,
    refreshData: loadAllData
  };
}
