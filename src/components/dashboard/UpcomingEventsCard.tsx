import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, MapPin, Clock, ExternalLink } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";

interface Event {
  id: string;
  title: string;
  start_time: string;
  location: string | null;
  registration_link: string | null;
}

interface UpcomingEventsCardProps {
  events: Event[];
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  const formatEventDate = (startTime: string) => {
    const date = new Date(startTime);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const formatEventTime = (startTime: string) => {
    const date = new Date(startTime);
    return format(date, "h:mm a");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Events
          </span>
          {events.length > 0 && (
            <Badge variant="secondary">{events.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length > 0 ? (
          <>
            <div className="space-y-2">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg border transition-colors hover:border-primary/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatEventDate(event.start_time)} at {formatEventTime(event.start_time)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {event.registration_link ? (
                    <a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        className="shrink-0 h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        RSVP
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </a>
                  ) : (
                    <Link to="/events">
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 h-7 px-3 text-xs"
                      >
                        Details
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/events" className="flex items-center gap-1">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        ) : (
          <div className="text-center py-4">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No upcoming events</p>
            <Button variant="link" size="sm" asChild>
              <Link to="/events">Browse past events</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
