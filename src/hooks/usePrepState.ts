import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PREP_JOURNEY, type SessionKind, type TrackId } from "@/lib/prepJourney";
import {
  STEP_BY_ID,
  makePlan,
  marksFor,
  routeFor,
  startOfDay,
  type Checks,
  type PlanRound,
  type SavedPlan,
} from "@/lib/prepPlan";
import { findResource, isInAppGuide, resourceAnchorId } from "@/lib/resourceCatalog";
import { PREP_KEYS, normalizeChecks, safeRead, safeWrite } from "@/lib/prepStorage";

export type PrepTab = "plan" | "library" | "people";
export type PrepView = PrepTab | "step";

export interface AskRecord {
  officer: string;
  at: string;
}

export interface ComposerState {
  kind: SessionKind;
  stepId: string | null;
  to: string;
  round: PlanRound;
  company: string;
  focus: string;
}

export interface QuizAnswers {
  track?: TrackId;
  year?: string;
  done?: string[];
  interviewDate?: string | null;
  round?: PlanRound;
}

interface UsePrepStateArgs {
  isMember: boolean;
  isLoggedIn: boolean;
  onOpenPaid: (resource: { title: string; url: string }) => void;
  onOpenAuth: () => void;
  /** False while auth is loading; scroll targets wait until the page has rendered. */
  ready: boolean;
}

const TABS: PrepTab[] = ["plan", "library", "people"];
const KINDS: SessionKind[] = ["coffee-chat", "resume-review", "mock-interview"];
const CHECK_LENGTHS = Object.fromEntries(PREP_JOURNEY.steps.map((s) => [s.id, s.checklist.length]));

const readPlan = (): SavedPlan | null => {
  const raw = safeRead<SavedPlan | null>(PREP_KEYS.plan, null);
  if (!raw || typeof raw !== "object" || !["two-year", "one-year", "sixty-day"].includes(raw.track)) return null;
  return { ...raw, done: Array.isArray(raw.done) ? raw.done : [] };
};

