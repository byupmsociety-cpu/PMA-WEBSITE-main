import { Users } from "lucide-react";
import { PREP_JOURNEY } from "@/lib/prepJourney";
import { STAGE_PERSON } from "../copy";

const StagesOverview = () => (
  <section className="mt-8">
    <h2 className="text-2xl font-bold">The whole program, open to everyone</h2>
    <p className="mt-1 text-base text-muted-foreground">
      Seven stages, {PREP_JOURNEY.steps.length} bite size steps. Each step has a goal, a time estimate, a short checklist,
      and at most three picks.
    </p>
    <ol className="mt-4 grid gap-3 sm:grid-cols-2">
      {PREP_JOURNEY.stages.map((stage, i) => {
        const steps = PREP_JOURNEY.steps.filter((s) => s.stage === stage.id);
        return (
          <li key={stage.id} className="rounded-xl border border-border bg-card p-4 text-card-foreground">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="text-[17px] font-bold">{stage.title}</h3>
              <span className="ml-auto text-[13px] text-muted-foreground">{steps.length} steps</span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{stage.summary}</p>
            <div className="mt-2 grid gap-1 text-sm">
              <div>
                <span className="font-semibold">You do:</span>{" "}
                <span className="text-foreground/80">
                  {steps
                    .slice(0, 2)
                    .map((s) => s.title)
                    .join(", ")}
                  {steps.length > 2 ? ", and more" : ""}
                </span>
              </div>
              <div className="flex gap-1.5 text-accent">
                <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">With a person:</span> {STAGE_PERSON[stage.id]}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  </section>
);

export default StagesOverview;
