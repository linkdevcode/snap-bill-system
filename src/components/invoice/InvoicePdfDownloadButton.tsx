"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";

import { useInvoice } from "@/context/InvoiceContext";
import { exportInvoiceElementToPdf } from "@/lib/export-invoice-pdf";
import type { Invoice } from "@/types/invoice";

function sanitizePdfSegment(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }

  const asciiSafe = trimmed.replace(/[^\x20-\x7E]/g, "_");
  const collapsed = asciiSafe
    .replace(/[/\\:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return collapsed.slice(0, 96);
}

function buildInvoicePdfFilename(invoice: Invoice): string {
  const invoicePart = sanitizePdfSegment(invoice.invoice_number);
  const clientPart = sanitizePdfSegment(invoice.client_data.client_name);

  if (!invoicePart && !clientPart) {
    return "Invoice_Draft.pdf";
  }

  const safeInvoice = invoicePart.length > 0 ? invoicePart : "Draft";
  const safeClient = clientPart.length > 0 ? clientPart : "Client";

  return `Invoice_${safeInvoice}_${safeClient}.pdf`;
}

export function InvoicePdfDownloadButton() {
  const { invoice, labels } = useInvoice();
  const [busy, setBusy] = useState(false);

  const handleDownload = useCallback(async () => {
    const element = document.getElementById("invoice-paper");
    if (!element || !(element instanceof HTMLElement)) {
      return;
    }

    setBusy(true);

    try {
      const filename = buildInvoicePdfFilename(invoice);
      await exportInvoiceElementToPdf(element, filename);
    } finally {
      setBusy(false);
    }
  }, [invoice]);

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={busy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:shadow-indigo-600/25"
      aria-busy={busy}
    >
      <Download className="h-4 w-4 shrink-0" aria-hidden />
      <span className="text-center leading-snug">
        {busy
          ? labels.previewChrome.preparingPdf
          : labels.previewChrome.downloadPdf}
      </span>
    </button>
  );
}
