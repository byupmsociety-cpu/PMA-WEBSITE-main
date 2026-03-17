import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, Calendar, Plus, Clock, User, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMockInterviews } from "@/hooks/useMockInterviews";
import { format } from "date-fns";

const MockInterviewsPage = () => {
  const { profile, user } = useAuth();
  const isPmaMember = profile?.is_pma_member || false;
  
  const { 
    openSlots, 
    mySlots, 
    myInterviews, 
    myFeedback,
    isLoading, 
    createSlot, 
    deleteSlot, 
    bookInterview,
    updateInterview,
    cancelInterview,
    completeInterview,
    upsertFeedback,
  } = useMockInterviews(user?.id);

  const [activeTab, setActiveTab] = useState<"find" | "schedule" | "library">("find");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");
  const [newSlotType, setNewSlotType] = useState<"peer" | "mentor">("peer");
  const [newInterviewType, setNewInterviewType] = useState<"general" | "behavioral" | "product" | "case">("general");
  const [newDuration, setNewDuration] = useState<30 | 45 | 60>(60);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackInterviewId, setFeedbackInterviewId] = useState<string | null>(null);
  const [rubric, setRubric] = useState<Record<string, number>>({
    structure: 3,
    communication: 3,
    productThinking: 3,
    clarity: 3,
  });
  const [notes, setNotes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [meetingLinkDraft, setMeetingLinkDraft] = useState<Record<string, string>>({});

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotDate || !newSlotTime) return;
    
    // Create Date objects (keeping it simple for MVP)
    const start = new Date(`${newSlotDate}T${newSlotTime}`);
    const end = new Date(start.getTime() + newDuration * 60 * 1000);
    
    await createSlot({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      slotType: newSlotType,
      interviewType: newInterviewType,
      durationMinutes: newDuration,
    });
    
    setIsAddOpen(false);
    setNewSlotDate("");
    setNewSlotTime("");
  };

  if (!isPmaMember) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Video className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">PMA Members Only</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The peer-to-peer mock interview system is exclusively available to official PMA members.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                Mock Interviews
              </h1>
              <p className="text-muted-foreground">
                Practice case studies and behavioral questions with peers.
              </p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Offer Availability
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Offer a Mock Interview Slot</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSlot} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    value={newSlotDate} 
                    onChange={(e) => setNewSlotDate(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input 
                    type="time" 
                    required 
                    value={newSlotTime} 
                    onChange={(e) => setNewSlotTime(e.target.value)} 
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newSlotType} onValueChange={(v) => setNewSlotType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peer">Peer</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Focus</Label>
                    <Select value={newInterviewType} onValueChange={(v) => setNewInterviewType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="case">Case</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minutes</Label>
                    <Select value={String(newDuration)} onValueChange={(v) => setNewDuration(Number(v) as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="45">45</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full">Post Availability</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "find" | "schedule" | "library")} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="find">Find a Partner</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
            <TabsTrigger value="library">Prompt Library</TabsTrigger>
          </TabsList>

          <TabsContent value="find" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <p className="text-muted-foreground col-span-full py-8 text-center">Loading slots...</p>
              ) : openSlots?.length === 0 ? (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground">No open slots available right now.</p>
                  <Button variant="link" onClick={() => setIsAddOpen(true)}>Post the first one!</Button>
                </div>
              ) : (
                openSlots?.map(slot => (
                  <Card key={slot.id} className="border-primary/20 flex flex-col">
                    <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            {slot.profiles?.full_name || "PMA Member"}
                          </CardTitle>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {slot.profiles?.school_year && <Badge variant="secondary" className="text-[10px]">{slot.profiles.school_year}</Badge>}
                            {slot.slot_type && <Badge variant="outline" className="text-[10px]">{slot.slot_type}</Badge>}
                            {slot.interview_type && <Badge variant="outline" className="text-[10px]">{slot.interview_type}</Badge>}
                            {slot.duration_minutes && <Badge variant="outline" className="text-[10px]">{slot.duration_minutes}m</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(slot.start_time), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(slot.start_time), "h:mm a")} - {format(new Date(slot.end_time), "h:mm a")}
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-auto" 
                        onClick={() => bookInterview({ slotId: slot.id })}
                      >
                        Book Interview
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                My Upcoming Interviews
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {myInterviews?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming interviews.</p>
                ) : (
                  myInterviews?.map(interview => {
                    const isInterviewer = interview.interviewer_id === user?.id;
                    const partner = isInterviewer ? interview.interviewee : interview.interviewer;
                    const roleLabel = isInterviewer ? "You are Interviewing" : "You are the Candidate";
                    const feedbackForInterview = (myFeedback || []).find((f: any) => f.interview_id === interview.id) as any;
                    const meetingLinkValue = meetingLinkDraft[interview.id] ?? interview.meeting_link ?? "";
                    
                    return (
                      <Card key={interview.id} className="bg-card">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{partner?.full_name || "PMA Member"}</CardTitle>
                              <p className="text-xs text-muted-foreground font-medium text-primary mt-1">{roleLabel}</p>
                            </div>
                            <Badge variant={interview.status === "scheduled" ? "default" : "secondary"}>
                              {interview.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                             <div className="flex items-center gap-2">
                               <Calendar className="h-4 w-4" />
                               {format(new Date(interview.slot.start_time), "MMM d")}
                             </div>
                             <div className="flex items-center gap-2">
                               <Clock className="h-4 w-4" />
                               {format(new Date(interview.slot.start_time), "h:mm a")}
                             </div>
                           </div>
                           <div className="space-y-2">
                             <Label className="text-xs">Meeting link (Zoom/Google Meet)</Label>
                             <div className="flex gap-2">
                               <Input
                                 placeholder="Paste a meeting link..."
                                 value={meetingLinkValue}
                                 onChange={(e) =>
                                   setMeetingLinkDraft((prev) => ({ ...prev, [interview.id]: e.target.value }))
                                 }
                               />
                               <Button
                                 variant="outline"
                                 onClick={() =>
                                   updateInterview({
                                     interviewId: interview.id,
                                     updates: { meeting_link: meetingLinkValue.trim() === "" ? null : meetingLinkValue.trim() },
                                   })
                                 }
                               >
                                 Save
                               </Button>
                             </div>
                             <p className="text-xs text-muted-foreground">
                               Tip: add a Google Meet link from your calendar event and paste it here.
                             </p>
                           </div>

                           <div className="flex flex-wrap gap-2 pt-2">
                             {interview.status === "scheduled" ? (
                               <>
                                 <Button variant="secondary" onClick={() => completeInterview({ interviewId: interview.id })}>
                                   Mark completed
                                 </Button>
                                 <Button
                                   variant="ghost"
                                   className="text-destructive"
                                   onClick={() => cancelInterview({ interviewId: interview.id })}
                                 >
                                   Cancel
                                 </Button>
                               </>
                             ) : null}

                             {isInterviewer ? (
                               <Button
                                 onClick={() => {
                                  const existing = (myFeedback || []).find((f: any) => f.interview_id === interview.id) as any;
                                  if (existing?.rubric) setRubric(existing.rubric as any);
                                  setNotes(existing?.notes ?? "");
                                  setStrengths(existing?.strengths ?? "");
                                  setImprovements(existing?.improvements ?? "");
                                  setActionItems(existing?.action_items ?? "");
                                   setFeedbackInterviewId(interview.id);
                                   setFeedbackOpen(true);
                                 }}
                                 disabled={interview.status !== "completed"}
                               >
                                 Leave feedback
                               </Button>
                             ) : null}

                             {!isInterviewer && feedbackForInterview ? (
                               <Button
                                 variant="outline"
                                 onClick={() => {
                                   setFeedbackInterviewId(interview.id);
                                   setFeedbackOpen(true);
                                 }}
                               >
                                 View feedback
                               </Button>
                             ) : null}
                           </div>

                           {!isInterviewer && interview.status === "completed" && !feedbackForInterview ? (
                             <p className="text-xs text-muted-foreground">
                               Feedback hasn’t been submitted yet.
                             </p>
                           ) : null}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                My Offered Slots
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {mySlots?.filter(s => !s.is_booked).length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-full">You have no open availability listed.</p>
                ) : (
                  mySlots?.filter(s => !s.is_booked).map(slot => (
                    <Card key={slot.id} className="border-dashed">
                      <CardContent className="p-4 flex items-center justify-between">
                         <div className="space-y-1">
                           <p className="text-sm font-medium">{format(new Date(slot.start_time), "MMM d, yyyy")}</p>
                           <p className="text-xs text-muted-foreground">{format(new Date(slot.start_time), "h:mm a")} - {format(new Date(slot.end_time), "h:mm a")}</p>
                         </div>
                         <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteSlot(slot.id)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Case & Behavioral Prompt Library
              </h2>
              <p className="text-sm text-muted-foreground">
                Use these examples when you are acting as the Interviewer to evaluate your peer.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Product Design Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Design a fire alarm for the deaf.</p>
                    <p className="text-xs text-muted-foreground">Focus on accessibility, alternative sensory inputs (lights, vibrations), and installation constraints.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">How would you improve Google Maps?</p>
                    <p className="text-xs text-muted-foreground">Identify a specific persona (e.g., commuters, tourists) and solve a specific pain point.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Design a vending machine for the blind.</p>
                    <p className="text-xs text-muted-foreground">Consider auditory feedback, tactile payments, and spatial item mapping.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Behavioral Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Tell me about a time you failed.</p>
                    <p className="text-xs text-muted-foreground">Look for accountability, what they learned, and how they applied it later.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">How do you prioritize features?</p>
                    <p className="text-xs text-muted-foreground">Listen for frameworks (RICE, Kano) and understanding of engineering constraints vs. user value.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Tell me about a time you influenced a team without authority.</p>
                    <p className="text-xs text-muted-foreground">Look for empathy, data-driven persuasion, and collaborative problem-solving.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Mock interview feedback</DialogTitle>
            </DialogHeader>

            {(() => {
              const interview = (myInterviews || []).find((i: any) => i.id === feedbackInterviewId) as any;
              if (!interview) {
                return <p className="text-sm text-muted-foreground">Select an interview to view feedback.</p>;
              }

              const isInterviewer = interview.interviewer_id === user?.id;
              const existing = (myFeedback || []).find((f: any) => f.interview_id === interview.id) as any;
              const canEdit = isInterviewer;

              const shownRubric = (existing?.rubric as any) || rubric;
              const shownNotes = existing?.notes ?? notes;
              const shownStrengths = existing?.strengths ?? strengths;
              const shownImprovements = existing?.improvements ?? improvements;
              const shownActionItems = existing?.action_items ?? actionItems;

              if (!canEdit) {
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Card>
                        <CardContent className="p-4 space-y-1">
                          <p className="text-xs text-muted-foreground">Structure</p>
                          <p className="text-lg font-semibold">{shownRubric.structure ?? "-"}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 space-y-1">
                          <p className="text-xs text-muted-foreground">Communication</p>
                          <p className="text-lg font-semibold">{shownRubric.communication ?? "-"}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 space-y-1">
                          <p className="text-xs text-muted-foreground">Product thinking</p>
                          <p className="text-lg font-semibold">{shownRubric.productThinking ?? "-"}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 space-y-1">
                          <p className="text-xs text-muted-foreground">Clarity</p>
                          <p className="text-lg font-semibold">{shownRubric.clarity ?? "-"}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Notes</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm whitespace-pre-wrap">
                        {shownNotes || <span className="text-muted-foreground">No notes provided.</span>}
                      </CardContent>
                    </Card>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm whitespace-pre-wrap">
                          {shownStrengths || <span className="text-muted-foreground">—</span>}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Improvements</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm whitespace-pre-wrap">
                          {shownImprovements || <span className="text-muted-foreground">—</span>}
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Next steps</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm whitespace-pre-wrap">
                        {shownActionItems || <span className="text-muted-foreground">—</span>}
                      </CardContent>
                    </Card>
                  </div>
                );
              }

              return (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "structure", label: "Structure" },
                      { key: "communication", label: "Communication" },
                      { key: "productThinking", label: "Product thinking" },
                      { key: "clarity", label: "Clarity" },
                    ].map((item) => (
                      <div key={item.key} className="space-y-2">
                        <Label>{item.label} (1–5)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={rubric[item.key] ?? 3}
                          onChange={(e) =>
                            setRubric((prev) => ({ ...prev, [item.key]: Number(e.target.value) }))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Notes / bullet point summary</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={"- What went well\n- What to improve\n- Any frameworks to practice"}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Strengths</Label>
                      <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} className="min-h-[90px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>Improvements</Label>
                      <Textarea value={improvements} onChange={(e) => setImprovements(e.target.value)} className="min-h-[90px]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Action items / next steps</Label>
                    <Textarea value={actionItems} onChange={(e) => setActionItems(e.target.value)} className="min-h-[90px]" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={async () => {
                        await upsertFeedback({
                          interviewId: interview.id,
                          rubric,
                          notes,
                          strengths,
                          improvements,
                          actionItems,
                        });
                        setFeedbackOpen(false);
                      }}
                    >
                      Save feedback
                    </Button>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default MockInterviewsPage;
