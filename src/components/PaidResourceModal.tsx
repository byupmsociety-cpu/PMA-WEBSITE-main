import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PaidResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  isAuthenticated: boolean;
}

const PaidResourceModal = ({ isOpen, onClose, resourceTitle, isAuthenticated }: PaidResourceModalProps) => {
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-primary to-blue-500">
              Partnership
            </Badge>
            {resourceTitle}
          </DialogTitle>
          <DialogDescription>Premium resource for PMA members</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video placeholder - replace with actual video when available */}
          {content.videoUrl && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Demo Video</p>
            </div>
          )}
          
          {!content.videoUrl && (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-primary/20">
              <p className="text-muted-foreground">Demo video coming soon</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-foreground">{content.description}</p>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">{content.benefit}</p>
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-lg px-4 py-2 bg-background">
                    {content.code}
                  </Badge>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to access your exclusive discount code
                </p>
                <Button onClick={handleSignIn} className="w-full">
                  Sign In to Access
                </Button>
              </div>
            )}

            {isAuthenticated && (
              <div className="pt-2">
                <Button onClick={onClose} variant="outline" className="w-full">
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
