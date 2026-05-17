import {
  CURRENCY_FORMAT_LOCALE,
  type InvoiceCurrency,
} from "@/types/locale";

export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value * 100) / 100;
}

export function lineTotalFromItem(quantity: number, unitPrice: number): number {
  return roundCurrency(quantity * unitPrice);
}

/**
 * Formats a monetary amount for display on invoices and dashboards.
 * VND: Vietnamese grouping with "đ" suffix (no decimals).
 * JPY/KRW: no decimal places.
 * CNY/USD/EUR/GBP: standard Intl currency with locale-appropriate symbol.
 */
export function formatMoney(
  amount: number,
  currency: InvoiceCurrency = "VND",
): string {
  const value = roundCurrency(amount);

  if (currency === "VND") {
    const formatted = new Intl.NumberFormat(CURRENCY_FORMAT_LOCALE.VND, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
    return `${formatted} đ`;
  }

  if (currency === "JPY" || currency === "KRW") {
    return new Intl.NumberFormat(CURRENCY_FORMAT_LOCALE[currency], {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }

  const locale = CURRENCY_FORMAT_LOCALE[currency];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
