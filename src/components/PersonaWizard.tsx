import { useState } from "react";
import { Sparkles, Compass, Rocket, Target } from "lucide-react";

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
  const [selectedPersona, setSelectedPersona] = useState<string | null>("curious");

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    
    if (onSelect) {
      onSelect(personaId);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Start Your PM Journey
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your path to get personalized resources, step-by-step guidance, and connect with peers
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => handlePersonaSelect(persona.id)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              selectedPersona === persona.id
                ? "border-primary bg-primary/10 shadow-lg scale-105"
                : "border-border hover:border-primary/50 hover:bg-accent"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center text-white`}>
                {persona.icon}
              </div>
              <h3 className="font-semibold text-sm">{persona.title}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaWizard;
