"use client";

import { useCallback, useEffect, useId, useState, type MouseEvent } from "react";
import { LogIn, LogOut, Mail, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

function initialsFromSession(
  email: string | null,
  displayName: string | null,
): string {
  if (displayName && displayName.trim().length > 0) {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.charAt(0) ?? "";
    const second =
      parts.length > 1
        ? parts[parts.length - 1]?.charAt(0) ?? ""
        : parts[0]?.charAt(1) ?? "";
    const initials = `${first}${second}`.toUpperCase();
    if (initials.trim().length > 0) {
      return initials.slice(0, 2);
    }
  }

  if (email && email.trim().length > 0) {
    return email.trim().slice(0, 2).toUpperCase();
  }

  return "?";
}

function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const {
    supabaseConfigured,
    authErrorBanner,
    clearAuthErrorBanner,
    signInWithMagicLink,
    signInWithGoogle,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setLinkSent(false);
      setEmail("");
      setSendingLink(false);
    }
  }, [open]);

  const onBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleSendMagicLink = useCallback(async () => {
    if (!supabaseConfigured || sendingLink) {
      return;
    }
    setSendingLink(true);
    setLinkSent(false);
    const ok = await signInWithMagicLink(email);
    setSendingLink(false);
    if (ok) {
      setLinkSent(true);
    }
  }, [email, sendingLink, signInWithMagicLink, supabaseConfigured]);

  const handleGoogle = useCallback(async () => {
    if (!supabaseConfigured) {
      return;
    }
    await signInWithGoogle();
  }, [signInWithGoogle, supabaseConfigured]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={onBackdropClick}
    >
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              Sign in
            </h2>
            <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
              We&apos;ll email you a secure magic link—no password to remember.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close sign-in"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {authErrorBanner ? (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-snug text-red-900 dark:border-red-500/35 dark:bg-red-950/50 dark:text-red-100"
          >
            <p>{authErrorBanner}</p>
            <button
              type="button"
              className="mt-2 text-xs font-semibold underline decoration-red-400/60 underline-offset-2"
              onClick={clearAuthErrorBanner}
            >
              Dismiss
            </button>
          </div>
        ) : null}

        {linkSent ? (
          <div
            role="status"
            className="mb-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2.5 text-xs leading-snug text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100"
          >
            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <p>
              Check your inbox for a sign-in link. You can close this window—it
              may take a minute to arrive.
            </p>
          </div>
        ) : null}

        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              disabled={!supabaseConfigured}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSendMagicLink();
                }
              }}
              placeholder="you@company.com"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-shadow placeholder:text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            />
          </label>

          <button
            type="button"
            disabled={!supabaseConfigured || sendingLink}
            onClick={() => void handleSendMagicLink()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
          >
            {sendingLink ? "Sending…" : "Send magic link"}
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Or
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          disabled={!supabaseConfigured}
          onClick={() => void handleGoogle()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {supabaseConfigured ? (
          <p className="mt-4 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            Magic links use Supabase Auth email. For Google: enable the provider
            in Dashboard → Authentication → Providers, add redirect URLs for
            your app origin (localhost or production).
          </p>
        ) : (
          <p className="mt-4 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            Add Supabase keys to <code className="rounded bg-slate-100 px-1 py-px dark:bg-slate-800">.env.local</code>{" "}
            to enable sign-in.
          </p>
        )}
      </div>
    </div>
  );
}

export function AuthToolbar() {
  const {
    session,
    loading,
    signOut,
    supabaseConfigured,
    authErrorBanner,
    clearAuthErrorBanner,
  } = useAuth();

  const [signInOpen, setSignInOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-11 min-w-[140px] items-center justify-end">
        <span className="h-9 w-9 animate-pulse rounded-full bg-tech-slate-200 dark:bg-tech-slate-700" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-end gap-2">
        <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

        {authErrorBanner && !signInOpen ? (
          <div
            role="alert"
            className="max-w-[min(100vw-2rem,320px)] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-right text-[11px] leading-snug text-red-900 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-50"
          >
            <p>{authErrorBanner}</p>
            <button
              type="button"
              className="mt-2 text-[11px] font-semibold underline"
              onClick={clearAuthErrorBanner}
            >
              Đóng
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setSignInOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-tech-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-tech-slate-800 dark:bg-warm-cream-100 dark:text-tech-slate-950 dark:hover:bg-warm-cream-200"
        >
          <LogIn className="h-4 w-4" aria-hidden />
          Sign In
        </button>

        {!supabaseConfigured ? (
          <p className="max-w-[220px] text-right text-[10px] leading-snug text-tech-slate-500 dark:text-warm-cream-400">
            Add Supabase keys to enable Sign In locally.
          </p>
        ) : null}
      </div>
    );
  }

  const label =
    session.displayName?.trim() ||
    session.email?.trim() ||
    "Signed in";

  const initials = initialsFromSession(session.email, session.displayName);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden max-w-[220px] flex-col items-end text-right text-xs leading-snug text-tech-slate-700 dark:text-warm-cream-200 sm:flex">
        <span className="font-semibold">{label}</span>
        {session.email ? (
          <span className="truncate text-[11px] text-tech-slate-500 dark:text-warm-cream-400">
            {session.email}
          </span>
        ) : null}
      </div>

      {session.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.avatarUrl}
          alt=""
          className="h-10 w-10 rounded-full border border-tech-slate-200 object-cover dark:border-tech-slate-700"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border border-tech-slate-200 bg-tech-slate-100 text-xs font-semibold text-tech-slate-800 dark:border-tech-slate-700 dark:bg-tech-slate-800 dark:text-warm-cream-100"
          aria-hidden
        >
          {initials}
        </span>
      )}

      <button
        type="button"
        onClick={() => void signOut()}
        className="inline-flex items-center gap-2 rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-xs font-semibold text-tech-slate-800 hover:bg-tech-slate-50 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50 dark:hover:bg-tech-slate-900"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Sign Out
      </button>
    </div>
  );
}
