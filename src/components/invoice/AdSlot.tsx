"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export type AdSlotLayout = "banner" | "sidebar";

export interface AdSlotProps {
  /** Google AdSense ad unit slot ID (numeric string from AdSense UI). */
  slotId: string;
  layout?: AdSlotLayout;
  className?: string;
}

function getAdsClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
}

/**
 * Reserved AdSense placement with fixed min-height to reduce CLS.
 * Loads the creative only when `NEXT_PUBLIC_ADSENSE_CLIENT` and `slotId` are set.
 */
export function AdSlot({
  slotId,
  layout = "banner",
  className = "",
}: AdSlotProps) {
  const pushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);
  const adsClient = getAdsClient();
  const trimmedSlot = slotId.trim();

  const minHeightClass =
    layout === "sidebar" ? "min-h-[600px]" : "min-h-[90px]";

  useEffect(() => {
    if (!adsClient || !trimmedSlot || pushedRef.current) {
      return;
    }

    const ins = insRef.current;
    if (!ins) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      /* non-fatal: ad blocker or script not ready */
    }
  }, [adsClient, trimmedSlot]);

  if (!adsClient || !trimmedSlot) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-xl border border-dashed border-tech-slate-300 bg-tech-slate-50 px-3 text-center text-xs font-medium uppercase tracking-wide text-tech-slate-500 dark:border-tech-slate-600 dark:bg-tech-slate-900 dark:text-warm-cream-400 ${minHeightClass} ${className}`}
        aria-hidden
      >
        Ad slot reserved ({layout}) · configure NEXT_PUBLIC_ADSENSE_CLIENT
        +&nbsp;slot
      </div>
    );
  }

  return (
    <div
      className={`flex w-full justify-center overflow-hidden rounded-xl border border-tech-slate-200 bg-tech-slate-50 dark:border-tech-slate-700 dark:bg-tech-slate-900 ${minHeightClass} ${className}`}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{
          display: "block",
          minHeight: layout === "sidebar" ? 600 : 90,
        }}
        data-ad-client={adsClient}
        data-ad-slot={trimmedSlot}
        data-ad-format={layout === "sidebar" ? "vertical" : "horizontal"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
