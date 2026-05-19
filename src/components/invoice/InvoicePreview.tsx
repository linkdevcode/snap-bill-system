"use client";

import { Building2 } from "lucide-react";

import { InvoicePreviewActions } from "@/components/invoice/InvoicePreviewActions";
import { InvoicePreviewLineItems } from "@/components/invoice/InvoicePreviewLineItems";
import { useInvoice } from "@/context/InvoiceContext";
import { formatInvoiceDate, statusLabel } from "@/utils/translations";

const metaLabelClass =
  "text-[10px] font-semibold uppercase tracking-wider text-slate-400";

const metaValueClass = "text-sm font-medium text-slate-800 tabular-nums";

export function InvoicePreview() {
  const { invoice, totals, language, labels, formatInvoiceMoney } = useInvoice();
  const preview = labels.preview;
  const logoSrc = invoice.sender_data.logo_url.trim();

  const senderCompany =
    invoice.sender_data.company_name.trim() || preview.defaultCompany;
  const clientName =
    invoice.client_data.client_name.trim() || preview.defaultClient;

  return (
    <div className="snapbill-print-shell rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 lg:sticky lg:top-6 lg:self-start">
      <div
        className="snapbill-no-print mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        data-snapbill-print-hide
      >
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {labels.previewChrome.livePreview}
        </p>
        <div className="flex w-full justify-center sm:w-auto sm:shrink-0">
          <InvoicePreviewActions />
        </div>
      </div>

      <div className="snapbill-print-area flex justify-center overflow-x-auto print:overflow-visible">
        <section
          id="invoice-paper"
          className="snapbill-invoice-paper relative box-border w-full max-w-[595px] shrink-0 bg-white p-4 text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)] ring-1 ring-black/5 min-h-0 sm:p-6 md:p-8 lg:p-10 print:min-h-0 print:h-auto print:max-h-none print:border-0 print:p-0 print:shadow-none print:ring-0"
          aria-label={labels.previewChrome.previewAria}
          lang={language}
        >
          {/* Header: title + meta left, logo right */}
          <header className="snapbill-print-avoid-break flex items-start justify-between gap-6 pb-2">
            <div className="min-w-0 flex-1">
              <h1 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
                {preview.invoice}
              </h1>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className={metaLabelClass}>{preview.invoiceNumber}</dt>
                  <dd className={metaValueClass}>
                    {invoice.invoice_number || "—"}
                  </dd>
                </div>
                <div className="snapbill-meta-status-cell">
                  <dt className={metaLabelClass}>{preview.status}</dt>
                  <dd className="snapbill-meta-status-dd">
                    <span className="snapbill-status-badge inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-center text-xs font-semibold leading-snug text-slate-800">
                      {statusLabel(invoice.status, language)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className={metaLabelClass}>{preview.issueDate}</dt>
                  <dd className={metaValueClass}>
                    {formatInvoiceDate(invoice.issue_date, language)}
                  </dd>
                </div>
                <div>
                  <dt className={metaLabelClass}>{preview.dueDate}</dt>
                  <dd className={metaValueClass}>
                    {formatInvoiceDate(invoice.due_date, language)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex shrink-0 flex-col items-end">
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoSrc}
                  alt={`${senderCompany} logo`}
                  className="h-16 w-auto max-w-[140px] object-contain object-right"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50"
                  aria-hidden
                >
                  <Building2
                    className="h-6 w-6 text-slate-300"
                    strokeWidth={1.5}
                  />
                  <span className="sr-only">{preview.logoPlaceholder}</span>
                </div>
              )}
            </div>
          </header>

          {/* FROM / TO row */}
          <section className="snapbill-from-to-row snapbill-print-avoid-break my-6 flex items-start justify-between gap-8 border-b border-slate-100 py-6 print:my-4 print:py-4">
            <div className="snapbill-from-to-col min-w-0 max-w-[48%] flex-1">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {preview.from}
              </p>
              <p className="text-base font-bold text-slate-900">{senderCompany}</p>
              {invoice.sender_data.sender_name.trim() ? (
                <p className="mt-1 text-sm text-slate-700">
                  {invoice.sender_data.sender_name}
                </p>
              ) : null}
              <div className="mt-2 space-y-1 text-sm leading-snug text-slate-600">
                {invoice.sender_data.email ? (
                  <p>{invoice.sender_data.email}</p>
                ) : null}
                {invoice.sender_data.address ? (
                  <p className="whitespace-pre-wrap">
                    {invoice.sender_data.address}
                  </p>
                ) : null}
                {invoice.sender_data.tax_id ? (
                  <p>
                    {preview.taxVat}: {invoice.sender_data.tax_id}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="snapbill-from-to-col snapbill-from-to-col--to min-w-0 max-w-[48%] flex-1 text-right">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {preview.to}
              </p>
              <p className="text-base font-bold text-slate-900">{clientName}</p>
              <div className="mt-2 space-y-1 text-sm leading-snug text-slate-600">
                {invoice.client_data.client_email ? (
                  <p>{invoice.client_data.client_email}</p>
                ) : null}
                {invoice.client_data.client_address ? (
                  <p className="whitespace-pre-wrap">
                    {invoice.client_data.client_address}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <InvoicePreviewLineItems
            items={invoice.items}
            preview={preview}
            formatInvoiceMoney={formatInvoiceMoney}
          />

          {/* Totals */}
          <div className="snapbill-invoice-totals snapbill-print-avoid-break mt-6 ml-auto w-full max-w-xs space-y-2 pt-2 text-right text-sm print:mt-4">
            <div className="snapbill-totals-row flex justify-end gap-6 text-slate-600">
              <span className="snapbill-totals-label">{preview.subtotal}</span>
              <span className="snapbill-totals-value min-w-[7rem] tabular-nums font-medium text-slate-900">
                {formatInvoiceMoney(totals.subtotal)}
              </span>
            </div>
            <div className="snapbill-totals-row flex justify-end gap-6 text-slate-600">
              <span className="snapbill-totals-label">{preview.tax}</span>
              <span className="snapbill-totals-value min-w-[7rem] tabular-nums font-medium text-slate-900">
                {formatInvoiceMoney(totals.tax_amount)}
              </span>
            </div>
            <div className="snapbill-totals-row flex justify-end gap-6 text-slate-600">
              <span className="snapbill-totals-label">{preview.discount}</span>
              <span className="snapbill-totals-value min-w-[7rem] tabular-nums font-medium text-slate-900">
                −{formatInvoiceMoney(totals.discount_amount)}
              </span>
            </div>
            <div className="snapbill-totals-row snapbill-totals-row--total flex justify-end gap-6 border-t border-slate-100 pt-3 text-base font-black text-slate-900">
              <span className="snapbill-totals-label uppercase tracking-tight">
                {preview.total}
              </span>
              <span className="snapbill-totals-value min-w-[7rem] tabular-nums text-indigo-600">
                {formatInvoiceMoney(totals.total_amount)}
              </span>
            </div>
          </div>

          {invoice.notes.trim() ? (
            <section className="snapbill-print-avoid-break mt-8 border-t border-slate-100 pt-6 print:mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {preview.notes}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {invoice.notes}
              </p>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
