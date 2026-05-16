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
  authErrorBanner: string | null;
  clearAuthErrorBanner: () => void;
  /** Sends a one-time sign-in link to the given email via Supabase Auth. Returns true if the request succeeded. */
  signInWithMagicLink: (email: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readOAuthReturnErrorFromUrl(): {
  message: string | null;
  rawCode: string | null;
  rawError: string | null;
} {
  if (typeof window === "undefined") {
    return { message: null, rawCode: null, rawError: null };
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;
  const rawError = params.get("error");
  const rawCode = params.get("error_code");
  const rawDesc = params.get("error_description");
  const decodedDesc = rawDesc
    ? decodeURIComponent(rawDesc.replace(/\+/g, " "))
    : "";

  if (!rawError && !rawCode && !decodedDesc) {
    return { message: null, rawCode, rawError };
  }

  const haystack = `${rawCode ?? ""} ${decodedDesc}`.toLowerCase();

  if (
    rawCode === "validation_failed" ||
    haystack.includes("provider is not enabled") ||
    haystack.includes("unsupported provider")
  ) {
    return {
      message:
        "Google OAuth chưa được bật trong Supabase (Dashboard → Authentication → Providers → Google).",
      rawCode,
      rawError,
    };
  }

  if (decodedDesc.length > 0) {
    return { message: decodedDesc, rawCode, rawError };
  }

  if (rawError && rawError.length > 0) {
    return { message: rawError, rawCode, rawError };
  }

  return { message: "Đăng nhập OAuth thất bại.", rawCode, rawError };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseConfigured = useMemo(() => isSupabaseConfigured(), []);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authErrorBanner, setAuthErrorBanner] = useState<string | null>(null);

  const clearAuthErrorBanner = useCallback(() => {
    setAuthErrorBanner(null);
  }, []);

  useEffect(() => {
    const parsed = readOAuthReturnErrorFromUrl();
    if (!parsed.message) {
      return;
    }

    setAuthErrorBanner(parsed.message);

    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    url.searchParams.delete("error_code");
    url.searchParams.delete("error_description");
    window.history.replaceState({}, "", `${url.pathname}${url.hash}`);
  }, []);

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

  const signInWithMagicLink = useCallback(
    async (email: string) => {
      const trimmed = email.trim();
      if (!trimmed) {
        setAuthErrorBanner("Please enter your email address.");
        return false;
      }

      const client = getSupabaseBrowserClient();
      if (!client) {
        console.warn(
          "[SnapBill] Cannot send magic link: Supabase client is not configured.",
        );
        setAuthErrorBanner(
          "Supabase is not configured. Add your project keys to sign in.",
        );
        return false;
      }

      clearAuthErrorBanner();

      const emailRedirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}`
          : undefined;

      const { error } = await client.auth.signInWithOtp({
        email: trimmed,
        options: emailRedirectTo ? { emailRedirectTo } : undefined,
      });

      if (error) {
        console.warn("[SnapBill] signInWithOtp error:", error.message);
        setAuthErrorBanner(error.message);
        return false;
      }

      return true;
    },
    [clearAuthErrorBanner],
  );

  const signInWithGoogle = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.warn(
        "[SnapBill] Cannot sign in: Supabase client is not configured.",
      );
      return;
    }

    clearAuthErrorBanner();

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : undefined;

    const oauthProvider = "google" as const;

    const { error } = await client.auth.signInWithOAuth({
      provider: oauthProvider,
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (error) {
      console.warn("[SnapBill] signInWithOAuth error:", error.message);
      setAuthErrorBanner(error.message);
    }
  }, [clearAuthErrorBanner]);

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
      authErrorBanner,
      clearAuthErrorBanner,
      signInWithMagicLink,
      signInWithGoogle,
      signOut,
    }),
    [
      authErrorBanner,
      clearAuthErrorBanner,
      loading,
      session,
      signInWithGoogle,
      signInWithMagicLink,
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
