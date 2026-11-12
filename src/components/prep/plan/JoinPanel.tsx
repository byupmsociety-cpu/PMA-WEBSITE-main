import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrep } from "@/hooks/usePrepState";
import { APPROVAL_COPY } from "@/lib/prepJourney";
import { STEP_BY_ID, freeStep } from "@/lib/prepPlan";
import { RESOURCE_CATEGORIES } from "@/lib/resources";
import { VIDEO_LIBRARY } from "@/lib/videoLibrary";
import { cn } from "@/lib/utils";
import { Eyebrow, focusRing, linkClass } from "../shared";

const VISIBLE_VIDEOS = VIDEO_LIBRARY.reduce((n, t) => n + t.videos.filter((v) => !v.fromCourse).length, 0);
const RESOURCE_COUNT = RESOURCE_CATEGORIES.reduce((n, c) => n + c.resources.length, 0);

const FREE = [
  "Your whole plan: every stage, step, goal and checklist",
  "The first step of each plan, with its videos",
  "Checkmarks saved on this device",
  "A coffee chat with an officer",
  "Search, so you can see what is inside",
];
const MEMBERS = [
  `The picked videos for every round, plus all ${VISIBLE_VIDEOS} in Practice Interviews`,
  "Nathan McCauley's APM Playbook. Nathan landed a Google APM offer.",
  `${RESOURCE_COUNT} hand picked resources: APM List, Aced, the Coffee Chat Guide and more`,
  "Partner perks: 90 free minutes on PMF Labs and a $50 Leland+ coaching credit",
  "Resume reviews and mock interviews with officers",
];

const JoinPanel = () => {
  const { paid, setPaid, plan, goStep, isLoggedIn, openAuth: onLogin } = usePrep();
  const steps: [string, string, "done" | "now" | "next"][] = [
    ["Pay dues on BYU Clubs", "About 2 minutes.", paid ? "done" : "now"],
    ["Log in here with the same email", "So we can match your payment.", paid ? "done" : "next"],
    [APPROVAL_COPY.approve, "You can use your plan the whole time.", paid ? "now" : "next"],
  ];
  const startIds = [freeStep(plan) ?? "explore-what-pm-does", "explore-officer-chat"].filter((x, i, a) => a.indexOf(x) === i);
  const email = (
    <a className={cn(linkClass, "underline")} href={`mailto:${APPROVAL_COPY.clubEmail}`}>
      {APPROVAL_COPY.clubEmail}
    </a>
  );

  return (
    <section id="join" className="scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      <div className="p-5">
        <h2 className="text-xl font-bold">What membership unlocks</h2>
        <Eyebrow className="mt-3">Free for everyone</Eyebrow>
        <ul className="mt-1.5 space-y-1.5 text-[15px]">
          {FREE.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {x}
            </li>
          ))}
        </ul>
        <Eyebrow className="mt-4">Members also get</Eyebrow>
        <ul className="mt-1.5 space-y-1.5 text-[15px]">
          {MEMBERS.map((x) => (
            <li key={x} className="flex gap-2">
              <Lock className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border bg-muted p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold">How joining works</h3>
          <div className="flex rounded-lg border border-border bg-card p-0.5 text-[13px]" role="group" aria-label="Have you paid dues?">
            {[
              ["Not yet", false],
              ["I paid dues", true],
            ].map(([label, value]) => (
              <button
                key={String(label)}
                type="button"
                aria-pressed={paid === value}
                onClick={() => setPaid(value as boolean)}
                className={cn(
                  "min-h-8 rounded-md px-2.5 py-1",
                  paid === value ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                  focusRing,
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <ol className="mt-3 space-y-3 text-[15px]">
          {steps.map(([title, detail, state], i) => (
            <li key={title} className="flex gap-3">
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold",
                  state === "done"
                    ? "bg-primary text-primary-foreground"
                    : state === "now"
                      ? "border-2 border-primary bg-card text-primary"
                      : "border border-border bg-card text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="h-4 w-4" aria-label="Done" /> : i + 1}
              </span>
              <span>
                <span className="font-semibold">{title}</span>
                <br />
                <span className="text-sm text-muted-foreground">{detail}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-lg border border-border bg-card p-3.5 text-sm leading-snug">
          {paid ? (
            <>
              <div className="text-[15px] font-semibold">You are in the queue.</div>A student officer matches your payment to your
              account by hand. If it has been more than a week, email {email} with your name and the email you used.
            </>
          ) : (
            <>
              <div className="text-[15px] font-semibold">An honest note on timing</div>
              Approval is done by a student officer, not a machine. You can use your plan the whole time, and your checkmarks
              stay. If it has been more than a week since you paid, email {email}.
            </>
          )}
        </div>

        <Eyebrow className="mt-4">Start these while you wait</Eyebrow>
        <ul className="mt-1.5 space-y-1 text-[15px]">
          {startIds.map((id) => (
            <li key={id}>
              <button type="button" onClick={() => goStep(id)} className={cn(linkClass, "text-left", focusRing)}>
                {STEP_BY_ID[id].title}
              </button>
            </li>
          ))}
        </ul>

        {!paid && (
          <div className="mt-4 grid gap-2">
            <Button asChild>
              <a href={APPROVAL_COPY.joinUrl} target="_blank" rel="noopener noreferrer">
                Join PMA (pay dues)
              </a>
            </Button>
            {!isLoggedIn && (
              <Button variant="outline" onClick={onLogin}>
                I already paid. Log in
              </Button>
            )}
          </div>
        )}
        {paid && !isLoggedIn && (
          <Button variant="outline" className="mt-4 w-full" onClick={onLogin}>
            Log in with the email you paid with
          </Button>
        )}
      </div>
    </section>
  );
};

export default JoinPanel;
