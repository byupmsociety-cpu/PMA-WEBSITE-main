import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

const AboutSection = () => {
  return (
    <section id="about" className="py-32">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About <span className="text-gradient">BYU PMA</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              The Product Management Association at Brigham Young University is dedicated to helping students develop
              the skills necessary to excel in the world of product management.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedSection animation="slide-up" delay={100}>
            <Card className="bg-white/80 dark:bg-black/40 border border-border backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#87CEEB] flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Join a network of like-minded students passionate about product management and technology.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={200}>
            <Card className="bg-white/80 dark:bg-black/40 border border-border backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Education</h3>
                <p className="text-muted-foreground">
                  Access workshops, guest speakers, and resources to develop essential product management skills.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={300}>
            <Card className="bg-white/80 dark:bg-black/40 border border-border backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Industry Access</h3>
                <p className="text-muted-foreground">
                  Connect with product leaders and companies for internships, job opportunities, and mentorship.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* New to Product Management Section */}
        <AnimatedSection animation="slide-up" delay={400}>
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              New to Product Management or want to learn more?
            </h2>
            <a
              href="/discover"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#215096] to-[#4299E1] rounded-xl !text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl drop-shadow-md"
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
