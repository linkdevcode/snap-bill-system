import { Suspense } from "react";

import { InvoiceShell } from "@/components/layout/InvoiceShell";

function HomeFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <span className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <InvoiceShell />
    </Suspense>
  );
}
