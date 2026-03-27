import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import PersonaWizard from "@/components/PersonaWizard";
import SuccessStoriesCarousel from "@/components/SuccessStoriesCarousel";
import PersonaTailoredContent from "@/components/PersonaTailoredContent";
import { useAuth } from "@/contexts/AuthContext";

import HomeHero from "@/components/home/HomeHero";
import CompanyLogoCarousel from "@/components/home/CompanyLogoCarousel";
import CompensationStats from "@/components/home/CompensationStats";
import AboutSection from "@/components/home/AboutSection";
import UpcomingEventBanner from "@/components/home/UpcomingEventBanner";

const HomePage = () => {
  const { user } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<string | null>("curious");

  return (
    <div className="min-h-screen">
      <HomeHero />
      <CompanyLogoCarousel />
      
      {/* Persona Wizard Section - Right after hero */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <PersonaWizard onSelect={setSelectedPersona} />

          {/* Sign-in CTA Card - Only show when persona is selected */}
          {selectedPersona && (
            <Card className="max-w-2xl mx-auto mt-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 animate-in fade-in duration-500">
              <CardContent className="pt-6 space-y-4 text-center">
                {user ? (
                  <>
                    <h3 className="text-xl font-semibold">Resume Your Journey</h3>
                    <p className="text-muted-foreground">
                      Head to your dashboard to track your progress and access exclusive resources
                    </p>
                    <Link to="/dashboard">
                      <Button size="lg" className="gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Go to Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">Ready to Start Your Journey?</h3>
                    <p className="text-muted-foreground">
                      Sign in to track your progress, earn badges, and connect with peers
                    </p>
                    <Link to="/auth">
                      <Button size="lg" className="gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Sign In to Unlock Dashboard
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Persona-Tailored Content - Changes based on selection */}
      {selectedPersona && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <PersonaTailoredContent persona={selectedPersona} />
          </div>
        </section>
      )}

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          width: max-content;
        }
        .hover-scroll-pause:hover {
          animation-play-state: paused;
        }
      `}</style>

      <CompensationStats />
      
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <SuccessStoriesCarousel />
        </div>
      </section>

      <AboutSection />
      
      <UpcomingEventBanner />
    </div>
  );
};

export default HomePage;
