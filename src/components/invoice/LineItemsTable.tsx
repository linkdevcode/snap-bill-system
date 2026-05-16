"use client";

import { Plus, Trash2 } from "lucide-react";

import { useInvoice } from "@/context/InvoiceContext";
import { lineTotalFromItem, roundCurrency } from "@/lib/money";

const cellInputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-900 outline-none transition-shadow placeholder:text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:ring-indigo-400";

const fieldLabelClass =
  "block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400";

export function LineItemsTable() {
  const { invoice, labels, addItem, updateItem, deleteItem, formatInvoiceMoney } =
    useInvoice();

  const { editor: t, preview: p } = labels;

  const canDeleteRow = invoice.items.length > 1;

  const handleRowTrashClick = (id: string) => {
    if (canDeleteRow) {
      deleteItem(id);
      return;
    }

    updateItem(id, {
      description: "",
      quantity: 1,
      unit_price: roundCurrency(0),
    });
  };

  return (
    <fieldset>
      <legend className="sr-only">{t.lineItems}</legend>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t.lineItems}
        </p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-center text-xs font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 dark:shadow-indigo-600/25"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {t.addItem}
        </button>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="space-y-3 md:hidden">
        {invoice.items.map((item) => {
          const lineTotal = lineTotalFromItem(item.quantity, item.unit_price);
          return (
            <li
              key={item.id}
              className="list-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-900/40"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {p.description}
                </span>
                <button
                  type="button"
                  onClick={() => handleRowTrashClick(item.id)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800/80 dark:hover:text-red-400"
                  aria-label={
                    canDeleteRow ? t.removeLineItem : t.clearLineItem
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <label className={fieldLabelClass}>
                <span className="sr-only">{p.description}</span>
                <input
                  className={cellInputClass}
                  value={item.description}
                  placeholder={t.placeholders.lineDescription}
                  onChange={(e) =>
                    updateItem(item.id, { description: e.target.value })
                  }
                />
              </label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className={fieldLabelClass}>
                  {p.qty}
                  <input
                    type="number"
                    min={1}
                    step={1}
                    className={cellInputClass}
                    value={item.quantity}
                    onChange={(e) => {
                      const raw = Number.parseInt(e.target.value, 10);
                      const next = Number.isFinite(raw)
                        ? Math.max(1, Math.trunc(raw))
                        : 1;
                      updateItem(item.id, { quantity: next });
                    }}
                  />
                </label>
                <label className={fieldLabelClass}>
                  {t.unitPrice}
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className={cellInputClass}
                    value={item.unit_price}
                    placeholder="0.00"
                    onChange={(e) => {
                      const parsed = Number.parseFloat(e.target.value);
                      const next = Number.isFinite(parsed)
                        ? roundCurrency(parsed)
                        : roundCurrency(0);
                      updateItem(item.id, { unit_price: next });
                    }}
                  />
                </label>
              </div>
              <p className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200 pt-2 text-sm dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {p.lineTotal}
                </span>
                <span className="tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
                  {formatInvoiceMoney(lineTotal)}
                </span>
              </p>
            </li>
          );
        })}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead className="bg-slate-100 text-left text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2.5">{p.description}</th>
              <th className="px-3 py-2.5">{p.qty}</th>
              <th className="px-3 py-2.5">{t.unitPrice}</th>
              <th className="px-3 py-2.5 text-right">{p.lineTotal}</th>
              <th className="w-12 px-3 py-2.5">
                <span className="sr-only">{labels.dashboard.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoice.items.map((item) => {
              const lineTotal = lineTotalFromItem(
                item.quantity,
                item.unit_price,
              );
              return (
                <tr key={item.id} className="bg-white dark:bg-slate-950/50">
                  <td className="px-3 py-2 align-top">
                    <input
                      className={`w-full min-w-[140px] ${cellInputClass} mt-0`}
                      value={item.description}
                      placeholder={t.placeholders.lineDescription}
                      onChange={(e) =>
                        updateItem(item.id, { description: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="number"
                      min={1}
                      step={1}
                      className={`w-20 ${cellInputClass} mt-0`}
                      value={item.quantity}
                      onChange={(e) => {
                        const raw = Number.parseInt(e.target.value, 10);
                        const next = Number.isFinite(raw)
                          ? Math.max(1, Math.trunc(raw))
                          : 1;
                        updateItem(item.id, { quantity: next });
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className={`w-28 ${cellInputClass} mt-0`}
                      value={item.unit_price}
                      placeholder="0.00"
                      onChange={(e) => {
                        const parsed = Number.parseFloat(e.target.value);
                        const next = Number.isFinite(parsed)
                          ? roundCurrency(parsed)
                          : roundCurrency(0);
                        updateItem(item.id, { unit_price: next });
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 align-top text-right tabular-nums font-medium text-slate-700 dark:text-slate-200">
                    {formatInvoiceMoney(lineTotal)}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <button
                      type="button"
                      onClick={() => handleRowTrashClick(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800/80 dark:hover:text-red-400"
                      aria-label={
                        canDeleteRow ? t.removeLineItem : t.clearLineItem
                      }
                      title={
                        canDeleteRow ? t.removeLineItem : t.clearLineItem
                      }
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
}
