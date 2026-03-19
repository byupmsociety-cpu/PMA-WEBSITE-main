import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Send,
  User as UserIcon,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetReviewWithProfile {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string | null;
  created_at: string;
  updated_at: string;
  is_tailored: boolean | null;
  job_title: string | null;
  job_url: string | null;
  job_description: string | null;
  profile: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const AdminResumesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<AssetReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<AssetReviewWithProfile | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    // Fetch reviews along with user profile data
    const { data, error } = await supabase
      .from("asset_reviews")
      .select(`
        *,
        profile:profiles!asset_reviews_user_id_fkey(full_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load resume reviews.",
        variant: "destructive",
      });
    } else {
      // @ts-ignore - Supabase types are wonky with joins sometimes
      setReviews((data as any[]) || []);
    }
    setLoading(false);
  };

  const handleOpenReview = (review: AssetReviewWithProfile) => {
    setCurrentReview(review);
    setFeedbackText(review.feedback || "");
    setReviewStatus(review.status === 'pending' ? 'approved' : (review.status as 'approved' | 'rejected'));
    setIsReviewOpen(true);
  };

  const submitReview = async (status: 'approved' | 'rejected') => {
    if (!currentReview || !user) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("asset_reviews")
      .update({
        status,
        feedback: feedbackText.trim() === "" ? null : feedbackText,
        reviewer_id: user.id,
      })
      .eq("id", currentReview.id);

    if (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review submitted",
        description: `Resume has been marked as ${status}.`,
      });
      setIsReviewOpen(false);
      await loadReviews();
    }
    setSubmitting(false);
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const pastReviews = reviews.filter(r => r.status !== 'pending');

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Needs Revision</Badge>;
      default:
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatedSection animation="slide-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Resume Reviews</h1>
            <p className="text-muted-foreground">
              Provide human, PM-focused feedback on resumes that often have already been improved using VMock.
            </p>
          </div>
          <Badge variant="outline" className="w-fit text-sm">
            {pendingReviews.length} Pending
          </Badge>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="slide-up" delay={100}>
        <Card>
          <CardHeader>
            <CardTitle>Manage Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="pending" className="relative">
                  Needs Review
                  {pendingReviews.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-primary/20 hover:bg-primary/20 hidden sm:inline-flex">
                      {pendingReviews.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="history">Review History</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="m-0">
                {pendingReviews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20 text-green-500" />
                    <p>Inbox zero! All caught up on resume reviews.</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>Target Role</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingReviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                                <UserIcon className="w-4 h-4 text-muted-foreground hidden sm:block shrink-0" />
                                {review.profile?.full_name || "Unknown Member"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="truncate max-w-[120px] sm:max-w-[200px] lg:max-w-[300px]" title={review.file_name}>
                                  {review.file_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {review.is_tailored && review.job_title ? (
                                <div className="flex items-center gap-1.5 text-sm text-primary max-w-[150px] truncate" title={review.job_title}>
                                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{review.job_title}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                              {format(new Date(review.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => window.open(review.file_url, '_blank')} className="hidden sm:flex" title="Open PDF">
                                  <Eye className="w-4 h-4 mr-2" /> PDF
                                </Button>
                                <Button size="sm" onClick={() => handleOpenReview(review)}>
                                  Review
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="m-0">
                {pastReviews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/10">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No reviewed resumes yet.</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>Target Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reviewed</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastReviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <div className="font-medium flex items-center gap-2 whitespace-nowrap">
                                {review.profile?.full_name || "Unknown Member"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[250px]" title={review.file_name}>
                                  {review.file_name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {review.is_tailored && review.job_title ? (
                                <div className="flex items-center gap-1.5 text-sm text-primary max-w-[150px] truncate" title={review.job_title}>
                                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate">{review.job_title}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={review.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                              {format(new Date(review.updated_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenReview(review)}>
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full flex flex-col pt-10">
          <DialogTitle className="sr-only">Evaluate Resume</DialogTitle>
          <DialogDescription className="sr-only">Review the submission.</DialogDescription>
          
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
            {/* Left side: PDF Viewer */}
            <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden border flex flex-col">
              {currentReview ? (
                <iframe 
                  src={currentReview.file_name.toLowerCase().endsWith('.docx') 
                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(currentReview.file_url)}&embedded=true` 
                    : `${currentReview.file_url}#toolbar=0`} 
                  className="w-full h-full min-h-[50vh] lg:min-h-full flex-1" 
                  title="Resume Document"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Right side: Review Form */}
            <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Evaluate Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Reviewing submission from {currentReview?.profile?.full_name || "Unknown Member"}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-muted rounded-md border mb-6">
                 <span className="text-sm font-medium truncate shrink min-w-0 mr-4" title={currentReview?.file_name}>{currentReview?.file_name}</span>
                 <Button variant="secondary" size="sm" onClick={() => window.open(currentReview?.file_url, '_blank')} className="shrink-0">
                   <Eye className="w-4 h-4 mr-2" /> Open in New Tab
                 </Button>
              </div>

              <div className="flex flex-col min-h-0 space-y-4 mb-6 flex-1 overflow-y-auto pr-1">
                {currentReview?.is_tailored && currentReview?.job_title && (
                  <div className="p-4 rounded-md border bg-muted/50 space-y-3 shrink-0">
                    <div className="flex items-start gap-2">
                       <Briefcase className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                       <div className="min-w-0">
                         <p className="font-semibold text-sm leading-tight flex items-center gap-2 flex-wrap">
                            <span className="truncate">{currentReview.job_title}</span>
                            {currentReview.job_url && (
                              <a href={currentReview.job_url} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center whitespace-nowrap shrink-0" title="Open Job Link">
                                 Link <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                         </p>
                         <p className="text-xs text-muted-foreground mt-0.5">Targeted Role</p>
                       </div>
                    </div>
                    {currentReview.job_description && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="job-desc" className="border-b-0">
                          <AccordionTrigger className="py-2 text-xs font-medium hover:no-underline px-2 rounded hover:bg-muted bg-background border">
                            View Job Description
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 px-1 text-xs text-muted-foreground whitespace-pre-wrap max-h-[200px] overflow-y-auto mt-2 bg-background p-3 rounded border">
                            {currentReview.job_description}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                )}

                <div className="flex-1 flex flex-col min-h-[200px] space-y-2">
                  <label htmlFor="feedback" className="text-sm font-medium">Detailed Feedback</label>
                  <Textarea
                    id="feedback"
                    placeholder="Leave constructive feedback for the member..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="flex-1 resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Status</label>
                  <Select value={reviewStatus} onValueChange={(v: 'approved' | 'rejected') => setReviewStatus(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">
                        <div className="flex items-center text-green-600 font-medium">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center text-red-600 font-medium">
                          <XCircle className="w-4 h-4 mr-2" />
                          Needs Revision
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end flex-1">
                  <Button 
                    className="w-full"
                    onClick={() => submitReview(reviewStatus)}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminResumesPage;
