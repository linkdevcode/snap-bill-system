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

function AdPlaceholder({ layout }: { layout: AdSlotLayout }) {
  if (layout === "banner") {
    return (
      <div
        className="flex h-24 min-h-[90px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 text-center text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500"
        role="img"
        aria-label="Vị trí quảng cáo Google AdSense"
      >
        <p className="text-xs font-bold uppercase tracking-widest">
          Quảng cáo Google AdSense
        </p>
        <p className="mt-1 max-w-sm text-[10px] leading-snug text-slate-400/90 dark:text-slate-500">
          Vị trí quảng cáo banner ngang
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[600px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-10 text-center text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500"
      role="img"
      aria-label="Vị trí quảng cáo cạnh trang"
    >
      <p className="text-xs font-bold uppercase tracking-widest">
        Quảng cáo Google AdSense
      </p>
      <p className="mt-2 max-w-[14rem] text-[10px] leading-relaxed text-slate-400/90 dark:text-slate-500">
        Vùng sidebar min-height cố định—tránh nhảy layout (CLS) khi tải
        creative.
      </p>
    </div>
  );
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
      <div className={`w-full ${className}`.trim()}>
        <AdPlaceholder layout={layout} />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900 ${minHeightClass} ${className}`}
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
