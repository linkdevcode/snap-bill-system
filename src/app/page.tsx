import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/layout/SiteHeader";

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

export default function HomePage() {
  return (
      <div className="min-h-screen bg-warm-cream-50 dark:bg-tech-slate-950">
        <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-6">
          <SiteHeader />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
            <div className="flex min-h-0 flex-col gap-6 xl:col-span-2 xl:flex-row xl:items-start">
              <div className="min-h-0 flex-1">
                <InvoiceEditor />
              </div>
              <div className="min-h-0 flex-1">
                <InvoicePreview />
              </div>
            </div>

            <aside
              className="hidden min-h-[600px] rounded-xl border border-dashed border-tech-slate-300 bg-tech-slate-50 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-4 dark:border-tech-slate-700 dark:bg-tech-slate-900"
              aria-hidden
            >
              <span className="text-center text-xs font-medium uppercase tracking-wide text-tech-slate-500 dark:text-warm-cream-400">
                Ad placeholder · sidebar · min-h 600px
              </span>
            </aside>
          </div>

          <div
            className="mt-6 flex min-h-[600px] w-full items-center justify-center rounded-xl border border-dashed border-tech-slate-300 bg-tech-slate-50 text-xs font-medium uppercase tracking-wide text-tech-slate-500 lg:hidden dark:border-tech-slate-700 dark:bg-tech-slate-900 dark:text-warm-cream-400"
            aria-hidden
          >
            Ad placeholder · sidebar (mobile stack) · min-h 600px
          </div>
        </div>
      </div>
  );
}
