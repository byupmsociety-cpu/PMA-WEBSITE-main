import { usePrep } from "@/hooks/usePrepState";
import { PREP_JOURNEY } from "@/lib/prepJourney";
import { STEP_BY_ID, isOptional, isStepDone, planOrder, type SavedPlan } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { ProgressBar, focusRing } from "../shared";

const StageStrip = ({ plan }: { plan: SavedPlan }) => {
  const { checks, goStep } = usePrep();
  const ids = planOrder(plan);
  const stages = PREP_JOURNEY.stages.filter((s) => ids.some((id) => STEP_BY_ID[id].stage === s.id));

  return (
    <div className="no-scrollbar -mx-4 mt-5 overflow-x-auto px-4">
      <div className="flex w-max gap-2" role="list" aria-label="Progress by stage">
        {stages.map((stage) => {
          const inStage = ids.filter((id) => STEP_BY_ID[id].stage === stage.id);
          const counted = inStage.filter((id) => !isOptional(plan, id));
          const done = counted.filter((id) => isStepDone(checks, id)).length;
          const next = inStage.find((id) => !isStepDone(checks, id)) ?? inStage[0];
          return (
            <button
              key={stage.id}
              type="button"
              role="listitem"
              onClick={() => goStep(next)}
              className={cn(
                "w-[150px] rounded-lg border border-border bg-card px-3 py-2 text-left text-card-foreground hover:border-primary",
                focusRing,
              )}
            >
              <span className="block truncate text-[13px] font-semibold">{stage.title}</span>
              <span className="mt-1 flex items-center gap-2">
                <ProgressBar value={counted.length ? (done / counted.length) * 100 : 0} className="flex-1" />
                <span className="text-xs text-muted-foreground">
                  {done}/{counted.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StageStrip;
