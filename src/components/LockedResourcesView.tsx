import { Link } from "react-router-dom";
import { Lock, LogIn, Mail } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PAY_DUES_URL = "https://clubs.byu.edu/link/club/18295873486206095";

export interface LockedCategoryPreview {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  resourceCount: number;
}

interface LockedResourcesViewProps {
  categories: LockedCategoryPreview[];
  isLoggedIn: boolean;
}

/**
 * Teaser shown on /resources to anyone who isn't a verified PMA member:
 * a login / pay-dues call to action, plus the category cards with lock icons
 * so visitors can see what membership unlocks.
 */
const LockedResourcesView = ({ categories, isLoggedIn }: LockedResourcesViewProps) => {
  const scrollToCta = () => {
    document.getElementById("resources-unlock")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background text-foreground overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="w-full max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              PM{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Content Library
              </span>
            </h1>
            <p className="text-base text-muted-foreground">
              Interview prep, templates, and career resources for PMA members.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-in">
          <Card id="resources-unlock" className="max-w-2xl mx-auto mb-12 border-primary/20">
            <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Members only</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md">
                {isLoggedIn
                  ? "Your account isn't a verified PMA member yet. Pay dues to unlock the full library."
                  : "Log in with your PMA member account to open the library. Not a member yet? Pay dues to join."}
              </p>

              <div className="w-full max-w-sm flex flex-col sm:flex-row gap-3">
                {!isLoggedIn && (
                  <Button asChild size="lg" className="w-full sm:flex-1">
                    <Link to="/auth">
                      <LogIn className="w-4 h-4 mr-2" />
                      Log in
                    </Link>
                  </Button>
                )}
                <Button
                  size="lg"
                  variant={isLoggedIn ? "default" : "outline"}
                  className="w-full sm:flex-1"
                  onClick={() => window.open(PAY_DUES_URL, "_blank", "noopener,noreferrer")}
                >
                  Join PMA (Pay Dues)
                </Button>
              </div>

              {isLoggedIn && (
                <div className="mt-6 pt-6 border-t border-border w-full max-w-sm flex items-start gap-3 text-left">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Already paid?</span> We approve members in
                    batches. If it's been a few days, email{" "}
                    <a href="mailto:byupmsociety@gmail.com" className="font-semibold text-primary underline">
                      byupmsociety@gmail.com
                    </a>
                    .
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>

        {categories.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-4">What's inside</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((category, idx) => (
                <AnimatedSection key={category.id} animation="slide-up" delay={idx * 100}>
                  <Card
                    className="h-full bg-card/80 border-border cursor-pointer hover:shadow-md transition-shadow"
                    onClick={scrollToCta}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white opacity-60`}
                        >
                          {category.icon}
                        </div>
                        <Lock className="w-4 h-4 text-muted-foreground" aria-label="Locked" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-card-foreground truncate">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
                      <span className="text-xs text-muted-foreground">{category.resourceCount} resources</span>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LockedResourcesView;
