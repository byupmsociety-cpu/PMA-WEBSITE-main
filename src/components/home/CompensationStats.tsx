import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const CompensationStats = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <AnimatedSection animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Product Management Pays Off</h2>
              <p className="text-base text-muted-foreground">Real outcomes from BYU</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Average Comp Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-card border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all hover:scale-105 duration-300">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    Average Total Comp
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-1">$123.4K</div>
                  <div className="text-xs text-muted-foreground">Undergraduate starting compensation</div>
                </div>
              </div>

              {/* High Comp Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-card border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all hover:scale-105 duration-300">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    Top Compensation
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-1">$196.7K</div>
                  <div className="text-xs text-muted-foreground">Highest undergraduate offer</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-base mb-5 text-foreground">
                Ready to join this community and unlock your potential?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/discover">
                  <Button size="lg" className="group">
                    Discover PM
                    <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button size="lg" variant="outline" className="group">
                    Explore Resources
                    <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CompensationStats;
