import { CASE_TYPES, PLAYBOOK_STEPS } from "@/lib/apmPlaybook";
import { PREP_JOURNEY, SESSION_KINDS, type SessionKind } from "@/lib/prepJourney";
import { RESOURCE_CATEGORIES } from "@/lib/resources";
import { VIDEO_LIBRARY } from "@/lib/videoLibrary";

export type SearchItemType = "step" | "topic" | "case" | "playbook" | "video" | "resource" | "person";

export interface SearchItem {
  type: SearchItemType;
  id: string;
  title: string;
  sub: string;
  kw: string[];
  body: string;
  pick?: boolean;
  topic?: string;
}

export interface SearchResult {
  raw: string;
  query: string;
  bridge: string;
  steps: SearchItem[];
  topics: SearchItem[];
  cases: SearchItem[];
  playbook: SearchItem[];
  videos: SearchItem[];
  resources: SearchItem[];
  people: SearchItem[];
  total: number;
}

const ALIASES: Record<string, string[]> = {
  case: ["product sense", "product design"],
  cases: ["product sense", "product design"],
  "case interview": ["product sense", "product design"],
  "case study": ["product sense", "product design"],
  behavorial: ["behavioral"],
  behavioural: ["behavioral"],
  behaviorial: ["behavioral"],
  behavior: ["behavioral"],
  behaviour: ["behavioral"],
  star: ["star method", "behavioral"],
  stpar: ["star method", "behavioral"],
  "star method": ["behavioral"],
  tmay: ["tell me about yourself"],
  "introduce yourself": ["tell me about yourself"],
  intro: ["tell me about yourself"],
  guesstimate: ["estimation"],
  "market sizing": ["estimation"],
  fermi: ["estimation"],
  estimate: ["estimation"],
  metric: ["metrics", "execution"],
  metrics: ["execution"],
  "root cause": ["execution"],
  analytical: ["execution"],
  kpi: ["metrics", "execution"],
  "ab test": ["a/b test", "execution"],
  mock: ["mock interview"],
  mocks: ["mock interview"],
  practice: ["practice interview", "mock interview"],
  "mock interview videos": ["interview videos", "mock interview"],
  cv: ["resume"],
  referral: ["networking", "coffee chat"],
  network: ["networking"],
  alumni: ["networking"],
  deadline: ["deadlines", "apm list"],
  deadlines: ["apm list", "applications"],
  "when do applications open": ["applications", "deadlines"],
  jobs: ["internship"],
  google: ["google interview"],
  "google apm": ["google interview", "product sense", "apm"],
  googleyness: ["google interview", "behavioral"],
  meta: ["meta interview"],
  facebook: ["meta interview"],
  openai: ["openai interview"],
  "first round": ["interview", "first round"],
  "phone screen": ["interview", "first round"],
  "recruiter screen": ["interview", "first round"],
  "new grad": ["apm"],
  "system design": ["technical"],
  "what is a pm": ["what is a pm", "day in the life"],
  "product manager": ["what is a pm"],
};

const BRIDGES: [RegExp, string][] = [
  [
    /\bcases?\b|case (interview|study)/,
    "Recruiters usually mean the product sense round when they say case interview. Strategy and estimation questions get called cases too.",
  ],
  [/\bstar\b|stpar/, "STAR stories are for the behavioral round. The APM Playbook teaches the same idea as STPAR."],
  [/behavorial|behavioural|behaviorial|behaviour\b/, "Showing results for behavioral."],
  [/googleyness/, "Googleyness is Google's name for its behavioral round. Your story bank is the prep."],
  [
    /first round|phone screen|recruiter screen/,
    "Most first rounds are product sense or behavioral. If yours is within 7 days, switch your plan to the 7 day sprint.",
  ],
];

const STOP = new Set([
  "the", "and", "for", "how", "what", "with", "pm", "a", "to", "of", "in", "my", "do", "i",
  "questions", "question", "prep", "is", "on", "an",
]);

