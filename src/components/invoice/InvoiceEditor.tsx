"use client";

import type { DragEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { CloudUpload, ImagePlus, Sparkles, X } from "lucide-react";

import { LineItemsTable } from "@/components/invoice/LineItemsTable";
import { useAuth } from "@/context/AuthContext";
import { useInvoice } from "@/context/InvoiceContext";
import { formatMoney } from "@/lib/money";

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = new Set(["image/png", "image/jpeg"]);

const fieldLabelClass =
  "block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

const fieldInputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-shadow placeholder:text-xs placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400";

const sectionTitleClass =
  "text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

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
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-slate-950">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
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
        <p className={sectionTitleClass}>Sender</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          className="sr-only"
          aria-label="Upload company logo"
          onChange={(e) => void onLogoInputChange(e.target.files)}
        />

        <div className="flex flex-col gap-4 sm:flex-row-reverse sm:items-start sm:gap-4">
          <div
            className={`relative flex w-full shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 px-2 py-3 outline-none transition-colors hover:bg-slate-50 sm:w-[100px] dark:border-slate-600 dark:hover:bg-slate-800/40 ${
              isDraggingLogo
                ? "border-indigo-400 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30"
                : ""
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDraggingLogo(true);
            }}
            onDragOver={onLogoDragOver}
            onDragLeave={onLogoDragLeave}
            onDrop={onLogoDrop}
          >
            {invoice.sender_data.logo_url ? (
              <div className="relative flex w-full flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={invoice.sender_data.logo_url}
                  alt=""
                  className="h-14 w-full max-w-[4.5rem] object-contain"
                />
                <button
                  type="button"
                  onClick={clearLogo}
                  className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
                >
                  <X className="h-3 w-3" aria-hidden />
                  Clear
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-1 px-1 py-1 text-center"
              >
                <ImagePlus
                  className="h-4 w-4 text-slate-400 dark:text-slate-500"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Logo
                </span>
                <span className="text-[9px] leading-tight text-slate-400 dark:text-slate-500">
                  PNG / JPG
                </span>
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            {logoError ? (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {logoError}
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={fieldLabelClass}>
                Company name
                <input
                  className={fieldInputClass}
                  value={invoice.sender_data.company_name}
                  onChange={(e) =>
                    updateSenderData({ company_name: e.target.value })
                  }
                  placeholder="Acme Studio"
                />
              </label>
              <label className={fieldLabelClass}>
                Sender name
                <input
                  className={fieldInputClass}
                  value={invoice.sender_data.sender_name}
                  onChange={(e) =>
                    updateSenderData({ sender_name: e.target.value })
                  }
                  placeholder="Your name"
                />
              </label>
              <label className={fieldLabelClass}>
                Email
                <input
                  type="email"
                  className={fieldInputClass}
                  value={invoice.sender_data.email}
                  onChange={(e) => updateSenderData({ email: e.target.value })}
                  placeholder="billing@company.com"
                />
              </label>
              <label className={fieldLabelClass}>
                Tax / VAT ID
                <input
                  className={fieldInputClass}
                  value={invoice.sender_data.tax_id}
                  onChange={(e) => updateSenderData({ tax_id: e.target.value })}
                  placeholder="Optional"
                />
              </label>
              <label className={`sm:col-span-2 ${fieldLabelClass}`}>
                Address
                <textarea
                  rows={2}
                  className={`${fieldInputClass} resize-y`}
                  value={invoice.sender_data.address}
                  onChange={(e) =>
                    updateSenderData({ address: e.target.value })
                  }
                  placeholder="Street, city, postal code"
                />
              </label>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Client</legend>
        <p className={sectionTitleClass}>Client</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={fieldLabelClass}>
            Client name
            <input
              className={fieldInputClass}
              value={invoice.client_data.client_name}
              onChange={(e) =>
                updateClientData({ client_name: e.target.value })
              }
              placeholder="Client or company"
            />
          </label>
          <label className={fieldLabelClass}>
            Client email
            <input
              type="email"
              className={fieldInputClass}
              value={invoice.client_data.client_email}
              onChange={(e) =>
                updateClientData({ client_email: e.target.value })
              }
              placeholder="accounts@client.com"
            />
          </label>
          <label className={`sm:col-span-2 ${fieldLabelClass}`}>
            Billing address
            <textarea
              rows={2}
              className={`${fieldInputClass} resize-y`}
              value={invoice.client_data.client_address}
              onChange={(e) =>
                updateClientData({ client_address: e.target.value })
              }
              placeholder="Billing address"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Invoice meta</legend>
        <p className={sectionTitleClass}>Invoice</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={fieldLabelClass}>
            Invoice number
            <input
              className={fieldInputClass}
              value={invoice.invoice_number}
              onChange={(e) =>
                updateInvoiceMeta({ invoice_number: e.target.value })
              }
              placeholder="INV-001"
            />
          </label>
          <label className={fieldLabelClass}>
            Status
            <select
              className={fieldInputClass}
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
          <label className={fieldLabelClass}>
            Issue date
            <input
              type="date"
              className={fieldInputClass}
              value={invoice.issue_date}
              onChange={(e) =>
                updateInvoiceMeta({ issue_date: e.target.value })
              }
            />
          </label>
          <label className={fieldLabelClass}>
            Due date
            <input
              type="date"
              className={fieldInputClass}
              value={invoice.due_date}
              onChange={(e) =>
                updateInvoiceMeta({ due_date: e.target.value })
              }
            />
          </label>
          <label className={fieldLabelClass}>
            Tax rate (%)
            <input
              type="number"
              min={0}
              step={0.01}
              className={fieldInputClass}
              value={Number.isFinite(invoice.tax_rate) ? invoice.tax_rate : 0}
              onChange={(e) =>
                updateInvoiceMeta({
                  tax_rate: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </label>
          <label className={fieldLabelClass}>
            Discount (%)
            <input
              type="number"
              min={0}
              step={0.01}
              className={fieldInputClass}
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
              placeholder="0"
            />
          </label>
        </div>
      </fieldset>

      <div className="mt-6">
        <LineItemsTable />
      </div>

      {showGuestCallout ? (
        <div className="mt-6 flex gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3.5 text-sm leading-snug text-amber-800 dark:border-amber-900/45 dark:bg-amber-950/35 dark:text-amber-100">
          <Sparkles
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <p>
            Đăng ký tài khoản miễn phí để lưu trữ và quản lý lịch sử hóa đơn
            vĩnh viễn—đồng bộ đám mây và truy cập từ mọi thiết bị.
          </p>
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex justify-between gap-4 py-1.5 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
          <span className="tabular-nums font-medium text-slate-900 dark:text-slate-100">
            {formatMoney(totals.subtotal)}
          </span>
        </div>
        <div className="flex justify-between gap-4 py-1.5 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Tax</span>
          <span className="tabular-nums font-medium text-slate-900 dark:text-slate-100">
            {formatMoney(totals.tax_amount)}
          </span>
        </div>
        <div className="flex justify-between gap-4 py-1.5 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Discount</span>
          <span className="tabular-nums font-medium text-slate-900 dark:text-slate-100">
            −{formatMoney(totals.discount_amount)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-indigo-100/90 bg-white px-4 py-4 shadow-sm dark:border-indigo-900/35 dark:bg-slate-900">
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Total due
        </span>
        <span className="tabular-nums text-xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatMoney(totals.total_amount)}
        </span>
      </div>

      <label className={`mt-6 ${fieldLabelClass}`}>
        Notes / payment terms
        <textarea
          rows={4}
          className={`${fieldInputClass} resize-y`}
          value={invoice.notes}
          onChange={(e) => updateInvoiceMeta({ notes: e.target.value })}
          placeholder="Bank details, thank-you message, or payment instructions."
        />
      </label>
    </div>
  );
}
