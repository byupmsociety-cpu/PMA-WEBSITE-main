import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PaidResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceUrl: string;
  isAuthenticated: boolean;
}

const PaidResourceModal = ({ isOpen, onClose, resourceTitle, resourceUrl, isAuthenticated }: PaidResourceModalProps) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate(`/auth?resource=${encodeURIComponent(resourceTitle)}`);
  };

  const getResourceContent = () => {
    if (resourceTitle === "PMF Labs") {
      return {
        description: "We are partnered with PMF Labs! It's an AI-powered mock interviewer for PM interviews. Practice real company interview questions from the comfort of your home and receive real assessments and feedback.",
        benefit: isAuthenticated 
          ? "As a PMA member you get 90 minutes of free credits and 75% off purchase with code" 
          : "As a PMA member you get 90 minutes of free credits and 75% off purchase",
        code: "BYU2025",
        videoUrl: "", // Add video URL when available
      };
    } else if (resourceTitle === "Leland+") {
      return {
        description: "Leland offers PMA students access to premium recruiting resources created by industry professionals.",
        benefit: isAuthenticated
          ? "Leland offers PMA students $50 Coaching Credit with code"
          : "Leland offers PMA students $50 Coaching Credit",
        code: "BYU-PMA-50",
        videoUrl: "", // Add video URL when available
      };
    }
    return null;
  };

  const content = getResourceContent();
  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              Premium Partner
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold">{resourceTitle}</DialogTitle>
          <DialogDescription className="text-base">
            Exclusive benefits for PMA members
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {/* Video placeholder */}
          {content.videoUrl && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <p className="text-muted-foreground">Demo Video</p>
            </div>
          )}
          
          {!content.videoUrl && (
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg flex items-center justify-center border border-border">
              <p className="text-sm text-muted-foreground">Demo video coming soon</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">{content.description}</p>
            
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border border-primary/20 space-y-3">
              <p className="font-semibold text-foreground">{content.benefit}</p>
              <p className="text-sm text-muted-foreground">Just make sure you create your account with your BYU email!</p>
              {isAuthenticated && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm text-muted-foreground">Your Code:</span>
                  <Badge variant="outline" className="font-mono text-base px-4 py-2 bg-background border-primary/30">
                    {content.code}
                  </Badge>
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="space-y-3 pt-2">
                <p className="text-muted-foreground text-center">
                  Sign in to access your exclusive discount code
                </p>
                <Button onClick={handleSignIn} className="w-full h-11" size="lg">
                  Sign In to Access
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => window.open(resourceUrl, '_blank')}
                  className="flex-1 h-11"
                  size="lg"
                >
                  Visit {resourceTitle}
                </Button>
                <Button onClick={onClose} variant="outline" className="h-11" size="lg">
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaidResourceModal;
