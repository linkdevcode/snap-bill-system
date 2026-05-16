export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface SenderData {
  company_name: string;
  sender_name: string;
  email: string;
  address: string;
  tax_id: string;
  /** Base64 data URL (`data:image/png;base64,...`) set client-side via FileReader */
  logo_url: string;
}

export interface ClientData {
  client_name: string;
  client_email: string;
  client_address: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

/** Line item row as stored in Postgres `invoices.items` JSONB (spec shape). */
export interface InvoiceLineItemDb {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface UserSession {
  id: string;
  email: string | null;
  avatarUrl: string | null;
  displayName: string | null;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  sender_data: SenderData;
  client_data: ClientData;
  items: LineItem[];
  tax_rate: number;
  discount_rate: number;
  subtotal: number;
  total_amount: number;
  notes: string;
}
