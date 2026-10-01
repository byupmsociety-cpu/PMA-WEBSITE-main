import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import KpiCard from "@/components/admin/KpiCard";
import { ArrowLeft, Eye, LogIn, RefreshCw, UserCheck, Users } from "lucide-react";

type Report = {
  totals: { page_views: number; unique_visitors: number; signed_in_users: number; logins: number };
  daily: { day: string; page_views: number; visitors: number }[];
  top_pages: { path: string; views: number; visitors: number }[];
  users: { user_id: string; full_name: string | null; email: string | null; page_views: number; logins: number; last_seen: string }[];
  recent: { created_at: string; event_type: "page_view" | "login"; path: string; visitor_id: string; full_name: string | null; email: string | null }[];
};

const RANGES = [
  { label: "24h", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const AdminAnalyticsPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [days, setDays] = useState(7);
  const [report, setReport] = useState<Report | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (rangeDays: number) => {
    setFetching(true);
    setError(null);
    const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString();
    const { data, error: rpcError } = await supabase.rpc("admin_analytics_report" as any, { since });
    if (rpcError) setError(rpcError.message);
    else setReport(data as unknown as Report);
    setFetching(false);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth");
    else if (!isAdmin) navigate("/");
    else void load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isAdmin, days]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const maxDaily = Math.max(1, ...(report?.daily.map((d) => d.page_views) ?? []));

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground text-sm">
              Page views and logins across the site. Admin pages are not tracked.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {RANGES.map((r) => (
              <Button
                key={r.days}
                size="sm"
                variant={days === r.days ? "default" : "outline"}
                onClick={() => setDays(r.days)}
              >
                {r.label}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => void load(days)} disabled={fetching}>
              <RefreshCw className={fetching ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Page views" value={(report?.totals.page_views ?? 0).toLocaleString()} icon={<Eye />} loading={fetching} />
          <KpiCard title="Unique visitors" value={(report?.totals.unique_visitors ?? 0).toLocaleString()} helperText="Distinct browsers" icon={<Users />} loading={fetching} />
          <KpiCard title="Signed in users" value={(report?.totals.signed_in_users ?? 0).toLocaleString()} helperText="Members who visited while logged in" icon={<UserCheck />} loading={fetching} />
          <KpiCard title="Logins" value={(report?.totals.logins ?? 0).toLocaleString()} icon={<LogIn />} loading={fetching} />
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Daily page views</CardTitle>
          </CardHeader>
          <CardContent>
            {report && report.daily.length > 0 ? (
              <div className="space-y-1.5">
                {report.daily.map((d) => (
                  <div key={d.day} className="flex items-center gap-3 text-sm">
                    <span className="w-16 shrink-0 text-muted-foreground tabular-nums">
                      {new Date(`${d.day}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <div className="flex-1 h-5 rounded bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(d.page_views / maxDaily) * 100}%` }} />
                    </div>
                    <span className="w-24 shrink-0 text-right tabular-nums">
                      {d.page_views} <span className="text-muted-foreground">/ {d.visitors} ppl</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{fetching ? "Loading…" : "No visits in this range."}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Top pages</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report?.top_pages.map((p) => (
                    <TableRow key={p.path}>
                      <TableCell className="font-mono text-xs break-all">{p.path}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.views}</TableCell>
                      <TableCell className="text-right tabular-nums">{p.visitors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Signed in users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Logins</TableHead>
                    <TableHead className="text-right">Last seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report?.users.map((u) => (
                    <TableRow key={u.user_id}>
                      <TableCell>
                        <div className="font-medium">{u.full_name || "Unnamed"}</div>
                        <div className="text-xs text-muted-foreground break-all">{u.email}</div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{u.page_views}</TableCell>
                      <TableCell className="text-right tabular-nums">{u.logins}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">{formatTime(u.last_seen)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Who</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Page</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.recent.map((r, i) => (
                  <TableRow key={`${r.created_at}-${i}`}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(r.created_at)}</TableCell>
                    <TableCell>
                      {r.email ? (
                        <span>{r.full_name || r.email}</span>
                      ) : (
                        <span className="text-muted-foreground">Anonymous · {r.visitor_id.slice(0, 6)}</span>
                      )}
                    </TableCell>
                    <TableCell>{r.event_type === "login" ? "Login" : "View"}</TableCell>
                    <TableCell className="font-mono text-xs break-all">{r.path}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
