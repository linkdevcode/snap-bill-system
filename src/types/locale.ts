export type InvoiceLanguage = "vi" | "en";

export type InvoiceCurrency = "VND" | "USD" | "EUR" | "GBP";

export const INVOICE_LANGUAGES: readonly InvoiceLanguage[] = ["vi", "en"] as const;

export const INVOICE_LANGUAGE_STORAGE_KEY = "snapbill-language";

export const INVOICE_CURRENCIES: readonly InvoiceCurrency[] = [
  "VND",
  "USD",
  "EUR",
  "GBP",
] as const;

export function parseInvoiceLanguage(value: unknown): InvoiceLanguage {
  return value === "en" ? "en" : "vi";
}

export function parseInvoiceCurrency(value: unknown): InvoiceCurrency {
  if (value === "USD" || value === "EUR" || value === "GBP") {
    return value;
  }
  return "VND";
}
