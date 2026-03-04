import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";

interface RoadmapProgressCardProps {
  progress: number;
  nextItem: string | null;
  hasRoadmap: boolean;
  completedCount: number;
  totalCount: number;
}

export function RoadmapProgressCard({
  progress,
  nextItem,
  hasRoadmap,
  completedCount,
  totalCount,
}: RoadmapProgressCardProps) {
  if (!hasRoadmap) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Create Your Roadmap</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Take the PM quiz to get a personalized career roadmap
            </p>
          </div>
          <Button size="sm" asChild>
            <Link to="/discover">Take the Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Your Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${progress * 1.76} 176`}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{progress}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} items completed
            </p>
            {nextItem && (
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Next: </span>
                <span className="font-medium">{nextItem}</span>
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/roadmap" className="flex items-center gap-2">
            Continue Roadmap
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
