export interface LibraryVideo {
  youtubeId: string;
  title: string;
  minutes: number;
  fromCourse?: boolean;
}

export interface InterviewGuide {
  tests: string;
  where: string;
  approach: string[];
  works: string[];
  hurts: string[];
}

export interface VideoTopic {
  slug: string;
  title: string;
  description: string;
  guide?: InterviewGuide;
  videos: LibraryVideo[];
}

// fromCourse videos are unlisted lessons from the Aced (formerly Exponent) PM course.
export const VIDEO_LIBRARY: VideoTopic[] = [
  {
    slug: "basics",
    title: "Interview Basics",
    description: "How PM interviews are structured and graded",
    videos: [
      { youtubeId: "3g0wKol8vR4", title: "Types of PM Interview Questions", minutes: 3, fromCourse: true },
      { youtubeId: "iIGH1gmpPF8", title: "PM Interview Framework", minutes: 4, fromCourse: true },
      { youtubeId: "6i_--b3S6jc", title: "The Perfect Structure for a PM Interview", minutes: 5 },
      { youtubeId: "_4vhjxOuA-A", title: "PM Interview Rubric: What to Expect", minutes: 5 },
      { youtubeId: "6RsJbuvZD3I", title: "How to Show Product Vision in a PM Interview", minutes: 4 },
      { youtubeId: "UBpO2CV0C7A", title: "Questions to Ask Your PM Interviewer", minutes: 2 },
      { youtubeId: "kMDkoDGbqwo", title: "Google PM Interview Guide", minutes: 6 },
      { youtubeId: "_fhphljJBNo", title: "The Meta PM Interview Process", minutes: 6 },
      { youtubeId: "C1PJ8832g7o", title: "OpenAI PM Interview Process and Questions", minutes: 6 },
      { youtubeId: "K68jNEFKTt8", title: "Introduction to Take Home Assignments", minutes: 1, fromCourse: true },
    ],
  },
  {
    slug: "product-sense",
    title: "Product Sense",
    description: "Design and improve a product for a specific user",
    guide: {
      tests: "Whether you can find a real user problem and design something that solves it. Interviewers grade how you make choices, not how clever the final idea is.",
      where: "Meta (Product Sense), Google (Product Design), Microsoft, and almost every APM loop. The favorite product question is a short version of this round.",
      approach: [
        "Clarify the goal and any constraints, then state what the product is for.",
        "List a few user segments, pick one, and say why.",
        "Walk through that user's day and name their biggest pain points. Prioritize one or two.",
        "Brainstorm three or four solutions, including one bold one, then pick one with clear criteria.",
        "Close with how you'd measure success and the biggest risk.",
      ],
      works: [
        "Making a clear choice at every step and explaining it.",
        "Tying every feature back to the user and pain point you picked.",
        "Summarizing as you go so the interviewer can follow.",
      ],
      hurts: [
        "Jumping to features before choosing a user.",
        "Designing for everyone at once.",
        "Listing ideas without committing to one.",
        "Running out of time before metrics and risks.",
      ],
    },
    videos: [
      { youtubeId: "s4BtFrDZL5Q", title: "Introduction to Product Sense Questions", minutes: 2, fromCourse: true },
      { youtubeId: "Gj9uioQ6pP8", title: "The Favorite Product Question", minutes: 4, fromCourse: true },
      { youtubeId: "LklG8VFZoCc", title: "Picking Your Favorite Product", minutes: 5, fromCourse: true },
      { youtubeId: "pymHNWlURMc", title: "Favorite Product: Having a Perspective", minutes: 3, fromCourse: true },
      { youtubeId: "mpnTRz8Sask", title: "Improving the Product", minutes: 3, fromCourse: true },
      { youtubeId: "TtK_WIU4saM", title: "Mock: What's Your Favorite Product?", minutes: 3, fromCourse: true },
      { youtubeId: "x2s4palTPA0", title: "Mock: Improve Zillow", minutes: 46, fromCourse: true },
      { youtubeId: "F03mbz0MARI", title: "Mock: Design Facebook Movies, with Hiring Evaluation", minutes: 41, fromCourse: true },
      { youtubeId: "drDL4ac1_fA", title: "Mock: Improve Headspace", minutes: 25, fromCourse: true },
      { youtubeId: "aaZ9kLnENVk", title: "Mock: Design an Amusement Park App", minutes: 35, fromCourse: true },
      { youtubeId: "GVCHbwjEzeU", title: "Mock: Vibe Code a Crypto App", minutes: 58, fromCourse: true },
      { youtubeId: "yNIiAXYegv4", title: "Mock: Improve a Product, then Vibe Code an MVP", minutes: 78, fromCourse: true },
      { youtubeId: "e0Nj_eYDj2s", title: "Google PM Mock: Improve WhatsApp", minutes: 44 },
      { youtubeId: "se6Soyi2k0U", title: "Meta PM Mock: Facebook Movies", minutes: 31 },
      { youtubeId: "O0K2gkCSy4o", title: "Meta PM Mock: Design a Fitness App", minutes: 29 },
      { youtubeId: "Axa7gx1lKqA", title: "Microsoft PM Mock: Design a Fridge for Kids", minutes: 30 },
      { youtubeId: "CR8Niz9DrWU", title: "Amazon PM Mock: Solving Pain Points", minutes: 23 },
      { youtubeId: "35mpatocpYI", title: "Meta PM Mock: Design an Audio Product", minutes: 31 },
      { youtubeId: "CXdaPETE7iE", title: "PM Mock: Improve Google Maps", minutes: 24 },
      { youtubeId: "vm5QLIiKbmI", title: "APM Mock: Favorite Product", minutes: 30 },
      { youtubeId: "1dj0zA7jlGc", title: "PM Mock: Improve Spotify's Social Features", minutes: 25 },
      { youtubeId: "CGS_UCTtvlY", title: "PM Mock: Improve Instagram Stories", minutes: 26 },
      { youtubeId: "qTcXXGJiunA", title: "Google PM Mock: Design for Rush Hour Drivers", minutes: 41 },
      { youtubeId: "RBZSFKJkUKE", title: "PM Mock: Improve Air Travel", minutes: 41 },
      { youtubeId: "aJxiSYiNwXk", title: "PM Mock: Design a Product for Moving Cities", minutes: 45 },
      { youtubeId: "9fa1vZT1zdQ", title: "Google PM Mock: A Bad Product Experience", minutes: 31 },
    ],
  },
  {
    slug: "strategy",
    title: "Product Strategy",
    description: "Market entry, growth, competition, and go to market",
    guide: {
      tests: "Business judgment: where a company should play, how it wins against competitors, and how it grows.",
      where: "Google, senior PM loops, and AI labs. Strategy also shows up as follow ups inside product sense rounds.",
      approach: [
        "Clarify the objective and time horizon. Growth, revenue, and defense lead to different answers.",
        "Start from the company's strengths, mission, and current goals.",
        "Size up the market, the users, and the competitors. A simple lens like company, customer, competition is enough.",
        "Lay out two or three options and compare them on impact, cost, and fit.",
        "Recommend one, name the main risk, and say what you'd test first.",
      ],
      works: [
        "Committing to a recommendation.",
        "Using rough numbers to size options.",
        "Saying what you'd need to validate before betting big.",
      ],
      hurts: [
        "Reciting a framework without adapting it to the question.",
        "Ignoring what the company is actually good at.",
        "Ending without a recommendation.",
        "Forgetting how competitors would respond.",
      ],
    },
    videos: [
      { youtubeId: "I8DYYpeLMWA", title: "Introduction to Product Strategy", minutes: 1, fromCourse: true },
      { youtubeId: "NiwhhZc2488", title: "Mock: Increase Airbnb Bookings", minutes: 32, fromCourse: true },
      { youtubeId: "gOynEbcTbRs", title: "Mock: Double Grammarly's Paid Subscribers", minutes: 43, fromCourse: true },
      { youtubeId: "kFwJdSwjFtU", title: "Mock: Build an AI Career Coach", minutes: 35, fromCourse: true },
      { youtubeId: "2JPbfSreEFs", title: "Mock: Food Delivery Time Increase", minutes: 20, fromCourse: true },
      { youtubeId: "mMQWzi8lv28", title: "Mock: Should Samsung Enter Gaming Consoles?", minutes: 29, fromCourse: true },
      { youtubeId: "Z83a6Qc2ETQ", title: "Mock: Biggest Threat to YouTube", minutes: 36, fromCourse: true },
      { youtubeId: "9jSKO_RJPMc", title: "Mock: Google Rideshare Market Entry", minutes: 13, fromCourse: true },
      { youtubeId: "psNKULiE_cU", title: "Mock: Should Apple Make Modular Phones?", minutes: 14, fromCourse: true },
      { youtubeId: "Impwn4rCMKo", title: "Google Strategy Mock: Photo Storage", minutes: 34 },
      { youtubeId: "nbB1H6XpPuU", title: "Netflix PM Mock: Inactive Users", minutes: 22 },
      { youtubeId: "B6RR2IXQ99o", title: "Google PM Mock: Facebook Messaging Strategy", minutes: 31 },
      { youtubeId: "BQhF1oXDpjw", title: "Google PM Mock: Google Maps Korea Launch", minutes: 22 },
    ],
  },
  {
    slug: "execution",
    title: "Analytical and Execution",
    description: "Metrics, goals, A/B tests, and root cause analysis",
    guide: {
      tests: "Whether you can define success with data and make good decisions when the numbers move.",
      where: "Meta (Analytical and Execution), Google, and most consumer tech loops.",
      approach: [
        "Goal setting: start from what the product is for, then pick one north star metric plus a few supporting and guardrail metrics.",
        "Root cause: clarify how the metric is defined and when it moved, and rule out tracking or data bugs first.",
        "Segment the drop by platform, region, user type, and new versus existing users.",
        "Check internal causes like launches and outages, then external ones like seasonality, competitors, and news.",
        "End with your leading hypothesis, how you'd confirm it, and what you'd do next.",
      ],
      works: [
        "Metrics tied to real user value, not vanity counts.",
        "A clear, ordered way of narrowing down causes.",
        "Making a call even with incomplete data.",
      ],
      hurts: [
        "Listing a dozen metrics without prioritizing.",
        "Guessing at causes without narrowing first.",
        "Forgetting guardrail metrics in A/B tests.",
        "Never reaching a decision.",
      ],
    },
    videos: [
      { youtubeId: "Gu8v_4CRJLY", title: "Introduction to Analytical and Execution Questions", minutes: 1, fromCourse: true },
      { youtubeId: "mM73xLRKjEc", title: "Mock: Set Facebook Marketplace Goals", minutes: 24, fromCourse: true },
      { youtubeId: "QyjzRryv9Ns", title: "Mock: Diagnose a Nike Conversion Decline", minutes: 25, fromCourse: true },
      { youtubeId: "AAw7gBdZSrE", title: "Mock: Diagnose a TikTok Usage Decline", minutes: 16, fromCourse: true },
      { youtubeId: "iOhtUKSLRX8", title: "Mock: LinkedIn Events Success Metrics", minutes: 21, fromCourse: true },
      { youtubeId: "15cql5yi4J8", title: "Mock: Instagram Reels Success Metrics", minutes: 24, fromCourse: true },
      { youtubeId: "6lCt8E0pkX8", title: "Mock: A/B Test Google Maps", minutes: 22, fromCourse: true },
      { youtubeId: "c98HnEzVjCw", title: "Mock: Optimize Newsfeed Photo Count", minutes: 25, fromCourse: true },
      { youtubeId: "DSV-vuvmIro", title: "Flipkart PM Mock: Root Cause Analysis", minutes: 26 },
      { youtubeId: "_FANcClDHa8", title: "Meta PM Mock: Facebook Marketplace Metrics", minutes: 24 },
      { youtubeId: "l8s9_ScogCk", title: "Google PM Mock: YouTube Watch Time Drop", minutes: 24 },
      { youtubeId: "nhnkv-wvyjA", title: "PM Mock: Measure Success for Facebook Events", minutes: 28 },
      { youtubeId: "4Qm3S4tQqtU", title: "Meta PM Mock: Friend Requests Down 10%", minutes: 20 },
      { youtubeId: "YgIIFAmzNbA", title: "Meta PM Mock: Instagram Viewership Drop", minutes: 45 },
      { youtubeId: "VW-GTFmrXyQ", title: "Google PM Mock: Define TikTok Success", minutes: 23 },
      { youtubeId: "u9oTvRk4ziw", title: "Meta PM Mock: Comments and Reactions", minutes: 29 },
      { youtubeId: "vApI2SSxxUA", title: "Google PM Mock: Prioritization", minutes: 17 },
      { youtubeId: "ZwrRJlhJBrE", title: "How to Set a North Star Metric", minutes: 5 },
      { youtubeId: "jEpwNaHjD68", title: "How to A/B Test a Product", minutes: 4 },
    ],
  },
  {
    slug: "estimation",
    title: "Estimation",
    description: "Market sizing and back of the envelope math",
    guide: {
      tests: "Structured thinking with numbers under pressure. The exact answer matters much less than the logic.",
      where: "Less common as its own round now. It still appears at Google, Uber, and startups, and inside strategy questions.",
      approach: [
        "Clarify exactly what you're estimating and the units.",
        "Pick an approach: top down from a population, or bottom up from units and usage.",
        "State each assumption out loud with round numbers.",
        "Calculate step by step where the interviewer can see it.",
        "Sanity check the result against something you know.",
      ],
      works: [
        "A written structure the interviewer can follow.",
        "Assumptions that are explained and easy to adjust.",
        "Checking the final number out loud.",
      ],
      hurts: [
        "Doing the math silently.",
        "False precision with decimals.",
        "Skipping the sanity check.",
        "Getting stuck debating one assumption.",
      ],
    },
    videos: [
      { youtubeId: "UAjHAzNPilU", title: "Google PM Mock: Estimate Pixel Phone Storage", minutes: 48 },
      { youtubeId: "XPmtaPHnca8", title: "Uber PM Mock: Estimate Drivers in SF", minutes: 14 },
      { youtubeId: "o_vG-CtqbGI", title: "PM Mock: Estimate Bandwidth for Students", minutes: 26 },
    ],
  },
  {
    slug: "behavioral",
    title: "Leadership and Drive",
    description: "Behavioral stories, introductions, and why this company",
    guide: {
      tests: "How you've actually worked: ownership, leadership, conflict, failure, and whether the team would want to work with you.",
      where: "Every loop. Amazon grades against its Leadership Principles, and Google calls it Googleyness and Leadership.",
      approach: [
        "Build a story bank of six to eight stories: leading a project, a conflict, a failure, influencing without authority, and something you shipped.",
        "Tell each one with a simple structure like situation, task, action, result. Spend most of the time on your actions.",
        "Give real numbers for the result and say what you learned.",
        "Prepare tell me about yourself, why PM, and why this company before anything else.",
      ],
      works: [
        "Saying I, not we, and naming your specific decisions.",
        "Real tradeoffs and real numbers.",
        "Honest failures with a clear lesson.",
      ],
      hurts: [
        "Vague team stories where your role is unclear.",
        "Long setup with a rushed ending.",
        "Failure stories that are really humble brags.",
        "A generic why this company answer.",
      ],
    },
    videos: [
      { youtubeId: "b3QpYIFXCWg", title: "Introduction to Leadership and Drive", minutes: 2, fromCourse: true },
      { youtubeId: "fFQDNSj9KFM", title: "Introducing Yourself: Do's and Don'ts", minutes: 10, fromCourse: true },
      { youtubeId: "UKVEY7Hu3mw", title: "Why Our Company: The Good, the Bad, and the Ugly", minutes: 6, fromCourse: true },
      { youtubeId: "seG-ZLNYHrI", title: "Mock: Why Google?", minutes: 9, fromCourse: true },
      { youtubeId: "k30vN_tO9Sg", title: "Mock: Making Short Term Sacrifices", minutes: 5, fromCourse: true },
      { youtubeId: "4hT8IwUa2Cw", title: "Mock: Leading a Product From Start to Finish", minutes: 53, fromCourse: true },
      { youtubeId: "3OF2LAlUyN0", title: "Mock: Amazon Behavioral, with Hiring Manager Evaluation", minutes: 25, fromCourse: true },
      { youtubeId: "0chymwsg2kc", title: "Principal AI PM Mock: How Innovative Are You?", minutes: 62, fromCourse: true },
      { youtubeId: "6p1m2nCE7jE", title: "Amazon Leadership Principles Explained", minutes: 12 },
      { youtubeId: "p8JTbk5UoFM", title: "Building a Behavioral Story Bank", minutes: 3 },
      { youtubeId: "jXWs8D0u6B0", title: "PM Mock: Conflicting Product Requirements", minutes: 43 },
      { youtubeId: "XQE9kbKu2WQ", title: "PM Mock: Advocating for a New Feature", minutes: 14 },
    ],
  },
  {
    slug: "technical",
    title: "Technical",
    description: "How products work under the hood",
    guide: {
      tests: "Whether you can work credibly with engineers: how systems fit together and what the tradeoffs are. It is not a coding test.",
      where: "Google, Microsoft, technical PM roles, and AI labs, where AI fluency questions are becoming standard.",
      approach: [
        "Clarify scope and who the users are.",
        "Sketch the main pieces: client, server, database, and the APIs between them.",
        "Walk one request through the system end to end.",
        "Discuss tradeoffs in speed, cost, reliability, and scale. For AI products, add model choice, evals, and latency.",
        "Connect each technical choice back to user impact.",
      ],
      works: [
        "Plain language explanations.",
        "Being honest about where your knowledge stops.",
        "Tying tradeoffs to what users would notice.",
      ],
      hurts: [
        "Buzzwords you can't explain.",
        "Going deep on one component and never finishing.",
        "Forgetting the user entirely.",
      ],
    },
    videos: [
      { youtubeId: "4BRni4hfdB4", title: "Introduction to Technical Questions", minutes: 1, fromCourse: true },
      { youtubeId: "2d3iNydNghs", title: "Mock: How Google Docs Works", minutes: 33, fromCourse: true },
      { youtubeId: "cMKDpzYIZTk", title: "Mock: How Autonomous Vehicles Work", minutes: 19, fromCourse: true },
      { youtubeId: "1Yb2jIf-Gr0", title: "Mock: Design a URL Shortener", minutes: 10, fromCourse: true },
      { youtubeId: "2DoAXRBKbUI", title: "PM Mock: How to Manage AI Risks", minutes: 38 },
    ],
  },
  {
    slug: "breaking-in",
    title: "Breaking Into PM",
    description: "Internships, APM programs, resumes, and the job itself",
    videos: [
      { youtubeId: "ufFfq-t6-xg", title: "Get Into Top APM Programs", minutes: 7 },
      { youtubeId: "hZwv04OIV3A", title: "How to Get a PM Internship", minutes: 6 },
      { youtubeId: "332v0mv7flY", title: "How to Write a PM Resume", minutes: 12 },
      { youtubeId: "7ALVChUtyf8", title: "Breaking Into PM Without Experience", minutes: 4 },
      { youtubeId: "U-lYLSlYU1o", title: "A Day in the Life of a PM", minutes: 5 },
      { youtubeId: "kHe4X7TZGtM", title: "How I Use AI as a Product Manager", minutes: 29 },
    ],
  },
];
