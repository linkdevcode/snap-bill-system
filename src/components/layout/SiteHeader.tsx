"use client";

import { AuthToolbar } from "@/components/auth/AuthToolbar";

export function SiteHeader() {
  return (
    <div className="mb-6 flex min-h-[90px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="flex min-h-[90px] min-w-0 flex-1 items-center justify-center rounded-xl border border-dashed border-tech-slate-300 bg-tech-slate-50 px-4 text-xs font-medium uppercase tracking-wide text-tech-slate-500 dark:border-tech-slate-700 dark:bg-tech-slate-900 dark:text-warm-cream-400"
        aria-hidden
      >
        Ad placeholder · top banner · min-h 90px
      </div>

      <div className="flex shrink-0 justify-end sm:pl-4">
        <AuthToolbar />
      </div>
    </div>
  );
}
