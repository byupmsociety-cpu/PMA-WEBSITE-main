import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  earned_at: string | null;
}

interface BadgesCardProps {
  badges: Badge[];
}

export function BadgesCard({ badges }: BadgesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          Badges Earned
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {badges.slice(0, 6).map((badge) => (
              <div
                key={badge.id}
                className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center"
                title={badge.description || badge.name}
              >
                <div className="text-xl">{badge.icon}</div>
                <p className="text-[10px] font-medium mt-1 truncate">{badge.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Complete steps to earn badges!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
