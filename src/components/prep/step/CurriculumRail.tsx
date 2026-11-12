import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePrep } from "@/hooks/usePrepState";
import {
  STEP_BY_ID,
  TRACK_BY_ID,
  countedSteps,
  currentPhaseIndex,
  isStepDone,
  phasesFor,
  type SavedPlan,
} from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { TRACK_COPY } from "../copy";
import { ProgressBar, StatusDot, cardClass, focusRing } from "../shared";

const CurriculumRail = ({ plan, activeId }: { plan: SavedPlan; activeId: string }) => {
  const { checks, today, goStep } = usePrep();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const phases = phasesFor(plan);
  const cur = currentPhaseIndex(plan, phases, today);
  const ids = countedSteps(plan);
  const done = ids.filter((id) => isStepDone(checks, id)).length;
  const pct = ids.length ? Math.round((done / ids.length) * 100) : 0;
  const groups = phases.map((ph, pi) => ({ label: ph.label, steps: ph.steps, pi, marker: ph.marker })).filter((g) => !g.marker);
  const side = TRACK_BY_ID[plan.track].sideLane;
  if (side) groups.push({ label: side.label, steps: side.steps, pi: -1, marker: undefined });

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
        className={cn(cardClass, "flex w-full items-center justify-between gap-3 px-4 py-3 lg:hidden", focusRing)}
      >
        <span className="text-left">
          <span className="block text-[13px] text-muted-foreground">Curriculum · {TRACK_COPY[plan.track].adj} plan</span>
          <span className="text-[15px] font-semibold">
            {done} of {ids.length} steps done
          </span>
        </span>
        <span className="flex items-center gap-2">
          <ProgressBar value={pct} className="w-16" />
          {mobileOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </span>
      </button>
      <div className={cn(cardClass, "overflow-hidden lg:block", mobileOpen ? "mt-2 block" : "hidden")}>
        <div className="border-b border-border p-4">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[17px] font-bold">
              {done} of {ids.length} steps
            </span>
            <span className="text-[13px] text-muted-foreground">{pct}%</span>
          </div>
          <ProgressBar value={pct} className="mt-2" />
        </div>
        <nav aria-label="Curriculum" className="overflow-y-auto lg:max-h-[calc(100vh-220px)]">
          {groups.map((g) => {
            const open = openGroups[g.pi] ?? (g.pi === cur || g.steps.includes(activeId));
            const gDone = g.steps.filter((id) => isStepDone(checks, id)).length;
            return (
              <div key={`${g.pi}-${g.label}`} className="border-b border-border last:border-0">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenGroups((o) => ({ ...o, [g.pi]: !open }))}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-between px-4 py-2.5 text-left",
                    g.pi === cur && "bg-muted",
                    focusRing,
                  )}
                >
                  <span className="text-sm">
                    <span className="font-semibold">{g.label}</span>
                    {g.pi === cur && (
                      <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-secondary">Now</span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {gDone}/{g.steps.length}
                    {open ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  </span>
                </button>
                {open && (
                  <ul className="pb-2">
                    {g.steps.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => goStep(id)}
                          aria-current={id === activeId ? "page" : undefined}
                          className={cn(
                            "flex w-full items-start gap-2.5 px-4 py-2 text-left text-sm leading-snug hover:bg-muted",
                            id === activeId && "border-l-[3px] border-primary bg-muted pl-[13px] font-semibold",
                            focusRing,
                          )}
                        >
                          <StatusDot checks={checks} stepId={id} small />
                          <span className={cn(isStepDone(checks, id) && "text-muted-foreground")}>{STEP_BY_ID[id].title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default CurriculumRail;
