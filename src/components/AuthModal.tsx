import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only redirect when modal is open (user just signed in via modal), not on token refresh etc.
      if (session?.user && isOpen) {
        onSuccess?.();
        onClose();
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [isOpen, onClose, onSuccess, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate BYU email
    if (!email.toLowerCase().endsWith('@byu.edu')) {
      toast({
        title: "Invalid Email",
        description: "You must use a @byu.edu email address to create an account.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Account created successfully! Check your email to verify your account.",
      });
    }

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Signed in successfully.",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setEmail("");
        setPassword("");
        setFullName("");
        setIsSignUp(false);
      }
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create an Account" : "Sign In"}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? "Join with your BYU email to start your PM journey"
              : "Sign in to access your resources"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4" autoComplete="off">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="off"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        
        <div className="text-center text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
