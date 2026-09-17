import { Briefcase, Code, MapPin, Mic, Award, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

const FLAGSHIP_PROGRAMS = [
  {
    icon: Briefcase,
    title: "Fall Career Fair",
    description: "Face time with recruiters who hire product interns.",
  },
  {
    icon: Code,
    title: "Winter Hackathon",
    description: "A weekend to turn an idea into a working product.",
  },
  {
    icon: MapPin,
    title: "Spring Tech Trek",
    description: "On site visits to teams building real products in Silicon Valley and locally.",
  },
];

const BIWEEKLY_EVENTS = [
  {
    icon: Mic,
    title: "Guest Speakers",
    description: "Working PMs on the job, unfiltered.",
  },
  {
    icon: Award,
    title: "Recruiting Workshops",
    description: "Resume, case, and interview prep.",
  },
  {
    icon: Cpu,
    title: "AI Training",
    description: "Hands on with the tools PMs use.",
  },
];

const ClubPrograms = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Does the Club Do?</h2>
            <p className="text-muted-foreground">Three flagship programs.</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {FLAGSHIP_PROGRAMS.map((program, index) => (
            <AnimatedSection key={program.title} animation="slide-up" delay={index * 100}>
              <Card className="h-full bg-white/80 dark:bg-black/40 border border-border backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-6">
                    <program.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="slide-up">
          <p className="text-center font-semibold text-primary mb-8">
            Plus events every two weeks, Wednesdays at 6:00
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {BIWEEKLY_EVENTS.map((event, index) => (
            <AnimatedSection key={event.title} animation="fade-in" delay={index * 100}>
              <div className="flex items-start gap-3 rounded-lg bg-muted/40 p-4">
                <event.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubPrograms;
