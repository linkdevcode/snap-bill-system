"use client";

import { useCallback } from "react";
import { Printer } from "lucide-react";

import { useInvoice } from "@/context/InvoiceContext";

const printButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-center text-sm font-medium text-indigo-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50 sm:w-auto";

export function InvoicePrintButton() {
  const { labels } = useInvoice();

  const handlePrint = useCallback(() => {
    const paper = document.getElementById("invoice-paper");
    if (!paper) {
      return;
    }
    window.print();
  }, []);

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={printButtonClass}
    >
      <Printer className="h-4 w-4 shrink-0" aria-hidden />
      <span className="text-center leading-snug">
        {labels.previewChrome.printPdf}
      </span>
    </button>
  );
}
