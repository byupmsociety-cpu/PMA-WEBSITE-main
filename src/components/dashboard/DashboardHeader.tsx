import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";

interface DashboardHeaderProps {
  fullName: string | null;
  isPmaMember: boolean;
  newJobsCount?: number;
  roadmapProgress?: number;
  memberCount?: number;
  upcomingEventsCount?: number;
  hasRoadmap?: boolean;
}

export function DashboardHeader({
  fullName,
  isPmaMember,
}: DashboardHeaderProps) {
  const firstName = fullName?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {isPmaMember ? (
            <span className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              PMA Member Dashboard
            </span>
          ) : (
            "Track your PM journey and explore resources"
          )}
        </p>
      </div>
      {!isPmaMember && (
        <Button
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", "_blank")}
        >
          <Crown className="h-4 w-4 mr-2" />
          Join PMA
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
