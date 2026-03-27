import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import DiscoverHero from '@/components/discover/DiscoverHero';
import {
  WhatIsPM,
  WhyPMSection,
  KeySkillsSection,
  PMSkillGenerator,
  PMJargonQuiz,
  PMDailyChallenge
} from '@/components/discover/DiscoverContent';

const DiscoverPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Video */}
      <DiscoverHero />

      {/* What is PM Section */}
      <WhatIsPM />

      {/* Why PM Section */}
      <WhyPMSection />

      {/* Key Skills Section */}
      <KeySkillsSection />

      {/* Games Section */}
      <section id="games-section" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Learn PM Through <span className="text-gradient">Games</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column with Skill Generator */}
            <div className="space-y-12">
              <AnimatedSection animation="slide-up" delay={100}>
                <PMSkillGenerator />
              </AnimatedSection>
            </div>

            {/* Right column with Jargon Quiz and Daily Challenge */}
            <div className="space-y-12">
              <AnimatedSection animation="slide-up" delay={200}>
                <PMJargonQuiz />
              </AnimatedSection>

              {/* PM Daily Challenge */}
              <AnimatedSection animation="slide-up" delay={300}>
                <PMDailyChallenge />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;