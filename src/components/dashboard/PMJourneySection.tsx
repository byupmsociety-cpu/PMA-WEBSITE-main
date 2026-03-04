import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  BookOpen, 
  Network, 
  Target, 
  Briefcase, 
  CheckCircle2, 
  ChevronDown 
} from "lucide-react";
import { JourneyStep } from "@/hooks/useDashboardData";

interface PMJourneySectionProps {
  steps: JourneyStep[];
  userPersona: string | null;
  onToggleStep: (stepId: string, currentStatus: boolean) => void;
  disabled?: boolean;
  defaultCollapsed?: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  learning: <BookOpen className="h-4 w-4" />,
  networking: <Network className="h-4 w-4" />,
  practice: <Target className="h-4 w-4" />,
  applying: <Briefcase className="h-4 w-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  learning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  networking: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  practice: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  applying: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const SECTION_COLORS: Record<string, string> = {
  curious: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
  starting: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
  recruiting: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
};

const SECTION_TITLES: Record<string, string> = {
  curious: "Exploring PM",
  starting: "Starting PM Path",
  recruiting: "Recruiting for PM",
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  curious: <BookOpen className="h-5 w-5 text-primary" />,
  starting: <Target className="h-5 w-5 text-primary" />,
  recruiting: <Briefcase className="h-5 w-5 text-primary" />,
};

export function PMJourneySection({
  steps,
  userPersona,
  onToggleStep,
  disabled = false,
  defaultCollapsed = false,
}: PMJourneySectionProps) {
  // Group steps by persona
  const curiousSteps = steps.filter(s => s.persona === "curious");
  const startingSteps = steps.filter(s => s.persona === "starting");
  const recruitingSteps = steps.filter(s => s.persona === "recruiting");

  // Determine which sections should be marked as completed based on user's persona
  const isCuriousCompleted = userPersona === "starting" || userPersona === "recruiting";
  const isStartingCompleted = userPersona === "recruiting";

  const renderSection = (
    persona: string,
    sectionSteps: JourneyStep[],
    sectionCompleted: boolean
  ) => {
    const completedCount = sectionSteps.filter(s => s.completed || sectionCompleted).length;
    const totalCount = sectionSteps.length;

    return (
      <Collapsible defaultOpen={!defaultCollapsed && !sectionCompleted} key={persona}>
        <div className={`space-y-3 p-4 rounded-lg border-2 ${SECTION_COLORS[persona]}`}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  sectionCompleted ? "bg-primary/20" : "bg-muted"
                }`}>
                  {sectionCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    SECTION_ICONS[persona]
                  )}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold flex items-center gap-2">
                    {SECTION_TITLES[persona]}
                    {sectionCompleted && (
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {completedCount} of {totalCount} steps
                  </p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 pt-3">
              {sectionSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-all ${
                    step.completed || sectionCompleted
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={step.completed || sectionCompleted}
                      onCheckedChange={() => !disabled && !sectionCompleted && onToggleStep(step.id, step.completed || false)}
                      disabled={sectionCompleted || disabled}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              (step.completed || sectionCompleted) ? "line-through text-muted-foreground" : ""
                            }`}>
                              {index + 1}. {step.title}
                            </span>
                            {(step.completed || sectionCompleted) && (
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </div>
                          {step.description && (
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          )}
                        </div>
                        <Badge className={`shrink-0 text-xs ${CATEGORY_COLORS[step.category] || ""}`}>
                          <span className="flex items-center gap-1">
                            {CATEGORY_ICONS[step.category]}
                            {step.category}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your PM Journey</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your progress through the complete PM career path
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSection("curious", curiousSteps, isCuriousCompleted)}
        {renderSection("starting", startingSteps, isStartingCompleted)}
        {renderSection("recruiting", recruitingSteps, false)}
      </CardContent>
    </Card>
  );
}
