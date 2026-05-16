import type {
  ClientData,
  InvoiceLineItemDb,
  InvoiceStatus,
  LineItem,
  SenderData,
} from "@/types/invoice";
import {
  parseInvoiceCurrency,
  parseInvoiceLanguage,
  type InvoiceCurrency,
  type InvoiceLanguage,
} from "@/types/locale";
import { roundCurrency } from "@/lib/money";

export interface InvoiceDbRow {
  id: string;
  user_id: string | null;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string;
  sender_data: unknown;
  client_data: unknown;
  items: unknown;
  tax_rate: number | string | null;
  discount_rate: number | string | null;
  subtotal: number | string | null;
  total_amount: number | string | null;
  notes: string | null;
  language: InvoiceLanguage;
  currency: InvoiceCurrency;
  created_at: string;
}

const STATUSES: readonly InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
] as const;

export function parseInvoiceStatus(value: string): InvoiceStatus {
  const v = value.toLowerCase() as InvoiceStatus;
  return STATUSES.includes(v) ? v : "draft";
}

function coerceDateOnly(value: string | null | undefined): string {
  if (!value || typeof value !== "string") {
    return new Date().toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const t = Date.parse(value);
  if (Number.isFinite(t)) {
    return new Date(t).toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

export function parseSenderData(raw: unknown): SenderData {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    company_name: typeof o.company_name === "string" ? o.company_name : "",
    sender_name: typeof o.sender_name === "string" ? o.sender_name : "",
    email: typeof o.email === "string" ? o.email : "",
    address: typeof o.address === "string" ? o.address : "",
    tax_id: typeof o.tax_id === "string" ? o.tax_id : "",
    logo_url: typeof o.logo_url === "string" ? o.logo_url : "",
  };
}

export function parseClientData(raw: unknown): ClientData {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    client_name: typeof o.client_name === "string" ? o.client_name : "",
    client_email: typeof o.client_email === "string" ? o.client_email : "",
    client_address:
      typeof o.client_address === "string" ? o.client_address : "",
  };
}

function isLineItemDbShape(v: unknown): v is InvoiceLineItemDb {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.description === "string" &&
    typeof r.quantity === "number" &&
    typeof r.unit_price === "number"
  );
}

export function parseItemsJsonbToLineItems(raw: unknown): LineItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [];
  }

  return raw.map((entry) => {
    if (isLineItemDbShape(entry)) {
      return {
        id: crypto.randomUUID(),
        description: entry.description,
        quantity: Math.max(1, Math.trunc(entry.quantity)),
        unit_price: roundCurrency(entry.unit_price),
      };
    }

    const r = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
    const qty = Number(r.quantity);
    const price = Number(r.unit_price);
    return {
      id: crypto.randomUUID(),
      description: typeof r.description === "string" ? r.description : "",
      quantity: Number.isFinite(qty) ? Math.max(1, Math.trunc(qty)) : 1,
      unit_price: Number.isFinite(price) ? roundCurrency(price) : 0,
    };
  });
}

export function normalizeInvoiceRow(raw: Record<string, unknown>): InvoiceDbRow | null {
  const id = raw.id;
  if (typeof id !== "string" || id.length === 0) {
    return null;
  }

  const invoice_number =
    typeof raw.invoice_number === "string" ? raw.invoice_number : "";
  const status = typeof raw.status === "string" ? raw.status : "draft";
  const issue_date =
    typeof raw.issue_date === "string"
      ? raw.issue_date
      : String(raw.issue_date ?? "");
  const due_date =
    typeof raw.due_date === "string"
      ? raw.due_date
      : String(raw.due_date ?? "");

  return {
    id,
    user_id: typeof raw.user_id === "string" ? raw.user_id : null,
    invoice_number,
    status: parseInvoiceStatus(status),
    issue_date: coerceDateOnly(issue_date),
    due_date: coerceDateOnly(due_date),
    sender_data: raw.sender_data,
    client_data: raw.client_data,
    items: raw.items,
    tax_rate: raw.tax_rate as InvoiceDbRow["tax_rate"],
    discount_rate: raw.discount_rate as InvoiceDbRow["discount_rate"],
    subtotal: raw.subtotal as InvoiceDbRow["subtotal"],
    total_amount: raw.total_amount as InvoiceDbRow["total_amount"],
    notes: typeof raw.notes === "string" ? raw.notes : null,
    language: parseInvoiceLanguage(raw.language),
    currency: parseInvoiceCurrency(raw.currency),
    created_at:
      typeof raw.created_at === "string"
        ? raw.created_at
        : new Date().toISOString(),
  };
}
