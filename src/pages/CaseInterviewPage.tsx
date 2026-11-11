import { ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

// Landing page for Case Interview: Build the Fix with AI (Wed Nov 11, 2026).
// Kept short on purpose: the case site has the full brief and instructions.

const CASE_URL = "https://pma-case-competition.vercel.app/case";

const CaseInterviewPage = () => (
  <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
    <div className="container mx-auto px-4 md:px-6">
      <AnimatedSection animation="slide-up">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Tonight · Wednesday, Nov 11
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Case Interview: <span className="text-gradient">Build the Fix with AI</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome! Tonight you'll work through a real AI case interview with your team. Everything you need, from the
            brief to the data and instructions, is on the case site.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="slide-up" delay={100}>
        <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6 md:p-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">A note from Nate</p>
          <div className="space-y-4 text-card-foreground">
            <p>
              In a recent product management interview, I was shown a product and given user data, then asked how I'd
              improve it. After I recommended a solution, they asked me to build it with AI. More and more PM
              interviews are starting to look like this.
            </p>
            <p>
              So we're running one. Join us this Wednesday for a hands-on AI workshop set up like an AI case
              interview.
            </p>
            <p>
              <span className="font-semibold">The case:</span> Congrats, you're hired as a PM. Your product is the PMA
              website, and engagement is slipping.
            </p>
            <p>In an hour, you'll work with a team and use real user data, user insights and AI agents to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Find the issue</li>
              <li>Design a solution</li>
              <li>Ship it</li>
            </ul>
            <p>
              The best features go live on the real PMA site with your name on them. It's a real project you can put
              on your resume, and practice for the interviews you'll see.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-in" delay={200}>
        <div className="max-w-2xl mx-auto text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary !text-white hover:opacity-90 drop-shadow-md"
          >
            <a href={CASE_URL} target="_blank" rel="noopener noreferrer">
              Start the case
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Opens the case version of the PMA site, with the full brief and instructions.
          </p>
        </div>
      </AnimatedSection>
    </div>
  </div>
);

export default CaseInterviewPage;
