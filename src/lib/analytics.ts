import { supabase } from "@/integrations/supabase/client";

type EventType = "page_view" | "login";

function getOrCreateId(storage: () => Storage, key: string): string {
  try {
    const existing = storage().getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    storage().setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

const visitorId = () => getOrCreateId(() => localStorage, "pma_visitor_id");
const sessionId = () => getOrCreateId(() => sessionStorage, "pma_session_id");

async function track(eventType: EventType, path: string, userId: string | null) {
  if (path.startsWith("/admin")) return;

  const { error } = await supabase.from("analytics_events" as any).insert({
    event_type: eventType,
    path: path.slice(0, 512),
    user_id: userId,
    visitor_id: visitorId(),
    session_id: sessionId(),
    referrer: document.referrer ? document.referrer.slice(0, 1024) : null,
    user_agent: navigator.userAgent.slice(0, 512),
  });
  if (error) console.warn("analytics", error.message);
}

export const trackPageView = (path: string, userId: string | null) =>
  void track("page_view", path, userId);

export const trackLogin = (userId: string) =>
  void track("login", window.location.pathname, userId);
