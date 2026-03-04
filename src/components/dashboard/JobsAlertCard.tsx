import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowRight, Bell, Star, Building2 } from "lucide-react";

interface FeaturedJob {
  id: string;
  title: string;
  company: string;
  job_type: string | null;
}

interface JobsAlertCardProps {
  newJobsCount: number;
  savedJobsCount: number;
  featuredJob: FeaturedJob | null;
  hasPreferences: boolean;
}

export function JobsAlertCard({
  newJobsCount,
  savedJobsCount,
  featuredJob,
  hasPreferences,
}: JobsAlertCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Opportunities
          </span>
          {newJobsCount > 0 && (
            <Badge className="bg-primary">{newJobsCount} new</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {featuredJob && (
          <Link
            to="/jobs"
            className="block p-3 rounded-lg border bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20 hover:border-amber-500/40 transition-colors"
          >
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{featuredJob.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {featuredJob.company}
                </p>
              </div>
            </div>
          </Link>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{savedJobsCount}</span> saved
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/jobs" className="flex items-center gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {!hasPreferences && (
          <div className="pt-2 border-t">
            <Link
              to="/preferences"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Bell className="h-3 w-3" />
              Set job preferences to get alerts
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
