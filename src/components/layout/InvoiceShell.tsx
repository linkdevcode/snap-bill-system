"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { InvoiceDashboard } from "@/components/invoice/InvoiceDashboard";
import { AdSlot } from "@/components/invoice/AdSlot";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import type { WorkspaceView } from "@/types/workspace";

const InvoiceEditor = dynamic(
  () =>
    import("@/components/invoice/InvoiceEditor").then((m) => m.InvoiceEditor),
  { ssr: false },
);

const InvoicePreview = dynamic(
  () =>
    import("@/components/invoice/InvoicePreview").then(
      (m) => m.InvoicePreview,
    ),
  { ssr: false },
);

export function InvoiceShell() {
  const { session, loading } = useAuth();
  const [view, setView] = useState<WorkspaceView>("editor");

  useEffect(() => {
    if (!loading && !session) {
      setView("editor");
    }
  }, [loading, session]);

  const showWorkspaceNav = Boolean(session && !loading);
  const sidebarSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "";

  return (
    <div className="min-h-screen bg-warm-cream-50 dark:bg-tech-slate-950">
      <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-6">
        <SiteHeader
          showWorkspaceNav={showWorkspaceNav}
          workspaceView={view}
          onWorkspaceViewChange={setView}
        />

        {view === "dashboard" && session ? (
          <InvoiceDashboard onSwitchToEditor={() => setView("editor")} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
            <div className="flex min-h-0 flex-col gap-6 xl:col-span-2 xl:flex-row xl:items-start">
              <div className="min-h-0 flex-1">
                <InvoiceEditor />
              </div>
              <div className="min-h-0 flex-1">
                <InvoicePreview />
              </div>
            </div>

            <aside className="hidden lg:block lg:w-[300px] xl:w-auto">
              <AdSlot slotId={sidebarSlotId} layout="sidebar" />
            </aside>
          </div>
        )}

        {view === "editor" ? (
          <div className="mt-6 lg:hidden">
            <AdSlot slotId={sidebarSlotId} layout="sidebar" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
