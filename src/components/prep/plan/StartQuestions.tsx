import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePrep } from "@/hooks/usePrepState";
import { DONE_OPTIONS, YEAR_TO_TRACK } from "@/lib/prepJourney";
import { ROUND_OPTIONS, TRACK_ORDER, addDays, applyAugFor, toDay, type PlanRound } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { TRACK_COPY } from "../copy";
import { Eyebrow, focusRing } from "../shared";

const YEAR_HINT: Record<string, string> = {
  Freshman: "Most freshmen aim for the internship after junior year. That gives you two years.",
  Sophomore: "Most sophomores apply next fall for the internship after junior year.",
  Junior: "Juniors usually go for next summer's internship, which recruits now.",
  Senior: "Seniors usually go for new grad APM roles, which recruit now.",
  "Grad student": "Grad students usually go for new grad APM roles, which recruit now.",
};

const StartQuestions = () => {
  const { plan, today, answerQuiz } = usePrep();
  const track = plan?.track ?? null;
  const done = plan?.done ?? [];

  return (
    <div id="start" className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
      <Eyebrow>Start here · 2 questions</Eyebrow>
      <h2 className="mt-1 text-[22px] font-extrabold leading-tight sm:text-[26px]">Where are you right now?</h2>

      <div className="mt-3 grid gap-2" role="radiogroup" aria-label="Where are you right now?">
        {TRACK_ORDER.map((id) => {
          const on = track === id;
          const aug = applyAugFor(id, today);
          const when = aug
            ? `You apply Aug to Oct ${aug.getFullYear()} for summer ${aug.getFullYear() + 1}.`
            : "Applications and interviews are happening now.";
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => answerQuiz({ track: id })}
              className={cn(
                "flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors",
                on ? "border-primary bg-muted" : "border-border bg-card hover:border-accent",
                focusRing,
              )}
            >
              <span
                className={cn(
                  "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                  on ? "bg-primary text-primary-foreground" : "border-2 border-border",
                )}
              >
                {on && <Check className="h-3 w-3" aria-hidden="true" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[17px] font-semibold leading-snug">
                  {TRACK_COPY[id].who} <span className="font-normal text-muted-foreground">· {TRACK_COPY[id].name}</span>
                </span>
                <span className="block text-sm leading-snug text-muted-foreground">
                  {when} {TRACK_COPY[id].sub}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-sm">
        <span className="mr-1 text-muted-foreground">Not sure? Pick your year:</span>
        {Object.keys(YEAR_TO_TRACK).map((y) => (
          <button
            key={y}
            type="button"
            aria-pressed={plan?.year === y}
            onClick={() => answerQuiz({ year: y, track: YEAR_TO_TRACK[y] })}
            className={cn(
              "min-h-8 rounded-full border px-2.5 py-0.5",
              plan?.year === y ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
              focusRing,
            )}
          >
            {y}
          </button>
        ))}
      </div>
      {plan?.year && YEAR_HINT[plan.year] && (
        <p className="mt-2 text-sm">
          {YEAR_HINT[plan.year]} We picked <b>{TRACK_COPY[YEAR_TO_TRACK[plan.year]].name}</b>. Change it if that is not you.
        </p>
      )}

      {track === "sixty-day" && (
        <div className="mt-4 grid gap-3 rounded-xl bg-muted p-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="prep-interview-date" className="text-sm font-semibold">
              First interview date (optional)
            </Label>
            <Input
              id="prep-interview-date"
              type="date"
              min={toDay(addDays(today, 1))}
              value={plan?.interviewDate ?? ""}
              onChange={(e) => answerQuiz({ interviewDate: e.target.value || null })}
              className="mt-1 bg-card text-base"
            />
            <span className="mt-1 block text-[13px] text-muted-foreground">We plan backward from it.</span>
          </div>
          <div>
            <Label htmlFor="prep-round" className="text-sm font-semibold">
              Which round is it?
            </Label>
            <select
              id="prep-round"
              value={plan?.round ?? "product-sense"}
              onChange={(e) => answerQuiz({ round: e.target.value as PlanRound })}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ROUND_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-[13px] text-muted-foreground">Not sure? Most first rounds are product sense.</span>
          </div>
        </div>
      )}

      {track ? (
        <>
          <h3 className="mt-5 text-lg font-bold">Already done any of these?</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {DONE_OPTIONS.map((o) => {
              const on = done.includes(o.key);
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => answerQuiz({ done: on ? done.filter((k) => k !== o.key) : [...done, o.key] })}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-1 rounded-full border px-3 py-1.5 text-left text-sm",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary",
                    focusRing,
                  )}
                >
                  {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  {o.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">
            We check off those exact steps. Your plan updates as you answer and saves on this device.
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Free, no account needed. Your plan shows up right below as you answer.
        </p>
      )}
    </div>
  );
};

export default StartQuestions;
