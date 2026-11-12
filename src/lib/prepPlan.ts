import {
  APPLY_MONTH_INDEX,
  DONE_OPTIONS,
  PREP_JOURNEY,
  ROUND_STEP,
  SESSION_KINDS,
  STEP_ROUTING,
  type JourneyStage,
  type JourneyStep,
  type JourneyTrack,
  type RoundPick,
  type RoundTopic,
  type SessionKind,
  type TrackId,
} from "@/lib/prepJourney";
import { VIDEO_LIBRARY, type LibraryVideo } from "@/lib/videoLibrary";

export type PlanRound = Exclude<RoundTopic, "basics">;
export type Checks = Record<string, boolean[]>;

export interface SavedPlan {
  track: TrackId;
  applyAug: string | null;
  startedAt: string;
  interviewDate: string | null;
  round: PlanRound;
  year?: string;
  done: string[];
  sprint: boolean;
  /** False when the plan was built before the student was a member. Drives the welcome banner. */
  builtAsMember?: boolean;
  welcomed?: boolean;
}

export interface Phase {
  label: string;
  sub: string;
  steps: string[];
  note?: string;
  s?: number;
  e?: number;
  event?: boolean;
  marker?: boolean;
}

export interface WeekTask {
  stepId: string;
  index: number;
  phaseIndex: number;
  catchUp: boolean;
}

export interface WeekInfo {
  phases: Phase[];
  current: number;
  tasks: WeekTask[];
  human?: string;
  pace: "behind" | "on" | "ahead" | "done";
  behindCount: number;
  earliest?: string;
}

export const STEP_BY_ID: Record<string, JourneyStep> = Object.fromEntries(PREP_JOURNEY.steps.map((s) => [s.id, s]));
export const STAGE_BY_ID: Record<string, JourneyStage & { index: number }> = Object.fromEntries(
  PREP_JOURNEY.stages.map((s, index) => [s.id, { ...s, index }]),
);
export const TRACK_BY_ID: Record<TrackId, JourneyTrack> = Object.fromEntries(
  PREP_JOURNEY.tracks.map((t) => [t.id, t]),
) as Record<TrackId, JourneyTrack>;
export const PICKS_BY_TOPIC: Partial<Record<RoundTopic, RoundPick>> = Object.fromEntries(
  PREP_JOURNEY.roundPicks.map((p) => [p.topic, p]),
);
/** Visible videos only. Course lessons (fromCourse) are never surfaced. */
export const VIDEO_BY_ID = new Map<string, LibraryVideo & { topic: string }>(
  VIDEO_LIBRARY.flatMap((t) =>
    t.videos.filter((v) => !v.fromCourse).map((v) => [v.youtubeId, { ...v, topic: t.slug }] as const),
  ),
);
export const VISIBLE_TOPICS = VIDEO_LIBRARY.map((t) => ({ ...t, videos: t.videos.filter((v) => !v.fromCourse) })).filter(
  (t) => t.videos.length > 0,
);

export const TRACK_ORDER: TrackId[] = ["two-year", "one-year", "sixty-day"];

export const ROUND_OPTIONS: { value: PlanRound; label: string }[] = [
  { value: "product-sense", label: "Product sense" },
  { value: "behavioral", label: "Behavioral" },
  { value: "execution", label: "Analytical and execution" },
  { value: "strategy", label: "Product strategy" },
  { value: "estimation", label: "Estimation" },
  { value: "technical", label: "Technical" },
];

/* ---------- Dates (local calendar days) ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 864e5;

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const parseDay = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
export const toDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
export const monthsBetween = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
export const daysBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
export const fmtDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
export const fmtMonth = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
export const fmtWeekday = (d: Date) => `${WEEKDAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`;

const rangeMonths = (a: Date, b: Date) => {
  if (a.getTime() === b.getTime()) return fmtMonth(a);
  return a.getFullYear() === b.getFullYear()
    ? `${MONTHS[a.getMonth()]} to ${fmtMonth(b)}`
    : `${fmtMonth(a)} to ${fmtMonth(b)}`;
};

/** Weekdays after the ask date, up to and including today. */
export const schoolDaysSince = (at: Date, today: Date) => {
  let n = 0;
  for (let x = addDays(at, 1); x <= startOfDay(today); x = addDays(x, 1)) {
    if (x.getDay() > 0 && x.getDay() < 6) n++;
  }
  return n;
};

