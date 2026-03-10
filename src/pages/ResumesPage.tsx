import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
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

interface AssetReview {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

const ResumesPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<AssetReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
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
    } else {
      setReviews(data as AssetReview[]);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Resume PDF must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

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
          file_name: file.name,
          status: 'pending'
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">PMA Members Only</h2>
        <p className="text-muted-foreground">You must be an approved PMA member to access resume reviews.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        
        <AnimatedSection animation="slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Resume Review Hub</h1>
            <p className="text-muted-foreground">
              Upload your resume as a PDF and get asynchronous feedback from PMA leadership and alumni.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Upload Section */}
          <AnimatedSection animation="slide-up" delay={100} className="md:col-span-1">
            <Card className="h-full border-primary/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Upload Resume</CardTitle>
                <CardDescription>
                  Submit a new version of your resume for feedback.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    uploading ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  style={{ cursor: uploading ? 'default' : 'pointer' }}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="w-8 h-8 animate-spin text-primary" />
                       <p className="text-sm font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-primary/10 rounded-full text-primary mb-2">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Click to browse file</p>
                      <p className="text-xs text-muted-foreground">PDF only, up to 5MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* History Section */}
          <AnimatedSection animation="slide-up" delay={150} className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Submissions</h2>
            
            {reviews.length === 0 ? (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">No resumes uploaded yet</p>
                  <p className="text-sm">Upload your first resume version on the left to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="overflow-hidden">
                    <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-muted rounded-md shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium truncate" title={review.file_name}>
                            {review.file_name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Submitted {format(new Date(review.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          <div className="mt-2">
                            <StatusBadge status={review.status} />
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
                      <div className="bg-muted/30 p-5 border-t border-border">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold mb-1">Reviewer Feedback</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {review.feedback || <i>No detailed feedback provided.</i>}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 inline-block">
                              Reviewed on {format(new Date(review.updated_at), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default ResumesPage;
