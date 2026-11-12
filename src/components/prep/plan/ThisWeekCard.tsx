import { Check, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePrep } from "@/hooks/usePrepState";
import { SESSION_KINDS, type SessionKind } from "@/lib/prepJourney";
import {
  STEP_BY_ID,
  addDays,
  countedSteps,
  daysBetween,
  fmtDate,
  isStepDone,
  parseDay,
  routeFor,
  schoolDaysSince,
  stepChecks,
  unitLabel,
  weekInfo,
  type SavedPlan,
} from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { firstName } from "../copy";
import { ProgressBar, focusRing } from "../shared";

const ThisWeekCard = ({ plan }: { plan: SavedPlan }) => {
  const { checks, isMember, today, asked, tick, goStep, openAsk } = usePrep();
  const w = weekInfo(plan, checks, isMember, today);
  const ids = countedSteps(plan);
  const doneN = ids.filter((id) => isStepDone(checks, id)).length;
  const pct = ids.length ? Math.round((doneN / ids.length) * 100) : 0;
  const offset = ((daysBetween(parseDay(plan.startedAt), today) % 7) + 7) % 7;
  const weekStart = addDays(today, -offset);
  const current = w.phases[w.current];
  const welcome = isMember && plan.builtAsMember === false && !plan.welcomed;
  const pace = {
    behind: `Catching up: ${w.behindCount} ${w.behindCount === 1 ? "step" : "steps"} from earlier. Nothing locks, just pick up here.`,
    on: "On pace.",
    ahead: "Ahead of pace. Nice.",
    done: "Every step is done.",
  }[w.pace];

  const rowClass = "flex items-start gap-3 rounded-xl bg-card p-3 text-card-foreground sm:p-4";

  let human: React.ReactNode = null;
  if (w.human) {
    const step = STEP_BY_ID[w.human];
    const kind = step.touchpoint?.kind as SessionKind;
    const session = SESSION_KINDS[kind];
    const route = routeFor(w.human, kind);
    const ask = asked[w.human];
    const locked = !isMember && !session.openToNonMembers;
    if (ask) {
      const at = new Date(ask.at);
      const days = schoolDaysSince(at, today);
      const next = route.find((n) => n !== ask.officer);
      const nudge = days >= 3 && next;
      human = (
        <li className={rowClass}>
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold leading-snug">
              Asked {ask.officer} for a {session.label.toLowerCase()} on {fmtDate(at)}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {nudge
                ? `${days} school days, no reply yet. That is normal. Send it to ${next} next.`
                : "Give it 3 school days, then try the next name."}
            </div>
          </div>
          {nudge && (
            <Button size="sm" className="shrink-0" onClick={() => openAsk({ stepId: w.human, kind, to: next })}>
              Write it
            </Button>
          )}
        </li>
      );
    } else {
      human = (
        <li className={rowClass}>
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-border text-muted-foreground">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold leading-snug">{step.touchpoint?.label}</div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {locked
                ? "Opens when you are a member. "
                : `With ${route.slice(0, 2).map(firstName).join(" or ")}. Writing the email takes 2 minutes. `}
              <button type="button" onClick={() => goStep(step.id)} className={cn("text-secondary hover:underline", focusRing)}>
                From {step.title}
              </button>
            </div>
          </div>
          {!locked && (
            <Button size="sm" className="shrink-0" onClick={() => openAsk({ stepId: step.id, kind })}>
              Write it
            </Button>
          )}
        </li>
      );
    }
  }

  return (
    <section aria-labelledby="prep-this-week" className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">
            {fmtDate(weekStart)} to {fmtDate(addDays(weekStart, 6))}
            {current && !current.marker ? ` · ${current.label}` : ""}
          </div>
          <h2 id="prep-this-week" className="mt-1 text-[28px] font-extrabold leading-tight">
            {welcome ? "Week 1. Start here." : "This week"}
          </h2>
        </div>
        <div className="text-sm text-primary-foreground/80 sm:text-right">
          {unitLabel(plan, w.phases, today)} · {doneN} of {ids.length} steps done
        </div>
      </div>
      <ProgressBar value={Math.max(pct, 3)} inverted className="mt-3" />
      <p className="mt-3 text-sm text-primary-foreground/80">{pace}</p>
      <ul className="mt-3 space-y-2">
        {w.tasks.map((t) => {
          const step = STEP_BY_ID[t.stepId];
          const on = stepChecks(checks, t.stepId)[t.index];
          const id = `tw-${t.stepId}-${t.index}`;
          return (
            <li key={id} className={rowClass}>
              <Checkbox
                id={id}
                checked={on}
                onCheckedChange={(v) => tick(t.stepId, t.index, v === true)}
                className="mt-1 h-5 w-5"
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={id}
                  className={cn("block cursor-pointer text-base font-semibold leading-snug", on && "text-muted-foreground line-through")}
                >
                  {step.checklist[t.index]}
                </label>
                <button
                  type="button"
                  onClick={() => goStep(t.stepId)}
                  className={cn("mt-0.5 inline-flex min-h-8 items-center gap-1 text-left text-sm text-secondary hover:underline", focusRing)}
                >
                  {t.catchUp && <span className="font-semibold">Catch up ·</span>} From {step.title}
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
        {human}
      </ul>
      {current?.note && <p className="mt-3 text-[15px] text-primary-foreground/80">{current.note}</p>}
    </section>
  );
};

export default ThisWeekCard;
