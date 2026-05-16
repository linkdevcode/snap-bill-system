"use client";

import type { DragEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { CloudUpload, ImagePlus, X } from "lucide-react";

import { LineItemsTable } from "@/components/invoice/LineItemsTable";
import { useAuth } from "@/context/AuthContext";
import { useInvoice } from "@/context/InvoiceContext";
import { formatMoney } from "@/lib/money";

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = new Set(["image/png", "image/jpeg"]);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }
      reject(new Error("Unexpected FileReader result"));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

export function InvoiceEditor() {
  const {
    invoice,
    totals,
    cloudSave,
    isSavingInvoice,
    saveInvoice,
    updateSenderData,
    updateClientData,
    updateInvoiceMeta,
  } = useInvoice();

  const { session, loading, supabaseConfigured } = useAuth();

  const showGuestCallout = !loading && session === null;
  const canCloudSave = Boolean(session && supabaseConfigured);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
  ] as const;

  const ingestLogoFile = useCallback(
    async (file: File) => {
      setLogoError(null);

      const mime = file.type.toLowerCase();
      const normalizedMime =
        mime === "image/jpg" ? "image/jpeg" : mime;

      if (!ACCEPTED_MIME_TYPES.has(normalizedMime)) {
        setLogoError("Please upload a PNG or JPG image.");
        return;
      }

      if (file.size > LOGO_MAX_BYTES) {
        setLogoError("Logo must be 2 MB or smaller.");
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        updateSenderData({ logo_url: dataUrl });
      } catch {
        setLogoError("Could not read that image file.");
      }
    },
    [updateSenderData],
  );

  const onLogoInputChange = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) {
        return;
      }
      await ingestLogoFile(file);
    },
    [ingestLogoFile],
  );

  const onLogoDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingLogo(false);
      const file = event.dataTransfer.files?.[0];
      if (!file) {
        return;
      }
      await ingestLogoFile(file);
    },
    [ingestLogoFile],
  );

  const onLogoDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingLogo(true);
  }, []);

  const onLogoDragLeave = useCallback(() => {
    setIsDraggingLogo(false);
  }, []);

  const clearLogo = useCallback(() => {
    setLogoError(null);
    updateSenderData({ logo_url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [updateSenderData]);

  return (
    <div className="rounded-xl border border-tech-slate-800/10 bg-white p-5 shadow-sm dark:border-warm-cream-200/10 dark:bg-tech-slate-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-tech-slate-900 dark:text-warm-cream-50">
          Invoice details
        </h2>

        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
          <button
            type="button"
            onClick={() => void saveInvoice()}
            disabled={!canCloudSave || isSavingInvoice}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-tech-slate-950 dark:hover:bg-sky-400"
          >
            <CloudUpload className="h-4 w-4" aria-hidden />
            {isSavingInvoice ? "Saving…" : "Save to Cloud"}
          </button>

          {cloudSave.phase !== "idle" ? (
            <div
              role="status"
              aria-live="polite"
              className={`w-full rounded-lg border px-3 py-2 text-xs font-medium sm:max-w-sm sm:text-right ${
                cloudSave.phase === "error"
                  ? "border-red-200 bg-red-50 text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-50"
              }`}
            >
              {cloudSave.message}
            </div>
          ) : null}

          {!canCloudSave && supabaseConfigured ? (
            <p className="text-right text-[11px] leading-snug text-tech-slate-500 dark:text-warm-cream-400">
              Sign in to enable cloud saves.
            </p>
          ) : null}

          {!supabaseConfigured ? (
            <p className="text-right text-[11px] leading-snug text-tech-slate-500 dark:text-warm-cream-400">
              Configure Supabase keys locally to enable Save to Cloud.
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">Sender</legend>
        <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-600 dark:text-warm-cream-300">
          Sender
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          className="sr-only"
          aria-label="Upload company logo"
          onChange={(e) => void onLogoInputChange(e.target.files)}
        />

        <div
          className={`rounded-xl border border-dashed px-4 py-5 outline-none transition-colors ${
            isDraggingLogo
              ? "border-tech-slate-900 bg-tech-slate-50 dark:border-warm-cream-100 dark:bg-tech-slate-800"
              : "border-tech-slate-300 bg-tech-slate-50/60 hover:border-tech-slate-400 dark:border-tech-slate-600 dark:bg-tech-slate-950/40 dark:hover:border-tech-slate-500"
          }`}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDraggingLogo(true);
          }}
          onDragOver={onLogoDragOver}
          onDragLeave={onLogoDragLeave}
          onDrop={onLogoDrop}
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tech-slate-900 text-white dark:bg-warm-cream-100 dark:text-tech-slate-950">
                <ImagePlus className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-tech-slate-900 dark:text-warm-cream-50">
                  Company logo
                </p>
                <p className="mt-1 text-xs leading-snug text-tech-slate-600 dark:text-warm-cream-300">
                  Drag & drop a PNG or JPG here, or click to browse. Stored as
                  Base64 on-device for instant preview.
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:items-end">
              <button
                type="button"
                className="rounded-lg bg-tech-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-tech-slate-800 dark:bg-warm-cream-100 dark:text-tech-slate-950 dark:hover:bg-warm-cream-200"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose image
              </button>

              {invoice.sender_data.logo_url ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-tech-slate-200 px-3 py-2 text-xs font-semibold text-tech-slate-800 hover:bg-tech-slate-100 dark:border-tech-slate-700 dark:text-warm-cream-100 dark:hover:bg-tech-slate-800"
                  onClick={clearLogo}
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                  Remove logo
                </button>
              ) : null}
            </div>
          </div>

          {logoError ? (
            <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
              {logoError}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Company name
            <input
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.sender_data.company_name}
              onChange={(e) =>
                updateSenderData({ company_name: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Sender name
            <input
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.sender_data.sender_name}
              onChange={(e) =>
                updateSenderData({ sender_name: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.sender_data.email}
              onChange={(e) => updateSenderData({ email: e.target.value })}
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Tax / VAT ID
            <input
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.sender_data.tax_id}
              onChange={(e) => updateSenderData({ tax_id: e.target.value })}
            />
          </label>
          <label className="sm:col-span-2 block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Address
            <textarea
              rows={2}
              className="mt-1 w-full resize-y rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.sender_data.address}
              onChange={(e) => updateSenderData({ address: e.target.value })}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Client</legend>
        <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-600 dark:text-warm-cream-300">
          Client
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Client name
            <input
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.client_data.client_name}
              onChange={(e) =>
                updateClientData({ client_name: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Client email
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.client_data.client_email}
              onChange={(e) =>
                updateClientData({ client_email: e.target.value })
              }
            />
          </label>
          <label className="sm:col-span-2 block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Billing address
            <textarea
              rows={2}
              className="mt-1 w-full resize-y rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.client_data.client_address}
              onChange={(e) =>
                updateClientData({ client_address: e.target.value })
              }
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Invoice meta</legend>
        <p className="text-xs font-semibold uppercase tracking-wide text-tech-slate-600 dark:text-warm-cream-300">
          Invoice
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Invoice number
            <input
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.invoice_number}
              onChange={(e) =>
                updateInvoiceMeta({ invoice_number: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Status
            <select
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.status}
              onChange={(e) =>
                updateInvoiceMeta({
                  status: e.target.value as typeof invoice.status,
                })
              }
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Issue date
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.issue_date}
              onChange={(e) =>
                updateInvoiceMeta({ issue_date: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Due date
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={invoice.due_date}
              onChange={(e) =>
                updateInvoiceMeta({ due_date: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Tax rate (%)
            <input
              type="number"
              min={0}
              step={0.01}
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={Number.isFinite(invoice.tax_rate) ? invoice.tax_rate : 0}
              onChange={(e) =>
                updateInvoiceMeta({
                  tax_rate: Number.parseFloat(e.target.value) || 0,
                })
              }
            />
          </label>
          <label className="block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
            Discount (%)
            <input
              type="number"
              min={0}
              step={0.01}
              className="mt-1 w-full rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
              value={
                Number.isFinite(invoice.discount_rate)
                  ? invoice.discount_rate
                  : 0
              }
              onChange={(e) =>
                updateInvoiceMeta({
                  discount_rate: Number.parseFloat(e.target.value) || 0,
                })
              }
            />
          </label>
        </div>
      </fieldset>

      <div className="mt-6">
        <LineItemsTable />
      </div>

      {showGuestCallout ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-snug text-amber-950 dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-50">
          Đăng ký tài khoản miễn phí để lưu trữ và quản lý lịch sử hóa đơn vĩnh
          viễn!
        </div>
      ) : null}

      <div className="mt-6 rounded-lg border border-tech-slate-200 bg-tech-slate-50 p-4 text-sm dark:border-tech-slate-700 dark:bg-tech-slate-950">
        <div className="flex justify-between gap-4 py-1">
          <span className="text-tech-slate-600 dark:text-warm-cream-300">
            Subtotal
          </span>
          <span className="tabular-nums font-medium text-tech-slate-900 dark:text-warm-cream-50">
            {formatMoney(totals.subtotal)}
          </span>
        </div>
        <div className="flex justify-between gap-4 py-1">
          <span className="text-tech-slate-600 dark:text-warm-cream-300">
            Tax
          </span>
          <span className="tabular-nums font-medium text-tech-slate-900 dark:text-warm-cream-50">
            {formatMoney(totals.tax_amount)}
          </span>
        </div>
        <div className="flex justify-between gap-4 py-1">
          <span className="text-tech-slate-600 dark:text-warm-cream-300">
            Discount
          </span>
          <span className="tabular-nums font-medium text-tech-slate-900 dark:text-warm-cream-50">
            −{formatMoney(totals.discount_amount)}
          </span>
        </div>
        <div className="mt-2 flex justify-between gap-4 border-t border-tech-slate-200 pt-2 text-base font-semibold dark:border-tech-slate-700">
          <span className="text-tech-slate-800 dark:text-warm-cream-100">
            Total due
          </span>
          <span className="tabular-nums text-tech-slate-900 dark:text-warm-cream-50">
            {formatMoney(totals.total_amount)}
          </span>
        </div>
      </div>

      <label className="mt-6 block text-sm font-medium text-tech-slate-700 dark:text-warm-cream-200">
        Notes / payment terms
        <textarea
          rows={4}
          className="mt-1 w-full resize-y rounded-lg border border-tech-slate-200 bg-white px-3 py-2 text-tech-slate-900 outline-none ring-tech-slate-400 focus:ring-2 dark:border-tech-slate-700 dark:bg-tech-slate-950 dark:text-warm-cream-50"
          value={invoice.notes}
          onChange={(e) => updateInvoiceMeta({ notes: e.target.value })}
          placeholder="Bank details, thank-you message, or payment instructions."
        />
      </label>
    </div>
  );
}
