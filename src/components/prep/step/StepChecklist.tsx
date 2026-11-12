import { Checkbox } from "@/components/ui/checkbox";
import { usePrep } from "@/hooks/usePrepState";
import { STEP_BY_ID, stepChecks } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { ProgressBar, cardClass } from "../shared";

const StepChecklist = ({ stepId }: { stepId: string }) => {
  const { checks, tick } = usePrep();
  const step = STEP_BY_ID[stepId];
  const row = stepChecks(checks, stepId);
  const n = row.filter(Boolean).length;

  return (
    <section className={cn(cardClass, "mt-6")} aria-labelledby="prep-checklist">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 id="prep-checklist" className="text-[19px] font-bold">
          Your checklist
        </h2>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {n} of {row.length}
          </span>
          <ProgressBar value={(n / row.length) * 100} className="w-20" />
        </div>
      </div>
      <ul className="p-2">
        {step.checklist.map((item, i) => {
          const id = `check-${stepId}-${i}`;
          return (
            <li key={id}>
              <label htmlFor={id} className="flex min-h-11 cursor-pointer gap-3 rounded-lg px-3 py-2.5 hover:bg-muted">
                <Checkbox
                  id={id}
                  checked={row[i]}
                  onCheckedChange={(v) => tick(stepId, i, v === true)}
                  className="mt-0.5 h-5 w-5"
                />
                <span className={cn("text-[17px] leading-snug", row[i] && "text-muted-foreground line-through")}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default StepChecklist;
