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
} from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface AssetReviewWithProfile {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string | null;
  created_at: string;
  updated_at: string;
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
        profile:profiles(full_name, email)
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
            <p className="text-muted-foreground">Manage and review member resume submissions</p>
          </div>
          <Badge variant="outline" className="w-fit text-sm">
            {pendingReviews.length} Pending
          </Badge>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="slide-up" delay={100}>
        <Card>
          <CardHeader>
            <CardTitle>Needs Review</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20 text-green-500" />
                <p>Inbox zero! All caught up on resume reviews.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4 bg-muted/20">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-primary/10 rounded-full shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          {review.profile?.full_name || "Unknown Member"}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate max-w-[250px] sm:max-w-md" title={review.file_name}>
                          {review.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {format(new Date(review.created_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full sm:w-auto gap-2">
                       <Button variant="outline" size="sm" onClick={() => window.open(review.file_url, '_blank')} className="flex-1 sm:flex-none">
                         <Eye className="w-4 h-4 mr-2" /> View PDF
                       </Button>
                       <Button size="sm" onClick={() => handleOpenReview(review)} className="flex-1 sm:flex-none">
                         <Send className="w-4 h-4 mr-2" /> Review
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      {pastReviews.length > 0 && (
        <AnimatedSection animation="slide-up" delay={200}>
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastReviews.map((review) => (
                  <div key={review.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {review.profile?.full_name || "Unknown Member"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={review.status} />
                          <span className="text-xs text-muted-foreground">
                            Reviewed {format(new Date(review.updated_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenReview(review)}>
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Evaluate Resume</DialogTitle>
            <DialogDescription>
              Review the submission from {currentReview?.profile?.full_name || "Unknown Member"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-md border">
               <span className="text-sm font-medium truncate shrink min-w-0 mr-4">{currentReview?.file_name}</span>
               <Button variant="secondary" size="sm" onClick={() => window.open(currentReview?.file_url, '_blank')} className="shrink-0">
                 <Eye className="w-4 h-4 mr-2" /> View PDF
               </Button>
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">Feedback Notes</label>
              <Textarea
                id="feedback"
                placeholder="Leave constructive feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => submitReview('rejected')}
              disabled={submitting}
            >
              {submitting && currentReview?.status !== 'rejected' ? null : <XCircle className="w-4 h-4 mr-2" />}
              Needs Revision
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => submitReview('approved')}
              disabled={submitting}
            >
              {submitting && currentReview?.status !== 'approved' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Approve Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminResumesPage;
