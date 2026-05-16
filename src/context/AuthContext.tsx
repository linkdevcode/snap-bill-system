"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import type { UserSession } from "@/types/invoice";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/utils/supabase/client";

function mapUserToSession(user: User): UserSession {
  const meta = user.user_metadata as Record<string, unknown>;

  const avatarRaw = meta.avatar_url ?? meta.picture;
  const avatarUrl =
    typeof avatarRaw === "string" && avatarRaw.trim().length > 0
      ? avatarRaw
      : null;

  const nameRaw = meta.full_name ?? meta.name;
  const displayName =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : null;

  return {
    id: user.id,
    email: user.email ?? null,
    avatarUrl,
    displayName,
  };
}

export interface AuthContextValue {
  session: UserSession | null;
  user: User | null;
  loading: boolean;
  supabaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseConfigured = useMemo(() => isSupabaseConfigured(), []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setUser(null);
      setLoading(false);
      return;
    }

    let active = true;

    void client.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabaseConfigured]);

  const session = useMemo(() => (user ? mapUserToSession(user) : null), [user]);

  const signInWithGoogle = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.warn(
        "[SnapBill] Cannot sign in: Supabase client is not configured.",
      );
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : undefined;

    await client.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? { redirectTo } : undefined,
    });
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      return;
    }

    await client.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      supabaseConfigured,
      signInWithGoogle,
      signOut,
    }),
    [
      loading,
      session,
      signInWithGoogle,
      signOut,
      supabaseConfigured,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
