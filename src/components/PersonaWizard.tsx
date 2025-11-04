import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, Rocket, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PersonaOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const personas: PersonaOption[] = [
  {
    id: "curious",
    title: "Curious About PM?",
    description: "Just starting to explore product management and want to learn the basics",
    icon: <Compass className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "starting",
    title: "Starting My PM Path",
    description: "Building foundational PM skills and working on projects",
    icon: <Rocket className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "recruiting",
    title: "Actively Recruiting for PM",
    description: "Preparing for interviews and applying to PM positions",
    icon: <Target className="h-8 w-8" />,
    color: "from-orange-500 to-red-500"
  }
];

interface PersonaWizardProps {
  onSelect?: (persona: string) => void;
}

const PersonaWizard = ({ onSelect }: PersonaWizardProps) => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };

  const handlePersonaSelect = async (personaId: string) => {
    setSelectedPersona(personaId);
    
    if (onSelect) {
      onSelect(personaId);
    }

    if (!isLoggedIn) {
      // Show sign-in prompt
      toast({
        title: "Sign in to continue",
        description: "Create an account to unlock your personalized PM dashboard",
      });
      return;
    }

    // Save persona to profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ 
        persona: personaId as "curious" | "starting" | "recruiting", 
        onboarding_completed: true 
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save your selection. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Persona saved! 🎉",
      description: "Redirecting to your personalized dashboard...",
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Start Your PM Journey
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your path to get personalized resources, step-by-step guidance, and connect with peers
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {personas.map((persona) => (
          <Card
            key={persona.id}
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
              selectedPersona === persona.id 
                ? "ring-2 ring-primary shadow-lg" 
                : "hover:border-primary/50"
            }`}
            onClick={() => handlePersonaSelect(persona.id)}
          >
            <CardHeader className="space-y-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center text-white mx-auto`}>
                {persona.icon}
              </div>
              <CardTitle className="text-center">{persona.title}</CardTitle>
              <CardDescription className="text-center">
                {persona.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant={selectedPersona === persona.id ? "default" : "outline"}
              >
                Select This Path
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoggedIn && (
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6 space-y-4 text-center">
            <h3 className="text-xl font-semibold">Unlock Your Personal PM Dashboard</h3>
            <p className="text-muted-foreground">
              Track your progress, earn badges, and connect with peers on their PM journey
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Sign In to Get Started
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaWizard;
