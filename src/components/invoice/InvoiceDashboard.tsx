"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FilePenLine, Loader2, Trash2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useInvoice } from "@/context/InvoiceContext";
import {
  type InvoiceDbRow,
  normalizeInvoiceRow,
  parseClientData,
  parseInvoiceStatus,
} from "@/lib/invoice-db";
import { formatMoney } from "@/lib/money";
import type { InvoiceStatus } from "@/types/invoice";
import {
  LANGUAGE_DATE_LOCALE,
  type InvoiceLanguage,
} from "@/types/locale";
import { statusLabel } from "@/utils/translations";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

function StatusBadge({
  status,
  language,
}: {
  status: InvoiceStatus;
  language: InvoiceLanguage;
}) {
  const styles: Record<InvoiceStatus, string> = {
    draft:
      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-warm-cream-100",
    sent: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100",
    paid: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-50",
    overdue:
      "bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[status]}`}
    >
      {statusLabel(status, language)}
    </span>
  );
}

function formatCreatedAt(iso: string, language: InvoiceLanguage): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) {
    return "—";
  }
  const locale = LANGUAGE_DATE_LOCALE[language];
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(t));
}

const STATUS_OPTIONS: readonly InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
] as const;

export interface InvoiceDashboardProps {
  onSwitchToEditor: () => void;
}

