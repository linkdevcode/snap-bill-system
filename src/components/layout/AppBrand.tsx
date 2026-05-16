"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { useInvoice } from "@/context/InvoiceContext";

export function AppBrand() {
  const { labels } = useInvoice();

  return (
    <Link
      href="/"
      className="group flex min-w-0 items-center gap-2.5 rounded-lg outline-none ring-indigo-500 focus-visible:ring-2"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-[1.02]">
        <FileText className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
            SnapBill
          </span>
          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
            {labels.brand.freeTag}
          </span>
        </span>
      </span>
    </Link>
  );
}
