"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const [view, setView] = useState<WorkspaceView>("editor");
  const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    const requested = searchParams.get("view");
    if (requested === "dashboard" && session) {
      setView("dashboard");
    }
  }, [searchParams, session]);

  useEffect(() => {
    if (!loading && !session) {
      setView("editor");
    }
  }, [loading, session]);

  const sidebarSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "";

  return (
    <div className="min-h-screen bg-slate-50 print:min-h-0 dark:bg-slate-950">
      <div className="snapbill-no-print">
        <SiteHeader
          workspaceView={view}
          onWorkspaceViewChange={setView}
          signInOpen={signInOpen}
          onSignInOpenChange={setSignInOpen}
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-12 md:px-8 print:max-w-none print:p-0">
        {view === "dashboard" && session ? (
          <div className="snapbill-no-print">
            <InvoiceDashboard onSwitchToEditor={() => setView("editor")} />
          </div>
        ) : (
          <div className="snapbill-print-layout grid grid-cols-1 gap-8 lg:grid-cols-12 print:gap-0">
            <div className="snapbill-no-print lg:col-span-7">
              <InvoiceEditor />
            </div>
            <div className="lg:col-span-5 print:w-full print:max-w-none">
              <InvoicePreview />
            </div>
            {view === "editor" ? (
              <div className="snapbill-no-print lg:col-span-12">
                <AdSlot slotId={sidebarSlotId} layout="sidebar" />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
