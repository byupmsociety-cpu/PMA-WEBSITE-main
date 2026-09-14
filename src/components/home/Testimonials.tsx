import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

// Placeholder testimonials — not attributed to real members. Swap in real
// quotes (with permission) once they're collected.
const TESTIMONIALS = [
  {
    quote:
      "PMA gave me a clear starting point for product management — mock interviews, real frameworks, and people who'd actually done the work.",
    attribution: "PMA Member, Junior",
  },
  {
    quote:
      "The coffee chats alone were worth joining. I walked away with a much better sense of what PMs actually do day to day.",
    attribution: "PMA Member, Sophomore",
  },
  {
    quote:
      "Workshops and case practice made recruiting season feel a lot less overwhelming.",
    attribution: "PMA Member, Senior",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Members Say</h2>
            <p className="text-muted-foreground">Illustrative feedback from the PMA community.</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <AnimatedSection key={testimonial.attribution} animation="fade-in" delay={index * 100}>
              <Card className="h-full bg-card border border-border">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="h-6 w-6 text-primary/40 mb-4" />
                  <p className="text-sm leading-relaxed mb-4 flex-1">"{testimonial.quote}"</p>
                  <p className="text-sm font-semibold text-muted-foreground">{testimonial.attribution}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
