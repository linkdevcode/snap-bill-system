"use client";

import { useCallback, useEffect, useId, useState, type MouseEvent } from "react";
import { KeyRound, LogOut, User, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useInvoice } from "@/context/InvoiceContext";
import { formatAuthOtpHint } from "@/utils/translations";

const modalLabelClass =
  "block text-xs font-bold uppercase text-slate-500 dark:text-slate-400";

const modalInputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-indigo-400";

const modalPrimaryClass =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-indigo-600/25";

const toolbarPrimaryClass =
  "inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700";

function maskEmailHint(addr: string): string {
  const t = addr.trim();
  const at = t.indexOf("@");
  if (at <= 0) {
    return t;
  }
  const local = t.slice(0, at);
  const domain = t.slice(at + 1);
  const head = local.slice(0, 1) || "•";
  return `${head}•••@${domain}`;
}

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
  auth: a,
}: {
  open: boolean;
  onClose: () => void;
  auth: ReturnType<typeof useInvoice>["labels"]["auth"];
}) {
  const titleId = useId();
  const {
    supabaseConfigured,
    authErrorBanner,
    clearAuthErrorBanner,
    sendEmailOtp,
    verifyEmailOtp,
    signInWithGoogle,
  } = useAuth();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);

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
    if (!open) {
      return;
    }
    setStep("email");
    setEmail("");
    setOtp("");
    setSendingCode(false);
    setVerifying(false);
  }, [open]);

  const onBackdropClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleSendCode = useCallback(async () => {
    if (!supabaseConfigured || sendingCode) {
      return;
    }
    setSendingCode(true);
    const ok = await sendEmailOtp(email);
    setSendingCode(false);
    if (ok) {
      setStep("otp");
      setOtp("");
    }
  }, [email, sendEmailOtp, sendingCode, supabaseConfigured]);

  const handleVerify = useCallback(async () => {
    if (!supabaseConfigured || verifying) {
      return;
    }
    setVerifying(true);
    const ok = await verifyEmailOtp(email, otp);
    setVerifying(false);
    if (ok) {
      onClose();
    }
  }, [email, onClose, otp, supabaseConfigured, verifyEmailOtp, verifying]);

  const handleGoogle = useCallback(async () => {
    if (!supabaseConfigured) {
      return;
    }
    await signInWithGoogle();
  }, [signInWithGoogle, supabaseConfigured]);

  const onOtpChange = useCallback((raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
  }, []);

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
              {a.signInTitle}
            </h2>
            <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
              {step === "email"
                ? a.emailStepHint
                : formatAuthOtpHint(a.otpStepHint, maskEmailHint(email))}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label={a.close}
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
              {a.dismissError}
            </button>
          </div>
        ) : null}

        {step === "email" ? (
          <div className="space-y-3">
            <label className={modalLabelClass}>
              {a.emailLabel}
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
                    void handleSendCode();
                  }
                }}
                placeholder={a.emailPlaceholder}
                className={modalInputClass}
              />
            </label>

            <button
              type="button"
              disabled={!supabaseConfigured || sendingCode}
              onClick={() => void handleSendCode()}
              className={modalPrimaryClass}
            >
              {sendingCode ? a.sendingCode : a.sendCode}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className={modalLabelClass}>
              {a.otpLabel}
              <input
                type="text"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={!supabaseConfigured}
                value={otp}
                onChange={(e) => onOtpChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleVerify();
                  }
                }}
                placeholder="••••••"
                maxLength={6}
                className={`${modalInputClass} text-center font-mono text-lg tracking-[0.35em]`}
              />
            </label>

            <button
              type="button"
              disabled={!supabaseConfigured || verifying}
              onClick={() => void handleVerify()}
              className={modalPrimaryClass}
            >
              <KeyRound className="h-4 w-4" aria-hidden />
              {verifying ? a.verifying : a.verify}
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <button
                type="button"
                className="font-semibold text-indigo-600 underline decoration-indigo-400/50 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  clearAuthErrorBanner();
                }}
              >
                {a.changeEmail}
              </button>
              <button
                type="button"
                className="font-semibold text-indigo-600 underline decoration-indigo-400/50 underline-offset-2 hover:text-indigo-500 disabled:opacity-50 dark:text-indigo-400"
                disabled={!supabaseConfigured || sendingCode}
                onClick={() => void handleSendCode()}
              >
                {a.resendCode}
              </button>
            </div>
          </div>
        )}

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {a.orDivider}
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          disabled={!supabaseConfigured}
          onClick={() => void handleGoogle()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
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
          {a.continueGoogle}
        </button>

        {supabaseConfigured ? (
          <p className="mt-4 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            {a.supabaseOtpHint}
          </p>
        ) : (
          <p className="mt-4 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
            {a.envHintBefore}{" "}
            <code className="rounded bg-slate-100 px-1 py-px dark:bg-slate-800">
              .env.local
            </code>{" "}
            {a.envHintAfter}
          </p>
        )}
      </div>
    </div>
  );
}

