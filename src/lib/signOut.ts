import { supabase } from "@/integrations/supabase/client";

/**
 * Signs the user out locally, clears any cached Supabase auth tokens, and
 * hard-reloads to the homepage. Falls back to the reload after 2s in case
 * signOut hangs.
 */
export const signOutAndReload = () => {
  const reload = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.includes("-auth-token") || key.startsWith("sb-")) {
        localStorage.removeItem(key);
      }
    });
    window.location.href = "/";
  };
  const timeout = setTimeout(reload, 2000);
  supabase.auth.signOut({ scope: "local" }).finally(() => {
    clearTimeout(timeout);
    reload();
  });
};
