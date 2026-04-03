import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import KpiCard from "@/components/admin/KpiCard";
import { Users, Calendar, UsersRound, RefreshCw, Shield, BookOpen, Briefcase, FileText, Video, MessageSquare } from "lucide-react";

const AdminDashboardPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    usersTotal: 0,
    feedbackPending: 0,
    usersNew30d: 0,
    resumeReviewsPending: 0,
    eventsTotal: 0,
    eventsUpcoming: 0,
  });



  const since30dIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString();
  }, []);

  const nowIso = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void refreshMetrics();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const refreshMetrics = async () => {
    setLoadingMetrics(true);
    setMetricsError(null);

    try {
      const [
        usersTotalRes,
        feedbackPendingRes,
        usersNew30dRes,
        resumeReviewsPendingRes,
        eventsTotalRes,
        eventsUpcomingRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase
          .from("user_feedback")
          .select("id", { count: "exact", head: true })
          .eq("status", "new"),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .gte("created_at", since30dIso),
        supabase
          .from("asset_reviews" as any)
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("events" as any).select("id", { count: "exact", head: true }),
        supabase
          .from("events" as any)
          .select("id", { count: "exact", head: true })
          .gt("start_time", nowIso),
      ]);

      const anyError =
        usersTotalRes.error ||
        feedbackPendingRes.error ||
        usersNew30dRes.error ||
        resumeReviewsPendingRes.error ||
        eventsTotalRes.error ||
        eventsUpcomingRes.error;

      if (anyError) {
        throw anyError;
      }

      setMetrics({
        usersTotal: usersTotalRes.count ?? 0,
        feedbackPending: feedbackPendingRes.count ?? 0,
        usersNew30d: usersNew30dRes.count ?? 0,
        resumeReviewsPending: resumeReviewsPendingRes.count ?? 0,
        eventsTotal: eventsTotalRes.count ?? 0,
        eventsUpcoming: eventsUpcomingRes.count ?? 0,
      });
    } catch (e: any) {
      setMetricsError(e?.message || "Failed to load metrics.");
    } finally {
      setLoadingMetrics(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              At-a-glance metrics and tools for managing PMA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => void refreshMetrics()}
              disabled={loadingMetrics}
            >
              <RefreshCw className={loadingMetrics ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold">At a glance</h2>
              <p className="text-sm text-muted-foreground">
                Key activity and content counts.
              </p>
            </div>
          </div>

          {metricsError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {metricsError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total users"
              value={metrics.usersTotal.toLocaleString()}
              helperText="Profiles excluding deleted users"
              icon={<Users />}
              loading={loadingMetrics}
            />
            <KpiCard
              title="Feedback to review"
              value={metrics.feedbackPending.toLocaleString()}
              helperText="New user feedback submissions"
              icon={<MessageSquare />}
              loading={loadingMetrics}
              action={<Button asChild size="sm" className="w-full"><Link to="/admin/feedback">Review feedback</Link></Button>}
            />
            <KpiCard
              title="Resumes to review"
              value={metrics.resumeReviewsPending.toLocaleString()}
              helperText="Pending resume submissions"
              icon={<FileText />}
              loading={loadingMetrics}
              action={<Button asChild size="sm" className="w-full"><Link to="/admin/resumes">Review resumes</Link></Button>}
            />
            <KpiCard
              title="Upcoming events"
              value={metrics.eventsUpcoming.toLocaleString()}
              helperText={`${metrics.eventsTotal.toLocaleString()} total events`}
              icon={<Calendar />}
              loading={loadingMetrics}
            />
          </div>
        </section>

        <Separator />

        <section className="space-y-8 pb-12">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold">Admin Tools</h2>
            <p className="text-sm text-muted-foreground">
              Manage platform content, user access, and career services.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">User Management</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Access &amp; Membership</h4>
                      <p className="text-sm text-muted-foreground flex-grow">
                        Roles, blocking, and pre-approved emails.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/access">Manage access</Link>
                  </Button>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Team</h4>
                      <p className="text-sm text-muted-foreground">
                        Update the PMA presidency section on the website.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <UsersRound className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/team">Manage team</Link>
                  </Button>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors relative">
                  {metrics.feedbackPending > 0 && (
                    <div className="absolute -top-2 -right-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white px-1.5">
                      {metrics.feedbackPending > 99 ? "99+" : metrics.feedbackPending}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="space-y-1">
                      <h4 className="font-semibold">User Feedback</h4>
                      <p className="text-sm text-muted-foreground flex-grow">
                        Review and triage feedback from users.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/feedback">Manage feedback</Link>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Content Hub</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Events</h4>
                      <p className="text-sm text-muted-foreground">
                        Publish and manage events shown on the public site.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/events">Manage events</Link>
                  </Button>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Resources</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage tools and resources on the Resources page.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/resources">Manage resources</Link>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Career Services</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Job Postings</h4>
                      <p className="text-sm text-muted-foreground">
                        Post jobs and notify matching PMA members.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <Briefcase className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/jobs">Manage jobs</Link>
                  </Button>
                </div>

                {/* Placeholders for upcoming Phase 2+ features */}
                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Mock Interviews</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor and manage mock interview activity.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <Video className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/interviews">Manage interviews</Link>
                  </Button>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors relative">
                  {metrics.resumeReviewsPending > 0 && (
                    <div className="absolute -top-2 -right-2 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white px-1.5">
                      {metrics.resumeReviewsPending > 99 ? "99+" : metrics.resumeReviewsPending}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Resume Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage the resume feedback queue.
                      </p>
                    </div>
                    <div className="text-primary/70 bg-primary/10 p-2 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/admin/resumes">Review Resumes</Link>
                  </Button>
                </div>

                <div className="rounded-xl border bg-card/40 p-5 space-y-4 border-dashed relative overflow-hidden group">
                  <div className="absolute inset-0 bg-muted/20 hidden group-hover:block transition-all"></div>
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="space-y-1 opacity-60">
                      <h4 className="font-semibold flex items-center gap-2">Alumni Network <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span></h4>
                      <p className="text-sm text-muted-foreground">
                        Manage alumni network access and profiles.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

