"use client";

import { useCallback, useState } from "react";
import { Download } from "lucide-react";

import { useInvoice } from "@/context/InvoiceContext";
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
  const { invoice } = useInvoice();
  const [busy, setBusy] = useState(false);

  const handleDownload = useCallback(async () => {
    const element = document.getElementById("invoice-paper");
    if (!element || !(element instanceof HTMLElement)) {
      return;
    }

    setBusy(true);

    try {
      const imported = await import("html2pdf.js");
      const html2pdf = imported.default;

      const filename = buildInvoicePdfFilename(invoice);

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY,
            backgroundColor: "#ffffff",
            onclone: (clonedDoc: Document) => {
              const node = clonedDoc.getElementById("invoice-paper");
              if (!(node instanceof HTMLElement)) {
                return;
              }

              node.style.boxShadow = "none";
              node.style.borderRadius = "0";
              node.style.outline = "none";
              node.style.border = "none";
              node.style.minHeight = "auto";

              node.querySelectorAll<HTMLElement>("[data-pdf-hide]").forEach(
                (el) => {
                  el.style.display = "none";
                },
              );

              clonedDoc.documentElement.style.backgroundColor = "#ffffff";
              clonedDoc.body.style.backgroundColor = "#ffffff";
            },
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["css", "legacy"],
            avoid: ["tr", ".snapbill-avoid-break"],
          },
        })
        .from(element)
        .save();
    } finally {
      setBusy(false);
    }
  }, [invoice]);

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:text-tech-slate-950 dark:hover:bg-emerald-400"
      aria-busy={busy}
    >
      <Download className="h-4 w-4" aria-hidden />
      {busy ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
