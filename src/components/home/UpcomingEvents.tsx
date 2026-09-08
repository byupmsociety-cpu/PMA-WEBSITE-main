import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import { useEvents } from "@/hooks/useEvents";

const UpcomingEvents = () => {
  const { data: events = [], isLoading, isError } = useEvents();

  const upcoming = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  if (isLoading) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">
              Workshops, speakers, and networking — RSVP on Luma to save your spot.
            </p>
          </div>
        </AnimatedSection>

        {isError || upcoming.length === 0 ? (
          <AnimatedSection animation="fade-in" delay={100}>
            <p className="text-center text-muted-foreground">
              No events on the calendar right now — check back soon.
            </p>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {upcoming.map((event, index) => (
              <AnimatedSection key={event.id} animation="fade-in" delay={index * 100}>
                <Card className="h-full bg-card border border-border">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-sm font-semibold text-primary mb-2">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{event.description}</p>
                    <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
                    {event.registrationLink && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                      >
                        Register on Luma
                      </a>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/events">
            <Button variant="outline" size="lg">
              See All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
