import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScrollTriggeredModals = () => {
  const [show30Modal, setShow30Modal] = useState(false);
  const [show60Modal, setShow60Modal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasShown30, setHasShown30] = useState(false);
  const [hasShown60, setHasShown60] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown30, hasShown60]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };

  const handleScroll = () => {
    if (isLoggedIn) return; // Don't show modals for logged-in users

    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > 30 && !hasShown30 && !show30Modal) {
      setShow30Modal(true);
      setHasShown30(true);
    }

    if (scrollPercent > 60 && !hasShown60 && !show60Modal) {
      setShow60Modal(true);
      setHasShown60(true);
    }
  };

  return (
    <>
      {/* 30% Scroll Modal - Dashboard Checklist */}
      <Dialog open={show30Modal} onOpenChange={setShow30Modal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Want Your Own Step-by-Step PM Checklist?
            </DialogTitle>
            <DialogDescription className="text-center">
              Sign in to get your personalized dashboard with:
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  ✓ <span>Customized PM journey checklist</span>
                </li>
                <li className="flex items-center gap-2">
                  ✓ <span>Progress tracking & badges</span>
                </li>
                <li className="flex items-center gap-2">
                  ✓ <span>Personalized resource recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  ✓ <span>Connect with peers on the same journey</span>
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Sign In to Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShow30Modal(false)}>
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 60% Scroll Modal - Community Connection */}
      <Dialog open={show60Modal} onOpenChange={setShow60Modal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              See What Your Friends Are Working On
            </DialogTitle>
            <DialogDescription className="text-center">
              Join the PMA community to:
              <ul className="mt-4 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  🤝 <span>Connect with peers on the same PM journey</span>
                </li>
                <li className="flex items-center gap-2">
                  💡 <span>Form study groups & practice together</span>
                </li>
                <li className="flex items-center gap-2">
                  🎯 <span>See which steps your classmates are on</span>
                </li>
                <li className="flex items-center gap-2">
                  🌟 <span>Share success stories & celebrate wins</span>
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <Users className="h-4 w-4" />
              Join the Community
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShow60Modal(false)}>
              Continue Browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScrollTriggeredModals;
