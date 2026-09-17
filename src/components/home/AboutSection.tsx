import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

const ROLES = [
  {
    title: "Strategy",
    description: "Decide what gets built and why it matters.",
  },
  {
    title: "Eng & AI",
    description: "Prototype the idea instead of just describing it.",
  },
  {
    title: "Design",
    description: "Shape the experience for whoever uses it.",
  },
];

const TRAITS = [
  {
    title: "Great Communication",
    description: "Write it down so twenty people can act on it.",
  },
  {
    title: "User Empathy",
    description: "Sit with users until the problem is obvious.",
  },
  {
    title: "Execution Attitude",
    description: "Own the outcome, not the task list.",
  },
  {
    title: "Product Sense",
    description: "Know which of ten good ideas actually matters.",
  },
  {
    title: "Data Fluency",
    description: "Pull the numbers yourself, then decide.",
  },
  {
    title: "AI Fluency",
    description: "Prototype the idea instead of describing it.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-32">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-gradient">Product Management?</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              The product manager is a role in tech companies that decides what gets built, why, and for whom, then
              works with engineers and designers until it's real.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {ROLES.map((role) => (
              <Card key={role.title} className="bg-white/80 dark:bg-black/40 border border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-3">{role.title}</h3>
                  <p className="text-muted-foreground">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground italic mb-20">
            AI is converging three separate roles into one person: the product builder.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={200}>
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold">What Makes a Good PM</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {TRAITS.map((trait) => (
              <Card key={trait.title} className="bg-white/80 dark:bg-black/40 border border-border backdrop-blur-sm">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold mb-2">{trait.title}</h4>
                  <p className="text-muted-foreground text-sm">{trait.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={300}>
          <div className="max-w-3xl mx-auto rounded-xl bg-gradient-to-r from-primary to-secondary text-white p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-3xl md:text-4xl font-extrabold whitespace-nowrap">$100K to $185K</div>
            <div className="text-sm sm:text-base sm:border-l sm:border-white/30 sm:pl-6">
              <p>What the middle 50% of entry level PMs earn in total comp. Median: $123K.</p>
              <p className="text-white/70 text-xs mt-2">
                Levels.fyi, entry level Product Manager, United States, September 2026.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={400}>
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              New to Product Management or want to learn more?
            </h2>
            <a
              href="/discover"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl !text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl drop-shadow-md"
            >
              Discover PM
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default AboutSection;
