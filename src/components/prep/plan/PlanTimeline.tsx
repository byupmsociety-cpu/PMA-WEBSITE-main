import { useState } from "react";
import { CalendarDays, Check, Zap } from "lucide-react";
import { usePrep } from "@/hooks/usePrepState";
import { ROUND_STEP } from "@/lib/prepJourney";
import {
  TRACK_BY_ID,
  addDays,
  currentPhaseIndex,
  daysBetween,
  fmtWeekday,
  isOptional,
  isStepDone,
  phasesFor,
  validInterviewDate,
  type SavedPlan,
} from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { Chip } from "../shared";
import StepRow from "./StepRow";

const Rail = ({ last, dark }: { last?: boolean; dark?: boolean }) =>
  last ? null : (
    <span className={cn("absolute bottom-0 left-4 top-8 -ml-px w-0.5", dark ? "bg-primary" : "bg-border")} aria-hidden="true" />
  );

const SprintLane = ({ plan }: { plan: SavedPlan }) => {
  const { today } = usePrep();
  const lane = TRACK_BY_ID["sixty-day"].fastLane;
  if (!lane) return null;
  const date = validInterviewDate(plan);
  const base = date && daysBetween(today, date) <= 7 ? addDays(date, -7) : today;
  return (
    <ol className="relative mt-2">
      {lane.days.map((d, i) => (
        <li key={d.day} className="relative pb-6 pl-12">
          <Rail last={i === lane.days.length - 1} />
          <span
            className={cn(
              "absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
              i === 0 ? "bg-secondary text-secondary-foreground" : "border-2 border-border bg-card text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="text-xl font-bold">{d.day}</h3>
            <span className="text-sm text-muted-foreground">
              {i === lane.days.length - 1 ? "The night before" : fmtWeekday(addDays(base, i))}
            </span>
          </div>
          <p className="mt-1 text-base">{d.do}</p>
          <div className="mt-3 space-y-2">
            {d.steps.map((id) => {
              const stepId = id === "int-product-sense" ? ROUND_STEP[plan.round] : id;
              return <StepRow key={`${d.day}-${stepId}`} plan={plan} stepId={stepId} />;
            })}
          </div>
        </li>
      ))}
    </ol>
  );
};

const PlanTimeline = ({ plan }: { plan: SavedPlan }) => {
  const { checks, today } = usePrep();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  if (plan.track === "sixty-day" && plan.sprint) return <SprintLane plan={plan} />;

  const phases = phasesFor(plan);
  const cur = currentPhaseIndex(plan, phases, today);
  const side = TRACK_BY_ID[plan.track].sideLane;

  return (
    <>
      <ol className="relative mt-2">
        {phases.map((ph, i) => {
          const last = i === phases.length - 1;
          if (ph.marker) {
            return (
              <li key={ph.label} className="relative pb-8 pl-12">
                <Rail last={last} />
                <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-extrabold leading-8">{ph.label}</h3>
                <p className="text-[15px] text-muted-foreground">
                  The night before: rewatch The Perfect Structure for a PM Interview and reread your round guide. Then sleep.
                </p>
              </li>
            );
          }
          const state = ph.event ? "event" : i < cur ? "past" : i === cur ? "now" : "later";
          const required = ph.steps.filter((id) => !isOptional(plan, id));
          const doneN = ph.steps.filter((id) => isStepDone(checks, id)).length;
          const complete = required.every((id) => isStepDone(checks, id));
          const collapsed = state === "past" && complete && !expanded[i];
          return (
            <li key={ph.label} className="relative pb-8 pl-12">
              <Rail last={last} dark={state === "past"} />
              <span className="absolute left-0 top-0">
                {state === "now" ? (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground ring-4 ring-secondary/15">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : state === "past" ? (
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full",
                      complete ? "bg-primary text-primary-foreground" : "border-2 border-secondary bg-card text-secondary",
                    )}
                  >
                    {complete ? (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <span className="text-[11px] font-bold">
                        {doneN}/{ph.steps.length}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="block h-8 w-8 rounded-full border-2 border-border bg-card" />
                )}
              </span>
              <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-xl font-bold">{ph.label}</h3>
                {state === "now" && <Chip tone="secondary">Now</Chip>}
                {state === "past" && (
                  <Chip>
                    {doneN} of {ph.steps.length} done
                  </Chip>
                )}
                <span className="text-sm text-muted-foreground">{ph.sub}</span>
                {state === "past" && complete && (
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => ({ ...e, [i]: !e[i] }))}
                    aria-expanded={!collapsed}
                    className="ml-auto min-h-8 text-sm text-secondary hover:underline"
                  >
                    {collapsed ? "Show" : "Hide"}
                  </button>
                )}
              </div>
              {ph.note && state !== "now" && <p className="mt-1 text-[15px] text-muted-foreground">{ph.note}</p>}
              {!collapsed && (
                <div className="mt-3 space-y-2">
                  {ph.steps.map((id) => (
                    <StepRow key={id} plan={plan} stepId={id} behind={state === "past"} />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {side && (
        <div className="rounded-2xl border-2 border-dashed border-border p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h3 className="text-xl font-bold">{side.label}</h3>
            <span className="text-sm text-muted-foreground">Side lane, {side.when.toLowerCase()}</span>
          </div>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Only if you are still sending applications. Do these next to your interview prep. They do not count against your
            progress.
          </p>
          <div className="mt-3 space-y-2">
            {side.steps.map((id) => (
              <StepRow key={id} plan={plan} stepId={id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PlanTimeline;
