import type { TrackId } from "@/lib/prepJourney";

export const TRACK_COPY: Record<TrackId, { who: string; name: string; adj: string; title: string; sub: string }> = {
  "two-year": {
    who: "Curious about PM",
    name: "2 years",
    adj: "2 year",
    title: "Your 2 year plan",
    sub: "Explore first, build a project, then recruit.",
  },
  "one-year": {
    who: "I want PM and apply next fall",
    name: "1 year",
    adj: "1 year",
    title: "Your 1 year plan",
    sub: "Experience, resume and referrals before August.",
  },
  "sixty-day": {
    who: "Applying or interviewing now",
    name: "60 days",
    adj: "60 day",
    title: "Your interview plan",
    sub: "Interview prep first. Includes new grad APM roles.",
  },
};

export const STAGE_PERSON: Record<string, string> = {
  explore: "First coffee chat with an officer",
  experience: "PMA events and the hackathon, if it fits",
  story: "Resume review with an officer",
  network: "Practice your outreach with an officer",
  apply: "Second resume review if applications go quiet",
  interview: "Mock interviews with officers and peers",
  offer: "Talk through the offer with an officer",
};

export const SEARCH_PLACEHOLDER = "Search prep: case interview, behavioral";
export const ASIDE_QUERIES = ["Case interview", "Behavioral", "Tell me about yourself", "Estimation", "Resume"];
export const LIBRARY_QUERIES = [
  "case interview",
  "product sense",
  "behavioral",
  "tell me about yourself",
  "mock interview videos",
  "resume",
  "estimation",
];
export const QUICK_LINKS = ["APM List", "Aced (formerly Exponent)", "Coffee Chat Guide"];
export const firstName = (name: string) => name.split(" ")[0];
