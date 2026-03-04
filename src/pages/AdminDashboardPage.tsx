import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import KpiCard from "@/components/admin/KpiCard";
import { Users, UserPlus, Calendar, UsersRound, RefreshCw, Shield, BookOpen, Briefcase } from "lucide-react";

const AdminDashboardPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    usersTotal: 0,
    usersNew7d: 0,
    usersNew30d: 0,
    teamMembersTotal: 0,
    eventsTotal: 0,
    eventsUpcoming: 0,
  });

  const since7dIso = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }, []);

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
        usersNew7dRes,
        usersNew30dRes,
        teamMembersRes,
        eventsTotalRes,
        eventsUpcomingRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .gte("created_at", since7dIso),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .gte("created_at", since30dIso),
        supabase.from("team_members" as any).select("id", { count: "exact", head: true }),
        supabase.from("events" as any).select("id", { count: "exact", head: true }),
        supabase
          .from("events" as any)
          .select("id", { count: "exact", head: true })
          .gt("start_time", nowIso),
      ]);

      const anyError =
        usersTotalRes.error ||
        usersNew7dRes.error ||
        usersNew30dRes.error ||
        teamMembersRes.error ||
        eventsTotalRes.error ||
        eventsUpcomingRes.error;

      if (anyError) {
        throw anyError;
      }

      setMetrics({
        usersTotal: usersTotalRes.count ?? 0,
        usersNew7d: usersNew7dRes.count ?? 0,
        usersNew30d: usersNew30dRes.count ?? 0,
        teamMembersTotal: teamMembersRes.count ?? 0,
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
              title="New users (7d)"
              value={metrics.usersNew7d.toLocaleString()}
              helperText="Created in the last 7 days"
              icon={<UserPlus />}
              loading={loadingMetrics}
            />
            <KpiCard
              title="Team members"
              value={metrics.teamMembersTotal.toLocaleString()}
              helperText="Shown on /team"
              icon={<UsersRound />}
              loading={loadingMetrics}
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

        <section className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-lg font-semibold">Tools</h2>
            <p className="text-sm text-muted-foreground">
              Common admin workflows, organized by area.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold">Access &amp; Membership</h3>
                  <p className="text-sm text-muted-foreground">
                    Roles, blocking, and pre-approved emails.
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/access">Manage access &amp; membership</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold">Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Update the PMA presidency section on the website.
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <UsersRound className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/team">Manage team</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold">Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Publish and manage events shown on the public site.
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/events">Manage events</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold">Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage tools and resources on the Resources page.
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/resources">Manage resources</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold">Job Postings</h3>
                  <p className="text-sm text-muted-foreground">
                    Post jobs and notify matching PMA members.
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/admin/jobs">Manage jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

