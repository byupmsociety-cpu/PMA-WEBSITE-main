import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, ExternalLink } from "lucide-react";
import AuthModal from "./AuthModal";

interface PremiumResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceUrl: string;
  isAuthenticated: boolean;
  isPmaMember: boolean;
}

const PremiumResourceModal = ({ 
  isOpen, 
  onClose, 
  resourceTitle, 
  resourceUrl, 
  isAuthenticated, 
  isPmaMember 
}: PremiumResourceModalProps) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleVisitResource = () => {
    window.open(resourceUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                PMA Member Exclusive
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold">{resourceTitle}</DialogTitle>
            <DialogDescription>
              This resource is exclusively available to PMA club members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            {!isAuthenticated ? (
              <>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Sign in to continue</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Create an account or sign in to see if you have access to this resource.
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setAuthModalOpen(true)} className="w-full">
                  Sign In
                </Button>
              </>
            ) : !isPmaMember ? (
              <>
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-4 space-y-3 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Become a PMA Member</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Join the Product Management Association to unlock exclusive resources, 
                        job alerts, personalized roadmaps, and connect with fellow PM aspirants.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", '_blank')}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    Join PMA
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button onClick={onClose} variant="outline" className="w-full">
                    Maybe Later
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    You have access to this resource as a PMA member!
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleVisitResource} className="flex-1">
                    Open Resource
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button onClick={onClose} variant="outline">
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default PremiumResourceModal;