const TOPIC_KEYS: Record<string, string[]> = {
  basics: [
    "interview", "interview prep", "mock interview", "interview videos", "practice interview", "rubric", "structure",
    "framework", "first round", "google interview", "meta interview", "openai interview",
  ],
  "product-sense": ["product sense", "product design", "improve a product", "circles", "favorite product", "case"],
  strategy: ["strategy", "product strategy", "market entry", "growth"],
  execution: ["execution", "metrics", "root cause", "analytical", "a/b test", "north star"],
  estimation: ["estimation", "market sizing"],
  behavioral: [
    "behavioral", "star method", "tell me about yourself", "leadership", "stories", "why this company",
    "amazon leadership principles",
  ],
  technical: ["technical", "system design", "engineering"],
  "breaking-in": ["resume", "internship", "no experience", "day in the life", "what is a pm", "apm"],
};

const RESOURCE_KEYS: Record<string, string[]> = {
  "Aced (formerly Exponent)": ["mock interview", "practice interview", "peer mock", "exponent", "interview", "company guides"],
  "Cracking the PM Interview": ["interview", "tell me about yourself", "behavioral", "book", "resume"],
  "Decode and Conquer": ["product sense", "product design", "circles", "book"],
  "PMF Labs": ["mock interview", "ai mock", "practice interview"],
  "Leland+": ["coaching", "mock interview", "resume review", "final round"],
  "Coffee Chat Guide": ["coffee chat", "networking", "referral", "alumni"],
  "Product Haven Slack": ["mock interview", "peer mock", "community", "slack"],
  "Product School Slack": ["resume review", "jobs", "slack", "community"],
  "APM List": ["apm", "deadlines", "internship", "applications", "apm list"],
  "Simplify Internship List": ["internship", "applications"],
  "APM Season": ["apm", "internship"],
  Jobright: ["resume", "applications"],
};

const PLAYBOOK_KEYS: Record<string, string[]> = {
  interviews: ["case", "interview", "behavioral", "star method", "stpar"],
  resume: ["resume"],
  networking: ["networking", "coffee chat", "referral", "alumni"],
  applications: ["deadlines", "applications", "apm", "recruiting timeline"],
  experience: ["experience", "side project", "no experience"],
};

const caseKeys = (id: string) =>
  id === "design" || id === "improvement"
    ? ["product sense", "product design"]
    : id === "metrics"
      ? ["metrics", "execution"]
      : [id];

const PERSON_KEYS: Record<SessionKind, string[]> = {
  "mock-interview": ["mock interview", "practice interview", "mock"],
  "resume-review": ["resume review", "resume feedback"],
  "coffee-chat": ["coffee chat", "mentor", "officer"],
};

export const PICKED_VIDEO_IDS = new Set(PREP_JOURNEY.roundPicks.flatMap((p) => p.videos.map((v) => v.youtubeId)));

export const normalizeQuery = (s: string) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9/ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildIndex = (): SearchItem[] => {
  const items: SearchItem[] = [];
  PREP_JOURNEY.steps.forEach((s) =>
    items.push({ type: "step", id: s.id, title: s.title, sub: s.goal, kw: s.keywords ?? [], body: s.checklist.join(" ") }),
  );
  VIDEO_LIBRARY.forEach((t) =>
    items.push({
      type: "topic",
      id: t.slug,
      title: t.title,
      sub: t.description,
      kw: TOPIC_KEYS[t.slug] ?? [],
      body: [t.guide?.tests, t.guide?.where].filter(Boolean).join(" "),
    }),
  );
  CASE_TYPES.forEach((c) =>
    items.push({
      type: "case",
      id: c.id,
      title: c.title,
      sub: c.examples[0],
      kw: ["case", "case types", ...caseKeys(c.id)],
      body: c.framework.join(" "),
    }),
  );
  PLAYBOOK_STEPS.forEach((s) =>
    items.push({
      type: "playbook",
      id: s.id,
      title: `Step ${s.number}: ${s.title}`,
      sub: s.lede,
      kw: PLAYBOOK_KEYS[s.id] ?? [],
      body: s.lists.map((l) => l.items.join(" ")).join(" "),
    }),
  );
  const seen = new Set<string>();
  VIDEO_LIBRARY.forEach((t) =>
    t.videos.forEach((v) => {
      if (v.fromCourse || seen.has(v.youtubeId)) return;
      seen.add(v.youtubeId);
      items.push({
        type: "video",
        id: v.youtubeId,
        title: v.title,
        sub: `${t.title} · ${v.minutes} min`,
        kw: TOPIC_KEYS[t.slug] ? [t.title.toLowerCase()] : [],
        body: "",
        pick: PICKED_VIDEO_IDS.has(v.youtubeId),
        topic: t.slug,
      });
    }),
  );
  RESOURCE_CATEGORIES.forEach((c) =>
    c.resources.forEach((r) =>
      items.push({
        type: "resource",
        id: r.title,
        title: r.title,
        sub: r.description,
        kw: RESOURCE_KEYS[r.title] ?? [],
        body: r.tips.join(" "),
      }),
    ),
  );
  (Object.keys(SESSION_KINDS) as SessionKind[]).forEach((k) =>
    items.push({
      type: "person",
      id: k,
      title: `${SESSION_KINDS[k].label} with an officer`,
      sub: SESSION_KINDS[k].when,
      kw: PERSON_KEYS[k],
      body: "",
    }),
  );
  return items;
};