export function InvoiceDashboard({ onSwitchToEditor }: InvoiceDashboardProps) {
  const { user, supabaseConfigured } = useAuth();
  const { hydrateInvoiceFromRemoteRow, resetInvoiceDraft, invoice, language, labels } =
    useInvoice();

  const d = labels.dashboard;

  const userId = user?.id ?? null;

  const [rows, setRows] = useState<InvoiceDbRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadRows = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!supabaseConfigured || !client || !userId) {
      setRows([]);
      setLoading(false);
      return;
    }

    setListError(null);
    setLoading(true);

    const { data, error } = await client
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      setListError(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    const next: InvoiceDbRow[] = [];
    for (const raw of data ?? []) {
      if (!raw || typeof raw !== "object") continue;
      const normalized = normalizeInvoiceRow(raw as Record<string, unknown>);
      if (normalized) {
        next.push(normalized);
      }
    }

    setRows(next);
    setLoading(false);
  }, [supabaseConfigured, userId]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const handleEdit = useCallback(
    (row: InvoiceDbRow) => {
      hydrateInvoiceFromRemoteRow(row);
      onSwitchToEditor();
    },
    [hydrateInvoiceFromRemoteRow, onSwitchToEditor],
  );

  const handleDelete = useCallback(
    async (row: InvoiceDbRow) => {
      const client = getSupabaseBrowserClient();
      if (!client || !userId) return;

      const ok = window.confirm(
        `Delete invoice ${row.invoice_number}? This cannot be undone.`,
      );
      if (!ok) return;

      setBusyId(row.id);
      setListError(null);

      const { error } = await client
        .from("invoices")
        .delete()
        .eq("id", row.id)
        .eq("user_id", userId);

      setBusyId(null);

      if (error) {
        setListError(error.message);
        return;
      }

      if (invoice.id === row.id) {
        resetInvoiceDraft();
      }

      await loadRows();
    },
    [invoice.id, loadRows, resetInvoiceDraft, userId],
  );

  const handleStatusChange = useCallback(
    async (row: InvoiceDbRow, nextStatus: InvoiceStatus) => {
      const client = getSupabaseBrowserClient();
      if (!client || !userId) return;

      setBusyId(row.id);
      setListError(null);

      const { error } = await client
        .from("invoices")
        .update({ status: nextStatus })
        .eq("id", row.id)
        .eq("user_id", userId);

      setBusyId(null);

      if (error) {
        setListError(error.message);
        return;
      }

      if (invoice.id === row.id) {
        hydrateInvoiceFromRemoteRow({ ...row, status: nextStatus });
      }

      await loadRows();
    },
    [hydrateInvoiceFromRemoteRow, invoice.id, loadRows, userId],
  );

  const emptyState = useMemo(() => {
    if (!supabaseConfigured || !userId) {
      return d.emptyNotConfigured;
    }
    return d.emptyNoInvoices;
  }, [d.emptyNoInvoices, d.emptyNotConfigured, supabaseConfigured, userId]);

  return (
    <div className="rounded-xl border border-tech-slate-800/10 bg-white p-5 shadow-sm dark:border-warm-cream-200/10 dark:bg-tech-slate-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-tech-slate-900 dark:text-warm-cream-50">
            {d.title}
          </h2>
          <p className="mt-1 text-xs text-tech-slate-600 dark:text-warm-cream-300">
            {d.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void loadRows()}
            className="rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-xs font-semibold text-tech-slate-800 hover:bg-tech-slate-50 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50 dark:hover:bg-tech-slate-800"
          >
            {d.refresh}
          </button>
          <button
            type="button"
            onClick={() => {
              resetInvoiceDraft();
              onSwitchToEditor();
            }}
            className="rounded-lg bg-tech-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-tech-slate-800 dark:bg-warm-cream-100 dark:text-tech-slate-950 dark:hover:bg-warm-cream-200"
          >
            {d.newInvoice}
          </button>
        </div>
      </div>

      {listError ? (
        <p
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-50"
          role="alert"
        >
          {listError}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-tech-slate-200 dark:border-tech-slate-700">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead className="bg-tech-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-tech-slate-600 dark:bg-tech-slate-950 dark:text-warm-cream-300">
            <tr>
              <th className="px-3 py-2">{d.invoiceNumber}</th>
              <th className="px-3 py-2">{d.client}</th>
              <th className="px-3 py-2 text-right">{d.total}</th>
              <th className="px-3 py-2">{d.created}</th>
              <th className="px-3 py-2">{d.status}</th>
              <th className="px-3 py-2 text-right">{d.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tech-slate-100 dark:divide-tech-slate-800">
            {loading ? (
              <tr>
                <td className="px-3 py-10 text-center" colSpan={6}>
                  <span className="inline-flex items-center gap-2 text-sm text-tech-slate-600 dark:text-warm-cream-300">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {d.loading}
                  </span>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-8 text-center text-tech-slate-600 dark:text-warm-cream-300"
                  colSpan={6}
                >
                  {emptyState}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const client = parseClientData(row.client_data);
                const displayName =
                  client.client_name.trim() ||
                  client.client_email.trim() ||
                  "—";
                const total = Number(row.total_amount ?? 0);

                return (
                  <tr
                    key={row.id}
                    className="align-middle text-tech-slate-900 dark:text-warm-cream-50"
                  >
                    <td className="px-3 py-3 font-semibold tabular-nums">
                      {row.invoice_number}
                    </td>
                    <td className="px-3 py-3">{displayName}</td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">
                      {formatMoney(total, row.currency)}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-tech-slate-700 dark:text-warm-cream-200">
                      {formatCreatedAt(row.created_at, language)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <StatusBadge
                          status={parseInvoiceStatus(row.status)}
                          language={language}
                        />
                        <label className="sr-only" htmlFor={`status-${row.id}`}>
                          {d.changeStatus}: {row.invoice_number}
                        </label>
                        <select
                          id={`status-${row.id}`}
                          className="w-full rounded-md border border-tech-slate-200 bg-white px-2 py-1 text-xs text-tech-slate-900 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50 sm:w-36"
                          value={parseInvoiceStatus(row.status)}
                          disabled={busyId === row.id}
                          onChange={(e) => {
                            const next = parseInvoiceStatus(e.target.value);
                            void handleStatusChange(row, next);
                          }}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {statusLabel(opt, language)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          disabled={busyId === row.id}
                          className="rounded p-2 text-tech-slate-600 hover:bg-tech-slate-100 hover:text-tech-slate-900 disabled:opacity-50 dark:text-warm-cream-300 dark:hover:bg-tech-slate-800 dark:hover:text-warm-cream-50"
                          aria-label={`${d.editInvoice} ${row.invoice_number}`}
                        >
                          <FilePenLine className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(row)}
                          disabled={busyId === row.id}
                          className="rounded p-2 text-tech-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-warm-cream-300 dark:hover:bg-red-900/30 dark:hover:text-red-200"
                          aria-label={`${d.deleteInvoice} ${row.invoice_number}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
