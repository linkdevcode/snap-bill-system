"use client";

import { ChevronDown } from "lucide-react";

import type { FaqItem } from "@/content/site-pages";

export interface FaqAccordionProps {
  items: readonly FaqItem[];
  title: string;
}

export function FaqAccordion({ items, title }: FaqAccordionProps) {
  return (
    <section aria-labelledby="snapbill-faq-heading">
      <h2
        id="snapbill-faq-heading"
        className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-xl"
      >
        {title}
      </h2>
      <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900">
        {items.map((item, index) => (
          <details
            key={item.question}
            className="group snapbill-faq-item"
            {...(index === 0 ? { open: true } : {})}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-slate-900 marker:content-none hover:bg-slate-50 dark:text-slate-50 dark:hover:bg-slate-800/60 [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
