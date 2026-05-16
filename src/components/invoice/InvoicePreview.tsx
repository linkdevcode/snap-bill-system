"use client";

import { Building2 } from "lucide-react";

import { InvoicePreviewActions } from "@/components/invoice/InvoicePreviewActions";
import { useInvoice } from "@/context/InvoiceContext";
import { lineTotalFromItem } from "@/lib/money";
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
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900 lg:sticky lg:top-6 lg:self-start">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {labels.previewChrome.livePreview}
        </p>
        <div className="flex w-full justify-center sm:w-auto sm:shrink-0">
          <InvoicePreviewActions />
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto">
        <section
          id="invoice-paper"
          className="relative box-border min-h-[842px] w-full max-w-[595px] shrink-0 bg-white p-10 text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)] ring-1 ring-black/5 print:border-0 print:shadow-none print:ring-0"
          aria-label={labels.previewChrome.previewAria}
          lang={language}
        >
          {/* Header: title + meta left, logo right */}
          <header className="flex items-start justify-between gap-6 border-b border-slate-100 pb-6">
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
                <div>
                  <dt className={metaLabelClass}>{preview.status}</dt>
                  <dd>
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
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
          <section className="my-6 flex items-start justify-between gap-8 border-y border-slate-100 py-6">
            <div className="min-w-0 max-w-[48%] flex-1">
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

            <div className="min-w-0 max-w-[48%] flex-1 text-right">
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

          {/* Line items — mobile */}
          <ul className="space-y-2 md:hidden print:hidden">
            {invoice.items.map((item) => {
              const lineTotal = lineTotalFromItem(
                item.quantity,
                item.unit_price,
              );
              const label =
                item.description.trim() || preview.defaultLineItem;
              return (
                <li
                  key={item.id}
                  className="snapbill-avoid-break list-none rounded-lg border border-slate-100 bg-slate-50/60 p-3"
                >
                  <p className="font-medium leading-snug text-slate-900">
                    {label}
                  </p>
                  <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <dt className="font-bold uppercase tracking-wider text-slate-400">
                        {preview.qty}
                      </dt>
                      <dd className="mt-0.5 tabular-nums text-slate-800">
                        {item.quantity}
                      </dd>
                    </div>
                    <div className="text-right">
                      <dt className="font-bold uppercase tracking-wider text-slate-400">
                        {preview.unit}
                      </dt>
                      <dd className="mt-0.5 tabular-nums text-slate-800">
                        {formatInvoiceMoney(item.unit_price)}
                      </dd>
                    </div>
                    <div className="text-right">
                      <dt className="font-bold uppercase tracking-wider text-slate-400">
                        {preview.lineTotal}
                      </dt>
                      <dd className="mt-0.5 tabular-nums font-semibold text-slate-900">
                        {formatInvoiceMoney(lineTotal)}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>

          {/* Line items — desktop */}
          <div className="hidden overflow-x-auto md:block print:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="py-2.5 pr-4">{preview.description}</th>
                  <th className="py-2.5 pr-4 text-right">{preview.qty}</th>
                  <th className="py-2.5 pr-4 text-right">{preview.unit}</th>
                  <th className="py-2.5 text-right">{preview.lineTotal}</th>
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

          {/* Totals */}
          <div className="mt-6 ml-auto w-full max-w-xs space-y-2 border-t border-slate-100 pt-4 text-right text-sm">
            <div className="flex justify-end gap-6 text-slate-600">
              <span>{preview.subtotal}</span>
              <span className="min-w-[7rem] tabular-nums font-medium text-slate-900">
                {formatInvoiceMoney(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-end gap-6 text-slate-600">
              <span>{preview.tax}</span>
              <span className="min-w-[7rem] tabular-nums font-medium text-slate-900">
                {formatInvoiceMoney(totals.tax_amount)}
              </span>
            </div>
            <div className="flex justify-end gap-6 text-slate-600">
              <span>{preview.discount}</span>
              <span className="min-w-[7rem] tabular-nums font-medium text-slate-900">
                −{formatInvoiceMoney(totals.discount_amount)}
              </span>
            </div>
            <div className="flex justify-end gap-6 border-t border-slate-100 pt-3 text-base font-black text-slate-900">
              <span className="uppercase tracking-tight">{preview.total}</span>
              <span className="min-w-[7rem] tabular-nums text-indigo-600">
                {formatInvoiceMoney(totals.total_amount)}
              </span>
            </div>
          </div>

          {invoice.notes.trim() ? (
            <section className="mt-8 border-t border-slate-100 pt-6">
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
