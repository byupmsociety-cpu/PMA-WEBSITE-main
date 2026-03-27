import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents, type Event } from "@/hooks/useEvents";

const FALLBACK_EVENT: Event = {
  id: "fallback",
  title: "PMA Workshop Series",
  description: "Join us for our PM Workshop Series - Learn from industry experts",
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  location: "BYU Campus",
  status: "upcoming",
  registrationLink: null,
};

const UpcomingEventBanner = () => {
  const [showEventBanner, setShowEventBanner] = useState(false);
  const { data: events = [], isLoading: isLoadingEvents, isError } = useEvents();

  // Pick upcoming event
  const upcomingEvent = useMemo(() => {
    if (isError || !events.length) return FALLBACK_EVENT;
    const now = new Date();
    const upcoming = events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] ?? FALLBACK_EVENT;
  }, [events, isError]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('eventBannerDismissed');
    if (dismissed === 'true') {
      return; 
    }

    const timer = setTimeout(() => {
      setShowEventBanner(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showEventBanner || !upcomingEvent || isLoadingEvents) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-2xl"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1">{upcomingEvent.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{upcomingEvent.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
                      />
                    </svg>
                    {new Date(upcomingEvent.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    {upcomingEvent.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 flex-shrink-0">
              <Link
                to={upcomingEvent.title.toLowerCase().includes('hackathon') ? '/hackathon' : '/events'}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  sessionStorage.setItem('eventBannerDismissed', 'true');
                  setShowEventBanner(false);
                }}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium text-xs hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Details
              </Link>
              {upcomingEvent.registrationLink && (
                <a
                  href={upcomingEvent.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium text-xs hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Register on Luma
                </a>
              )}
              <button
                onClick={() => {
                  setShowEventBanner(false);
                  sessionStorage.setItem('eventBannerDismissed', 'true');
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                aria-label="Dismiss banner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpcomingEventBanner;
