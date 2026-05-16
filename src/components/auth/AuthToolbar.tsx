"use client";

import { LogIn, LogOut } from "lucide-react";

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

export function AuthToolbar() {
  const {
    session,
    loading,
    signInWithGoogle,
    signOut,
    supabaseConfigured,
    authErrorBanner,
    clearAuthErrorBanner,
  } = useAuth();

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
        {authErrorBanner ? (
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
          onClick={() => void signInWithGoogle()}
          disabled={!supabaseConfigured}
          className="inline-flex items-center gap-2 rounded-lg bg-tech-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-tech-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-warm-cream-100 dark:text-tech-slate-950 dark:hover:bg-warm-cream-200"
        >
          <LogIn className="h-4 w-4" aria-hidden />
          Sign In
        </button>

        {supabaseConfigured ? (
          <p className="max-w-[260px] text-right text-[10px] leading-snug text-tech-slate-500 dark:text-warm-cream-400">
            Nếu Supabase báo &quot;Unsupported provider&quot;: Dashboard →
            Authentication → Providers → Google — bật provider, nhập Client ID /
            Secret, và thêm Redirect URL khớp địa chỉ app (localhost và/hoặc
            production).
          </p>
        ) : null}

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
