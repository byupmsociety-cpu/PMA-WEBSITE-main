// Content from Nathan McCauley's "Breaking into Big Tech PM Roles" workshop deck (public/docs/breaking-into-apm.pdf).

export const PLAYBOOK_DECK_URL = "/docs/breaking-into-apm.pdf";

export interface PlaybookStat {
  value: string;
  label: string;
}

export const REALITY_STATS: PlaybookStat[] = [
  { value: "<5%", label: "Typical acceptance rate, often below 1 to 2%" },
  { value: "$130K to $230K", label: "Entry level comp across base, RSUs, and bonus" },
  { value: "10 to 30", label: "People in a typical rotational APM cohort" },
];

export const WHAT_SETS_YOU_APART = [
  "Starting early with a structured recruiting approach",
  "Framing yourself as all in on PM",
  "Communicating clearly and concisely",
];

export type PlaybookLink =
  | { kind: "category"; slug: string; label: string }
  | { kind: "resource"; title: string; label: string };

export interface PlaybookList {
  heading: string;
  items: string[];
  ordered?: boolean;
}

export interface PlaybookStep {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  lede: string;
  lists: PlaybookList[];
  callout: string;
  links: PlaybookLink[];
}

export const PLAYBOOK_STEPS: PlaybookStep[] = [
  {
    id: "experience",
    number: 1,
    title: "Gain relevant PM experience",
    shortTitle: "Experience",
    lede: "The PM paradox: you need PM experience to get PM experience. With AI, the bar for \"I built something\" has never been lower. Thinking like a PM is what actually matters.",
    lists: [
      {
        heading: "Ways to break in",
        ordered: true,
        items: [
          "Build your own product that solves a real need",
          "Take the OCI or Strategy APM class",
          "Do hackathons for a compressed timeline and a real deliverable",
          "Network into smaller companies to get your first PM experience",
        ],
      },
      {
        heading: "What makes a strong PM project",
        items: [
          "Solves a real problem for real users",
          "Covers the full lifecycle: user interviews, prioritization, building and iterating on feedback, measuring outcomes",
          "Clearly documents the process",
          "Creates experiences you can use in interviews",
        ],
      },
    ],
    callout: "Your process is the portfolio, not just the outcome.",
    links: [{ kind: "category", slug: "ai-tools", label: "Build with AI" }],
  },
  {
    id: "resume",
    number: 2,
    title: "Build a strong resume",
    shortTitle: "Resume",
    lede: "Your resume gets you the interview. Interviewing gets you the job. Its only job is to convince a recruiter in 10 seconds that you think like a PM.",
    lists: [
      {
        heading: "PM your previous experience",
        items: [
          "Reframe every bullet through a PM lens, even in non PM roles",
          "Highlight cross functional work with engineering, design, and data",
          "Show ownership, execution metrics, and the decisions you drove",
        ],
      },
      {
        heading: "What else to include",
        items: [
          "PM projects (this is why Step 1 matters)",
          "PM skills: user research, roadmapping, prioritization",
          "AI native prototyping skills, which signal you move fast and speak modern product",
        ],
      },
    ],
    callout: "If you're not getting interviews, it's almost certainly your resume.",
    links: [],
  },
  {
    id: "networking",
    number: 3,
    title: "Network and get referrals",
    shortTitle: "Networking",
    lede: "Referrals matter, and every company handles them differently. Some refer to the company instead of a role, some allow multiple referrals, some need it before the app opens, and some give a special application link. Network to learn the specifics for each target company.",
    lists: [],
    callout: "Never lead with \"can you refer me?\" Earn the relationship first.",
    links: [
      { kind: "resource", title: "Coffee Chat Guide", label: "Coffee Chat Guide" },
      { kind: "category", slug: "networking", label: "Community & Networking" },
    ],
  },
  {
    id: "applications",
    number: 4,
    title: "Applications and deadlines",
    shortTitle: "Applications",
    lede: "Apply instantly, not eventually. Recruiters can fill a cohort from the first few hundred applications, so speed matters as much as quality.",
    lists: [
      {
        heading: "How to find the exact open date",
        items: [
          "Follow target companies on LinkedIn and X",
          "Join Slack communities, where APM channels surface dates early",
          "Check APMseason.com (acquired by Leland)",
          "Watch company career pages, since some publish dates in advance",
          "Sign up for talent and recruiting emails from company portals",
          "Ask your network, another reason the spring coffee chat matters",
        ],
      },
    ],
    callout: "Goal: submit within hours of the app opening, with a referral already in.",
    links: [
      { kind: "category", slug: "job-search", label: "APM Job Postings" },
      { kind: "resource", title: "APM List", label: "APM List" },
    ],
  },
  {
    id: "interviews",
    number: 5,
    title: "Interview prep",
    shortTitle: "Interviews",
    lede: "Expect behavioral and case rounds. Practice both out loud with a partner, not just in your head.",
    lists: [],
    callout: "Interviewing is a muscle to train, not a script to memorize.",
    links: [
      { kind: "category", slug: "resume-interview", label: "PM Interview Prep" },
      { kind: "category", slug: "mock-interviews", label: "Mock Interview Videos" },
    ],
  },
];

