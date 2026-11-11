import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

// Landing page for Case Interview: Build the Fix with AI (Wed Nov 11, 2026).
// Facts come from docs/events/ai-pm-case-competition.md and the case repo's
// case-kit/brief.md. Time and room are left off on purpose (not final in the plan).

const CASE_URL = "https://pma-case-competition.vercel.app/case";
const REPO_URL = "https://github.com/danielwait2/pma-case-competition";

const CLOCK = [
  { time: "0:00", what: "Framing and the brief. Pull request teams fork the repo and run npm install now." },
  { time: "0:07", what: "Discover. Analyze the data and interviews with AI." },
  { time: "0:22", what: "Pick one problem and write a five line spec." },
  { time: "0:25", what: "Build and ship." },
  { time: "0:46", what: "Submit your link." },
  { time: "0:48", what: "Share. A few teams show what they built." },
  { time: "0:58", what: "Wrap." },
];

const DELIVERABLES = [
  { title: "Problem", body: "One or two sentences naming the most important reason the number is falling. Pick one." },
  { title: "Evidence", body: "At least one number you computed from the data and at least one quote from an interview or the feedback." },
  { title: "Spec", body: "Who it is for, what it does, what you are not building, and the metric that tells you it worked." },
  { title: "Something shipped", body: "A working change, a clickable prototype, or a pull request. Rough is fine." },
];

const TRACKS = [
  {
    level: "Beginner",
    title: "Chat AI",
    body: "Upload the case kit to ChatGPT, Claude, or Gemini. Ship a written spec plus a mockup or the message you would send users.",
  },
  {
    level: "Builder",
    title: "Prototype",
    body: "Build a clickable prototype of your fix with a Claude artifact, Lovable, or v0. Ship the link.",
  },
  {
    level: "Advanced",
    title: "Pull request",
    body: "Fork the case repo, run it locally, and change the site with Claude Code, Cursor, or any editor. Ship a pull request.",
  },
];

const StartCaseButton = () => (
  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary !text-white hover:opacity-90 drop-shadow-md">
    <a href={CASE_URL} target="_blank" rel="noopener noreferrer">
      Start the case
      <ExternalLink className="w-4 h-4 ml-1" />
    </a>
  </Button>
);

const CaseInterviewPage = () => (
  <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
    <div className="container mx-auto px-4 md:px-6">
      {/* Hero */}
      <AnimatedSection animation="slide-up">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Tonight · Wednesday, Nov 11
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Case Interview: <span className="text-gradient">Build the Fix with AI</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            You're the PM for the PMA website, and engagement is slipping. Your team uses data, user interviews, and
            AI to find out why, write a short spec, and ship a fix in one hour.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <StartCaseButton />
            <Button asChild size="lg" variant="outline">
              <Link to="/submit">Submit your work</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            The case opens on a practice copy of the PMA site. No coding experience needed.
          </p>
        </div>
      </AnimatedSection>

      {/* The case */}
      <AnimatedSection animation="slide-up" delay={50}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-3 text-card-foreground">The case</h2>
            <p className="text-muted-foreground mb-3">
              PMA wants students to come back to Resources every week during recruiting season. The number that
              tracks it, weekly active members on Resources, has dropped over the last 30 days, and recruiting peaks
              in about three weeks.
            </p>
            <p className="text-muted-foreground">
              You get a case kit with site analytics, account data, feedback, and five short user interviews. Find
              the real cause, back it with evidence, and ship something that fixes it.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 flex flex-col justify-center text-center">
            <p className="text-4xl md:text-5xl font-heading font-extrabold text-primary">41 → 23</p>
            <p className="mt-2 text-sm text-muted-foreground">Weekly active members on Resources, over four weeks</p>
          </div>
        </div>
      </AnimatedSection>

      {/* The hour + team format */}
      <AnimatedSection animation="slide-up" delay={100}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">How the hour runs</h2>
            <ul className="space-y-3">
              {CLOCK.map((c) => (
                <li key={c.time} className="flex gap-3">
                  <span className="font-mono font-semibold w-10 shrink-0">{c.time}</span>
                  <span className="text-muted-foreground">{c.what}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground">Your team</h2>
            <p className="text-muted-foreground mb-3">
              You work in a team of 2 or 3. Teams mix people who are new to AI tools with people who already build
              with them.
            </p>
            <p className="text-muted-foreground">
              There's no judging. One person per team submits a link to your work. Officers look through every
              entry, and the best changes get merged into the live PMA site with your names on them. Either way,
              it's a real PM project for your resume.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Deliverables */}
      <AnimatedSection animation="slide-up" delay={150}>
        <div className="max-w-4xl mx-auto rounded-xl border border-border bg-card p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold mb-2 text-card-foreground">What your team ships</h2>
          <p className="text-muted-foreground mb-6">
            Not every scary chart is the cause, and not every loud request is the right thing to build.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {DELIVERABLES.map((d, i) => (
              <div key={d.title} className="rounded-lg bg-muted/50 p-4">
                <p className="font-semibold mb-1">
                  {i + 1}. {d.title}
                </p>
                <p className="text-sm text-muted-foreground">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Tracks */}
      <AnimatedSection animation="slide-up" delay={200}>
        <div className="max-w-4xl mx-auto mb-10">
          <h2 className="text-2xl font-bold mb-2 text-center">Pick a track</h2>
          <p className="text-muted-foreground text-center mb-8">Mix and match. Pick what fits your team.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TRACKS.map((t) => (
              <div key={t.level} className="rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.level}</p>
                <h3 className="text-xl font-bold mt-1 mb-3 text-card-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Setup */}
      <AnimatedSection animation="slide-up" delay={250}>
        <div className="max-w-4xl mx-auto rounded-xl border border-border bg-card p-6 md:p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-card-foreground">Before you start</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Everyone</h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>A laptop.</li>
                <li>A ChatGPT, Claude, or Gemini login. The free versions can handle the case kit.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Pull request track</h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>A GitHub account and Node.js 22 or newer.</li>
                <li>A coding tool such as Claude Code or Cursor.</li>
                <li>Fork the case repo, clone your fork, and run npm install during the framing.</li>
              </ul>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary underline underline-offset-4"
              >
                <Github className="h-4 w-4" />
                Open the case repo
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Closing CTA */}
      <AnimatedSection animation="fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready when your team is</h2>
          <p className="text-muted-foreground mb-6">
            The case page has the full brief, the case kit download, and a prompt to get your AI started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <StartCaseButton />
            <Button asChild size="lg" variant="ghost">
              <Link to="/submit">
                Done? Submit your work
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </div>
);

export default CaseInterviewPage;
