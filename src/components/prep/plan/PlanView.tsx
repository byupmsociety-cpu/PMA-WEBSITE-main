import { useState } from "react";
import { Check, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrep } from "@/hooks/usePrepState";
import {
  ROUND_OPTIONS,
  TRACK_BY_ID,
  TRACK_ORDER,
  countedSteps,
  daysBetween,
  fmtWeekday,
  isStepDone,
  parseDay,
  validInterviewDate,
  type SavedPlan,
} from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { TRACK_COPY } from "../copy";
import { Eyebrow, cardClass, focusRing, linkClass } from "../shared";
import JoinPanel from "./JoinPanel";
import { HowItWorks, LibraryMini, PersonCard } from "./PlanAside";
import PlanTimeline from "./PlanTimeline";
import StageStrip from "./StageStrip";
import StagesOverview from "./StagesOverview";
import StartQuestions from "./StartQuestions";
import ThisWeekCard from "./ThisWeekCard";

const scrollToId = (id: string) =>
  window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);

const ExampleCard = () => (
  <div className="mt-10 hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg lg:block" aria-hidden="true">
    <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">Example · 1 year plan, month 1</div>
    <div className="mt-1 font-heading text-2xl font-extrabold">This week</div>
    <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-primary-foreground/20">
      <span className="block h-full w-[8%] rounded-full bg-primary-foreground" />
    </span>
    <ul className="mt-4 space-y-2 text-[15px] text-card-foreground">
      <li className="flex gap-3 rounded-xl bg-card p-3">
        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </span>
        <span className="font-semibold text-muted-foreground line-through">Read the five steps in the APM Playbook.</span>
      </li>
      <li className="flex gap-3 rounded-xl bg-card p-3">
        <span className="mt-0.5 h-5 w-5 shrink-0 rounded border-2 border-border" />
        <span className="font-semibold">
          Watch Get Into Top APM Programs. <span className="font-normal text-muted-foreground">7 min</span>
        </span>
      </li>
      <li className="flex items-center gap-3 rounded-xl bg-card p-3">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          NM
        </span>
        <span className="font-semibold">Coffee chat with an officer</span>
      </li>
    </ul>
  </div>
);

const NoPlan = () => {
  const { isMember } = usePrep();
  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pb-8 pt-5 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <Eyebrow>PM internship prep, from BYU PMA</Eyebrow>
            <h1 className="mt-1.5 text-[30px] font-extrabold leading-[1.08] sm:text-[42px]">
              Land a PM internship, one week at a time.
            </h1>
            <p className="mt-2 max-w-xl text-base text-muted-foreground sm:text-lg">
              Answer two questions. Get a dated plan, a short list for each week, the right videos, and a real person when you
              need one.
            </p>
            <div className="mt-4">
              <StartQuestions />
            </div>
          </div>
          <ExampleCard />
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <StagesOverview />
        </div>
        <aside className="space-y-5 self-start">
          {isMember ? (
            <>
              <LibraryMini />
              <PersonCard />
            </>
          ) : (
            <JoinPanel />
          )}
        </aside>
      </div>
    </>
  );
};

const Summary = ({ plan, onEdit }: { plan: SavedPlan; onEdit: () => void }) => {
  const date = validInterviewDate(plan);
  const aug = plan.applyAug ? parseDay(plan.applyAug) : null;
  const target =
    plan.track === "sixty-day"
      ? date
        ? `first round ${fmtWeekday(date)}`
        : "interviews now"
      : aug
        ? `summer ${aug.getFullYear() + 1} internships, applications open Aug ${aug.getFullYear()}`
        : "";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      <span>
        {plan.year ? `${plan.year} · ` : ""}
        {TRACK_COPY[plan.track].adj} plan · {target}
      </span>
      <button type="button" onClick={onEdit} className={cn(linkClass, "min-h-8", focusRing)}>
        Change answers
      </button>
    </div>
  );
};

