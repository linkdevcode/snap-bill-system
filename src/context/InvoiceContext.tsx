"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { lineTotalFromItem, roundCurrency } from "@/lib/money";
import type {
  ClientData,
  Invoice,
  InvoiceLineItemDb,
  InvoiceStatus,
  LineItem,
  SenderData,
} from "@/types/invoice";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

export interface InvoiceTotals {
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
}

export type CloudSavePhase = "idle" | "success" | "error";

export interface CloudSaveBanner {
  phase: CloudSavePhase;
  message: string;
}

interface InvoiceDbPayload {
  user_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  sender_data: SenderData;
  client_data: ClientData;
  items: InvoiceLineItemDb[];
  tax_rate: number;
  discount_rate: number;
  subtotal: number;
  total_amount: number;
  notes: string;
}

export interface InvoiceContextValue {
  invoice: Invoice;
  totals: InvoiceTotals;
  cloudSave: CloudSaveBanner;
  isSavingInvoice: boolean;
  saveInvoice: () => Promise<void>;
  updateSenderData: (patch: Partial<SenderData>) => void;
  updateClientData: (patch: Partial<ClientData>) => void;
  updateInvoiceMeta: (
    patch: Partial<{
      invoice_number: string;
      status: InvoiceStatus;
      issue_date: string;
      due_date: string;
      tax_rate: number;
      discount_rate: number;
      notes: string;
    }>,
  ) => void;
  addItem: () => void;
  updateItem: (id: string, patch: Partial<Omit<LineItem, "id">>) => void;
  deleteItem: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextValue | undefined>(
  undefined,
);

function formatDateISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function createEmptyLineItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    unit_price: 0,
  };
}

function createDefaultInvoice(): Omit<Invoice, "subtotal" | "total_amount"> {
  const today = new Date();
  const due = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  return {
    id: "",
    invoice_number: `INV-${today.getFullYear()}-001`,
    status: "draft",
    issue_date: formatDateISO(today),
    due_date: formatDateISO(due),
    sender_data: {
      company_name: "",
      sender_name: "",
      email: "",
      address: "",
      tax_id: "",
      logo_url: "",
    },
    client_data: {
      client_name: "",
      client_email: "",
      client_address: "",
    },
    items: [createEmptyLineItem()],
    tax_rate: 0,
    discount_rate: 0,
    notes: "",
  };
}

