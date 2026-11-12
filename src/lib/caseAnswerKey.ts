// Content for /events/case-interview/answer-key.
// Copied from the fact checked answer key for Case Interview: Build the Fix with AI (Nov 11, 2026).

export interface CaseStage {
  number: number;
  name: string;
  goal: string;
  questions: string[];
  inThisCase: string;
  watchOut: string;
}

export interface NamedDetail {
  name: string;
  detail: string;
}

export interface Framework {
  name: string;
  oneLine: string;
  url: string;
}

export interface Source {
  title: string;
  url: string;
  publisher: string;
}

export interface CaseAnswerKey {
  title: string;
  intro: string;
  stages: CaseStage[];
  otherRealProblems: NamedDetail[];
  pitfalls: NamedDetail[];
  frameworks: Framework[];
  sources: Source[];
}

export const CASE_ANSWER_KEY: CaseAnswerKey = {
  title: "How to Think Through a Product Case",
  intro: "Every product case, in an interview or at work, follows the same path: understand the goal and the data, find the problems, pick one, scope it, justify it, then do the same thing with solutions, then build and measure. This page walks through that path one stage at a time, with the questions to ask yourself at each step. The worked example is our case, \"Bring students back to Resources,\" where weekly active members on /resources fell from 41 to 23 in four weeks. There is no single magic framework. Use the questions to keep yourself honest, not as a script to recite.",
  stages: [
    {
      number: 1,
      name: "Understand the goal and the data",
      goal: "Know what the team is trying to achieve, exactly what dropped, by how much, and whether the drop is real before you guess why.",
      questions: [
        "What is the goal, and who is this for?",
        "What exactly does the metric count, and who does it leave out?",
        "How much did it fall, and when did it start?",
        "Could this be a tracking bug or a definition change?",
        "Are fewer people arriving, or fewer people coming back?"
      ],
      inThisCase: "The goal is to get existing members using Resources every week again. Weekly active members, the main number this case tracks (its north star), went 41, 33, 30, 23, and those numbers rebuild cleanly from the raw event log, so this is not a tracking bug. New or returning members held steady at 11 to 13 a week, so the drop is existing members not coming back. The metric only counts approved members who saw the unlocked page.",
      watchOut: "Read the metric definition before you read the charts. It tells you which problems can and cannot move this number."
    },
    {
      number: 2,
      name: "Find the problems",
      goal: "List every possible cause, inside and outside the product, with the evidence and the number of people behind each one.",
      questions: [
        "What changed inside the product when the drop started?",
        "What changed outside it, like seasons, events, or other tools?",
        "What do interviews and feedback complain about, and how many people say it?",
        "What did people who left do differently from people who stayed?"
      ],
      inThisCase: "The candidates were failing search (76 of 97 searches returned nothing), the approval lock, long videos, dark mode, the hackathon spike and the game. Comparing groups is what separates them: 24 of the 29 members who stopped coming hit a search with zero results, versus 4 of the 12 members who stayed.",
      watchOut: "Count people, not messages. A complaint repeated eight times by three people is still three people."
    },
    {
      number: 3,
      name: "Pick the problem",
      goal: "Choose one cause using reasons you say out loud: how many people it touches, how much of the drop it explains, and how strong the evidence is.",
      questions: [
        "How many members does this problem touch?",
        "How much of the drop could it explain?",
        "Can this problem even move the metric as defined?",
        "Do the numbers and the quotes tell the same story?",
        "Why does my second choice lose?"
      ],
      inThisCase: "Failed search touched 44 members, and 22 of the 29 members who stopped coming hit a zero result search in their last visit. The approval lock looks bigger, but only 2 of those 29 ever saw it.",
      watchOut: "A big scary number is not the answer until you ask who it actually touches."
    },
    {
      number: 4,
      name: "Scope the problem",
      goal: "Narrow it to one group of users, one moment, and one root cause you can say in a single sentence.",
      questions: [
        "Who exactly has this problem?",
        "What are they trying to do when it happens?",
        "What do they expect, and what actually happens?",
        "What is the real cause, not just the symptom?",
        "What am I deliberately leaving out?"
      ],
      inThisCase: "Members preparing for interviews search phrases like \"case interview\" (13 times) and \"product sense\" (12 times), but search only matches the titles on resource cards, and typing hides the Practice Interviews section on the same page. Owen put it simply: \"I don't know what the officers call things.\"",
      watchOut: "\"There is no X feature\" is a solution wearing a problem costume. A real problem can be fixed more than one way."
    },
    {
      number: 5,
      name: "Justify why this problem",
      goal: "Back your pick with a number you worked out, a user quote, how many people it touches, and a clear reason it beats the runner up.",
      questions: [
        "What number did I work out, and how?",
        "Which quote shows the problem in the user's own words?",
        "How many members does it touch?",
        "What evidence would prove me wrong?"
      ],
      inThisCase: "Members who hit a zero result search came back the next week 19%, 7% and 9% of the time, versus 76%, 89% and 58% for members who did not. Owen: \"We search, we get nothing, we leave.\" That gap shows the two go together, not that one caused the other, so say so out loud.",
      watchOut: "When new evidence shows up, use it to sharpen your reason, not to switch problems. The click log (only 3 of 33 sessions that used the search box clicked a result) backs up search."
    },
    {
      number: 6,
      name: "Do the same with solutions",
      goal: "Come up with two or three truly different fixes, compare how much each helps, how sure you are, and how hard it is, pick one, and name what you are giving up.",
      questions: [
        "Are my ideas truly different, or three versions of one?",
        "Does each idea fix the cause I picked?",
        "How much does each help, and how hard is it?",
        "What am I giving up with my pick?",
        "What is the smallest version that tests it?"
      ],
      inThisCase: "Options include matching interview phrases like \"behavioral\" and \"star method\" to the Practice Interviews content, keeping that section visible when search finds nothing, or rebuilding search from scratch. The first two are small, aim straight at the 76 failed searches, and match the pain Owen described: \"Just show me the stuff.\"",
      watchOut: "Do not build the exact thing a user asks for. Ask what problem sits behind the request, then check the data."
    },
    {
      number: 7,
      name: "Build it and measure it",
      goal: "Ship the smallest working version, then name one number it should move, one guardrail (a number that must not get worse), and a target you set before launch.",
      questions: [
        "What one number should move, and by how much?",
        "What number must not get worse?",
        "Did I set the target before launch?",
        "Could anything else explain the change?",
        "Could this metric actually fail?"
      ],
      inThisCase: "Watch the zero result rate (78% today) and search sessions that end in a click (3 of 33) first, since they move fast. Weekly active members (23) is the main goal, but it moves more slowly. A good guardrail is resource clicks per week, which held at 28 to 33; the fix should not push that down.",
      watchOut: "Recruiting season is ramping up, so a simple before and after comparison can flatter your fix. Compare against the weeks before, and against members who did not search."
    }
  ],
  otherRealProblems: [
    {
      name: "The approval wait (lock screen)",
      detail: "This one is real and painful: 659 of 860 /resources sessions (77%) hit the lock, 136 signed in accounts were locked out, approval took a median of 5.0 days (1 in 10 waited 11 days or more), and the join button drew 54 rage clicks. Anjali said it well: \"the waiting part is where you lose people.\" It is not the cause of this drop, though, because the main metric only counts approved members, and only 2 of the 29 members who stopped coming ever saw the lock. Treat it as a problem for growth and new members. A cheap first step is telling people that approval is done by hand and roughly how long it takes."
    },
    {
      name: "Too many long videos",
      detail: "Practice videos got 67 opens with a median watch time of 23 seconds, and 61% of opens ended in under 60 seconds. Tessa asked to \"show me three videos, not sixteen.\" It is a real problem, but while 11 of the members who stopped coming left a video quickly, only 2 of them never hit a failed search. It makes a good follow up after search is fixed, not the headline."
    },
    {
      name: "Typing a search hides the videos",
      detail: "The Practice Interviews section sits on the same page, but as soon as someone types, the page switches to results only. Owen: \"once you type something, the page kind of changes to just the results\" so all he saw was the no resources found message. That message was hovered 40 times. This is part of the search problem rather than a separate one, and it is one of the cheapest pieces to fix."
    }
  ],
  pitfalls: [
    {
      name: "Following the loudest request",
      detail: "Volume is not reach. Dark mode showed up in 8 messages, but they came from just 3 people. Always count distinct users, not mentions, and ask whether those users are even in the group whose behavior changed."
    },
    {
      name: "Blaming whatever spiked at the same time",
      detail: "Two things happening in the same weeks does not mean one caused the other. The hackathon page had 1,022 events peaking Oct 20 to 22, which looks like it pulled people away, but 0 Resources members visited it. It was anonymous promo traffic."
    },
    {
      name: "Fixing what the metric cannot see",
      detail: "Before you pick a cause, check whether it can even show up in the number. The main metric only counts approved members, so people stuck on the lock screen are outside it by definition, no matter how frustrated they are."
    },
    {
      name: "Reacting to a scary number without asking who it touches",
      detail: "A percentage can sound alarming and still explain very little. 61% of video opens ended in under a minute, but only 2 of the members who stopped coming had video trouble and no failed search. Always ask how many of the people who left this problem actually reached."
    },
    {
      name: "Building the solution a user asks for",
      detail: "Users are great at describing pain and less reliable at prescribing fixes. Colby wanted to \"add like a hundred more resources,\" but resource clicks were flat every week, and Maren, a heavy user, said \"Don't add a hundred more links.\" Find the problem behind the request, and do not jump to your own first idea either."
    },
    {
      name: "Picking everything",
      detail: "Listing five causes and five fixes feels thorough but shows you cannot prioritize. As one guide puts it, you can do anything, but not everything. Pick one problem, say why it wins, and put the rest on a later list."
    },
    {
      name: "Choosing a metric that cannot fail",
      detail: "\"Searches performed\" or page views can go up whether or not anyone finds what they need. Even \"searches with results\" looks perfect if your fix always shows something. Pick a number tied to the user actually succeeding, like the share of searches that end in a click, and pair it with a number that must not get worse."
    },
    {
      name: "Switching problems when new data shows up",
      detail: "Partway through a case you often get one more piece of evidence. Use it to test and sharpen your pick, not to chase something new. Here the click log showed only 3 of 33 search sessions clicked a result, which strengthens the search story rather than replacing it."
    }
  ],
  frameworks: [
    {
      name: "CIRCLES (Lewis C. Lin)",
      oneLine: "Seven steps for product questions: Comprehend the situation, Identify the customer, Report needs, Cut through prioritization, List solutions, Evaluate trade offs, Summarize.",
      url: "https://productschool.com/blog/skills/circles-framework-guide"
    },
    {
      name: "Analyzing Metric Changes (Sequoia)",
      oneLine: "When a number moves, check for data problems first, then product changes, seasons or outside events, and shifts in who your users are.",
      url: "https://articles.sequoiacap.com/analyzing-metric-changes"
    },
    {
      name: "RICE and ICE scoring",
      oneLine: "Score each idea on reach, impact, confidence and effort to compare options, then sanity check the ranking against your gut.",
      url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/"
    },
    {
      name: "HEART with Goals, Signals, Metrics (Google)",
      oneLine: "Start from the goal, name the user behavior that would show it, then turn that into a number you can track.",
      url: "https://research.google.com/pubs/archive/36299.pdf"
    },
    {
      name: "Opportunity Solution Tree (Teresa Torres)",
      oneLine: "Tie a goal to user needs, pick one need to focus on, compare about three solutions, and test your riskiest assumption first.",
      url: "https://www.producttalk.org/opportunity-solution-trees/"
    }
  ],
  sources: [
    {
      title: "The definitive guide to mastering product sense interviews",
      url: "https://www.lennysnewsletter.com/p/the-definitive-guide-to-mastering",
      publisher: "Lenny's Newsletter (Ben Erez)"
    },
    {
      title: "Analyzing Metric Changes Part VII: Action Plan",
      url: "https://articles.sequoiacap.com/analyzing-metric-changes-part-vii-action-plan",
      publisher: "Sequoia Capital"
    },
    {
      title: "Intercom's product principles: Start with the problem",
      url: "https://www.intercom.com/blog/intercom-product-principles-start-with-the-problem/",
      publisher: "Intercom"
    },
    {
      title: "RICE: Simple prioritization for product managers",
      url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/",
      publisher: "Intercom"
    },
    {
      title: "Measuring the User Experience on a Large Scale (HEART)",
      url: "https://research.google.com/pubs/archive/36299.pdf",
      publisher: "Google Research"
    },
    {
      title: "Opportunity Solution Trees",
      url: "https://www.producttalk.org/opportunity-solution-trees/",
      publisher: "Product Talk (Teresa Torres)"
    },
    {
      title: "Metrics PM interview questions",
      url: "https://www.rocketblocks.me/blog/success-metrics-pm-interviews.php",
      publisher: "RocketBlocks"
    },
    {
      title: "Guardrail metrics: The complete guide to balanced product growth",
      url: "https://mixpanel.com/blog/guardrail-metrics/",
      publisher: "Mixpanel"
    },
    {
      title: "Product Discovery With ICE and The Confidence Meter",
      url: "https://itamargilad.com/the-tool-that-will-help-you-choose-better-product-ideas/",
      publisher: "Itamar Gilad"
    },
    {
      title: "The Most Common Mistakes People Make In Product Manager Interviews",
      url: "https://www.producttalk.org/the-most-common-mistakes-people-make-in-product-manager-interviews/",
      publisher: "Product Talk (Teresa Torres)"
    },
    {
      title: "A Guide to the CIRCLES Framework with Product Examples",
      url: "https://productschool.com/blog/skills/circles-framework-guide",
      publisher: "Product School"
    }
  ]
};
