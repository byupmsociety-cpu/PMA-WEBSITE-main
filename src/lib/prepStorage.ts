// Prep progress lives in localStorage only, per device and not per user, so a plan built
// before login carries into the member view. Every access is guarded for private mode.

export const PREP_KEYS = {
  plan: "pma-prep-plan-v1",
  checks: "pma-prep-checks-v1",
  watched: "pma-prep-watched-v1",
  asked: "pma-prep-asked-v1",
  view: "pma-prep-view-v1",
  paid: "pma-prep-paid-v1",
} as const;

export const safeRead = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
};

export const safeWrite = (key: string, value: unknown) => {
  try {
    if (value === undefined || value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable or full: the page keeps working from memory.
  }
};

/** Pads or trims each saved checklist to the step's current length and drops unknown steps. */
export const normalizeChecks = (
  raw: unknown,
  lengths: Record<string, number>,
): Record<string, boolean[]> => {
  const out: Record<string, boolean[]> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const len = lengths[id];
    if (len === undefined || !Array.isArray(value)) continue;
    out[id] = Array.from({ length: len }, (_, i) => value[i] === true);
  }
  return out;
};
