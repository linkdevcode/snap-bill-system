"use client";

import { useInvoice } from "@/context/InvoiceContext";
import {
  INVOICE_CURRENCIES,
  INVOICE_LANGUAGES,
  type InvoiceCurrency,
  type InvoiceLanguage,
} from "@/types/locale";

const selectClass =
  "cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-xs font-medium text-slate-800 outline-none transition-shadow focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-400";

export function InvoiceLocaleSelectors() {
  const { language, currency, labels, setLanguage, setCurrency } = useInvoice();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-1.5">
        <span className="sr-only">{labels.selectors.languageAria}</span>
        <select
          className={selectClass}
          value={language}
          onChange={(e) => setLanguage(e.target.value as InvoiceLanguage)}
          aria-label={labels.selectors.languageAria}
        >
          {INVOICE_LANGUAGES.map((code) => (
            <option key={code} value={code}>
              {labels.selectors.languageOptions[code]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5">
        <span className="sr-only">{labels.selectors.currencyAria}</span>
        <select
          className={selectClass}
          value={currency}
          onChange={(e) => setCurrency(e.target.value as InvoiceCurrency)}
          aria-label={labels.selectors.currencyAria}
        >
          {INVOICE_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {labels.selectors.currencyOptions[code]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
