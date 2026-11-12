import { Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PRESIDENCY } from "@/lib/officers";
import { STEP_BY_ID, doneCount, type Checks } from "@/lib/prepPlan";

export const Eyebrow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>{children}</div>
);

type ChipTone = "primary" | "muted" | "secondary" | "outline";
const CHIP_TONES: Record<ChipTone, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  muted: "bg-muted text-foreground",
  outline: "border border-border text-muted-foreground",
};

export const Chip = ({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: ChipTone;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
      CHIP_TONES[tone],
      className,
    )}
  >
    {children}
  </span>
);

export const ProgressBar = ({ value, inverted, className }: { value: number; inverted?: boolean; className?: string }) => (
  <span
    className={cn("block h-1.5 overflow-hidden rounded-full", inverted ? "bg-primary-foreground/20" : "bg-border", className)}
    role="presentation"
  >
    <span
      className={cn("block h-full rounded-full", inverted ? "bg-primary-foreground" : "bg-primary")}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </span>
);

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export const OfficerAvatar = ({ name, className }: { name: string; className?: string }) => {
  const officer = PRESIDENCY.find((o) => o.name === name);
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      {officer?.imageUrl && <AvatarImage src={officer.imageUrl} alt="" className="object-cover" />}
      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials(name)}</AvatarFallback>
    </Avatar>
  );
};

export const StatusDot = ({ checks, stepId, small }: { checks: Checks; stepId: string; small?: boolean }) => {
  const total = STEP_BY_ID[stepId].checklist.length;
  const n = doneCount(checks, stepId);
  const size = small ? "h-5 w-5" : "h-7 w-7";
  if (n === total)
    return (
      <span className={cn(size, "grid shrink-0 place-items-center rounded-full bg-primary text-primary-foreground")}>
        <Check className={small ? "h-3 w-3" : "h-4 w-4"} aria-hidden="true" />
        <span className="sr-only">Done</span>
      </span>
    );
  if (n > 0)
    return (
      <span
        className={cn(
          size,
          "grid shrink-0 place-items-center rounded-full border-2 border-secondary font-bold text-secondary",
          small ? "text-[8px]" : "text-[11px]",
        )}
      >
        {n}/{total}
      </span>
    );
  return <span className={cn(size, "shrink-0 rounded-full border-2 border-border bg-card")} aria-label="Not started" />;
};

export const linkClass = "font-semibold text-secondary underline-offset-4 hover:underline";
export const cardClass = "rounded-xl border border-border bg-card text-card-foreground";
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
