"use client";

import { AuthToolbar } from "@/components/auth/AuthToolbar";
import { AdSlot } from "@/components/invoice/AdSlot";
import type { WorkspaceView } from "@/types/workspace";

export interface SiteHeaderProps {
  showWorkspaceNav?: boolean;
  workspaceView?: WorkspaceView;
  onWorkspaceViewChange?: (view: WorkspaceView) => void;
}

export function SiteHeader({
  showWorkspaceNav = false,
  workspaceView = "editor",
  onWorkspaceViewChange,
}: SiteHeaderProps) {
  const topSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1">
        <AdSlot slotId={topSlotId} layout="banner" />
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4 lg:pl-4">
        {showWorkspaceNav && onWorkspaceViewChange ? (
          <div
            className="flex w-full justify-end rounded-lg border border-tech-slate-200 bg-white p-0.5 dark:border-tech-slate-700 dark:bg-tech-slate-950 sm:w-auto"
            role="tablist"
            aria-label="Workspace"
          >
            <button
              type="button"
              role="tab"
              aria-selected={workspaceView === "editor"}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                workspaceView === "editor"
                  ? "bg-tech-slate-900 text-white dark:bg-warm-cream-100 dark:text-tech-slate-950"
                  : "text-tech-slate-700 hover:bg-tech-slate-50 dark:text-warm-cream-200 dark:hover:bg-tech-slate-900"
              }`}
              onClick={() => onWorkspaceViewChange("editor")}
            >
              Editor
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspaceView === "dashboard"}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                workspaceView === "dashboard"
                  ? "bg-tech-slate-900 text-white dark:bg-warm-cream-100 dark:text-tech-slate-950"
                  : "text-tech-slate-700 hover:bg-tech-slate-50 dark:text-warm-cream-200 dark:hover:bg-tech-slate-900"
              }`}
              onClick={() => onWorkspaceViewChange("dashboard")}
            >
              My Invoices
            </button>
          </div>
        ) : null}

        <div className="flex justify-end">
          <AuthToolbar />
        </div>
      </div>
    </div>
  );
}
