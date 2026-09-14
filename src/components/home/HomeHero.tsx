
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/contexts/AuthContext";

const HomeHero = () => {
  const { user, profile } = useAuth();
  const isPmaMember = profile?.is_pma_member ?? false;

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden py-16 md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 dark:bg-secondary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 z-10 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <AnimatedSection animation="fade-in">
              <h1 className="text-center md:text-left text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                BYU Product Management <span className="text-gradient">Association</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={300}>
              <p className="text-center md:text-left text-xl md:text-2xl text-muted-foreground mt-6">
                Empowering the next generation of product leaders through hands-on experience, industry connections,
                and community.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={600}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
                {user && isPmaMember ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    Go to Dashboard
                  </Link>
                ) : (
                  <a
                    href="https://clubs.byu.edu/link/club/18295873486206095"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Join BYU PMA
                  </a>
                )}
                <a
                  href="https://luma.com/calendar/cal-82eg3LzQnk5FD0J"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium hover:bg-white/10 transition-all"
                >
                  Subscribe to Calendar
                </a>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="slide-up" className="hidden lg:flex justify-center">
            <iframe
              src="https://luma.com/embed/event/evt-9LS6JEYF3Bfi8dy/simple"
              width="600"
              height="780"
              frameBorder="0"
              style={{ border: "1px solid #bfcbda88", borderRadius: "4px" }}
              allow="fullscreen; payment"
              aria-hidden="false"
              tabIndex={0}
              className="w-full max-w-[600px]"
              title="Register for our next event"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
