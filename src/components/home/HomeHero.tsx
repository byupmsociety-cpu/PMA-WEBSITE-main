
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
                A product manager decides what gets built, why, and for whom, then works with engineers and
                designers until it's real.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={600}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
                {user && isPmaMember ? (
                  <Link
                    to="/resources"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Go to Resources
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

          <AnimatedSection animation="slide-up" className="flex justify-center mt-4 lg:mt-0">
            <iframe
              src="https://luma.com/embed/calendar/cal-82eg3LzQnk5FD0J/events"
              width="600"
              height="450"
              frameBorder="0"
              style={{ border: "1px solid #bfcbda88", borderRadius: "4px" }}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
              className="w-full max-w-[600px]"
              title="BYU PMA Luma Calendar"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
