"use client";

import Link from "next/link";

import { AdSlot, isAdSlotConfigured } from "@/components/invoice/AdSlot";
import { AppBrand } from "@/components/layout/AppBrand";
import { getSitePagesContent } from "@/content/site-pages";
import { useInvoice } from "@/context/InvoiceContext";

const footerSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? "";

const footerLinkClass =
  "text-sm text-slate-600 underline-offset-4 hover:text-indigo-600 hover:underline dark:text-slate-400 dark:hover:text-indigo-400";

export function SiteFooter() {
  const { language } = useInvoice();
  const { footer } = getSitePagesContent(language);

  return (
    <footer className="snapbill-no-print snapbill-site-footer mt-12 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {isAdSlotConfigured(footerSlotId) ? (
        <div
          className="mx-auto max-w-[1400px] px-4 pt-8 md:px-8"
          data-snapbill-ad-region="footer-top"
        >
          <AdSlot slotId={footerSlotId} layout="banner" />
        </div>
      ) : null}

      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <AppBrand />
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {footer.tagline}
            </p>
          </div>

          <nav
            className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2"
            aria-label="Legal and contact"
          >
            <Link href="/privacy" className={footerLinkClass}>
              {footer.privacy}
            </Link>
            <Link href="/terms" className={footerLinkClass}>
              {footer.terms}
            </Link>
            <Link href="/contact" className={footerLinkClass}>
              {footer.contact}
            </Link>
          </nav>
        </div>

        <p className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500 md:text-left">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
