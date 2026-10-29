import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { submitRating } from "@/lib/feedback";

const RATINGS = [1, 2, 3, 4, 5];
const STORAGE_KEY = "pma-resources-feedback-submitted";

const alreadySubmitted = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const ResourcesFeedback = () => {
  const { profile } = useAuth();
  const { pathname } = useLocation();
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(alreadySubmitted() ? "sent" : "idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setStatus("sending");
    try {
      await submitRating({ rating, message, page: pathname, profileId: profile?.id });
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Storage can be unavailable in private browsing; the thank you still shows.
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section aria-labelledby="resources-feedback-title" className="max-w-6xl mx-auto mt-16">
      <div className="rounded-xl border border-border bg-card p-5 md:p-8">
        {status === "sent" ? (
          <div role="status">
            <h2 id="resources-feedback-title" className="text-xl md:text-2xl font-bold text-card-foreground">
              Thanks for the feedback
            </h2>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              Officers read every response and use it to decide what to add next.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id="resources-feedback-title" className="text-xl md:text-2xl font-bold text-card-foreground">
              How helpful are these resources?
            </h2>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              Rate them from 1 (not helpful) to 5 (very helpful).
            </p>

            <div role="radiogroup" aria-label="Rating from 1 to 5" className="mt-5 flex flex-wrap gap-2">
              {RATINGS.map((value) => {
                const selected = rating === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${value} out of 5`}
                    onClick={() => setRating(value)}
                    className={`h-12 w-12 rounded-lg border text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>

            {rating !== null && (
              <div className="mt-6">
                <label htmlFor="resources-feedback-message" className="text-sm font-semibold text-foreground">
                  How can we be more helpful? <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <Textarea
                  id="resources-feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="What's missing, confusing, or worth adding?"
                  className="mt-2"
                />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending..." : "Send feedback"}
                  </Button>
                  {status === "error" && (
                    <p role="alert" className="text-sm text-destructive">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default ResourcesFeedback;
