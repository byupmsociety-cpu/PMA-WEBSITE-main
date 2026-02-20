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
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isGuest: boolean;
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
      .select("id, user_id, full_name, email, role, is_pma_member")
      .eq("user_id", currentUser.id)
      .single();

    if (error) {
      console.error("Error loading profile", error);
      setProfile(null);
      return;
    }

    setProfile({
      id: data.id,
      user_id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: (data.role ?? "guest") as Role,
      is_pma_member: data.is_pma_member ?? null,
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
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await loadProfile(currentUser);
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

  const role: Role = (profile?.role ?? "guest") as Role;

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isSuperAdmin: role === "super-admin",
    isAdmin: role === "admin" || role === "super-admin",
    isUser: role === "user" || role === "admin" || role === "super-admin",
    isGuest: role === "guest",
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