export interface AuthToolbarProps {
  layout?: "default" | "header";
  signInOpen?: boolean;
  onSignInOpenChange?: (open: boolean) => void;
}

export function AuthToolbar({
  layout = "default",
  signInOpen: signInOpenProp,
  onSignInOpenChange,
}: AuthToolbarProps) {
  const {
    session,
    loading,
    signOut,
    supabaseConfigured,
    authErrorBanner,
    clearAuthErrorBanner,
  } = useAuth();
  const { labels } = useInvoice();
  const a = labels.auth;

  const [signInOpenInternal, setSignInOpenInternal] = useState(false);
  const signInOpen = signInOpenProp ?? signInOpenInternal;
  const setSignInOpen = onSignInOpenChange ?? setSignInOpenInternal;
  const isHeaderLayout = layout === "header";

  if (loading) {
    return (
      <span className="inline-flex h-9 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
    );
  }

  if (!session) {
    return (
      <>
        <SignInModal
          open={signInOpen}
          onClose={() => setSignInOpen(false)}
          auth={a}
        />

        {!isHeaderLayout && authErrorBanner && !signInOpen ? (
          <div
            role="alert"
            className="max-w-[min(100vw-2rem,320px)] rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-right text-[11px] leading-snug text-red-900 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100"
          >
            <p>{authErrorBanner}</p>
            <button
              type="button"
              className="mt-2 text-[11px] font-semibold underline"
              onClick={clearAuthErrorBanner}
            >
              {a.dismissShort}
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setSignInOpen(true)}
          className={toolbarPrimaryClass}
        >
          <User className="h-4 w-4" aria-hidden />
          {a.signIn}
        </button>

        {!isHeaderLayout && !supabaseConfigured ? (
          <p className="max-w-[220px] text-right text-[10px] leading-snug text-slate-500 dark:text-slate-400">
            {a.needSupabaseKeys}
          </p>
        ) : null}
      </>
    );
  }

  const label =
    session.displayName?.trim() ||
    session.email?.trim() ||
    a.signedInFallback;

  const initials = initialsFromSession(session.email, session.displayName);

  if (isHeaderLayout) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="hidden max-w-[120px] truncate text-xs font-medium text-slate-700 dark:text-slate-200 sm:inline"
          title={session.email ?? undefined}
        >
          {label}
        </span>
        {session.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full border border-slate-200 object-cover dark:border-slate-600"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            aria-hidden
          >
            {initials}
          </span>
        )}
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label={a.signOut}
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden max-w-[220px] flex-col items-end text-right text-xs leading-snug text-slate-700 dark:text-slate-200 sm:flex">
        <span className="font-semibold">{label}</span>
        {session.email ? (
          <span className="truncate text-[11px] text-slate-500 dark:text-slate-400">
            {session.email}
          </span>
        ) : null}
      </div>

      {session.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.avatarUrl}
          alt=""
          className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-600"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          aria-hidden
        >
          {initials}
        </span>
      )}

      <button
        type="button"
        onClick={() => void signOut()}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 shadow-sm transition-colors hover:bg-white dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        {a.signOut}
      </button>
    </div>
  );
}
