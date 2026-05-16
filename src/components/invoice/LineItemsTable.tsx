"use client";

import { Plus, Trash2 } from "lucide-react";

import { useInvoice } from "@/context/InvoiceContext";
import { formatMoney, lineTotalFromItem, roundCurrency } from "@/lib/money";

export function LineItemsTable() {
  const { invoice, addItem, updateItem, deleteItem } = useInvoice();

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
      <legend className="sr-only">Line items</legend>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-600 dark:text-warm-cream-300">
          Line items
        </p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1.5 rounded-lg bg-tech-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-tech-slate-800 dark:bg-warm-cream-100 dark:text-tech-slate-950 dark:hover:bg-warm-cream-200"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add item
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-tech-slate-200 dark:border-tech-slate-700">
        <table className="min-w-full divide-y divide-tech-slate-200 text-sm dark:divide-tech-slate-700">
          <thead className="bg-tech-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-tech-slate-600 dark:bg-tech-slate-950 dark:text-warm-cream-300">
            <tr>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Unit price</th>
              <th className="px-3 py-2 text-right">Line total</th>
              <th className="w-12 px-3 py-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tech-slate-100 dark:divide-tech-slate-800">
            {invoice.items.map((item) => {
              const lineTotal = lineTotalFromItem(item.quantity, item.unit_price);
              return (
                <tr key={item.id}>
                  <td className="px-3 py-2 align-top">
                    <input
                      className="w-full min-w-[140px] rounded border border-transparent bg-transparent px-2 py-1 text-tech-slate-900 outline-none hover:border-tech-slate-200 focus:border-tech-slate-300 focus:ring-1 focus:ring-tech-slate-400 dark:text-warm-cream-50 dark:hover:border-tech-slate-700 dark:focus:border-tech-slate-600"
                      value={item.description}
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
                      className="w-20 rounded border border-transparent bg-transparent px-2 py-1 text-tech-slate-900 outline-none hover:border-tech-slate-200 focus:border-tech-slate-300 focus:ring-1 focus:ring-tech-slate-400 dark:text-warm-cream-50 dark:hover:border-tech-slate-700 dark:focus:border-tech-slate-600"
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
                      className="w-28 rounded border border-transparent bg-transparent px-2 py-1 text-tech-slate-900 outline-none hover:border-tech-slate-200 focus:border-tech-slate-300 focus:ring-1 focus:ring-tech-slate-400 dark:text-warm-cream-50 dark:hover:border-tech-slate-700 dark:focus:border-tech-slate-600"
                      value={item.unit_price}
                      onChange={(e) => {
                        const parsed = Number.parseFloat(e.target.value);
                        const next = Number.isFinite(parsed)
                          ? roundCurrency(parsed)
                          : roundCurrency(0);
                        updateItem(item.id, { unit_price: next });
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 align-top text-right tabular-nums text-tech-slate-700 dark:text-warm-cream-200">
                    {formatMoney(lineTotal)}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <button
                      type="button"
                      onClick={() => handleRowTrashClick(item.id)}
                      className="rounded p-1 text-tech-slate-500 hover:bg-tech-slate-100 hover:text-red-600 dark:text-warm-cream-400 dark:hover:bg-tech-slate-800 dark:hover:text-red-400"
                      aria-label={
                        canDeleteRow ? "Remove line item" : "Clear line item"
                      }
                      title={
                        canDeleteRow ? "Remove line item" : "Clear line item"
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