const PlanView = () => {
  const { plan, isMember, paid, today, checks, answerQuiz, toggleSprint, dismissWelcome } = usePrep();
  const [editing, setEditing] = useState(() => !plan);

  if (!plan) return <NoPlan />;

  const track = TRACK_BY_ID[plan.track];
  const date = validInterviewDate(plan);
  const aug = plan.applyAug ? parseDay(plan.applyAug) : null;
  const welcome = isMember && plan.builtAsMember === false && !plan.welcomed;
  const sprint = plan.track === "sixty-day" && plan.sprint;
  const edit = () => {
    setEditing(true);
    scrollToId("start");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {editing ? (
        <div className="mb-6">
          <StartQuestions />
        </div>
      ) : (
        <div className="mb-3">
          <Summary plan={plan} onEdit={edit} />
        </div>
      )}

      {!isMember && (
        <div className={cn(cardClass, "mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1 text-[15px]">
            <span className="font-semibold">
              {paid ? "You are in the queue. " : ""}Your plan is saved on this device.
            </span>{" "}
            Every checklist works now and the first step's videos are open. Videos and links in later steps unlock when an
            officer approves your membership.
          </div>
          <Button variant={paid ? "outline" : "default"} className="shrink-0" onClick={() => scrollToId("join")}>
            {paid ? "What happens next" : "How joining works"}
          </Button>
        </div>
      )}
      {welcome && (
        <div className={cn(cardClass, "mb-5 flex flex-col gap-3 border-2 border-primary p-4 sm:flex-row sm:items-center")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1 text-[15px]">
            <span className="font-semibold">You are in. Everything is unlocked.</span> We kept the plan you built before
            approval: the {TRACK_COPY[plan.track].adj} plan{aug ? `, summer ${aug.getFullYear() + 1}` : ""}, and{" "}
            {countedSteps(plan).filter((id) => isStepDone(checks, id)).length} steps you had already done.
          </div>
          <Button variant="outline" className="shrink-0" onClick={dismissWelcome}>
            Got it
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{isMember ? (welcome ? "Welcome to PMA" : "Your plan") : "Your plan, saved on this device"}</Eyebrow>
              <h1 className="mt-1 text-[28px] font-extrabold leading-tight sm:text-[36px]">
                {date ? `First round: ${fmtWeekday(date)}` : TRACK_COPY[plan.track].title}
              </h1>
              <p className="mt-1 max-w-xl text-base text-muted-foreground">
                {date
                  ? `${daysBetween(today, date)} days. ${
                      ROUND_OPTIONS.find((r) => r.value === plan.round)?.label ?? "Product sense"
                    } round first, a live mock before the day, and company prep in the final week.`
                  : track.promise}
              </p>
            </div>
            <div className="flex rounded-lg border border-border bg-card p-1 text-sm" role="group" aria-label="Plan length">
              {TRACK_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={plan.track === id}
                  onClick={() => answerQuiz({ track: id })}
                  className={cn(
                    "min-h-9 rounded-md px-3 py-1.5",
                    plan.track === id ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    focusRing,
                  )}
                >
                  {TRACK_COPY[id].name}
                </button>
              ))}
            </div>
          </div>

          <ThisWeekCard plan={plan} />

          {plan.track === "sixty-day" && (
            <div className={cn(cardClass, "mt-4 flex items-center gap-3 p-4")}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-secondary">
                <Zap className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="flex-1 text-[15px]">
                <span className="font-semibold">{sprint ? "You are on the 7 day sprint." : "First round in 7 days or less?"}</span>{" "}
                <span className="text-muted-foreground">
                  {sprint ? "One thing a day, ending with the night before." : "Switch to a day by day sprint. Your checkmarks carry over."}
                </span>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" onClick={toggleSprint}>
                {sprint ? "Back" : "Switch"}
              </Button>
            </div>
          )}

          <StageStrip plan={plan} />

          <div className="mt-8 flex items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold">{sprint ? "Your 7 day sprint" : "The whole plan"}</h2>
            <span className="text-sm text-muted-foreground">Tap a step to open it</span>
          </div>
          <div className="mt-4">
            <PlanTimeline plan={plan} />
          </div>
        </div>

        <aside className="space-y-5 self-start">
          {!isMember && <JoinPanel />}
          <LibraryMini />
          <PersonCard />
          <HowItWorks onEdit={edit} />
        </aside>
      </div>
    </div>
  );
};

export default PlanView;
