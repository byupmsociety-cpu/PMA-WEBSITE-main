import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Settings, UserCircle } from "lucide-react";

interface ProfileSummaryCardProps {
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  schoolYear: string | null;
  recruitingStage: string | null;
  isPmaMember: boolean;
  journeyProgress: number;
}

const RECRUITING_STAGES: Record<string, { label: string; color: string }> = {
  exploring: { label: "Exploring PM", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  applying: { label: "Actively Applying", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  interviewing: { label: "Interviewing", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  offer: { label: "Received Offer", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  not_looking: { label: "Not Looking", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
};

export function ProfileSummaryCard({
  fullName,
  email,
  avatarUrl,
  schoolYear,
  recruitingStage,
  isPmaMember,
  journeyProgress,
}: ProfileSummaryCardProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stageConfig = recruitingStage ? RECRUITING_STAGES[recruitingStage] : null;

  return (
    <Card className={isPmaMember ? "border-amber-500/30" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {isPmaMember && <Crown className="h-4 w-4 text-amber-500" />}
            Profile
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to="/profile">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(fullName) || <UserCircle className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{fullName || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
            {schoolYear && (
              <p className="text-xs text-muted-foreground">{schoolYear}</p>
            )}
          </div>
        </div>

        {isPmaMember && stageConfig && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Recruiting Status</p>
            <Badge variant="outline" className={stageConfig.color}>
              {stageConfig.label}
            </Badge>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Journey Progress</span>
            <span className="font-semibold">{journeyProgress}%</span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${journeyProgress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