export const usePrepState = ({ isMember, isLoggedIn, onOpenPaid, onOpenAuth, ready }: UsePrepStateArgs) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [plan, setPlanState] = useState<SavedPlan | null>(readPlan);
  const [checks, setChecksState] = useState<Checks>(() =>
    normalizeChecks(safeRead<unknown>(PREP_KEYS.checks, {}), CHECK_LENGTHS),
  );
  const [watched, setWatched] = useState<Set<string>>(() => {
    const raw = safeRead<unknown>(PREP_KEYS.watched, []);
    return new Set(Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : []);
  });
  const [asked, setAsked] = useState<Record<string, AskRecord>>(() => safeRead(PREP_KEYS.asked, {}));
  const [storedPaid, setStoredPaid] = useState<boolean | null>(() => safeRead<boolean | null>(PREP_KEYS.paid, null));

  const paid = storedPaid ?? isLoggedIn;

  /* ---------- URL state ---------- */
  const viewParam = searchParams.get("view");
  const stepParam = searchParams.get("step");
  const kindParam = searchParams.get("kind");
  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("cat");
  const topic = searchParams.get("topic");
  const playbook = searchParams.get("playbook");

  const view: PrepView = (() => {
    if (viewParam === "people") return "people";
    if (stepParam) return STEP_BY_ID[stepParam] ? "step" : "plan";
    if (TABS.includes(viewParam as PrepTab)) return viewParam as PrepTab;
    if (location.hash === "#practice-interviews") return "library";
    const lastTab = safeRead<string | null>(PREP_KEYS.view, null);
    if (TABS.includes(lastTab as PrepTab)) return lastTab as PrepTab;
    return isMember && !plan ? "library" : "plan";
  })();

  const stepId = view === "step" ? stepParam : null;
  const tab: PrepTab = view === "step" ? "plan" : view;

  useEffect(() => {
    if (viewParam && TABS.includes(viewParam as PrepTab)) safeWrite(PREP_KEYS.view, viewParam);
  }, [viewParam]);

  /* ---------- Scrolling after navigation ---------- */
  const scrollTarget = useRef<string | null>(null);
  const handledHash = useRef("");
  const firstLoad = useRef(true);
  useEffect(() => {
    if (!ready) return;
    const freshHash = location.hash && location.hash !== handledHash.current ? location.hash.slice(1) : null;
    handledHash.current = location.hash;
    // A direct load of ?topic= or ?playbook= lands on that section.
    const loadTarget = firstLoad.current ? (topic ? "practice-interviews" : playbook ? "apm-playbook" : null) : null;
    firstLoad.current = false;
    const target = scrollTarget.current ?? freshHash ?? loadTarget;
    scrollTarget.current = null;
    if (!target) return;
    const timer = window.setTimeout(() => {
      if (target === "top") window.scrollTo({ top: 0 });
      else if (target === "focus-search") {
        window.scrollTo({ top: 0 });
        document.getElementById("prep-search")?.focus();
      } else document.getElementById(target)?.scrollIntoView({ block: "start" });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [location.key, location.hash, ready, topic, playbook]);

  const go = useCallback(
    (params: Record<string, string | null | undefined>, opts: { replace?: boolean; scroll?: string; hash?: string } = {}) => {
      const next = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => v && next.set(k, v));
      const resource = searchParams.get("resource");
      if (resource) next.set("resource", resource);
      scrollTarget.current = opts.scroll ?? null;
      const search = next.toString();
      navigate({ pathname: "/resources", search: search ? `?${search}` : "", hash: opts.hash ?? "" }, { replace: opts.replace });
    },
    [navigate, searchParams],
  );

  const goTab = useCallback(
    (next: PrepTab) => {
      safeWrite(PREP_KEYS.view, next);
      go({ view: next }, { scroll: "top" });
    },
    [go],
  );
  const goStep = useCallback((id: string) => go({ step: id }, { scroll: "top" }), [go]);
  const goLibrary = useCallback(
    (p: { q?: string; cat?: string; topic?: string; playbook?: string } = {}, opts: { replace?: boolean; scroll?: string } = {}) => {
      const scroll = opts.scroll ?? (p.topic ? "practice-interviews" : p.playbook ? "apm-playbook" : "top");
      go({ view: "library", ...p }, { ...opts, scroll });
    },
    [go],
  );
  const setQuery = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set("q", value);
      else next.delete("q");
      next.set("view", "library");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );
  const goJoin = useCallback(() => {
    if (isMember) return;
    go({ view: "plan" }, { scroll: "join" });
  }, [go, isMember]);
  const goPeople = useCallback(
    (kind?: SessionKind, step?: string | null) => go({ view: "people", kind, step: step ?? undefined }, { scroll: "top" }),
    [go],
  );
  const focusSearch = useCallback(() => go({ view: "library", q: q || undefined }, { scroll: "focus-search" }), [go, q]);

  /* ---------- Persistence ---------- */
  const savePlan = useCallback((next: SavedPlan | null) => {
    setPlanState(next);
    safeWrite(PREP_KEYS.plan, next);
  }, []);
  const saveChecks = useCallback((updater: (prev: Checks) => Checks) => {
    setChecksState((prev) => {
      const next = updater(prev);
      safeWrite(PREP_KEYS.checks, next);
      return next;
    });
  }, []);

  const setAll = (c: Checks, id: string, value: boolean): Checks => ({
    ...c,
    [id]: STEP_BY_ID[id].checklist.map(() => value),
  });

  /** Rebuilds the plan from quiz answers. Keeps checkmarks, except the ones the previous answers added. */
  const answerQuiz = useCallback(
    (answers: QuizAnswers) => {
      const base = plan ?? null;
      const track = answers.track ?? base?.track;
      if (!track) return;
      const next = makePlan(track, today, {
        year: answers.year ?? base?.year,
        done: answers.done ?? base?.done ?? [],
        interviewDate: track === "sixty-day" ? (answers.interviewDate !== undefined ? answers.interviewDate : base?.interviewDate ?? null) : null,
        round: answers.round ?? base?.round ?? "product-sense",
        sprint: track === base?.track && track === "sixty-day" ? base.sprint : false,
        builtAsMember: base ? base.builtAsMember : isMember,
        welcomed: base?.welcomed,
      });
      const prevMarks = base ? marksFor(base) : [];
      const nextMarks = marksFor(next);
      saveChecks((prev) => {
        let c = prev;
        prevMarks.filter((id) => !nextMarks.includes(id)).forEach((id) => (c = setAll(c, id, false)));
        nextMarks.forEach((id) => (c = setAll(c, id, true)));
        return c;
      });
      savePlan(next);
    },
    [plan, today, isMember, saveChecks, savePlan],
  );

  const toggleSprint = useCallback(() => {
    if (plan) savePlan({ ...plan, sprint: !plan.sprint });
  }, [plan, savePlan]);
  const dismissWelcome = useCallback(() => {
    if (plan) savePlan({ ...plan, welcomed: true });
  }, [plan, savePlan]);

  const tick = useCallback(
    (id: string, index: number, value: boolean) =>
      saveChecks((prev) => {
        const row = [...(prev[id] ?? STEP_BY_ID[id].checklist.map(() => false))];
        row[index] = value;
        return { ...prev, [id]: row };
      }),
    [saveChecks],
  );
  const setStepDone = useCallback((id: string, value: boolean) => saveChecks((prev) => setAll(prev, id, value)), [saveChecks]);

  const toggleWatched = useCallback((id: string) => {
    setWatched((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      safeWrite(PREP_KEYS.watched, [...next]);
      return next;
    });
  }, []);

  const setPaid = useCallback((value: boolean) => {
    setStoredPaid(value);
    safeWrite(PREP_KEYS.paid, value);
  }, []);

  /* ---------- Officer asks ---------- */
  const initialKind = KINDS.includes(kindParam as SessionKind) ? (kindParam as SessionKind) : "coffee-chat";
  const [composer, setComposer] = useState<ComposerState>(() => {
    const presetStep = viewParam === "people" && stepParam && STEP_BY_ID[stepParam] ? stepParam : null;
    return {
      kind: initialKind,
      stepId: presetStep,
      to: routeFor(presetStep, initialKind)[0],
      round: plan?.round ?? "product-sense",
      company: "",
      focus: "",
    };
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (viewParam !== "people") return;
    const kind = KINDS.includes(kindParam as SessionKind) ? (kindParam as SessionKind) : null;
    const presetStep = stepParam && STEP_BY_ID[stepParam] ? stepParam : null;
    if (!kind && !presetStep) return;
    setComposer((c) => {
      const k = kind ?? c.kind;
      if (c.kind === k && c.stepId === (presetStep ?? c.stepId)) return c;
      return { ...c, kind: k, stepId: presetStep ?? c.stepId, to: routeFor(presetStep ?? c.stepId, k)[0] };
    });
  }, [viewParam, kindParam, stepParam]);

  const openAsk = useCallback(
    ({ stepId: sid = null, kind, to }: { stepId?: string | null; kind: SessionKind; to?: string }) => {
      setComposer((c) => ({
        ...c,
        kind,
        stepId: sid,
        to: to ?? routeFor(sid, kind)[0],
        round: plan?.round ?? c.round,
        focus: c.kind === kind ? c.focus : "",
      }));
      setSheetOpen(true);
    },
    [plan],
  );

  const recordAsk = useCallback(
    (key: string, officer: string) => {
      const next = { ...asked, [key]: { officer, at: new Date().toISOString() } };
      setAsked(next);
      safeWrite(PREP_KEYS.asked, next);
      toast(`Marked as asked. Your plan will show it is with ${officer.split(" ")[0]}.`);
    },
    [asked],
  );

  /* ---------- Resources ---------- */
  /** Opens a resource with today's rules. `free` opens it for non members (the plan's free step). */
  const openResource = useCallback(
    (title: string, opts: { free?: boolean } = {}) => {
      const found = findResource(title);
      if (!found) return;
      const { resource, category } = found;
      if (resource.isPaid) {
        onOpenPaid({ title: resource.title, url: resource.url });
        return;
      }
      if (!isMember && !opts.free) {
        goJoin();
        return;
      }
      if (isInAppGuide(resource)) {
        goLibrary({ cat: category.id }, { scroll: resourceAnchorId(resource.title) });
        return;
      }
      if (isMember) void supabase.from("resource_clicks").insert({ resource_title: resource.title, category_id: category.id });
      window.open(resource.url, "_blank", "noopener,noreferrer");
    },
    [isMember, onOpenPaid, goJoin, goLibrary],
  );

  return {
    today,
    isMember,
    isLoggedIn,
    plan,
    checks,
    watched,
    asked,
    paid,
    view,
    tab,
    stepId,
    q,
    cat,
    topic,
    playbook,
    composer,
    setComposer,
    sheetOpen,
    setSheetOpen,
    answerQuiz,
    toggleSprint,
    dismissWelcome,
    tick,
    setStepDone,
    toggleWatched,
    setPaid,
    openAsk,
    recordAsk,
    openResource,
    openAuth: onOpenAuth,
    goTab,
    goStep,
    goLibrary,
    goJoin,
    goPeople,
    setQuery,
    focusSearch,
  };
};

export type PrepApi = ReturnType<typeof usePrepState>;

export const PrepContext = createContext<PrepApi | null>(null);

export const usePrep = () => {
  const ctx = useContext(PrepContext);
  if (!ctx) throw new Error("usePrep must be used inside PrepContext");
  return ctx;
};
