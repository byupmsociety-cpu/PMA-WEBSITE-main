import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { trackPageView } from "@/lib/analytics";

const PageViewTracker = () => {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (loading) return;
    trackPageView(pathname, userId);
    // Only a route change counts as a new view, not a sign in on the same page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, loading]);

  return null;
};

export default PageViewTracker;