/* ---------- Plan building ---------- */

/** August 1 of the application year: this year if at least 4 months away, else next. The 2 year plan adds a year. */
export const applyAugFor = (track: TrackId, today: Date): Date | null => {
  if (track === "sixty-day") return null;
  let aug = new Date(today.getFullYear(), 7, 1);
  if (monthsBetween(today, aug) < 4) aug = new Date(today.getFullYear() + 1, 7, 1);
  return track === "two-year" ? new Date(aug.getFullYear() + 1, 7, 1) : aug;
};

/** Interview date counts only when it is 1 to 63 days after the plan start. */
export const validInterviewDate = (plan: Pick<SavedPlan, "track" | "interviewDate" | "startedAt">) => {
  if (plan.track !== "sixty-day" || !plan.interviewDate) return null;
  const date = parseDay(plan.interviewDate);
  const days = daysBetween(parseDay(plan.startedAt), date);
  return days >= 1 && days <= 63 ? date : null;
};

export const makePlan = (
  track: TrackId,
  today: Date,
  extra: Partial<Omit<SavedPlan, "track" | "applyAug" | "startedAt">> = {},
): SavedPlan => {
  const aug = applyAugFor(track, today);
  const plan: SavedPlan = {
    track,
    applyAug: aug ? toDay(aug) : null,
    startedAt: toDay(today),
    interviewDate: null,
    round: "product-sense",
    done: [],
    sprint: false,
    ...extra,
  };
  if (track !== "sixty-day") plan.interviewDate = null;
  const date = validInterviewDate(plan);
  plan.sprint = track === "sixty-day" && (extra.sprint ?? false);
  if (date && daysBetween(today, date) <= 7) plan.sprint = true;
  return plan;
};

export const month1 = (plan: SavedPlan) => {
  if (!plan.applyAug || plan.track === "sixty-day") return null;
  return addMonths(parseDay(plan.applyAug), -(APPLY_MONTH_INDEX[plan.track] - 1));
};

export const isOptional = (plan: SavedPlan, id: string) => (TRACK_BY_ID[plan.track].optional ?? []).includes(id);
export const stepTime = (plan: SavedPlan | null, id: string) =>
  (plan && TRACK_BY_ID[plan.track].timeOverrides?.[id]) || STEP_BY_ID[id].time;

export const countdownPhases = (plan: SavedPlan, date: Date): Phase[] => {
  const start = parseDay(plan.startedAt);
  const days = daysBetween(start, date);
  const W = Math.max(1, Math.ceil(days / 7));
  const order = [
    "int-basics",
    "story-tell-me",
    "int-mocks",
    ROUND_STEP[plan.round],
    "story-bank",
    "int-behavioral",
    "int-execution",
    "int-more-rounds",
  ].filter((x, i, a) => a.indexOf(x) === i);
  const per = W > 1 ? Math.min(3, Math.ceil(order.length / (W - 1))) : 0;
  const out: Phase[] = [];
  for (let w = 1; w < W; w++) {
    out.push({
      label: `Week ${w}`,
      sub: `${fmtDate(addDays(start, (w - 1) * 7))} to ${fmtDate(addDays(start, w * 7 - 1))}`,
      steps: order.splice(0, per),
      s: w,
      e: w,
    });
  }
  out.push({
    label: W === 1 ? "This week" : `Week ${W}`,
    sub: `${fmtDate(addDays(start, (W - 1) * 7))} to ${fmtDate(addDays(date, -1))}`,
    steps: ["offer-company-prep", "story-why-company"],
    s: W,
    e: W,
    note: "Get one live mock in before the day.",
  });
  out.push({ marker: true, label: `${fmtWeekday(date)}: your first round`, sub: "", steps: [] });
  out.push({
    label: "After your first round",
    sub: "Pick these up as more rounds land",
    steps: [...order, "offer-final-rounds", "offer-decide", "offer-pay-forward"],
    event: true,
  });
  return out;
};

