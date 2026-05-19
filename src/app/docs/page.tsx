"use client";

import Link from "next/link";
import { BookOpen, FileText, Shield } from "lucide-react";

import { InvoiceLocaleSelectors } from "@/components/invoice/InvoiceLocaleSelectors";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useInvoice } from "@/context/InvoiceContext";

export default function DocsPage() {
  const { labels } = useInvoice();
  const d = labels.docs;
  const downloadPdf = labels.previewChrome.downloadPdf;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-8 md:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
                <BookOpen className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {d.title}
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {d.subtitle}
                </p>
              </div>
            </div>
            <InvoiceLocaleSelectors />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-950/50">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                <FileText className="h-4 w-4 text-indigo-600" aria-hidden />
                {d.editorSection}
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <li>
                  {d.editorBullet1Before}{" "}
                  <Link
                    href="/"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {labels.nav.editor}
                  </Link>
                  {d.editorBullet1After}
                </li>
                <li>{d.editorBullet2}</li>
                <li>
                  {d.editorBullet3Before}{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {downloadPdf}
                  </span>{" "}
                  {d.editorBullet3After}
                </li>
              </ul>
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-950/50">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                <Shield className="h-4 w-4 text-indigo-600" aria-hidden />
                {d.accountSection}
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <li>{d.accountBullet1}</li>
                <li>{d.accountBullet2}</li>
                <li>
                  {d.accountBullet3Before}{" "}
                  <Link
                    href="/?view=dashboard"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {labels.nav.myInvoices}
                  </Link>{" "}
                  {d.accountBullet3After}
                </li>
              </ul>
            </section>
          </div>

          <p className="mt-8 text-xs text-slate-500 dark:text-slate-500">
            {d.footer}
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
