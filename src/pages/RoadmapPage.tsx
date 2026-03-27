import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import MemberLockout from "@/components/MemberLockout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  BookOpen,
  Users,
  Lightbulb,
  Briefcase,
  Wrench,
  Code,
  Calendar,
  UserPlus,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

interface RoadmapProfile {
  id: string;
  school_year: string | null;
  major: string | null;
  generated_roadmap: {
    academics?: string[];
    classes?: string[];
    clubs?: string[];
    projects?: string[];
    internships?: string[];
    skills?: string[];
    tools?: string[];
    events?: string[];
    alumni?: string[];
  } | null;
  updated_at: string;
}

interface RoadmapProgress {
  roadmap_section: string;
  item_id: string;
  item_title: string;
  completed_at: string;
}

const SECTION_CONFIG = [
  { key: "academics", title: "Academic Path", icon: GraduationCap, color: "text-blue-500" },
  { key: "classes", title: "Recommended Classes", icon: BookOpen, color: "text-purple-500" },
  { key: "clubs", title: "Clubs & Organizations", icon: Users, color: "text-green-500" },
  { key: "projects", title: "Project Ideas", icon: Lightbulb, color: "text-amber-500" },
  { key: "internships", title: "Internship Opportunities", icon: Briefcase, color: "text-red-500" },
  { key: "skills", title: "Skills to Develop", icon: Wrench, color: "text-cyan-500" },
  { key: "tools", title: "Tools to Learn", icon: Code, color: "text-pink-500" },
  { key: "events", title: "PMA Events", icon: Calendar, color: "text-indigo-500" },
  { key: "alumni", title: "Alumni Connections", icon: UserPlus, color: "text-orange-500" },
];

const RoadmapPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roadmapProfile, setRoadmapProfile] = useState<RoadmapProfile | null>(null);
  const [progress, setProgress] = useState<Map<string, RoadmapProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (isPmaMember) {
        void loadRoadmapData();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, user, isPmaMember, navigate]);

  const loadRoadmapData = async () => {
    if (!user) return;

    setLoading(true);

    const [profileResult, progressResult] = await Promise.all([
      supabase
        .from("roadmap_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("roadmap_progress")
        .select("*")
        .eq("user_id", user.id),
    ]);

    if (profileResult.error && profileResult.error.code !== "PGRST116") {
      console.error("Error loading roadmap profile:", profileResult.error);
    }

    if (profileResult.data) {
      setRoadmapProfile(profileResult.data as RoadmapProfile);
    }

    if (progressResult.data) {
      const progressMap = new Map<string, RoadmapProgress>();
      progressResult.data.forEach((p) => {
        const key = `${p.roadmap_section}-${p.item_id}`;
        progressMap.set(key, p);
      });
      setProgress(progressMap);
    }

    setLoading(false);
  };

  const toggleItemCompletion = async (section: string, itemId: string, itemTitle: string) => {
    if (!user) return;

    const key = `${section}-${itemId}`;
    const isCompleted = progress.has(key);
    setUpdatingItem(key);

    if (isCompleted) {
      const { error } = await supabase
        .from("roadmap_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("roadmap_section", section)
        .eq("item_id", itemId);

      if (error) {
        toast({
          title: "Error updating progress",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const newProgress = new Map(progress);
        newProgress.delete(key);
        setProgress(newProgress);
      }
    } else {
      const { error } = await supabase.from("roadmap_progress").insert({
        user_id: user.id,
        roadmap_section: section,
        item_id: itemId,
        item_title: itemTitle,
      });

      if (error) {
        toast({
          title: "Error updating progress",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const newProgress = new Map(progress);
        newProgress.set(key, {
          roadmap_section: section,
          item_id: itemId,
          item_title: itemTitle,
          completed_at: new Date().toISOString(),
        });
        setProgress(newProgress);
      }
    }

    setUpdatingItem(null);
  };

  const calculateOverallProgress = () => {
    if (!roadmapProfile?.generated_roadmap) return 0;

    let totalItems = 0;
    SECTION_CONFIG.forEach(({ key }) => {
      const items = roadmapProfile.generated_roadmap?.[key as keyof typeof roadmapProfile.generated_roadmap];
      if (items) totalItems += items.length;
    });

    if (totalItems === 0) return 0;
    return Math.round((progress.size / totalItems) * 100);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return <MemberLockout 
      description="The personalized roadmap dashboard is exclusive to PMA club members. Join PMA to save your roadmap and track your progress over time." 
      features={[
        "Follow a structured step-by-step PM recruiting guide",
        "Track your progress across different phases",
        "Access hand-picked resources for each milestone",
        "Stay organized during recruiting season"
      ]}
    />;
  }

  if (!roadmapProfile?.generated_roadmap) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="container max-w-2xl mx-auto px-4">
          <AnimatedSection animation="slide-up">
            <Card>
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Create Your Roadmap</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Take the PM quiz to generate your personalized roadmap based on your
                  background, interests, and goals.
                </p>
                <Button asChild>
                  <Link to="/discover">Take the PM Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <AnimatedSection animation="slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your PM Roadmap</h1>
              <p className="text-muted-foreground">
                Track your progress towards becoming a Product Manager
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/discover">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        {/* Progress Overview */}
        <AnimatedSection animation="slide-up" delay={100}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Progress</span>
                <Badge variant={overallProgress >= 75 ? "default" : "secondary"}>
                  {overallProgress}% Complete
                </Badge>
              </CardTitle>
              <CardDescription>
                {roadmapProfile.school_year && roadmapProfile.major && (
                  <span>
                    {roadmapProfile.school_year} • {roadmapProfile.major}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {progress.size} of{" "}
                {SECTION_CONFIG.reduce((acc, { key }) => {
                  const items = roadmapProfile.generated_roadmap?.[key as keyof typeof roadmapProfile.generated_roadmap];
                  return acc + (items?.length ?? 0);
                }, 0)}{" "}
                items completed
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Roadmap Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTION_CONFIG.map(({ key, title, icon: Icon, color }, idx) => {
            const items = roadmapProfile.generated_roadmap?.[key as keyof typeof roadmapProfile.generated_roadmap];
            if (!items || items.length === 0) return null;

            const completedCount = items.filter((_, i) => progress.has(`${key}-${i}`)).length;

            return (
              <AnimatedSection key={key} animation="slide-up" delay={150 + idx * 50}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className={`w-5 h-5 ${color}`} />
                      {title}
                      <Badge variant="outline" className="ml-auto">
                        {completedCount}/{items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {items.map((item, i) => {
                        const itemKey = `${key}-${i}`;
                        const isCompleted = progress.has(itemKey);
                        const isUpdating = updatingItem === itemKey;

                        return (
                          <li
                            key={i}
                            className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                              isCompleted ? "bg-green-500/5" : "hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              id={itemKey}
                              checked={isCompleted}
                              disabled={isUpdating}
                              onCheckedChange={() => toggleItemCompletion(key, String(i), item)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={itemKey}
                              className={`text-sm cursor-pointer flex-1 ${
                                isCompleted ? "text-muted-foreground line-through" : ""
                              }`}
                            >
                              {item}
                            </label>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Quick Links */}
        <AnimatedSection animation="fade-in" delay={500}>
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Continue Your Journey</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore more resources to accelerate your PM career
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link to="/resources">Resources</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/jobs">Job Board</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/events">Events</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default RoadmapPage;
