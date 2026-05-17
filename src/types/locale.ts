export type InvoiceLanguage = "vi" | "en" | "zh" | "ja";

export type InvoiceCurrency = "VND" | "USD" | "EUR" | "GBP" | "CNY" | "JPY";

export const INVOICE_LANGUAGES: readonly InvoiceLanguage[] = [
  "vi",
  "en",
  "zh",
  "ja",
] as const;

export const INVOICE_LANGUAGE_STORAGE_KEY = "snapbill-language";

export const INVOICE_CURRENCY_STORAGE_KEY = "snapbill-currency";

export const INVOICE_CURRENCIES: readonly InvoiceCurrency[] = [
  "VND",
  "USD",
  "EUR",
  "GBP",
  "CNY",
  "JPY",
] as const;

/** BCP 47 locale for date formatting per UI language. */
export const LANGUAGE_DATE_LOCALE: Record<InvoiceLanguage, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
};

/** BCP 47 locale for Intl currency formatting. */
export const CURRENCY_FORMAT_LOCALE: Record<InvoiceCurrency, string> = {
  VND: "vi-VN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CNY: "zh-CN",
  JPY: "ja-JP",
};

export function parseInvoiceLanguage(value: unknown): InvoiceLanguage {
  if (value === "en" || value === "zh" || value === "ja") {
    return value;
  }
  return "vi";
}

export function parseInvoiceCurrency(value: unknown): InvoiceCurrency {
  if (
    value === "USD" ||
    value === "EUR" ||
    value === "GBP" ||
    value === "CNY" ||
    value === "JPY"
  ) {
    return value;
  }
  return "VND";
}
