import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type KpiCardProps = {
  title: string;
  value: React.ReactNode;
  helperText?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  ctaLabel?: string;
  ctaTo?: string;
};

export default function KpiCard({ title, value, helperText, icon, loading, ctaLabel, ctaTo }: KpiCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-semibold tracking-tight">
          {loading ? <span className="text-muted-foreground">—</span> : value}
        </div>
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
        {ctaLabel && ctaTo ? (
          <Button asChild size="sm" variant="outline" className="mt-1">
            <Link to={ctaTo}>{ctaLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

