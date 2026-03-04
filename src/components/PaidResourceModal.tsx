import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthModal from "./AuthModal";

interface PaidResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceUrl: string;
  isAuthenticated: boolean;
  isPmaMember: boolean;
}

const PaidResourceModal = ({ isOpen, onClose, resourceTitle, resourceUrl, isAuthenticated, isPmaMember }: PaidResourceModalProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const getResourceContent = () => {
    if (resourceTitle === "PMF Labs") {
      return {
        description: "We are partnered with PMF Labs! It's an AI-powered mock interviewer for PM interviews. Practice real company interview questions from the comfort of your home and receive real assessments and feedback.",
        benefit: isPmaMember 
          ? "As a PMA member you get 90 minutes of free credits and 75% off purchase with code" 
          : "As a PMA member you get 90 minutes of free credits and 75% off purchase",
        code: "BYU2025",
        videoUrl: "", // Add video URL when available
      };
    } else if (resourceTitle === "Leland+") {
      return {
        description: "Leland offers PMA students access to premium recruiting resources created by industry professionals.",
        benefit: isPmaMember
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
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] p-0">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                  Premium Partner
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold">{resourceTitle}</DialogTitle>
              <DialogDescription className="text-sm">
                Exclusive benefits for PMA members
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              {/* Video placeholder */}
              {content.videoUrl && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <p className="text-muted-foreground">Demo Video</p>
                </div>
              )}
              
              {!content.videoUrl && (
                <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg flex items-center justify-center border border-border">
                  <p className="text-xs text-muted-foreground">Demo video coming soon</p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">{content.description}</p>
                
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20 space-y-2">
                  <p className="font-semibold text-sm text-foreground">{content.benefit}</p>
                  {isPmaMember && (
                    <>
                      <p className="text-xs text-muted-foreground">Just make sure you create your account with your BYU email!</p>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-xs text-muted-foreground">Your Code:</span>
                        <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-background border-primary/30">
                          {content.code}
                        </Badge>
                      </div>
                    </>
                  )}
                  {!isPmaMember && isAuthenticated && (
                    <p className="text-xs text-muted-foreground">
                      Join PMA at{" "}
                      <a 
                        href="https://clubs.byu.edu/link/club/18295873486206095" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary underline hover:no-underline"
                      >
                        clubs.byu.edu
                      </a>
                      {" "}to unlock your discount code!
                    </p>
                  )}
                </div>

                {!isAuthenticated ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-muted-foreground text-center">
                      Sign in to view premium partner benefits
                    </p>
                    <Button onClick={() => setAuthModalOpen(true)} className="w-full" size="default">
                      Sign In to View
                    </Button>
                  </div>
                ) : !isPmaMember ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-muted-foreground text-center">
                      Join PMA to access exclusive discount codes
                    </p>
                    <Button 
                      onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", '_blank')}
                      className="w-full"
                      size="default"
                    >
                      Join PMA
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={() => window.open(resourceUrl, '_blank')}
                      className="flex-1"
                      size="default"
                    >
                      Visit {resourceTitle}
                    </Button>
                    <Button onClick={onClose} variant="outline" size="default">
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </Dialog>
  );
};

export default PaidResourceModal;
