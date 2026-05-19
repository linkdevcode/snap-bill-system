"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { InvoiceLocaleSelectors } from "@/components/invoice/InvoiceLocaleSelectors";

export interface PolicyPageShellProps {
  children: React.ReactNode;
}

export function PolicyPageShell({ children }: PolicyPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 md:px-8 md:py-10">
        <div className="mb-6 flex justify-end">
          <InvoiceLocaleSelectors />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
