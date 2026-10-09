// Hardcoded until resources can be edited in Supabase again.

export type ResourceIcon = "BookOpen" | "Video" | "Briefcase" | "Users" | "Cpu";

export interface CuratedResource {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  tips: string[];
  isPaid?: boolean;
  isFeatured?: boolean;
}

export interface ResourceCategory {
  slug: string;
  title: string;
  description: string;
  icon: ResourceIcon;
  color: string;
  resources: CuratedResource[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    slug: "resume-interview",
    title: "PM Interview Prep",
    description: "What our officers used to land PM offers at Google and beyond",
    icon: "BookOpen",
    color: "from-primary to-primary/80",
    resources: [
      {
        title: "Aced (formerly Exponent)",
        description:
          "The prep platform our officers used to land PM offers. Use it once you know the basics and want reps on real PM questions with peers.",
        url: "https://www.aced.io/questions?role=pm",
        tips: [
          "Filter the question bank to PM and answer out loud before reading the sample answers.",
          "The free plan includes 5 peer mock interviews a month at aced.io/practice. The 8 AM and 6 PM Pacific slots fit a Utah schedule.",
          "Read the company guide (Google, Meta, and others) the week before that interview.",
        ],
        isFeatured: true,
      },
      {
        title: "Cracking the PM Interview",
        description:
          "The standard introduction to PM recruiting by Gayle McDowell and Jackie Bavaro. Read it first, before you start mock interviews.",
        url: "https://www.crackingthepminterview.com",
        tips: [
          'Draft and rehearse your "tell me about yourself" pitch from the behavioral chapters early. It opens almost every interview.',
          "For estimation questions, state your assumptions, break the problem into parts, and do the math out loud.",
          "About $19 for the paperback on Amazon.",
        ],
      },
      {
        title: "Decode and Conquer",
        description:
          "Lewis Lin's tactical interview book. More hands on than Cracking the PM Interview and best for product design questions using the CIRCLES method.",
        url: "https://www.lewis-lin.com/decode-and-conquer/",
        tips: [
          "Study how the sample answers are structured instead of memorizing them.",
          "Get the 5th edition. It is a full rewrite of the older versions.",
          "Buy a copy sold by Amazon itself. Counterfeit copies from third party sellers are common.",
        ],
      },
      {
        title: "PMF Labs",
        description:
          "AI mock interviewer for real PM interview questions with scored feedback. PMA partner: members get 90 free minutes and 75% off.",
        url: "https://www.pmflabs.ai",
        imageUrl: "/assets/pmflabs.jpg",
        tips: [
          "Use it for extra reps between live peer mocks.",
          "Create your account with your BYU email so the member code works.",
        ],
        isPaid: true,
      },
      {
        title: "Leland+",
        description:
          "Recruiting content and one on one coaching from working PMs. PMA partner: members get a $50 coaching credit.",
        url: "https://start.joinleland.com/campus-race",
        imageUrl: "/assets/leland.png",
        tips: [
          "Save the credit for a mock interview or resume review right before your final rounds.",
          "Pick a coach who has worked at the company you are interviewing with.",
        ],
        isPaid: true,
      },
    ],
  },
  {
    slug: "mock-interviews",
    title: "Mock Interview Videos",
    description: "Watch real PM mocks for each question type before you do your own",
    icon: "Video",
    color: "from-primary to-secondary",
    resources: [
      {
        title: "Google PM Mock: Improve Headspace",
        description:
          "Product sense. A Google and Coinbase PM walks through the classic structure: clarify, pick users, find pain points, propose solutions. From the Aced (formerly Exponent) channel.",
        url: "https://www.youtube.com/watch?v=BNuRsv_42jc",
        tips: [
          "Pause after the question and outline your own answer before watching.",
          "Compare how the candidate picks one user segment instead of designing for everyone.",
        ],
      },
      {
        title: "Meta Product Sense Mock: Design a Fitness App",
        description:
          "Product design. The newest mock on this list (2024), by an ex Google PM, following the flow Meta expects: mission, segments, pain points, solutions, metrics.",
        url: "https://www.youtube.com/watch?v=oGqz-TMQNR4",
        tips: [
          "Note how the mission statement shapes every later decision.",
          "Practice the risks follow up at the end. Interviewers almost always ask it.",
        ],
      },
      {
        title: "Airbnb PM Mock: Increase Bookings",
        description:
          "Product strategy and growth. The most watched mock here, covering mission, metrics, users, features, and go to market. From the Aced (formerly Exponent) channel.",
        url: "https://www.youtube.com/watch?v=OUyjQOj83Uw",
        tips: [
          "Pause after the question and write down your top three growth levers first.",
          "Watch how the candidate ties every feature back to one north star metric.",
        ],
      },
      {
        title: "Meta Execution Mock: YouTube Goals and Decline",
        description:
          "Metrics and execution. Covers both halves of Meta's execution round: defining success metrics and diagnosing a drop. From the Aced (formerly Exponent) channel.",
        url: "https://www.youtube.com/watch?v=3Qx9cVRJ06I",
        tips: [
          "Before the candidate answers, list internal and external causes for the decline yourself.",
          "Notice how they rule out data and tracking issues before anything else.",
        ],
      },
      {
        title: "Google Estimation Mock: Paint Market",
        description:
          "Estimation in about 12 minutes, ending with follow up questions and a debrief. From the Aced (formerly Exponent) channel.",
        url: "https://www.youtube.com/watch?v=geeyxZ53lvM",
        tips: [
          "Do the estimate yourself first, then compare your assumptions with the candidate's.",
          "Copy the habit of sanity checking the final number out loud.",
        ],
      },
    ],
  },
  {
    slug: "job-search",
    title: "APM Job Postings",
    description: "Track when APM programs and PM internships open so you apply on day one",
    icon: "Briefcase",
    color: "from-secondary to-secondary/80",
    resources: [
      {
        title: "APM List",
        description:
          "Free table of APM programs and PM internships for the 2027 cycle, updated weekly by Aced, with open and closed status and interview guides.",
        url: "https://apmlist.com",
        tips: [
          "Turn on the free email alert for when full time APM roles open. It does not cover internships.",
          "Most APM and PM internship windows open August through October, and some close within two weeks.",
        ],
        isFeatured: true,
      },
      {
        title: "APM Season",
        description: "Board of APM, PM internship, and rotational roles with salary and visa sponsorship info.",
        url: "https://www.apmseason.com",
        imageUrl: "/assets/apm-season.jpg",
        tips: [
          'Check the "Last Updated" date first. It had not been updated since January 2026 when we checked.',
          "The free weekly digest is enough. Skip the paid alerts unless updates resume.",
        ],
      },
      {
        title: "Simplify Internship List",
        description:
          "Free GitHub list of internships updated daily, with a Product Management section and direct apply links.",
        url: "https://github.com/SimplifyJobs/Summer2027-Internships",
        tips: [
          "Jump to the Product Management section and click Watch on the repo to get notified of new roles.",
          "Looking for full time? The companion New Grad Positions repo has its own PM section.",
        ],
      },
      {
        title: "Jobright",
        description: "AI job matcher that surfaces PM roles you qualify for and tailors your resume to each posting.",
        url: "https://jobright.ai",
        imageUrl: "/assets/jobright.jpg",
        tips: [
          "Set your target role to Product Manager and entry level so matches stay relevant.",
          "Run the resume tailoring before you apply, then edit the output in your own voice.",
        ],
      },
    ],
  },
  {
    slug: "networking",
    title: "Community & Networking",
    description: "Slack communities and coffee chats that lead to referrals",
    icon: "Users",
    color: "from-accent to-accent/80",
    resources: [
      {
        title: "Coffee Chat Guide",
        description:
          "The two touch strategy for turning coffee chats into referrals: build the relationship in spring, ask for the referral in late summer.",
        url: "",
        imageUrl: "/assets/coffee-chat.jpg",
        tips: [
          "Target BYU alumni who are PMs at your target companies first, then non PM alumni there, then non alumni in the role you want.",
          "Spring or early summer: reach out on LinkedIn and ask for 20 minutes to learn about their role. No ask, just build the relationship.",
          "Come with questions about their team, their path to PM, and how their company handles referrals and application dates.",
          "Late summer or early fall: follow up as recruiting opens and ask for a referral. Many companies need it before the application opens.",
          'Send a thank you within 24 hours of every chat. Never lead with "can you refer me?"',
        ],
      },
      {
        title: "Product Haven Slack",
        description:
          "The PM recruiting Slack our officers used while landing offers: community mock interviews, peer practice, and recruiting intel like when APM applications open.",
        url: "https://join.slack.com/t/producthaven/shared_invite/zt-4cp9d3zhg-SCCk6WPCUuznCKPWWu19lQ",
        tips: [
          "Introduce yourself and name the APM programs you are targeting so people can share what they know.",
          "Look for mock interview partners there and trade sessions weekly during recruiting season.",
        ],
      },
      {
        title: "Product School Slack",
        description: "Free PM Slack with over 100,000 members, open to students. Best for job postings and resume feedback.",
        url: "https://productschool.com/slack-community",
        tips: [
          "Turn on notifications for #08_job-portal only and mute everything else.",
          "Post an anonymized resume in #07_resume-review before fall APM deadlines.",
        ],
      },
    ],
  },
  {
    slug: "ai-tools",
    title: "Build with AI",
    description: "Ship a side project to show recruiters you can build",
    icon: "Cpu",
    color: "from-secondary to-accent",
    resources: [
      {
        title: "Cursor",
        description:
          "AI code editor, free for a year for students. Use it to build a real side project you can demo in interviews.",
        url: "https://cursor.com/students",
        imageUrl: "/assets/cursor.jpg",
        tips: [
          "Claim the free student year with your BYU email.",
          "Start small: ship one working feature end to end before adding more.",
        ],
        isFeatured: true,
      },
      {
        title: "Lovable",
        description:
          "Build a working web app by chatting with AI, no coding required. The fastest way to prototype a product idea.",
        url: "https://lovable.dev",
        imageUrl: "/assets/lovable.png",
        tips: [
          "Write a one paragraph product spec first, then paste it in as your first prompt.",
          "Share the live link on your resume or LinkedIn so recruiters can try it.",
        ],
      },
      {
        title: "Claude Code",
        description:
          "Anthropic's AI coding agent that works in your terminal. Use it when your project outgrows no code tools.",
        url: "https://www.claude.com/product/claude-code",
        imageUrl: "/assets/claude-code.jpg",
        tips: [
          "Describe what you want built in plain language and review each change before accepting it.",
          "Pair it with Cursor: plan in Claude Code, polish in the editor.",
        ],
      },
    ],
  },
];