export const phasesFor = (plan: SavedPlan): Phase[] => {
  const track = TRACK_BY_ID[plan.track];
  const date = validInterviewDate(plan);
  if (date) return countdownPhases(plan, date);
  const m1 = month1(plan);
  if (track.unit === "month" && m1) {
    return track.phases.map((ph) =>
      ph.start == null || ph.end == null
        ? { label: ph.when, sub: "Starts when your first interview is booked", steps: ph.steps, event: true }
        : {
            label: ph.when,
            sub: rangeMonths(addMonths(m1, ph.start - 1), addMonths(m1, ph.end - 1)),
            steps: ph.steps,
            note: ph.note,
            s: ph.start,
            e: ph.end,
          },
    );
  }
  const start = parseDay(plan.startedAt);
  return track.phases.map((ph) => ({
    label: ph.when,
    sub: `${fmtDate(addDays(start, ((ph.start ?? 1) - 1) * 7))} to ${fmtDate(addDays(start, (ph.end ?? 1) * 7 - 1))}`,
    steps: ph.steps,
    note: ph.note,
    s: ph.start ?? undefined,
    e: ph.end ?? undefined,
  }));
};

/** Month or week number the student is in today, starting at 1. */
export const nowUnit = (plan: SavedPlan, today: Date) => {
  const m1 = month1(plan);
  if (m1) return Math.max(1, monthsBetween(m1, today) + 1);
  return Math.max(1, Math.floor(daysBetween(parseDay(plan.startedAt), today) / 7) + 1);
};

export const currentPhaseIndex = (plan: SavedPlan, phases: Phase[], today: Date) => {
  const n = nowUnit(plan, today);
  let idx = 0;
  phases.forEach((ph, i) => {
    if (ph.s != null && n >= ph.s) idx = i;
  });
  return idx;
};

/** Every step in the plan in order (first appearance wins), side lane last. */
export const planOrder = (plan: SavedPlan) => {
  const ids: string[] = [];
  phasesFor(plan).forEach((ph) => ph.steps.forEach((id) => !ids.includes(id) && ids.push(id)));
  TRACK_BY_ID[plan.track].sideLane?.steps.forEach((id) => !ids.includes(id) && ids.push(id));
  return ids;
};

export const sideLaneSteps = (plan: SavedPlan) => TRACK_BY_ID[plan.track].sideLane?.steps ?? [];

/** Steps that count toward progress: not optional, not side lane. */
export const countedSteps = (plan: SavedPlan) => {
  const side = sideLaneSteps(plan);
  return planOrder(plan).filter((id) => !isOptional(plan, id) && !side.includes(id));
};

export const phaseIndexOf = (phases: Phase[], id: string) => phases.findIndex((ph) => ph.steps.includes(id));

export const unitLabel = (plan: SavedPlan, phases: Phase[], today: Date) => {
  const n = nowUnit(plan, today);
  if (validInterviewDate(plan)) {
    const total = phases.filter((p) => p.s != null).length;
    return `Week ${Math.min(n, total)} of ${total}`;
  }
  const track = TRACK_BY_ID[plan.track];
  const total = Math.max(...track.phases.map((p) => p.end ?? 0));
  return `${track.unit === "week" ? "Week" : "Month"} ${Math.min(n, total)} of ${total}`;
};

/* ---------- Progress ---------- */

export const stepChecks = (checks: Checks, id: string) =>
  checks[id] ?? STEP_BY_ID[id].checklist.map(() => false);
export const isStepDone = (checks: Checks, id: string) => stepChecks(checks, id).every(Boolean);
export const doneCount = (checks: Checks, id: string) => stepChecks(checks, id).filter(Boolean).length;

