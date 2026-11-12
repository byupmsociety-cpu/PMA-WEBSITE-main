// Content for the PM Internship Prep plan on /resources. Every link resolves against resources.ts,
// apmPlaybook.ts or videoLibrary.ts. Only videos without fromCourse are used (course lessons stay unlisted).
// Copy is PMA voice: plain, no dashes as punctuation.

export type StageId = "explore" | "experience" | "story" | "network" | "apply" | "interview" | "offer";
export type TrackId = "two-year" | "one-year" | "sixty-day";
export type RoundTopic = "basics" | "product-sense" | "execution" | "behavioral" | "strategy" | "estimation" | "technical";
export type TouchKind = "coffee-chat" | "mock-interview" | "resume-review" | "event";

export type JourneyLink =
  | { kind: "resource"; title: string }
  | { kind: "playbook"; id: string }
  | { kind: "topic"; slug: string }
  | { kind: "video"; youtubeId: string; topic: string };

export interface Touchpoint {
  kind: TouchKind;
  where: "presidency" | "events" | "hackathon";
  label: string;
  detail: string;
}
export interface JourneyStage { id: StageId; title: string; summary: string }
export interface JourneyStep {
  id: string;
  stage: StageId;
  title: string;
  goal: string;
  time: string;
  checklist: string[];
  links: JourneyLink[];
  touchpoint?: Touchpoint;
  roundPicks?: RoundTopic[];
  keywords?: string[];
}
export interface RoundPick {
  topic: RoundTopic;
  label: string;
  videos: { youtubeId: string; role: "Watch first" | "Watch this week" | "Watch next" | "Rewatch the night before"; note: string }[];
}
export interface TrackPhase { when: string; start: number | null; end: number | null; steps: string[]; note?: string }
export interface JourneyTrack {
  id: TrackId;
  label: string;
  who: string;
  promise: string;
  unit: "month" | "week";
  phases: TrackPhase[];
  sideLane?: { label: string; when: string; steps: string[] };
  fastLane?: { label: string; days: { day: string; do: string; steps: string[] }[] };
  timeOverrides?: Record<string, string>;
  optional?: string[];
}
export interface JourneyModel { stages: JourneyStage[]; steps: JourneyStep[]; roundPicks: RoundPick[]; tracks: JourneyTrack[] }

/** Month of the track that lands on August 1 of the application year. Used to back solve dates. */
export const APPLY_MONTH_INDEX: Record<Exclude<TrackId, "sixty-day">, number> = { "two-year": 22, "one-year": 10 };

/** Quiz answers to the exact steps they check off. Never whole stages. */
export const DONE_OPTIONS: { key: string; label: string; steps: string[] }[] = [
  { key: "whatpm", label: "I know what a PM does", steps: ["explore-what-pm-does"] },
  { key: "officer", label: "Talked with a PMA officer or a working PM", steps: ["explore-officer-chat"] },
  { key: "project", label: "Built a project or owned a product decision", steps: ["exp-pick-path", "exp-ship-project"] },
  { key: "resume", label: "Wrote a resume aimed at PM", steps: ["story-resume"] },
  { key: "network", label: "Started coffee chats with alumni", steps: ["net-find-people", "net-touch-one"] },
  { key: "practice", label: "Practiced interview questions out loud", steps: ["int-basics"] },
];

/** Year chip to suggested track. The student can always override. */
export const YEAR_TO_TRACK: Record<string, TrackId> = {
  Freshman: "two-year", Sophomore: "one-year", Junior: "sixty-day", Senior: "sixty-day", "Grad student": "sixty-day",
};

/** Round chosen in the 60 day date planner to the step that preps it. */
export const ROUND_STEP: Record<Exclude<RoundTopic, "basics">, string> = {
  "product-sense": "int-product-sense", execution: "int-execution", behavioral: "int-behavioral",
  strategy: "int-more-rounds", estimation: "int-more-rounds", technical: "int-more-rounds",
};

/** Human layer. Officer names must match PRESIDENCY in officers.ts. Proposed; officers confirm before launch. */
export const SESSION_KINDS = {
  "coffee-chat": {
    label: "Coffee chat", length: "20 min", openToNonMembers: true,
    when: "When you are starting out, deciding on a path, or about to message alumni.",
    bring: ["Three questions you actually want answered", "Where you are in your plan"],
    leave: ["A clear next step for this month", "Someone at PMA who knows your name"],
    officers: ["Ella Moore", "Nathan McCauley", "Sophie Strong"],
  },
  "resume-review": {
    label: "Resume review", length: "By email", openToNonMembers: false,
    when: "After you rewrite your bullets yourself, and again if applications go quiet.",
    bring: ["Your resume as a PDF", "One question you want answered", "Where you are applying"],
    leave: ["A marked up resume", "The one change that matters most"],
    officers: ["Nathan Irizarry", "Logan West"],
  },
  "mock-interview": {
    label: "Mock interview", length: "30 to 45 min", openToNonMembers: false,
    when: "After you have watched the picks for a round and answered three questions out loud.",
    bring: ["The round you want to practice", "The company and date, if you have one", "What went wrong in your last practice"],
    leave: ["A real rep with a timer", "One thing to fix before the real one"],
    officers: ["Nathan Irizarry", "Logan West", "Nathan McCauley"],
  },
} as const;
export type SessionKind = keyof typeof SESSION_KINDS;

