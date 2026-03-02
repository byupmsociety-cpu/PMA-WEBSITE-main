import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: React.ReactNode;
  helperText?: string;
  icon?: React.ReactNode;
  loading?: boolean;
};

export default function KpiCard({ title, value, helperText, icon, loading }: KpiCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight">
          {loading ? <span className="text-muted-foreground">—</span> : value}
        </div>
        {helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

