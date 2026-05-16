"use client";

import { InvoicePdfDownloadButton } from "@/components/invoice/InvoicePdfDownloadButton";
import { useInvoice } from "@/context/InvoiceContext";
import { formatMoney, lineTotalFromItem } from "@/lib/money";

function formatDisplayDate(isoDate: string): string {
  const parsed = Date.parse(`${isoDate}T00:00:00`);
  if (!Number.isFinite(parsed)) {
    return isoDate;
  }
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(parsed));
}

export function InvoicePreview() {
  const { invoice, totals } = useInvoice();

  const logoSrc = invoice.sender_data.logo_url.trim();

  return (
    <div className="rounded-xl border border-tech-slate-800/10 bg-white p-4 shadow-sm dark:border-warm-cream-200/10 dark:bg-tech-slate-900 lg:sticky lg:top-6 lg:self-start">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500 dark:text-warm-cream-400">
          Live preview
        </p>
        <InvoicePdfDownloadButton />
      </div>

      <div className="flex justify-center overflow-x-auto">
        <section
          id="invoice-paper"
          className="relative box-border min-h-[842px] w-full max-w-[595px] shrink-0 bg-white p-10 text-tech-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)] ring-1 ring-black/5 print:border-0 print:shadow-none print:ring-0"
          aria-label="Invoice preview sheet"
        >
          <header className="flex flex-col gap-6 border-b border-tech-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              {logoSrc ? (
                <div className="shrink-0">
                  {/* Base64/data URLs from FileReader — native <img> avoids Next/Image remote patterns */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoSrc}
                    alt={`${invoice.sender_data.company_name.trim() || "Company"} logo`}
                    className="h-14 max-h-16 max-w-[220px] object-contain object-left"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tech-slate-500">
                  Invoice
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-tech-slate-900">
                  {invoice.sender_data.company_name.trim() ||
                    "Your company name"}
                </h1>
                <p className="mt-1 text-sm text-tech-slate-700">
                  {invoice.sender_data.sender_name}
                </p>
                <div className="mt-3 space-y-1 text-sm leading-snug text-tech-slate-700">
                  {invoice.sender_data.email ? (
                    <p>{invoice.sender_data.email}</p>
                  ) : null}
                  {invoice.sender_data.address ? (
                    <p className="whitespace-pre-wrap">
                      {invoice.sender_data.address}
                    </p>
                  ) : null}
                  {invoice.sender_data.tax_id ? (
                    <p className="text-tech-slate-600">
                      Tax / VAT: {invoice.sender_data.tax_id}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <dl className="grid gap-2 text-sm text-tech-slate-800 sm:text-right">
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                  Invoice #
                </dt>
                <dd className="font-semibold tabular-nums text-tech-slate-900">
                  {invoice.invoice_number || "—"}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                  Status
                </dt>
                <dd className="inline-flex items-center rounded-full bg-tech-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-tech-slate-800">
                  {invoice.status}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                  Issue date
                </dt>
                <dd className="tabular-nums">
                  {formatDisplayDate(invoice.issue_date)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:items-end">
                <dt className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                  Due date
                </dt>
                <dd className="tabular-nums">
                  {formatDisplayDate(invoice.due_date)}
                </dd>
              </div>
            </dl>
          </header>

          <section className="mt-6 grid gap-6 border-b border-tech-slate-200 pb-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                Bill to
              </p>
              <p className="mt-2 text-lg font-semibold text-tech-slate-900">
                {invoice.client_data.client_name.trim() || "Client name"}
              </p>
              <div className="mt-2 space-y-1 text-sm text-tech-slate-700">
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
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                Amount due
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-tech-slate-900">
                {formatMoney(totals.total_amount)}
              </p>
            </div>
          </section>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-tech-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-tech-slate-600">
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4 text-right">Qty</th>
                  <th className="py-2 pr-4 text-right">Unit</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tech-slate-100">
                {invoice.items.map((item) => {
                  const lineTotal = lineTotalFromItem(
                    item.quantity,
                    item.unit_price,
                  );
                  const label =
                    item.description.trim() || "Line item description";
                  return (
                    <tr
                      key={item.id}
                      className="snapbill-avoid-break align-top text-tech-slate-800"
                    >
                      <td className="py-3 pr-4 font-medium text-tech-slate-900">
                        {label}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {formatMoney(item.unit_price)}
                      </td>
                      <td className="py-3 text-right tabular-nums font-semibold text-tech-slate-900">
                        {formatMoney(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between gap-6 text-tech-slate-700">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-tech-slate-900">
                {formatMoney(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-tech-slate-700">
              <span>Tax</span>
              <span className="tabular-nums font-medium text-tech-slate-900">
                {formatMoney(totals.tax_amount)}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-tech-slate-700">
              <span>Discount</span>
              <span className="tabular-nums font-medium text-tech-slate-900">
                −{formatMoney(totals.discount_amount)}
              </span>
            </div>
            <div className="flex justify-between gap-6 border-t border-tech-slate-200 pt-3 text-base font-semibold text-tech-slate-900">
              <span>Total</span>
              <span className="tabular-nums">
                {formatMoney(totals.total_amount)}
              </span>
            </div>
          </div>

          {invoice.notes.trim() ? (
            <section className="mt-8 border-t border-tech-slate-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-500">
                Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-tech-slate-800">
                {invoice.notes}
              </p>
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
