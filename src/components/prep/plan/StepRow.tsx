import { ChevronRight, Clock, Lock, Play, Users } from "lucide-react";
import { usePrep } from "@/hooks/usePrepState";
import {
  STAGE_BY_ID,
  STEP_BY_ID,
  freeStep,
  isOptional,
  isStepDone,
  isStepLocked,
  stepTime,
  stepVideoIds,
  type SavedPlan,
} from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { StatusDot, focusRing } from "../shared";

const StepRow = ({ plan, stepId, behind }: { plan: SavedPlan; stepId: string; behind?: boolean }) => {
  const { checks, isMember, goStep } = usePrep();
  const step = STEP_BY_ID[stepId];
  const done = isStepDone(checks, stepId);
  const free = !isMember && stepId === freeStep(plan);
  const locked = isStepLocked(stepId, plan, isMember);
  const videos = stepVideoIds(stepId).length;

  return (
    <button
      type="button"
      onClick={() => goStep(stepId)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-card-foreground transition-colors hover:border-primary",
        focusRing,
      )}
    >
      <StatusDot checks={checks} stepId={stepId} />
      <span className="min-w-0 flex-1">
        <span className={cn("block text-base font-semibold leading-snug", done && "text-muted-foreground")}>{step.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted-foreground">
          <span>{STAGE_BY_ID[step.stage].title}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {stepTime(plan, stepId)}
          </span>
          {videos > 0 && (
            <span className="inline-flex items-center gap-1">
              <Play className="h-3 w-3" aria-hidden="true" />
              {videos} {videos === 1 ? "video" : "videos"}
            </span>
          )}
          {step.touchpoint && (
            <span className="inline-flex items-center gap-1 text-accent">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {step.touchpoint.where === "presidency" ? "With an officer" : "Event"}
            </span>
          )}
          {isOptional(plan, stepId) && <span className="italic">If it fits</span>}
          {behind && !done && <span className="font-semibold text-secondary">Not done yet</span>}
          {free ? (
            <span className="rounded bg-primary px-1.5 text-xs font-semibold text-primary-foreground">Free step</span>
          ) : (
            locked && (
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Members
              </span>
            )
          )}
        </span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  );
};

export default StepRow;