/** Free for non members: the first step of the plan. Nothing is free before a plan exists. */
export const freeStep = (plan: SavedPlan | null) => (plan ? TRACK_BY_ID[plan.track].phases[0].steps[0] : null);
export const isStepLocked = (id: string, plan: SavedPlan | null, isMember: boolean) => !isMember && id !== freeStep(plan);

/** Picked videos for round steps, otherwise the step's own video links. */
export const stepVideoIds = (id: string) => {
  const step = STEP_BY_ID[id];
  const ids = step.roundPicks
    ? step.roundPicks.flatMap((r) => PICKS_BY_TOPIC[r]?.videos.map((v) => v.youtubeId) ?? [])
    : step.links.flatMap((l) => (l.kind === "video" ? [l.youtubeId] : []));
  return ids.filter((id) => VIDEO_BY_ID.has(id));
};

export const hasOfficerTouch = (id: string) => STEP_BY_ID[id]?.touchpoint?.where === "presidency";

export const routeFor = (stepId: string | null | undefined, kind: SessionKind): string[] =>
  (stepId && STEP_ROUTING[stepId]) || [...SESSION_KINDS[kind].officers];

/** Quiz "Already done" answers to the exact steps they check, limited to this plan. */
export const marksFor = (plan: SavedPlan) => {
  const order = planOrder(plan);
  return plan.done
    .flatMap((key) => DONE_OPTIONS.find((o) => o.key === key)?.steps ?? [])
    .filter((id, i, a) => order.includes(id) && a.indexOf(id) === i);
};

/** This week reads the earliest unfinished steps. The calendar only sets the pace label. */
export const weekInfo = (plan: SavedPlan, checks: Checks, isMember: boolean, today: Date): WeekInfo => {
  const phases = phasesFor(plan);
  const current = currentPhaseIndex(plan, phases, today);
  const order: { id: string; pi: number }[] = [];
  phases.forEach((ph, pi) => ph.steps.forEach((id) => !order.some((o) => o.id === id) && order.push({ id, pi })));
  const pool = order.filter((o) => !phases[o.pi].event && !isOptional(plan, o.id) && !isStepDone(checks, o.id));
  const earliest = pool[0];
  const pace: WeekInfo["pace"] = !earliest
    ? "done"
    : earliest.pi < current
      ? "behind"
      : earliest.pi > current
        ? "ahead"
        : "on";

  const tasks: WeekTask[] = [];
  const push = (stepId: string, index: number, phaseIndex: number) =>
    tasks.push({ stepId, index, phaseIndex, catchUp: phaseIndex >= 0 && phaseIndex < current });

  const free = freeStep(plan);
  if (!isMember && free && !isStepDone(checks, free)) {
    stepChecks(checks, free).forEach((v, i) => {
      if (!v && tasks.length < 2) push(free, i, phaseIndexOf(phases, free));
    });
  }

  let limit = Math.max(current, earliest ? earliest.pi : current);
  for (let pass = 0; pass < 2 && tasks.length < 2; pass++, limit++) {
    const candidates = pool.filter((o) => o.pi <= limit && !hasOfficerTouch(o.id));
    for (let r = 0; r < 4 && tasks.length < 2; r++) {
      for (const o of candidates) {
        if (tasks.length >= 2) break;
        const open = stepChecks(checks, o.id)
          .map((v, i) => (v ? -1 : i))
          .filter((i) => i >= 0);
        const idx = open[r];
        if (idx !== undefined && !tasks.some((t) => t.stepId === o.id && t.index === idx)) push(o.id, idx, o.pi);
      }
    }
  }

  const human = order.find((o) => !isOptional(plan, o.id) && !isStepDone(checks, o.id) && hasOfficerTouch(o.id))?.id;
  return {
    phases,
    current,
    tasks,
    human,
    pace,
    behindCount: pool.filter((o) => o.pi < current).length,
    earliest: earliest?.id,
  };
};
