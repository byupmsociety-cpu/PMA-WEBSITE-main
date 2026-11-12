// Development only: /resources?demo=<preset> seeds prep progress in localStorage so each state
// can be checked without a member account. Never active in production builds.
import {
  STEP_BY_ID,
  addDays,
  applyAugFor,
  makePlan,
  phasesFor,
  schoolDaysSince,
  startOfDay,
  toDay,
  type Checks,
} from "@/lib/prepPlan";
import { PREP_KEYS, safeWrite } from "@/lib/prepStorage";

const SESSION_KEY = "pma-prep-demo-member";
type Preset = "fresh" | "waiting" | "approved" | "member" | "sprinter" | "off";

const all = (c: Checks, id: string) => (c[id] = STEP_BY_ID[id].checklist.map(() => true));

const seed = (preset: Preset, today: Date): boolean | null => {
  Object.values(PREP_KEYS).forEach((k) => safeWrite(k, null));
  if (preset === "off" || preset === "fresh") return preset === "fresh" ? false : null;
  const checks: Checks = {};
  if (preset === "waiting") {
    safeWrite(PREP_KEYS.plan, { ...makePlan("one-year", today, { year: "Sophomore" }), builtAsMember: false });
    checks["explore-recruiting"] = [true, false, false];
    safeWrite(PREP_KEYS.paid, true);
  }
  if (preset === "approved") {
    const plan = { ...makePlan("one-year", today, { year: "Sophomore", done: ["project", "resume"] }), builtAsMember: false };
    safeWrite(PREP_KEYS.plan, plan);
    ["exp-pick-path", "exp-ship-project", "story-resume"].forEach((id) => all(checks, id));
  }
  if (preset === "member") {
    const aug = applyAugFor("one-year", today);
    const plan = {
      ...makePlan("two-year", today, { year: "Sophomore" }),
      applyAug: aug ? toDay(aug) : null,
      builtAsMember: true,
    };
    safeWrite(PREP_KEYS.plan, plan);
    phasesFor(plan)
      .slice(0, 3)
      .forEach((ph) => ph.steps.forEach((id) => id !== "exp-hackathon" && all(checks, id)));
    checks["exp-document"] = [true, true, false];
    all(checks, "story-resume");
    checks["story-resume-review"] = [true, false, false];
    let askedAt = addDays(today, -1);
    while (schoolDaysSince(askedAt, today) < 3) askedAt = addDays(askedAt, -1);
    safeWrite(PREP_KEYS.asked, { "story-resume-review": { officer: "Logan West", at: askedAt.toISOString() } });
    safeWrite(PREP_KEYS.watched, ["U-lYLSlYU1o", "hZwv04OIV3A", "332v0mv7flY"]);
  }
  if (preset === "sprinter") {
    safeWrite(
      PREP_KEYS.plan,
      makePlan("sixty-day", today, {
        year: "Senior",
        done: ["practice"],
        interviewDate: toDay(addDays(today, 21)),
        round: "product-sense",
        builtAsMember: true,
      }),
    );
    checks["int-basics"] = [true, true, true];
    checks["story-tell-me"] = [true, false, false];
    checks["int-product-sense"] = [true, false, false, false];
  }
  safeWrite(PREP_KEYS.checks, checks);
  return preset !== "waiting";
};

/** Returns a member override for this tab, or null to use real auth. */
export const applyPrepDemo = (): boolean | null => {
  if (!import.meta.env.DEV) return null;
  try {
    const url = new URL(window.location.href);
    const preset = url.searchParams.get("demo") as Preset | null;
    if (preset) {
      const member = seed(preset, startOfDay(new Date()));
      if (member === null) sessionStorage.removeItem(SESSION_KEY);
      else sessionStorage.setItem(SESSION_KEY, member ? "1" : "0");
      url.searchParams.delete("demo");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored === null ? null : stored === "1";
  } catch {
    return null;
  }
};