export const RESUME_REFRAME = { before: "Assisted with project", after: "Led cross functional team of 4" };

export const NETWORK_TIERS = [
  { tier: "Best", who: "Alumni who are current PMs at your target companies" },
  { tier: "Better", who: "Non PM alumni at your target company" },
  { tier: "Good", who: "Non alumni with a similar background in your desired role" },
];

export const TWO_TOUCH = [
  {
    label: "Touch 1",
    timing: "Spring or early summer",
    items: [
      "Reach out on LinkedIn",
      "Coffee chat in the off season with no ask",
      "Learn about their role and company",
      "Get advice and share your goals",
    ],
  },
  {
    label: "Touch 2",
    timing: "Late summer or early fall",
    items: [
      "Follow up as recruiting season approaches",
      "The relationship is already built",
      "Now ask for a referral. It feels natural, not transactional",
    ],
  },
];

export type CalendarSeason = "early" | "peak" | "late";

export const RECRUITING_CALENDAR: { month: string; season: CalendarSeason }[] = [
  { month: "Jul", season: "early" },
  { month: "Aug", season: "peak" },
  { month: "Sep", season: "peak" },
  { month: "Oct", season: "peak" },
  { month: "Nov", season: "late" },
  { month: "Dec", season: "late" },
  { month: "Jan", season: "late" },
  { month: "Feb", season: "late" },
  { month: "Mar", season: "late" },
  { month: "Apr", season: "late" },
];

export const STPAR = [
  { letter: "S", word: "Situation" },
  { letter: "T", word: "Task" },
  { letter: "P", word: "Principle" },
  { letter: "A", word: "Action" },
  { letter: "R", word: "Result" },
];

export const BEHAVIORAL_THEMES = [
  { title: "Why PM, why this company", detail: "Your origin story and what draws you to product and to this company" },
  { title: "Cross functional collaboration", detail: "Working with eng, design, and data; influencing without authority" },
  { title: "Leadership and ownership", detail: "Driving a project; making a call with incomplete information" },
  { title: "Ambiguity and failure", detail: "A time things went wrong and how you adapted" },
  { title: "Data driven decisions", detail: "Using data to prioritize or change direction" },
  { title: "Customer obsession", detail: "Advocating for the user; surfacing insights that shaped direction" },
];

export interface CaseType {
  id: string;
  title: string;
  examples: string[];
  framework: string[];
  sequential: boolean;
}

export const CASE_TYPES: CaseType[] = [
  {
    id: "design",
    title: "Product Design",
    examples: ["Design a stove for blind people.", "Design a product for travelers in an airport."],
    framework: ["User", "Problem", "Solution", "Tradeoff", "Metrics"],
    sequential: true,
  },
  {
    id: "improvement",
    title: "Product Improvement",
    examples: ["How would you improve Netflix?"],
    framework: ["Diagnosis", "Prioritization", "Proposal"],
    sequential: true,
  },
  {
    id: "strategy",
    title: "Product Strategy",
    examples: ["You're a PM at Spotify. How would you increase revenue 5x in the next 5 years?"],
    framework: ["Market", "Competition", "Fit", "Risks"],
    sequential: false,
  },
  {
    id: "metrics",
    title: "Metrics and Execution",
    examples: ["DAU dropped 20%. What do you do?", "How do you measure the success of IG Stories?"],
    framework: ["Structured diagnosis", "What you tackle first"],
    sequential: true,
  },
  {
    id: "estimation",
    title: "Estimation",
    examples: ["How many restaurants are in SF?"],
    framework: ["Assumptions", "Segmentation", "Math"],
    sequential: true,
  },
];

export const KEY_TAKEAWAYS = [
  { title: "Never count yourself out", detail: "Acceptance rates are brutal, but never self eliminate." },
  { title: "There is no silver bullet", detail: "Go through all 5 steps, consistently." },
  { title: "Start early", detail: "Students who land APM roles work at it steadily instead of sprinting before deadlines." },
  { title: "Communicate your value", detail: "If you want the job, learn to clearly communicate your value." },
];
