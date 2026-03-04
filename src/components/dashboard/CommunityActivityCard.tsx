import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

interface PeerActivity {
  user_name: string;
  step_title: string;
  persona: string;
  completed_at: string;
}

interface CommunityActivityCardProps {
  peerActivity: PeerActivity[];
  memberCount: number;
}

const PERSONA_LABELS: Record<string, string> = {
  curious: "Exploring PM",
  starting: "Starting PM Path",
  recruiting: "Recruiting for PM",
};

export function CommunityActivityCard({
  peerActivity,
  memberCount,
}: CommunityActivityCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </span>
          <Badge variant="secondary">{memberCount} members</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {peerActivity.length > 0 ? (
          <>
            <div className="space-y-2">
              {peerActivity.slice(0, 4).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(activity.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs">
                      <span className="font-medium">{activity.user_name}</span>
                      <span className="text-muted-foreground"> completed </span>
                      <span className="font-medium">{activity.step_title}</span>
                    </p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-1">
                      {PERSONA_LABELS[activity.persona] || activity.persona}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/members" className="flex items-center gap-1">
                View Directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">
              Be the first to complete a step!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
