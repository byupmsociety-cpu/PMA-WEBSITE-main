import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "super-admin" | "admin" | "user" | "guest";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  is_pma_member: boolean | null;
  is_blocked: boolean;
  deleted_at: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
  isBlocked: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, full_name, email, role, is_pma_member, is_blocked, deleted_at")
      .eq("user_id", currentUser.id)
      .single();

    if (error) {
      // Profile may not exist (e.g. trigger failed). Try to repair by inserting.
      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: currentUser.id,
        email: currentUser.email ?? null,
        full_name: currentUser.user_metadata?.full_name ?? null,
        role: "guest",
        is_pma_member: false,
      });

      if (insertError) {
        // Duplicate = profile was created by another request; retry load.
        if (insertError.code === "23505") {
          const { data: retryData, error: retryError } = await supabase
            .from("profiles")
            .select("id, user_id, full_name, email, role, is_pma_member, is_blocked, deleted_at")
            .eq("user_id", currentUser.id)
            .single();
          if (!retryError && retryData) {
            setProfile({
              id: retryData.id,
              user_id: retryData.user_id,
              full_name: retryData.full_name,
              email: retryData.email,
              role: (retryData.role ?? "guest") as Role,
              is_pma_member: retryData.is_pma_member ?? null,
              is_blocked: retryData.is_blocked ?? false,
              deleted_at: retryData.deleted_at ?? null,
            });
            return;
          }
        }
        console.error("Error loading profile", error);
        setProfile(null);
        return;
      }
      // Insert succeeded; load the new profile.
      await loadProfile(currentUser);
      return;
    }

    setProfile({
      id: data.id,
      user_id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: (data.role ?? "guest") as Role,
      is_pma_member: data.is_pma_member ?? null,
      is_blocked: data.is_blocked ?? false,
      deleted_at: data.deleted_at ?? null,
    });
  };

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser ?? null);
      await loadProfile(currentUser ?? null);
      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        // Defer Supabase calls to avoid auth-js#762 deadlock
        setTimeout(() => loadProfile(currentUser), 0);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    await loadProfile(currentUser ?? null);
  };

  const isBlocked = !!(profile && (profile.is_blocked || profile.deleted_at));
  const effectiveRole: Role = isBlocked ? "guest" : (profile?.role ?? "guest");

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isSuperAdmin: effectiveRole === "super-admin",
    isAdmin: effectiveRole === "admin" || effectiveRole === "super-admin",
    isUser: effectiveRole === "user" || effectiveRole === "admin" || effectiveRole === "super-admin",
    isGuest: effectiveRole === "guest",
    isBlocked,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

