import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Rocket } from "lucide-react";
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
    // Check if modal was dismissed in this session
    const dismissed = sessionStorage.getItem('hackathonModalDismissed');
    if (dismissed === 'true') {
      setHasShown30(true); // Prevent showing the modal
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown30, hasShown60]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };

  const handleScroll = () => {
    if (isLoggedIn) return; // Don't show modals for logged-in users
    
    // Check if modal was dismissed in this session
    const dismissed = sessionStorage.getItem('hackathonModalDismissed');
    if (dismissed === 'true') return;

    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > 30 && !hasShown30 && !show30Modal) {
      setShow30Modal(true);
      setHasShown30(true);
    }

    // Disabled second modal for now
    // if (scrollPercent > 60 && !hasShown60 && !show60Modal) {
    //   setShow60Modal(true);
    //   setHasShown60(true);
    // }
  };

  return (
    <>
      {/* 30% Scroll Modal - Hackathon CTA */}
      <Dialog 
        open={show30Modal} 
        onOpenChange={(open) => {
          setShow30Modal(open);
          if (!open) {
            // User dismissed the modal - store in sessionStorage
            sessionStorage.setItem('hackathonModalDismissed', 'true');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Hackathon presentations are at the Kiln!
            </DialogTitle>
            <DialogDescription className="text-center">
              Friday, Feb 13th, 2–5 PM. View the schedule and room assignments.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button size="lg" onClick={() => window.open("https://docs.google.com/spreadsheets/d/1e_sVQZftfYrc-TiOKohjKHdkF12O8oao_diB6QjwRQc/edit?gid=0#gid=0", "_blank")} className="gap-2">
              <Rocket className="h-4 w-4" />
              View presentation schedule
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/hackathon")} className="gap-2">
              Hackathon details & FAQ
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => {
                setShow30Modal(false);
                // Store dismissal in sessionStorage
                sessionStorage.setItem('hackathonModalDismissed', 'true');
              }}
            >
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 60% Scroll Modal - Disabled for now */}
      {/* <Dialog open={show60Modal} onOpenChange={setShow60Modal}>
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
      </Dialog> */}
    </>
  );
};

export default ScrollTriggeredModals;
