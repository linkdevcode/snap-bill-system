"use client";

import { InvoicePdfDownloadButton } from "@/components/invoice/InvoicePdfDownloadButton";
import { useInvoice } from "@/context/InvoiceContext";
import { lineTotalFromItem } from "@/lib/money";
import { formatInvoiceDate, statusLabel } from "@/utils/translations";

export function InvoicePreview() {
  const { invoice, totals, language, labels, formatInvoiceMoney } = useInvoice();
  const preview = labels.preview;
  const logoSrc = invoice.sender_data.logo_url.trim();

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 lg:sticky lg:top-6 lg:self-start">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {labels.previewChrome.livePreview}
        </p>
        <InvoicePdfDownloadButton />
      </div>

      <div className="flex justify-center overflow-x-auto">
        <section
          id="invoice-paper"
          className="relative box-border min-h-[842px] w-full max-w-[595px] shrink-0 bg-white p-10 text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)] ring-1 ring-black/5 print:border-0 print:shadow-none print:ring-0"
          aria-label={labels.previewChrome.previewAria}
          lang={language}
        >
          <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              {logoSrc ? (
                <div className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoSrc}
                    alt={`${invoice.sender_data.company_name.trim() || "Company"} logo`}
                    className="h-14 max-h-16 max-w-[220px] object-contain object-left"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  {preview.invoice}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {invoice.sender_data.company_name.trim() ||
                    preview.defaultCompany}
                </h1>
                <p className="mt-1 text-sm text-slate-700">
                  {invoice.sender_data.sender_name}
                </p>
                <div className="mt-3 space-y-1 text-sm leading-snug text-slate-700">
                  {invoice.sender_data.email ? (
                    <p>{invoice.sender_data.email}</p>
                  ) : null}
                  {invoice.sender_data.address ? (
                    <p className="whitespace-pre-wrap">
                      {invoice.sender_data.address}
                    </p>
                  ) : null}
                  {invoice.sender_data.tax_id ? (
                    <p className="text-slate-600">
                      {preview.taxVat}: {invoice.sender_data.tax_id}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <dl className="grid gap-2 text-sm text-slate-800 sm:text-right">
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {preview.invoiceNumber}
                </dt>
                <dd className="font-semibold tabular-nums text-slate-900">
                  {invoice.invoice_number || "—"}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {preview.status}
                </dt>
                <dd className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                  {statusLabel(invoice.status, language)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {preview.issueDate}
                </dt>
                <dd className="tabular-nums">
                  {formatInvoiceDate(invoice.issue_date, language)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {preview.dueDate}
                </dt>
                <dd className="tabular-nums">
                  {formatInvoiceDate(invoice.due_date, language)}
                </dd>
              </div>
            </dl>
          </header>

          <section className="mt-6 grid gap-6 border-b border-slate-200 pb-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {preview.billTo}
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {invoice.client_data.client_name.trim() || preview.defaultClient}
              </p>
              <div className="mt-2 space-y-1 text-sm text-slate-700">
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
            <div className="text-right sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {preview.amountDue}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-indigo-600">
                {formatInvoiceMoney(totals.total_amount)}
              </p>
            </div>
          </section>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                  <th className="py-2 pr-4">{preview.description}</th>
                  <th className="py-2 pr-4 text-right">{preview.qty}</th>
                  <th className="py-2 pr-4 text-right">{preview.unit}</th>
                  <th className="py-2 text-right">{preview.lineTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => {
                  const lineTotal = lineTotalFromItem(
                    item.quantity,
                    item.unit_price,
                  );
                  const label =
                    item.description.trim() || preview.defaultLineItem;
                  return (
                    <tr
                      key={item.id}
                      className="snapbill-avoid-break align-top text-slate-800"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {label}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatInvoiceMoney(item.unit_price)}
                      </td>
                      <td className="py-3 text-right tabular-nums font-semibold text-slate-900">
                        {formatInvoiceMoney(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-right text-sm">
            <div className="flex justify-end gap-6 text-slate-700">
              <span>{preview.subtotal}</span>
              <span className="tabular-nums font-medium text-slate-900">
                {formatInvoiceMoney(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-end gap-6 text-slate-700">
              <span>{preview.tax}</span>
              <span className="tabular-nums font-medium text-slate-900">
                {formatInvoiceMoney(totals.tax_amount)}
              </span>
            </div>
            <div className="flex justify-end gap-6 text-slate-700">
              <span>{preview.discount}</span>
              <span className="tabular-nums font-medium text-slate-900">
                −{formatInvoiceMoney(totals.discount_amount)}
              </span>
            </div>
            <div className="flex justify-end gap-6 border-t border-slate-100 pt-2 text-lg font-black text-slate-900">
              <span className="uppercase tracking-tight">{preview.total}:</span>
              <span className="tabular-nums text-indigo-600">
                {formatInvoiceMoney(totals.total_amount)}
              </span>
            </div>
          </div>

          {invoice.notes.trim() ? (
            <section className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {preview.notes}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                {invoice.notes}
              </p>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
