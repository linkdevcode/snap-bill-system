"use client";

import { ListChecks, Receipt } from "lucide-react";

import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { AdSlot, isAdSlotConfigured } from "@/components/invoice/AdSlot";
import { getSitePagesContent } from "@/content/site-pages";
import { useInvoice } from "@/context/InvoiceContext";

const contentSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT ?? "";

export function HomeSeoSection() {
  const { language } = useInvoice();
  const content = getSitePagesContent(language);
  const { seo } = content;

  return (
    <section
      className="snapbill-no-print snapbill-seo-content mt-10 border-t border-slate-200 pt-10 dark:border-slate-800"
      aria-label="SnapBill guides and FAQ"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
          <h2 className="flex items-start gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-xl">
            <ListChecks
              className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400"
              aria-hidden
            />
            {seo.howToTitle}
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {seo.howToSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
          <h2 className="flex items-start gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-xl">
            <Receipt
              className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400"
              aria-hidden
            />
            {seo.professionalTitle}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {seo.professionalIntro}
          </p>
          <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {seo.invoiceComponentsTitle}
          </h3>
          <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {seo.invoiceComponents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-8">
        <FaqAccordion items={seo.faq} title={seo.faqTitle} />
      </div>

      {isAdSlotConfigured(contentSlotId) ? (
        <div className="mt-8" data-snapbill-ad-region="content-below-seo">
          <AdSlot slotId={contentSlotId} layout="banner" />
        </div>
      ) : null}
    </section>
  );
}
