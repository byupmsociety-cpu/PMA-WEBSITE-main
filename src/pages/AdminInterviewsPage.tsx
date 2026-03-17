import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, Loader2, Video, XCircle } from "lucide-react";

type InterviewStatus = "scheduled" | "completed" | "cancelled";

interface AdminInterview {
  id: string;
  status: InterviewStatus;
  meeting_link: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  slot: {
    id: string;
    start_time: string;
    end_time: string;
    slot_type?: string;
    interview_type?: string;
    duration_minutes?: number;
  };
  interviewer: { id: string; full_name: string | null; email: string | null } | null;
  interviewee: { id: string; full_name: string | null; email: string | null } | null;
}

const AdminInterviewsPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [items, setItems] = useState<AdminInterview[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [current, setCurrent] = useState<AdminInterview | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/auth");
      else if (!isAdmin && !isSuperAdmin) navigate("/");
      else void loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadData = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("mock_interviews")
      .select(
        `
        id,
        status,
        meeting_link,
        created_at,
        updated_at,
        completed_at,
        cancelled_at,
        cancellation_reason,
        slot:mock_interview_slots (id, start_time, end_time, slot_type, interview_type, duration_minutes),
        interviewer:profiles!interviewer_id (id, full_name, email),
        interviewee:profiles!interviewee_id (id, full_name, email)
      `
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setItems([]);
    } else {
      // @ts-ignore
      setItems((data as any[]) || []);
    }
    setLoadingData(false);
  };

  const counts = useMemo(() => {
    const scheduled = items.filter((i) => i.status === "scheduled").length;
    const completed = items.filter((i) => i.status === "completed").length;
    const cancelled = items.filter((i) => i.status === "cancelled").length;
    return { scheduled, completed, cancelled };
  }, [items]);

  const openDetail = (it: AdminInterview) => {
    setCurrent(it);
    setMeetingLink(it.meeting_link || "");
    setCancelReason(it.cancellation_reason || "");
    setDetailOpen(true);
  };

  const saveMeetingLink = async () => {
    if (!current) return;
    setSaving(true);
    const { error } = await supabase
      .from("mock_interviews")
      .update({ meeting_link: meetingLink.trim() === "" ? null : meetingLink.trim() })
      .eq("id", current.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Saved" });
    setDetailOpen(false);
    await loadData();
  };

  const adminCancel = async () => {
    if (!current) return;
    if (!confirm("Cancel this interview and reopen the slot?")) return;
    setSaving(true);
    const { error } = await supabase
      .from("mock_interviews")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: cancelReason.trim() === "" ? null : cancelReason.trim(),
      })
      .eq("id", current.id);

    if (!error) {
      // Reopen the slot (admins can update slots)
      const { error: slotErr } = await supabase
        .from("mock_interview_slots")
        .update({ is_booked: false })
        .eq("id", current.slot.id);
      if (slotErr) {
        toast({ title: "Slot reopen failed", description: slotErr.message, variant: "destructive" });
      }
    }

    setSaving(false);
    if (error) {
      toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Interview cancelled" });
    setDetailOpen(false);
    await loadData();
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderTable = (rows: AdminInterview[]) => (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Interviewer</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((it) => (
            <TableRow key={it.id}>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(it.slot.start_time), "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(it.slot.start_time), "h:mm a")}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {it.interviewer?.full_name || it.interviewer?.email || "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {it.interviewee?.full_name || it.interviewee?.email || "—"}
              </TableCell>
              <TableCell>
                <Badge variant={it.status === "scheduled" ? "default" : it.status === "completed" ? "secondary" : "destructive"}>
                  {it.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => openDetail(it)}>
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <AnimatedSection animation="slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mock Interviews</h1>
            <p className="text-muted-foreground">Monitor and manage mock interview activity.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => void loadData()}>
              Refresh
            </Button>
            <Badge variant="outline" className="w-fit text-sm">
              {items.length} total
            </Badge>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="slide-up" delay={100}>
        <Card>
          <CardHeader>
            <CardTitle>Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scheduled" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="scheduled" className="relative">
                  Upcoming
                  {counts.scheduled > 0 ? (
                    <Badge variant="secondary" className="ml-2 bg-primary/20 hover:bg-primary/20 hidden sm:inline-flex">
                      {counts.scheduled}
                    </Badge>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="scheduled" className="m-0 space-y-4">
                {counts.scheduled === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No upcoming interviews right now.</p>
                  </div>
                ) : (
                  renderTable(items.filter((i) => i.status === "scheduled"))
                )}
              </TabsContent>

              <TabsContent value="completed" className="m-0 space-y-4">
                {counts.completed === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No completed interviews yet.</p>
                  </div>
                ) : (
                  renderTable(items.filter((i) => i.status === "completed"))
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="m-0 space-y-4">
                {counts.cancelled === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                    <XCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No cancelled interviews yet.</p>
                  </div>
                ) : (
                  renderTable(items.filter((i) => i.status === "cancelled"))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedSection>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl">
          <DialogTitle>Interview details</DialogTitle>
          <DialogDescription className="sr-only">Admin interview detail view</DialogDescription>

          {current ? (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={current.status === "scheduled" ? "default" : current.status === "completed" ? "secondary" : "destructive"}>
                      {current.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Created {format(new Date(current.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">When:</span>{" "}
                    {format(new Date(current.slot.start_time), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Interviewer:</span>{" "}
                    {current.interviewer?.full_name || current.interviewer?.email || "—"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Candidate:</span>{" "}
                    {current.interviewee?.full_name || current.interviewee?.email || "—"}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Meeting link</Label>
                <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <Label>Cancel reason (optional)</Label>
                <Input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason shown to participants" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => void saveMeetingLink()} disabled={saving}>
                  Save link
                </Button>
                {current.status !== "cancelled" ? (
                  <Button variant="destructive" onClick={() => void adminCancel()} disabled={saving}>
                    Cancel interview
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInterviewsPage;

