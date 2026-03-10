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
import { useMockInterviews } from "@/hooks/useMockInterviews";
import { format } from "date-fns";

const MockInterviewsPage = () => {
  const { profile, user } = useAuth();
  const isPmaMember = profile?.is_pma_member || false;
  
  const { 
    openSlots, 
    mySlots, 
    myInterviews, 
    isLoading, 
    createSlot, 
    deleteSlot, 
    bookInterview 
  } = useMockInterviews(user?.id);

  const [activeTab, setActiveTab] = useState<"find" | "schedule" | "library">("find");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [newSlotTime, setNewSlotTime] = useState("");

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotDate || !newSlotTime) return;
    
    // Create Date objects (keeping it simple for MVP)
    const start = new Date(`${newSlotDate}T${newSlotTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour later
    
    await createSlot({
      startTime: start.toISOString(),
      endTime: end.toISOString()
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
                  <Label>Start Time (1 hour slot)</Label>
                  <Input 
                    type="time" 
                    required 
                    value={newSlotTime} 
                    onChange={(e) => setNewSlotTime(e.target.value)} 
                  />
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
                        onClick={() => bookInterview({ slotId: slot.id, interviewerId: slot.user_id })}
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
                           <p className="text-xs text-muted-foreground">Reach out via email or Slack to coordinate a meeting link.</p>
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

      </div>
    </div>
  );
};

export default MockInterviewsPage;
