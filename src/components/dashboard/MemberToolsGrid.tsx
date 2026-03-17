import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FolderKanban, Users, FileText, Video, Network } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function MemberToolsGrid() {
  const { user } = useAuth();
  const [unviewedResumeFeedbackCount, setUnviewedResumeFeedbackCount] = useState(0);

  useEffect(() => {
    const loadResumeReviewStatus = async () => {
      if (!user) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("last_seen_resume_feedback_at")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Error loading profile for resume feedback status:", profileError);
          return;
        }

        const lastSeen = profileData?.last_seen_resume_feedback_at || null;

        let query = supabase
          .from("asset_reviews")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .in("status", ["approved", "rejected"]);

        if (lastSeen) {
          query = query.gt("updated_at", lastSeen);
        }

        const { count, error: reviewsError } = await query;

        if (reviewsError) {
          console.error("Error loading resume review count:", reviewsError);
          return;
        }

        setUnviewedResumeFeedbackCount(count || 0);
      } catch (err) {
        console.error("Error determining resume feedback visibility:", err);
      }
    };

    void loadResumeReviewStatus();
  }, [user]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        Member Tools
      </h3>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <Link to="/jobs" className="group">
          <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors bg-card hover:bg-card/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Job Board</h4>
                <p className="text-xs text-muted-foreground hidden sm:block">Find PM roles</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/tracker" className="group">
          <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors bg-card hover:bg-card/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <FolderKanban className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">App Tracker</h4>
                <p className="text-xs text-muted-foreground hidden sm:block">Track stages</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/members" className="group">
          <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors bg-card hover:bg-card/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-green-500/10 rounded-full text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Directory</h4>
                <p className="text-xs text-muted-foreground hidden sm:block">Find peers</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/interviews" className="group">
          <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors bg-card hover:bg-card/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-red-500/10 rounded-full text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Mock Interv.</h4>
                <p className="text-xs text-muted-foreground hidden sm:block">Peer-to-peer</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/resumes" className="group">
          <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors bg-card hover:bg-card/60 relative">
            {unviewedResumeFeedbackCount > 0 && (
              <div
                className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white px-1"
                title="New resume feedback available"
              >
                {unviewedResumeFeedbackCount > 9 ? "9+" : unviewedResumeFeedbackCount}
              </div>
            )}
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-pink-500/10 rounded-full text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Resumes</h4>
                <p className="text-xs text-muted-foreground hidden sm:block">VMock + PMA feedback</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/members" className="group">
          <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors bg-card hover:bg-card/60">
            <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Network className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Alumni Hub</h4>
                <p className="text-xs text-muted-foreground hidden sm:block">Connect</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
