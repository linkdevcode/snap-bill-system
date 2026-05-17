export type InvoiceLanguage = "vi" | "en" | "zh" | "ja" | "ko";

export type InvoiceCurrency =
  | "VND"
  | "USD"
  | "EUR"
  | "GBP"
  | "CNY"
  | "JPY"
  | "KRW";

export const INVOICE_LANGUAGES: readonly InvoiceLanguage[] = [
  "vi",
  "en",
  "zh",
  "ja",
  "ko",
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
  "KRW",
] as const;

/** BCP 47 locale for date formatting per UI language. */
export const LANGUAGE_DATE_LOCALE: Record<InvoiceLanguage, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
};

/** BCP 47 locale for Intl currency formatting. */
export const CURRENCY_FORMAT_LOCALE: Record<InvoiceCurrency, string> = {
  VND: "vi-VN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CNY: "zh-CN",
  JPY: "ja-JP",
  KRW: "ko-KR",
};

export function parseInvoiceLanguage(value: unknown): InvoiceLanguage {
  if (value === "en" || value === "zh" || value === "ja" || value === "ko") {
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
    value === "JPY" ||
    value === "KRW"
  ) {
    return value;
  }
  return "VND";
}