/** Step specific routing overrides SESSION_KINDS[kind].officers. First name is the default. */
export const STEP_ROUTING: Record<string, string[]> = {
  "explore-officer-chat": ["Ella Moore", "Nathan McCauley", "Sophie Strong"],
  "net-touch-one": ["Truman Dangerfield", "Ella Moore"],
  "story-resume-review": ["Nathan Irizarry", "Logan West"],
  "apply-no-interviews": ["Logan West", "Nathan Irizarry"],
  "int-mocks": ["Nathan Irizarry", "Logan West"],
  "offer-final-rounds": ["Nathan McCauley", "Nathan Irizarry"],
  "offer-decide": ["Ella Moore", "Nathan McCauley"],
  "offer-pay-forward": ["Nathan Irizarry", "Logan West"],
};
export const OFFICER_NOTES: Record<string, string> = {
  "Nathan McCauley": "Wrote the APM Playbook. Landed a Google APM offer.",
  "Truman Dangerfield": "Handles alumni and company relations.",
};

/** Peer options shown before officer time. Titles must match resources.ts. */
export const PEER_OPTIONS: { title: string; note: string }[] = [
  { title: "Aced (formerly Exponent)", note: "Free peer mocks. The free plan includes 5 a month." },
  { title: "Product Haven Slack", note: "Find a weekly mock partner and trade sessions." },
  { title: "PMF Labs", note: "AI mock interviews for extra reps. Members get 90 free minutes." },
  { title: "Leland+", note: "Before a final round: a $50 coaching credit for a mock with a coach." },
];

/** Approval copy. No timing promises: approval is manual and we do not publish a number. */
export const APPROVAL_COPY = {
  short: "An officer approves new members by hand. If it has been more than a week, email the club.",
  queued: "A student officer matches your payment to your account by hand. If it has been more than a week, email the club with your name and the email you used.",
  clubEmail: "byupmsociety@gmail.com",
  joinUrl: "https://clubs.byu.edu/link/club/18295873486206095",
};

