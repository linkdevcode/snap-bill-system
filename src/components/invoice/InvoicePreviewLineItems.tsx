"use client";

import { lineTotalFromItem } from "@/lib/money";
import type { LineItem } from "@/types/invoice";
import type { InvoicePreviewLabels } from "@/utils/translations";

interface InvoicePreviewLineItemsProps {
  items: LineItem[];
  preview: InvoicePreviewLabels;
  formatInvoiceMoney: (amount: number) => string;
}

export function InvoicePreviewLineItems({
  items,
  preview,
  formatInvoiceMoney,
}: InvoicePreviewLineItemsProps) {
  return (
    <>
      <ul className="snapbill-line-items-mobile space-y-2.5">
        {items.map((item) => {
          const lineTotal = lineTotalFromItem(item.quantity, item.unit_price);
          const label = item.description.trim() || preview.defaultLineItem;

          return (
            <li
              key={item.id}
              className="snapbill-avoid-break list-none rounded-lg border border-slate-100 bg-slate-50/70 p-3"
            >
              <p className="break-words text-sm font-medium leading-snug text-slate-900">
                {label}
              </p>
              <div className="mt-2.5 flex items-end justify-between gap-3 border-t border-slate-100/80 pt-2.5">
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-400">
                    {preview.qtyTimesUnit}
                  </span>
                  <p className="mt-0.5 text-xs leading-snug tabular-nums text-slate-800">
                    <span className="font-medium">{item.quantity}</span>
                    <span
                      className="mx-1.5 font-normal text-slate-400"
                      aria-hidden
                    >
                      ×
                    </span>
                    <span className="break-all sm:break-normal">
                      {formatInvoiceMoney(item.unit_price)}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-[10px] font-bold uppercase leading-tight tracking-wide text-slate-400">
                    {preview.lineTotal}
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold tabular-nums text-slate-900">
                    {formatInvoiceMoney(lineTotal)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="snapbill-line-items-desktop snapbill-print-avoid-break overflow-x-auto">
        <table className="snapbill-line-items-table w-full min-w-[280px] table-fixed border-collapse text-[11px] leading-snug sm:text-xs">
          <colgroup>
            <col className="snapbill-line-col-desc" />
            <col className="snapbill-line-col-qty" />
            <col className="snapbill-line-col-unit" />
            <col className="snapbill-line-col-total" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-100 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
              <th className="py-2 pr-2 font-bold">{preview.description}</th>
              <th className="py-2 pr-2 text-right font-bold">{preview.qty}</th>
              <th className="py-2 pr-2 text-right font-bold">{preview.unit}</th>
              <th className="py-2 text-right font-bold">{preview.lineTotal}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
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
                  <td className="py-2.5 pr-2 font-medium leading-snug text-slate-900">
                    <span className="block break-words">{label}</span>
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-right align-top tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-right align-top tabular-nums">
                    {formatInvoiceMoney(item.unit_price)}
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right align-top font-semibold tabular-nums text-slate-900">
                    {formatInvoiceMoney(lineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
