import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href: string;
  highlight?: boolean;
  locked?: boolean;
}

export function QuickStatsCard({
  icon: Icon,
  label,
  value,
  href,
  highlight = false,
  locked = false,
}: QuickStatsCardProps) {
  const content = (
    <Card
      className={`transition-all hover:shadow-md cursor-pointer ${
        highlight
          ? "border-primary/50 bg-primary/5"
          : locked
          ? "opacity-60"
          : "hover:border-primary/30"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              highlight
                ? "bg-primary/10 text-primary"
                : locked
                ? "bg-muted text-muted-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (locked) {
    return content;
  }

  return <Link to={href}>{content}</Link>;
}