export const PREP_JOURNEY: JourneyModel = {
  stages: [
    {id: "explore", title: "Explore PM", summary: "Find out what a PM does and whether you want to be one."},
    {
      id: "experience",
      title: "Build experience",
      summary: "Get real product work you can talk about in an interview."
    },
    {
      id: "story",
      title: "Resume and story",
      summary: "Turn what you have done into a resume and stories that sound like a PM."
    },
    {
      id: "network",
      title: "Network",
      summary: "Build relationships in the off season so referrals feel natural later."
    },
    {id: "apply", title: "Apply", summary: "Apply within hours of each opening, with a referral already in."},
    {
      id: "interview",
      title: "Interview prep",
      summary: "Learn each round, then practice out loud with real people."
    },
    {
      id: "offer",
      title: "Final rounds and offer",
      summary: "Prep for each company, close strong, and help the next person."
    }
  ],
  steps: [
    {
      id: "explore-what-pm-does",
      stage: "explore",
      title: "See what a PM actually does",
      goal: "Know what a PM does all day and why companies hire them.",
      time: "30 min",
      checklist: [
        "Watch A Day in the Life of a PM.",
        "Watch How to Get a PM Internship.",
        "Write down two parts of the job that excite you and one that worries you."
      ],
      links: [
        {kind: "video", youtubeId: "U-lYLSlYU1o", topic: "breaking-in"},
        {kind: "video", youtubeId: "hZwv04OIV3A", topic: "breaking-in"}
      ],
      keywords: ["what is a pm", "product manager", "day in the life"]
    },
    {
      id: "explore-recruiting",
      stage: "explore",
      title: "Learn how PM recruiting works",
      goal: "Know what APM programs are, how hard they are to get, and when applications open.",
      time: "30 min",
      checklist: [
        "Read the five steps in the APM Playbook.",
        "Note the recruiting calendar: most applications open August through October.",
        "Watch Get Into Top APM Programs."
      ],
      links: [
        {kind: "playbook", id: "applications"},
        {kind: "video", youtubeId: "ufFfq-t6-xg", topic: "breaking-in"}
      ],
      keywords: ["apm", "recruiting timeline", "when do applications open"]
    },
    {
      id: "explore-officer-chat",
      stage: "explore",
      title: "Have your first coffee chat with a PMA officer",
      goal: "Talk to someone who has been through PM recruiting at BYU.",
      time: "10 min to set up, 20 min to talk",
      checklist: [
        "Pick an officer from Connect with a Presidency Member and send a short note asking for 20 minutes.",
        "Bring three questions: how they found PM, what they wish they had done earlier, and which class or club helped most.",
        "Send a thank you within 24 hours."
      ],
      links: [{kind: "resource", title: "Coffee Chat Guide"}],
      touchpoint: {
        kind: "coffee-chat",
        where: "presidency",
        label: "Coffee chat with an officer",
        detail: "Officers are happy to talk with members who are just starting. Email or message one from the list on this page."
      },
      keywords: ["coffee chat", "officer", "mentor"]
    },
    {
      id: "explore-community",
      stage: "explore",
      title: "Join the PM community",
      goal: "Get recruiting news and practice partners without hunting for them.",
      time: "20 min, then 10 min a week",
      checklist: [
        "Join Product Haven Slack and introduce yourself with the programs you are curious about.",
        "Join Product School Slack and mute everything except #08_job-portal.",
        "Come to one PMA event this month."
      ],
      links: [{kind: "resource", title: "Product Haven Slack"}, {kind: "resource", title: "Product School Slack"}],
      touchpoint: {
        kind: "event",
        where: "events",
        label: "Come to a PMA event",
        detail: "Meet members who are a year or two ahead of you. Check the events page for the next one."
      },
      keywords: ["slack", "community", "events"]
    },
    {
      id: "explore-product-opinion",
      stage: "explore",
      title: "Start thinking like a PM",
      goal: "Practice having a clear product opinion, the first thing interviewers test.",
      time: "1.5 hrs",
      checklist: [
        "Watch APM Mock: Favorite Product.",
        "Pick an app you use every day. Write who it is for, the problem it solves, and one thing you would change.",
        "Explain it out loud to a friend and let them push back."
      ],
      links: [
        {kind: "video", youtubeId: "vm5QLIiKbmI", topic: "product-sense"},
        {kind: "topic", slug: "product-sense"}
      ],
      keywords: ["favorite product", "product sense"]
    },
    {
      id: "exp-pick-path",
      stage: "experience",
      title: "Pick your way in",
      goal: "Choose the one path you will use to get PM experience this semester.",
      time: "30 min",
      checklist: [
        "Read Step 1 of the APM Playbook.",
        "Watch Breaking Into PM Without Experience.",
        "Pick one: build your own product, take the OCI or Strategy APM class, do a hackathon, or network into a small company."
      ],
      links: [{kind: "playbook", id: "experience"}, {kind: "video", youtubeId: "7ALVChUtyf8", topic: "breaking-in"}],
      keywords: ["experience", "no experience", "side project"]
    },
    {
      id: "exp-pm-your-role",
      stage: "experience",
      title: "Find PM work in what you already do",
      goal: "Take ownership of a product decision in a job, club, or class you are already in.",
      time: "1 hr, then ongoing",
      checklist: [
        "List the decisions your team makes about users, features, or priorities.",
        "Volunteer to own one of them from start to finish.",
        "Write down one number before and after so you can show the result."
      ],
      links: [{kind: "playbook", id: "resume"}]
    },
    {
      id: "exp-ship-project",
      stage: "experience",
      title: "Ship a side project",
      goal: "Build something small that solves a real problem for real users.",
      time: "3 hrs a week for 6 weeks",
      checklist: [
        "Talk to five people who have the problem before you build anything.",
        "Write a one paragraph spec, then build the first version with Lovable or Cursor.",
        "Get at least five real people to use it and write down what they said.",
        "Make one change based on that feedback."
      ],
      links: [
        {kind: "resource", title: "Lovable"},
        {kind: "resource", title: "Cursor"},
        {kind: "resource", title: "Claude Code"}
      ],
      keywords: ["side project", "build", "ai", "vibe code"]
    },
    {
      id: "exp-hackathon",
      stage: "experience",
      title: "Do a hackathon",
      goal: "Run a full product cycle with a real deliverable in one weekend.",
      time: "1 weekend",
      checklist: [
        "Sign up for the PMA hackathon or another BYU hackathon.",
        "Take the PM role: own the user, the problem, and the demo.",
        "Afterward, write down one hard decision you made and why."
      ],
      links: [{kind: "playbook", id: "experience"}],
      touchpoint: {
        kind: "event",
        where: "hackathon",
        label: "PMA hackathon",
        detail: "Our hackathon is built for exactly this kind of rep. See the hackathon page for the next one."
      },
      keywords: ["hackathon"]
    },
    {
      id: "exp-document",
      stage: "experience",
      title: "Show your work",
      goal: "Give each project a home that recruiters can click through.",
      time: "2 hrs",
      checklist: [
        "For each project, write the problem, what you built, and the result.",
        "Get a simple portfolio site live with the Portfolio Factory Quick Start.",
        "Put the link on your resume and LinkedIn."
      ],
      links: [{kind: "resource", title: "Portfolio Factory"}, {kind: "playbook", id: "experience"}],
      keywords: ["portfolio"]
    },
    {
      id: "story-resume",
      stage: "story",
      title: "Write a PM resume",
      goal: "Get a one page resume that shows a recruiter you think like a PM in 10 seconds.",
      time: "3 hrs",
      checklist: [
        "Watch How to Write a PM Resume and read Step 2 of the APM Playbook.",
        "Rewrite every bullet to show ownership, cross functional work, and a number. \"Led cross functional team of 4\", not \"Assisted with project\".",
        "Put your PM project near the top."
      ],
      links: [{kind: "video", youtubeId: "332v0mv7flY", topic: "breaking-in"}, {kind: "playbook", id: "resume"}],
      keywords: ["resume"]
    },
    {
      id: "story-resume-review",
      stage: "story",
      title: "Get your resume reviewed",
      goal: "Have people who know PM mark it up before a recruiter sees it.",
      time: "1 hr of your time over a week",
      checklist: [
        "Ask a PMA officer to review it.",
        "Post an anonymized copy in #07_resume-review in Product School Slack.",
        "Make the edits and save a clean PDF."
      ],
      links: [{kind: "resource", title: "Product School Slack"}, {kind: "playbook", id: "resume"}],
      touchpoint: {
        kind: "resume-review",
        where: "presidency",
        label: "Resume review with an officer",
        detail: "Send your resume to an officer with one question you want answered. Most of us had ours torn apart before it worked."
      },
      keywords: ["resume review", "resume feedback"]
    },
    {
      id: "story-tell-me",
      stage: "story",
      title: "Write your tell me about yourself",
      goal: "Have a short answer ready for the question that opens almost every interview.",
      time: "1 hr, plus practice",
      checklist: [
        "Read the Leadership and Drive guide and the tell me about yourself advice in Cracking the PM Interview.",
        "Draft four parts: where you started, what you do now, why PM, and why now.",
        "Say it out loud until it fits in about 90 seconds."
      ],
      links: [
        {kind: "topic", slug: "behavioral"},
        {kind: "resource", title: "Cracking the PM Interview"}
      ],
      keywords: ["tell me about yourself", "introduction", "pitch", "behavioral"]
    },
    {
      id: "story-bank",
      stage: "story",
      title: "Build your story bank",
      goal: "Have six to eight true stories ready for any behavioral question.",
      time: "2 hrs a week for 2 weeks",
      checklist: [
        "Watch Building a Behavioral Story Bank.",
        "Write one story for each theme: why PM, cross functional work, leadership, failure, a data driven decision, and advocating for a user.",
        "Shape each one as situation, task, principle, action, result, and spend most of it on what you did.",
        "Put a real number in every result."
      ],
      links: [
        {kind: "video", youtubeId: "p8JTbk5UoFM", topic: "behavioral"},
        {kind: "topic", slug: "behavioral"},
        {kind: "playbook", id: "interviews"}
      ],
      keywords: ["behavioral", "behavioral questions", "behavorial", "star method", "stpar", "stories", "leadership"]
    },
    {
      id: "story-why-company",
      stage: "story",
      title: "Know why each company",
      goal: "Have a specific answer to why this company for each of your top targets.",
      time: "30 min per company",
      checklist: [
        "Read the why PM, why this company theme in Step 5 of the APM Playbook.",
        "For each target, write one product of theirs you use, one thing you would build, and how it connects to your story."
      ],
      links: [
        {kind: "playbook", id: "interviews"},
        {kind: "topic", slug: "behavioral"}
      ],
      keywords: ["why this company", "why google", "behavioral"]
    },
    {
      id: "net-targets",
      stage: "network",
      title: "Pick your target companies",
      goal: "Know the 10 to 15 programs you are going after.",
      time: "1 hr",
      checklist: [
        "Browse APM List and the Product Management section of the Simplify Internship List.",
        "Put 10 to 15 targets in a spreadsheet with their status and links.",
        "Mark which ones need a referral before the application opens."
      ],
      links: [
        {kind: "resource", title: "APM List"},
        {kind: "resource", title: "Simplify Internship List"},
        {kind: "playbook", id: "applications"}
      ],
      keywords: ["internship", "apm programs", "target companies"]
    },
    {
      id: "net-find-people",
      stage: "network",
      title: "Find your people",
      goal: "Build a list of BYU alumni and PMs at your target companies.",
      time: "2 hrs",
      checklist: [
        "Search LinkedIn for BYU alumni at each target company.",
        "Sort them: best is alumni who are PMs there, then other alumni there, then non alumni in the role you want.",
        "Pick the first 10 you will reach out to."
      ],
      links: [{kind: "resource", title: "Coffee Chat Guide"}, {kind: "playbook", id: "networking"}],
      keywords: ["networking", "alumni", "linkedin"]
    },
    {
      id: "net-touch-one",
      stage: "network",
      title: "Coffee chats, round one",
      goal: "Build real relationships in the spring, with no ask.",
      time: "2 chats a week for 6 weeks",
      checklist: [
        "Send a short LinkedIn note asking for 20 minutes to learn about their role.",
        "Ask about their team, their path to PM, and how referrals and application dates work at their company.",
        "Send a thank you within 24 hours and write down what you learned."
      ],
      links: [{kind: "resource", title: "Coffee Chat Guide"}, {kind: "playbook", id: "networking"}],
      touchpoint: {
        kind: "coffee-chat",
        where: "presidency",
        label: "Practice your outreach with an officer",
        detail: "Send your first LinkedIn note to an officer before you send it to an alum. We will tell you what we would reply to."
      },
      keywords: ["coffee chat", "networking", "referral"]
    },
    {
      id: "net-touch-two",
      stage: "network",
      title: "Coffee chats, round two",
      goal: "Follow up as recruiting opens and ask for a referral that feels natural.",
      time: "1 hr a week, July to September",
      checklist: [
        "Follow up with everyone from round one and share what you have done since you talked.",
        "Ask how their company handles referrals this year.",
        "Ask for the referral, then thank them whether or not it works out."
      ],
      links: [{kind: "resource", title: "Coffee Chat Guide"}, {kind: "playbook", id: "networking"}],
      keywords: ["referral", "follow up", "networking"]
    },
    {
      id: "apply-alerts",
      stage: "apply",
      title: "Set up your alerts",
      goal: "Know the day an application opens, not a week later.",
      time: "30 min",
      checklist: [
        "Click Watch on the Simplify Internship List repo.",
        "Bookmark APM List and check it twice a week starting in July.",
        "Follow your targets on LinkedIn and sign up for their talent emails.",
        "Turn on notifications for #08_job-portal in Product School Slack."
      ],
      links: [
        {kind: "resource", title: "Simplify Internship List"},
        {kind: "resource", title: "APM List"},
        {kind: "resource", title: "Product School Slack"}
      ],
      keywords: ["job alerts", "internship", "apm list"]
    },
    {
      id: "apply-kit",
      stage: "apply",
      title: "Get your application kit ready",
      goal: "Have everything ready so you can apply within hours of an opening.",
      time: "2 hrs",
      checklist: [
        "Save your final resume as a PDF.",
        "Write a short why this company paragraph for each target.",
        "Note who can refer you at each target.",
        "Try Jobright to check your resume against a posting, then edit the output in your own voice."
      ],
      links: [{kind: "resource", title: "Jobright"}, {kind: "playbook", id: "applications"}]
    },
    {
      id: "apply-day-one",
      stage: "apply",
      title: "Apply on day one",
      goal: "Submit within hours of each application opening, with a referral already in.",
      time: "15 min per application, August to October",
      checklist: [
        "Apply the same day a role opens.",
        "Tell your referrer you applied.",
        "Track every application with the date, referral, and status.",
        "Scan APM Season for roles you missed, after checking its last updated date."
      ],
      links: [
        {kind: "playbook", id: "applications"},
        {kind: "resource", title: "APM List"},
        {kind: "resource", title: "APM Season"}
      ],
      keywords: ["apply", "applications", "deadlines"]
    },
    {
      id: "apply-no-interviews",
      stage: "apply",
      title: "Not getting interviews? Fix the resume",
      goal: "If applications go quiet, look at the resume first. It is almost always the reason.",
      time: "1 hr",
      checklist: [
        "Reread Step 2 of the APM Playbook against your resume, bullet by bullet.",
        "Get a second review from a PMA officer.",
        "Ask a round one coffee chat contact for a referral on your next application."
      ],
      links: [{kind: "playbook", id: "resume"}],
      touchpoint: {
        kind: "resume-review",
        where: "presidency",
        label: "Second resume review",
        detail: "Tell the officer how many places you applied and what you heard back. That helps us find the problem fast."
      }
    },
    {
      id: "int-basics",
      stage: "interview",
      title: "Learn how PM interviews work",
      goal: "Know the round types and how you are graded before you start practicing.",
      time: "15 min",
      checklist: [
        "Watch PM Interview Rubric: What to Expect.",
        "Watch The Perfect Structure for a PM Interview.",
        "Start Cracking the PM Interview. It is the standard first read."
      ],
      links: [
        {kind: "video", youtubeId: "_4vhjxOuA-A", topic: "basics"},
        {kind: "video", youtubeId: "6i_--b3S6jc", topic: "basics"},
        {kind: "resource", title: "Cracking the PM Interview"}
      ],
      keywords: [
        "interview",
        "interview prep",
        "mock interview videos",
        "practice interview",
        "interview videos",
        "case interview",
        "case",
        "rubric"
      ]
    },
    {
      id: "int-product-sense",
      stage: "interview",
      title: "Product sense round",
      goal: "Pick one user, solve their biggest problem, and make a clear choice at every step.",
      time: "3 hrs a week for 3 weeks",
      checklist: [
        "Read the Product Sense guide: what it tests, how to approach it, what hurts.",
        "Watch the three picked videos in order.",
        "Answer three product design questions out loud with a 30 minute timer.",
        "Note where you ran out of time and fix that next round."
      ],
      links: [
        {kind: "topic", slug: "product-sense"},
        {kind: "resource", title: "Decode and Conquer"},
        {kind: "playbook", id: "interviews"}
      ],
      roundPicks: ["product-sense"],
      keywords: [
        "product sense",
        "product sense interview",
        "case interview",
        "case",
        "case study",
        "product design",
        "improve a product",
        "circles",
        "google interview",
        "meta interview"
      ]
    },
    {
      id: "int-execution",
      stage: "interview",
      title: "Analytical and execution round",
      goal: "Pick the right metric and stay calm when the numbers move.",
      time: "2 hrs a week for 2 weeks",
      checklist: [
        "Read the Analytical and Execution guide.",
        "Watch the three picked videos in order.",
        "Practice one goal setting question and one metric drop question out loud.",
        "For every metric drop, rule out a tracking bug before anything else."
      ],
      links: [{kind: "topic", slug: "execution"}, {kind: "playbook", id: "interviews"}],
      roundPicks: ["execution"],
      keywords: [
        "execution",
        "execution interview",
        "metrics",
        "root cause",
        "a/b test",
        "north star",
        "analytical",
        "meta interview"
      ]
    },
    {
      id: "int-behavioral",
      stage: "interview",
      title: "Behavioral round",
      goal: "Tell your stories out loud, on time, saying I and not we.",
      time: "2 hrs a week for 2 weeks",
      checklist: [
        "Read the Leadership and Drive guide.",
        "Watch the three picked videos in order.",
        "Tell each story from your story bank out loud in under 3 minutes.",
        "Record one and listen for vague team language."
      ],
      links: [{kind: "topic", slug: "behavioral"}, {kind: "playbook", id: "interviews"}],
      roundPicks: ["behavioral"],
      keywords: [
        "behavioral",
        "behavioral questions",
        "behavorial",
        "behavioural",
        "star method",
        "leadership",
        "amazon leadership principles",
        "tell me about yourself"
      ]
    },
    {
      id: "int-more-rounds",
      stage: "interview",
      title: "Cover the other rounds your companies use",
      goal: "Prepare for strategy, estimation, or technical rounds only where your targets ask for them.",
      time: "2 hrs per round type",
      checklist: [
        "Check which rounds each target uses in the Interview Basics company videos or the Aced company guides.",
        "For each round you need, read its guide and watch its picked videos.",
        "Practice one question per round out loud."
      ],
      links: [
        {kind: "topic", slug: "strategy"},
        {kind: "topic", slug: "estimation"},
        {kind: "topic", slug: "technical"}
      ],
      roundPicks: ["strategy", "estimation", "technical"],
      keywords: [
        "strategy",
        "product strategy",
        "estimation",
        "market sizing",
        "technical",
        "system design",
        "ai",
        "guesstimate"
      ]
    },
    {
      id: "int-mocks",
      stage: "interview",
      title: "Do live mock interviews",
      goal: "Get real reps with a real person every week.",
      time: "2 mocks a week",
      checklist: [
        "Book free peer mocks on Aced. The free plan includes 5 a month.",
        "Find a weekly mock partner in Product Haven Slack and trade sessions.",
        "Use PMF Labs for extra reps between live mocks.",
        "After each mock, write the one thing you will fix next time."
      ],
      links: [
        {kind: "resource", title: "Aced (formerly Exponent)"},
        {kind: "resource", title: "Product Haven Slack"},
        {kind: "resource", title: "PMF Labs"}
      ],
      touchpoint: {
        kind: "mock-interview",
        where: "presidency",
        label: "Mock interview with an officer",
        detail: "Ask an officer for a mock, or come to a PMA event where we run them. Bring a round type you want to work on."
      },
      keywords: ["mock interview", "practice interview", "peer mock", "aced", "exponent"]
    },
    {
      id: "offer-company-prep",
      stage: "offer",
      title: "Prep for a specific company",
      goal: "Walk in knowing how that company runs its loop.",
      time: "2 hrs the week before",
      checklist: [
        "Watch that company's process video in Interview Basics (Google, Meta, or OpenAI) or read its Aced company guide.",
        "Rehearse your why this company answer.",
        "Prepare two questions to ask your interviewer."
      ],
      links: [
        {kind: "topic", slug: "basics"},
        {kind: "resource", title: "Aced (formerly Exponent)"},
        {kind: "video", youtubeId: "UBpO2CV0C7A", topic: "basics"}
      ],
      keywords: ["google interview", "meta interview", "openai interview", "questions to ask"]
    },
    {
      id: "offer-final-rounds",
      stage: "offer",
      title: "Get ready for final rounds",
      goal: "Polish with an expert right before your last loop.",
      time: "1 week",
      checklist: [
        "Use the Leland+ coaching credit for a mock with a coach who worked at that company.",
        "Do one full practice loop back to back to build stamina.",
        "The night before, reread your story bank and the guide for each round. Then sleep."
      ],
      links: [{kind: "resource", title: "Leland+"}, {kind: "resource", title: "Aced (formerly Exponent)"}],
      touchpoint: {
        kind: "mock-interview",
        where: "presidency",
        label: "Final round mock with an officer",
        detail: "Tell us the company and the date. If an officer has done that loop, we will try to pair you."
      },
      keywords: ["final round", "onsite", "superday"]
    },
    {
      id: "offer-decide",
      stage: "offer",
      title: "Handle the offer",
      goal: "Make a calm decision, even with a short deadline.",
      time: "1 to 2 hrs",
      checklist: [
        "Write down the deadline, then ask the recruiter politely if you need more time.",
        "Tell your other companies you have an offer and ask whether they can speed up.",
        "Talk it through with an officer or mentor before you sign."
      ],
      links: [{kind: "playbook", id: "applications"}],
      touchpoint: {
        kind: "coffee-chat",
        where: "presidency",
        label: "Talk through the offer",
        detail: "Officers have been where you are. A 20 minute chat can save a week of stress."
      },
      keywords: ["offer", "deadline", "negotiation"]
    },
    {
      id: "offer-pay-forward",
      stage: "offer",
      title: "Thank people and pay it forward",
      goal: "Close the loop with everyone who helped and help the next person in.",
      time: "1 hr, then 1 mock a month",
      checklist: [
        "Thank every referrer and coffee chat contact with the news.",
        "Watch How I Use AI as a Product Manager before your first day.",
        "Offer to run a mock interview for a younger PMA member."
      ],
      links: [
        {kind: "video", youtubeId: "kHe4X7TZGtM", topic: "breaking-in"},
        {kind: "resource", title: "Coffee Chat Guide"}
      ],
      touchpoint: {
        kind: "mock-interview",
        where: "presidency",
        label: "Become a mock interviewer",
        detail: "Tell an officer you are open to running mocks. This is how the club keeps working."
      }
    }
  ],
  roundPicks: [
    {
      topic: "basics",
      label: "Every round",
      videos: [
        {youtubeId: "_4vhjxOuA-A", role: "Watch first", note: "What interviewers are grading."},
        {youtubeId: "6RsJbuvZD3I", role: "Watch this week", note: "How to show product vision in any round."},
        {
          youtubeId: "6i_--b3S6jc",
          role: "Rewatch the night before",
          note: "One structure that works for any question."
        }
      ]
    },
    {
      topic: "product-sense",
      label: "Product sense",
      videos: [
        {youtubeId: "6i_--b3S6jc", role: "Watch first", note: "One structure for any PM question, in 5 minutes."},
        {youtubeId: "BNuRsv_42jc", role: "Watch this week", note: "A full Google round, start to finish."},
        {
          youtubeId: "oGqz-TMQNR4",
          role: "Watch next",
          note: "A Meta design question, so you see a second style."
        }
      ]
    },
    {
      topic: "execution",
      label: "Analytical and execution",
      videos: [
        {youtubeId: "jEpwNaHjD68", role: "Watch first", note: "How A/B tests work, in 4 minutes."},
        {youtubeId: "ZwrRJlhJBrE", role: "Watch this week", note: "How to pick a north star metric."},
        {
          youtubeId: "3Qx9cVRJ06I",
          role: "Watch next",
          note: "A full round with goal setting and a metric drop."
        }
      ]
    },
    {
      topic: "behavioral",
      label: "Behavioral",
      videos: [
        {youtubeId: "p8JTbk5UoFM", role: "Watch first", note: "How to build your story bank."},
        {youtubeId: "6p1m2nCE7jE", role: "Watch this week", note: "The principles Amazon grades every story against."},
        {youtubeId: "XQE9kbKu2WQ", role: "Watch next", note: "A full behavioral answer about pushing for a user."}
      ]
    },
    {
      topic: "strategy",
      label: "Product strategy",
      videos: [
        {youtubeId: "nbB1H6XpPuU", role: "Watch first", note: "A full strategy round on a real growth problem."},
        {youtubeId: "BQhF1oXDpjw", role: "Watch this week", note: "A market entry question, start to finish."},
        {youtubeId: "OUyjQOj83Uw", role: "Watch next", note: "A full Airbnb growth round."}
      ]
    },
    {
      topic: "estimation",
      label: "Estimation",
      videos: [
        {youtubeId: "geeyxZ53lvM", role: "Watch first", note: "A clean Google estimation round."},
        {youtubeId: "XPmtaPHnca8", role: "Watch this week", note: "Same skill, different company."},
        {youtubeId: "o_vG-CtqbGI", role: "Watch next", note: "A longer one with more assumptions to defend."}
      ]
    },
    {
      topic: "technical",
      label: "Technical",
      videos: [
        {youtubeId: "2DoAXRBKbUI", role: "Watch first", note: "The one public technical mock. Pair it with the round guide."}
      ]
    }
  ],
  tracks: [
    {
      id: "two-year",
      label: "2 years",
      who: "Freshmen and sophomores who are curious about PM.",
      promise: "Small steps each month. By the time applications open, you will have a project, a resume, a network, and reps.",
      unit: "month",
      phases: [
        {
          when: "Months 1 to 2",
          start: 1,
          end: 2,
          steps: ["explore-what-pm-does", "explore-recruiting", "explore-officer-chat", "explore-community"]
        },
        {
          when: "Months 3 to 4",
          start: 3,
          end: 4,
          steps: ["explore-product-opinion", "exp-pick-path", "exp-pm-your-role"]
        },
        {when: "Months 5 to 9", start: 5, end: 9, steps: ["exp-ship-project", "exp-hackathon"]},
        {
          when: "Months 10 to 12",
          start: 10,
          end: 12,
          steps: ["exp-document", "story-resume", "story-resume-review"]
        },
        {
          when: "Months 13 to 15",
          start: 13,
          end: 15,
          steps: ["net-targets", "net-find-people", "story-tell-me", "int-basics"]
        },
        {
          when: "Months 16 to 19",
          start: 16,
          end: 19,
          steps: ["net-touch-one", "story-bank", "int-product-sense", "story-why-company"]
        },
        {
          when: "Months 20 to 21",
          start: 20,
          end: 21,
          steps: ["apply-alerts", "apply-kit", "net-touch-two", "int-behavioral", "int-execution"]
        },
        {
          when: "Months 22 to 24",
          start: 22,
          end: 24,
          steps: ["apply-day-one", "apply-no-interviews", "int-more-rounds", "int-mocks"]
        },
        {
          when: "When interviews land",
          start: null,
          end: null,
          steps: ["offer-company-prep", "offer-final-rounds", "offer-decide", "offer-pay-forward"]
        }
      ],
      optional: ["exp-hackathon", "exp-pm-your-role", "apply-no-interviews"]
    },
    {
      id: "one-year",
      label: "1 year",
      who: "Students who know they want PM and are about a year from applying.",
      promise: "A month by month plan that lands your experience, resume, and referrals before August.",
      unit: "month",
      phases: [
        {
          when: "Month 1",
          start: 1,
          end: 1,
          steps: ["explore-recruiting", "explore-officer-chat", "exp-pick-path"]
        },
        {
          when: "Months 2 to 3",
          start: 2,
          end: 3,
          steps: ["exp-ship-project", "exp-pm-your-role", "story-resume"]
        },
        {
          when: "Month 4",
          start: 4,
          end: 4,
          steps: ["exp-document", "story-resume-review", "net-targets", "explore-community"]
        },
        {
          when: "Months 5 to 7",
          start: 5,
          end: 7,
          steps: ["net-find-people", "net-touch-one", "story-tell-me", "story-bank"]
        },
        {
          when: "Month 8",
          start: 8,
          end: 8,
          steps: ["int-basics", "int-product-sense", "story-why-company", "apply-alerts"]
        },
        {
          when: "Month 9",
          start: 9,
          end: 9,
          steps: ["apply-kit", "net-touch-two", "int-behavioral", "int-execution"]
        },
        {
          when: "Months 10 to 12",
          start: 10,
          end: 12,
          steps: ["apply-day-one", "apply-no-interviews", "int-more-rounds", "int-mocks"]
        },
        {
          when: "When interviews land",
          start: null,
          end: null,
          steps: ["offer-company-prep", "offer-final-rounds", "offer-decide", "offer-pay-forward"]
        }
      ],
      optional: ["exp-pm-your-role", "explore-community", "apply-no-interviews"]
    },
    {
      id: "sixty-day",
      label: "60 days",
      who: "Students with interviews coming up, or applications going out now.",
      promise: "Interview prep first. Three videos per round, not sixteen, and a real person to practice with.",
      unit: "week",
      phases: [
        {
          when: "Week 1",
          start: 1,
          end: 1,
          steps: ["int-basics", "story-tell-me", "int-mocks"],
          note: "Book your first live mock now, for week 3."
        },
        {when: "Week 2", start: 2, end: 2, steps: ["int-product-sense", "story-bank"]},
        {when: "Week 3", start: 3, end: 3, steps: ["int-behavioral", "story-why-company"]},
        {when: "Week 4", start: 4, end: 4, steps: ["int-execution"]},
        {when: "Week 5", start: 5, end: 5, steps: ["int-more-rounds"]},
        {
          when: "Weeks 6 to 7",
          start: 6,
          end: 7,
          steps: ["offer-company-prep"],
          note: "Keep doing 2 live mocks a week."
        },
        {when: "Week 8", start: 8, end: 8, steps: ["offer-final-rounds"]},
        {when: "Week 9", start: 9, end: 9, steps: ["offer-decide", "offer-pay-forward"]}
      ],
      sideLane: {
        label: "Still applying?",
        when: "Weeks 1 to 2",
        steps: ["story-resume", "story-resume-review", "apply-alerts", "apply-day-one", "net-touch-two"]
      },
      fastLane: {
        label: "First round in 7 days",
        days: [
          {
            day: "Day 1",
            do: "Watch the three Every round videos and your company's process video.",
            steps: ["int-basics", "offer-company-prep"]
          },
          {
            day: "Day 2",
            do: "Read the guide for your round and watch its first two picks.",
            steps: ["int-product-sense"]
          },
          {
            day: "Day 3",
            do: "Answer two questions for that round out loud with a timer.",
            steps: ["int-product-sense"]
          },
          {
            day: "Day 4",
            do: "Write your tell me about yourself and your three strongest stories.",
            steps: ["story-tell-me", "story-bank"]
          },
          {day: "Day 5", do: "Do one live mock with an officer or an Aced peer.", steps: ["int-mocks"]},
          {
            day: "Day 6",
            do: "Rehearse why this company and pick two questions to ask.",
            steps: ["offer-company-prep"]
          },
          {
            day: "Day 7",
            do: "Rewatch The Perfect Structure for a PM Interview and reread the round guide. Then rest.",
            steps: ["int-basics"]
          }
        ]
      },
      timeOverrides: {
        "int-product-sense": "5 hrs this week",
        "int-behavioral": "3 hrs this week",
        "int-execution": "4 hrs this week",
        "int-more-rounds": "2 hrs per round you need",
        "story-bank": "3 hrs this week",
        "story-resume": "2 hrs",
        "story-resume-review": "Send it this week",
        "net-touch-two": "1 hr this week",
        "int-mocks": "2 mocks a week from week 3"
      },
      optional: ["int-more-rounds"]
    }
  ]
};