let INDEX: SearchItem[] | null = null;
let VOCAB: Set<string> | null = null;

const ensureIndex = () => {
  if (!INDEX) {
    INDEX = buildIndex();
    VOCAB = new Set(
      INDEX.flatMap((x) => normalizeQuery([x.title, ...x.kw].join(" ")).split(" ")).filter((w) => w.length >= 5),
    );
  }
  return { index: INDEX, vocab: VOCAB as Set<string> };
};

/** Damerau Levenshtein distance for short words. */
const distance = (a: string, b: string) => {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
};

const fixTypos = (q: string, vocab: Set<string>) => {
  let changed = false;
  const out = q
    .split(" ")
    .map((w) => {
      if (w.length < 5 || vocab.has(w) || ALIASES[w]) return w;
      let best: string | null = null;
      let bestD = 9;
      vocab.forEach((v) => {
        if (Math.abs(v.length - w.length) > 2) return;
        const dd = distance(w, v);
        if (dd < bestD) {
          bestD = dd;
          best = v;
        }
      });
      if (best && bestD <= (w.length >= 8 ? 2 : 1)) {
        changed = true;
        return best;
      }
      return w;
    })
    .join(" ");
  return { q: out, changed };
};

const score = (item: SearchItem, terms: string[], tokens: string[]) => {
  let s = 0;
  const title = normalizeQuery(item.title);
  const sub = normalizeQuery(item.sub);
  const kws = item.kw.map(normalizeQuery);
  const body = normalizeQuery(item.body);
  terms.forEach((term, i) => {
    const w = i === 0 ? 1 : 0.7;
    if (title === term) s += 12 * w;
    else if (` ${title} `.includes(` ${term} `)) s += 8 * w;
    kws.forEach((k, ix) => {
      if (k === term) s += (6 - Math.min(ix, 5) * 0.2) * w;
      else if (term.length > 3 && k.includes(term)) s += 2 * w;
    });
    if (term.length > 3 && sub.includes(term)) s += 2 * w;
    if (term.length > 3 && body.includes(term)) s += 1 * w;
  });
  tokens.forEach((tok) => {
    if (tok.length < 3 || STOP.has(tok)) return;
    if (` ${title} `.includes(` ${tok} `)) s += 1.5;
    if (kws.some((k) => ` ${k} `.includes(` ${tok} `))) s += 0.8;
  });
  if (item.type === "step") s *= 1.15;
  return s;
};

export const searchPrep = (raw: string): SearchResult | null => {
  const { index, vocab } = ensureIndex();
  const normalized = normalizeQuery(raw);
  if (!normalized) return null;
  const fixed = fixTypos(normalized, vocab);
  const query = fixed.q;
  const terms = [query];
  Object.entries(ALIASES).forEach(([k, v]) => {
    if (query === k || ` ${query} `.includes(` ${k} `)) v.forEach((x) => !terms.includes(x) && terms.push(x));
  });
  const tokens = query.split(" ");
  const scored = index
    .map((item) => ({ item, s: score(item, terms, tokens) }))
    .filter((x) => x.s >= 3)
    .sort((a, b) => b.s - a.s || Number(!!b.item.pick) - Number(!!a.item.pick));
  const by = (type: SearchItemType) => scored.filter((x) => x.item.type === type).map((x) => x.item);
  const bridge =
    BRIDGES.find(([re]) => re.test(query))?.[1] ?? (fixed.changed ? `Showing results for "${query}".` : "");
  return {
    raw,
    query,
    bridge,
    steps: by("step"),
    topics: by("topic"),
    cases: by("case"),
    playbook: by("playbook"),
    videos: by("video"),
    resources: by("resource"),
    people: by("person"),
    total: scored.length,
  };
};
