import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import MemberLockout from "@/components/MemberLockout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  UploadCloud,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AssetReview {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string | null;
  created_at: string;
  updated_at: string;
  is_tailored?: boolean;
  job_title?: string | null;
  job_url?: string | null;
  job_description?: string | null;
}

const ResumesPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<AssetReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  
  const [isTailored, setIsTailored] = useState<"yes" | "no" | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (isPmaMember) {
        void loadReviews();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, user, isPmaMember, navigate]);

  const loadReviews = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("asset_reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load resume reviews.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const typed = (data || []) as AssetReview[];
    setReviews(typed);

    // Mark latest feedback as viewed for dashboard notifications (persistent in DB)
    try {
      const latestCompleted = typed
        .filter((r) => r.status !== "pending")
        .sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];

      if (latestCompleted) {
        await supabase
          .from("profiles")
          .update({ last_seen_resume_feedback_at: latestCompleted.updated_at })
          .eq("user_id", user.id);
      }
    } catch (e) {
      console.error("Error updating resume feedback last seen timestamp in DB:", e);
    }

    setLoading(false);
  };

  const handleFileSelection = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Resume must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsTailored(null);
    setJobTitle("");
    setJobUrl("");
    setJobDescription("");
    setIsContextModalOpen(true);
  };

  const submitResume = async () => {
    if (!user || !selectedFile) return;

    if (isTailored === 'yes' && !jobTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide the role or company name.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setIsContextModalOpen(false);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('asset_reviews')
        .insert({
          user_id: user.id,
          file_url: publicUrl,
          file_name: selectedFile.name,
          status: 'pending',
          is_tailored: isTailored === 'yes',
          job_title: isTailored === 'yes' ? jobTitle.trim() : null,
          job_url: isTailored === 'yes' ? jobUrl.trim() : null,
          job_description: isTailored === 'yes' ? jobDescription.trim() : null
        });

      if (dbError) throw dbError;

      toast({
        title: "Resume uploaded",
        description: "Your resume has been submitted for review. An admin will provide feedback soon.",
      });

      await loadReviews();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume. Ensure you've created the 'resumes' storage bucket.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume? The feedback will also be lost.")) return;
    
    // Optimistic UI update could be done here, but let's wait for DB
    const { error } = await supabase
      .from("asset_reviews")
      .delete()
      .eq("id", id)
      .eq("status", "pending"); // Only allow deleting pending reviews for now from UI

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Resume deleted",
        description: "The resume review request has been removed.",
      });
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Needs Revision</Badge>;
      default:
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent dark:bg-amber-900/30 dark:text-amber-300"><Clock className="w-3 h-3 mr-1" /> Pending Review</Badge>;
    }
  };

  const renderReviewCard = (review: AssetReview, isLatest: boolean) => (
    <Card key={review.id} className={`overflow-hidden ${isLatest ? 'border-primary/30 shadow-md ring-1 ring-primary/10' : 'opacity-80 hover:opacity-100 transition-opacity'}`}>
      <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-md shrink-0 ${isLatest ? 'bg-primary/10' : 'bg-muted'}`}>
            <FileText className={`w-6 h-6 ${isLatest ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate" title={review.file_name}>
              {review.file_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Submitted {format(new Date(review.created_at), "MMM d, yyyy 'at' h:mm a")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              <StatusBadge status={review.status} />
              {review.is_tailored && review.job_title && (
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  Targeted: {review.job_title}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => window.open(review.file_url, '_blank')}>
            <Eye className="w-4 h-4 mr-2" /> View PDF
          </Button>
          {review.status === 'pending' && (
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleDelete(review.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Section */}
      {review.status !== 'pending' && (
        <div className={`p-5 border-t border-border ${isLatest ? 'bg-muted/50' : 'bg-muted/30'}`}>
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1">Reviewer Feedback</h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {review.feedback || <i className="text-muted-foreground">No detailed feedback provided.</i>}
              </p>
              <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 inline-block">
                Reviewed on {format(new Date(review.updated_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return <MemberLockout 
      description="You must be an approved PMA member to access resume reviews." 
      features={[
        "Get your resume reviewed by experienced PMA Presidency",
        "Access a database of successful PM resumes",
        "Learn how to tailor your experience for PM roles",
        "Stand out to recruiters and hiring managers"
      ]}
    />;
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 max-w-full">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-3">Resume Review</h1>
          <p className="text-muted-foreground">
            Get your resume reviewed using instant AI feedback or personalized guidance from PMA Leadership.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: VMock */}
          <AnimatedSection animation="slide-up">
            <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors flex flex-col overflow-hidden group">
              <div className="h-2 bg-blue-500 w-full"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <span className="text-2xl">🤖</span>
                </div>
                <CardTitle className="text-xl">Instant AI Feedback</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Use VMock to get immediate, automated scoring and line-by-line formatting suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <ul className="text-sm text-muted-foreground space-y-2 mb-8">
                 <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" /> Free access with BYU NetID</li>
                 <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" /> Catch spelling/grammar issues</li>
                 <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" /> Perfect your basic structure</li>
                </ul>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="https://www.vmock.com/byu/login" target="_blank" rel="noreferrer">
                    Open VMock ↗
                  </a>
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Card 2: PMA Review */}
          <AnimatedSection animation="slide-up" delay={100}>
            <Card className="h-full border-primary/20 hover:border-primary/50 transition-colors flex flex-col overflow-hidden group">
              <div className="h-2 bg-primary w-full"></div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">👥</span>
                </div>
                <CardTitle className="text-xl">PMA Leadership Review</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Get personalized, targeted feedback on your PM storytelling, impact metrics, and role-fit.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <ul className="text-sm text-muted-foreground space-y-2 mb-8">
                 <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" /> Human feedback from PMA leaders</li>
                 <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" /> Targeted to your specific roles</li>
                 <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-primary shrink-0 mt-0.5" /> Best used after a VMock scan</li>
                </ul>
                
                <div className="w-full">
                  <input 
                    type="file" 
                    accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <Button 
                    className="w-full" 
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                    Upload Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* History Section */}
        <AnimatedSection animation="slide-up" delay={200}>
          <div className="mb-6 border-b border-border/50 pb-2">
            <h2 className="text-2xl font-semibold">Your Review Submissions</h2>
            <p className="text-sm text-muted-foreground mt-1">Track the status and read feedback for your uploaded resumes.</p>
          </div>
          
          {reviews.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium">No resumes uploaded yet</p>
                <p className="text-sm mt-2 max-w-md">
                  Upload your resume using the PMA Review card above. We recommend using VMock first to catch basic errors!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-4xl space-y-8">
              {/* Latest Submission */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold mr-2">LATEST</span>
                  Current Status
                </h3>
                
                {reviews[0].status === 'rejected' && (
                  <div className="mb-4 p-4 border border-destructive/50 bg-destructive/10 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive">Action Required: Revision Needed</h4>
                      <p className="text-sm text-destructive/90 mt-1">
                        Your resume requires some updates. Please review the feedback below, make the necessary changes, and upload a new version.
                      </p>
                    </div>
                  </div>
                )}

                {renderReviewCard(reviews[0], true)}
              </div>

              {/* Previous Versions */}
              {reviews.length > 1 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 border-b border-border/50 pb-2">
                    Previous Versions
                  </h3>
                  <div className="space-y-4">
                    {reviews.slice(1).map((review) => renderReviewCard(review, false))}
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatedSection>
        <Dialog open={isContextModalOpen} onOpenChange={setIsContextModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Job Context</DialogTitle>
              <DialogDescription>
                Is this resume tailored for a specific job application? Providing this context helps reviewers give more targeted feedback.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isTailored === "yes" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsTailored("yes")}
                >
                  Yes, it's for a specific job
                </Button>
                <Button
                  type="button"
                  variant={isTailored === "no" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setIsTailored("no")}
                >
                  No, general resume
                </Button>
              </div>

              {isTailored === "yes" && (
                <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Role / Company <span className="text-red-500">*</span></Label>
                    <Input 
                      id="jobTitle" 
                      placeholder="e.g. Product Manager Intern at Google" 
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobUrl">Job Link (Optional)</Label>
                    <Input 
                      id="jobUrl" 
                      type="url"
                      placeholder="https://..." 
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDesc">Job Description (Optional)</Label>
                    <Textarea 
                      id="jobDesc" 
                      placeholder="Paste the key requirements or description here if the link might be broken..." 
                      className="min-h-[100px] resize-y"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsContextModalOpen(false)}>Cancel</Button>
              <Button onClick={submitResume} disabled={isTailored === null || (isTailored === 'yes' && !jobTitle.trim()) || uploading}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Submit Resume
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ResumesPage;
