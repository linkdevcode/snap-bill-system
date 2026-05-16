"use client";

import { InvoicePdfDownloadButton } from "@/components/invoice/InvoicePdfDownloadButton";
import { InvoicePrintButton } from "@/components/invoice/InvoicePrintButton";

export function InvoicePreviewActions() {
  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
      <InvoicePdfDownloadButton />
      <InvoicePrintButton />
    </div>
  );
}
