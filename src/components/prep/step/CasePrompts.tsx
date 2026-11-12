import { Lock } from "lucide-react";
import { CASE_TYPES } from "@/lib/apmPlaybook";
import { cn } from "@/lib/utils";
import { Chip, cardClass } from "../shared";

const CASES_FOR_STEP: Record<string, string[]> = {
  "int-product-sense": ["design", "improvement"],
  "int-execution": ["metrics"],
  "int-more-rounds": ["strategy", "estimation"],
};

const CasePrompts = ({ stepId, locked }: { stepId: string; locked: boolean }) => {
  const cases = (CASES_FOR_STEP[stepId] ?? []).flatMap((id) => CASE_TYPES.filter((c) => c.id === id));
  if (cases.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-[21px] font-bold">Practice prompts from the APM Playbook</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {cases.map((c) => (
          <div key={c.id} className={cn(cardClass, "p-4")}>
            <div className="text-base font-semibold">{c.title}</div>
            {locked ? (
              <p className="mt-1 inline-flex gap-1.5 text-sm text-muted-foreground">
                <Lock className="mt-0.5 h-3.5 w-3.5" aria-hidden="true" /> Example prompt and framework for members
              </p>
            ) : (
              <>
                <p className="mt-1 text-[15px] text-foreground/80">"{c.examples[0]}"</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.framework.map((f, k) => (
                    <Chip key={f}>
                      {c.sequential ? `${k + 1}. ` : ""}
                      {f}
                    </Chip>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CasePrompts;