function mapItemsForDb(items: LineItem[]): InvoiceLineItemDb[] {
  return items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    unit_price: roundCurrency(item.unit_price),
  }));
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const { user, supabaseConfigured } = useAuth();
  const userId = user?.id ?? null;

  const [base, setBase] = useState<Omit<Invoice, "subtotal" | "total_amount">>(
    () => createDefaultInvoice(),
  );

  const [cloudSave, setCloudSave] = useState<CloudSaveBanner>({
    phase: "idle",
    message: "",
  });

  const [isSavingInvoice, setIsSavingInvoice] = useState(false);

  const dismissTimerRef = useRef<number | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const scheduleDismissBanner = useCallback(() => {
    clearDismissTimer();
    dismissTimerRef.current = window.setTimeout(() => {
      setCloudSave({ phase: "idle", message: "" });
      dismissTimerRef.current = null;
    }, 4500);
  }, [clearDismissTimer]);

  useEffect(() => {
    return () => {
      clearDismissTimer();
    };
  }, [clearDismissTimer]);

  const totals = useMemo<InvoiceTotals>(() => {
    const subtotal = base.items.reduce<number>((sum, item) => {
      const lineTotal = lineTotalFromItem(item.quantity, item.unit_price);
      return sum + lineTotal;
    }, 0);

    const tax_amount = roundCurrency(subtotal * (base.tax_rate / 100));
    const discount_amount = roundCurrency(
      subtotal * (base.discount_rate / 100),
    );
    const total_amount = roundCurrency(
      subtotal + tax_amount - discount_amount,
    );

    return {
      subtotal,
      tax_amount,
      discount_amount,
      total_amount,
    };
  }, [base.discount_rate, base.items, base.tax_rate]);

  const invoice = useMemo<Invoice>(
    () => ({
      ...base,
      subtotal: totals.subtotal,
      total_amount: totals.total_amount,
    }),
    [base, totals.subtotal, totals.total_amount],
  );

  const saveInvoice = useCallback(async () => {
    const client = getSupabaseBrowserClient();

    if (!supabaseConfigured || !client) {
      setCloudSave({
        phase: "error",
        message:
          "Supabase chưa được cấu hình. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào .env.local.",
      });
      scheduleDismissBanner();
      return;
    }

    if (!userId) {
      setCloudSave({
        phase: "error",
        message: "Đăng nhập để lưu hóa đơn lên đám mây.",
      });
      scheduleDismissBanner();
      return;
    }

    setIsSavingInvoice(true);

    setCloudSave({
      phase: "success",
      message: "Đang đồng bộ với Supabase…",
    });

    const payload: InvoiceDbPayload = {
      user_id: userId,
      invoice_number: invoice.invoice_number,
      status: invoice.status,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      sender_data: invoice.sender_data,
      client_data: invoice.client_data,
      items: mapItemsForDb(invoice.items),
      tax_rate: roundCurrency(invoice.tax_rate),
      discount_rate: roundCurrency(invoice.discount_rate),
      subtotal: roundCurrency(totals.subtotal),
      total_amount: roundCurrency(totals.total_amount),
      notes: invoice.notes,
    };

    try {
      if (invoice.id.trim().length > 0) {
        const { error } = await client
          .from("invoices")
          .update(payload)
          .eq("id", invoice.id)
          .eq("user_id", userId);

        if (error) {
          throw new Error(error.message);
        }

        setCloudSave({
          phase: "success",
          message: "Đã cập nhật hóa đơn trên Supabase.",
        });
      } else {
        const { data, error } = await client
          .from("invoices")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          throw new Error(error.message);
        }

        const newId =
          data &&
          typeof data === "object" &&
          "id" in data &&
          typeof (data as { id: unknown }).id === "string"
            ? (data as { id: string }).id
            : null;

        if (newId) {
          setBase((prev) => ({ ...prev, id: newId }));
        }

        setCloudSave({
          phase: "success",
          message: "Đã lưu hóa đơn mới lên Supabase.",
        });
      }

      scheduleDismissBanner();
    } catch (unknownError) {
      const message =
        unknownError instanceof Error
          ? unknownError.message
          : "Không thể lưu hóa đơn lên Supabase.";

      setCloudSave({
        phase: "error",
        message,
      });

      scheduleDismissBanner();
    } finally {
      setIsSavingInvoice(false);
    }
  }, [
    invoice.client_data,
    invoice.due_date,
    invoice.id,
    invoice.invoice_number,
    invoice.issue_date,
    invoice.items,
    invoice.notes,
    invoice.sender_data,
    invoice.status,
    invoice.tax_rate,
    invoice.discount_rate,
    scheduleDismissBanner,
    supabaseConfigured,
    totals.subtotal,
    totals.total_amount,
    userId,
  ]);

  const updateSenderData = useCallback((patch: Partial<SenderData>) => {
    setBase((prev) => ({
      ...prev,
      sender_data: { ...prev.sender_data, ...patch },
    }));
  }, []);

  const updateClientData = useCallback((patch: Partial<ClientData>) => {
    setBase((prev) => ({
      ...prev,
      client_data: { ...prev.client_data, ...patch },
    }));
  }, []);

  const updateInvoiceMeta = useCallback(
    (
      patch: Partial<{
        invoice_number: string;
        status: InvoiceStatus;
        issue_date: string;
        due_date: string;
        tax_rate: number;
        discount_rate: number;
        notes: string;
      }>,
    ) => {
      setBase((prev) => ({
        ...prev,
        ...patch,
      }));
    },
    [],
  );

  const addItem = useCallback(() => {
    setBase((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyLineItem()],
    }));
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<LineItem, "id">>) => {
      setBase((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      }));
    },
    [],
  );

  const deleteItem = useCallback((id: string) => {
    setBase((prev) => {
      if (prev.items.length <= 1) {
        return {
          ...prev,
          items: [createEmptyLineItem()],
        };
      }
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      };
    });
  }, []);

  const value = useMemo<InvoiceContextValue>(
    () => ({
      invoice,
      totals,
      cloudSave,
      isSavingInvoice,
      saveInvoice,
      updateSenderData,
      updateClientData,
      updateInvoiceMeta,
      addItem,
      updateItem,
      deleteItem,
    }),
    [
      invoice,
      totals,
      cloudSave,
      isSavingInvoice,
      saveInvoice,
      updateSenderData,
      updateClientData,
      updateInvoiceMeta,
      addItem,
      updateItem,
      deleteItem,
    ],
  );

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
}

export function useInvoice(): InvoiceContextValue {
  const ctx = useContext(InvoiceContext);
  if (ctx === undefined) {
    throw new Error("useInvoice must be used within an InvoiceProvider");
  }
  return ctx;
}
