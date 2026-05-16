"use client";

import { useEffect, useRef } from "react";
import { Megaphone } from "lucide-react";

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
        className={`flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/60 bg-slate-50/50 px-4 text-center dark:border-slate-600/50 dark:bg-slate-900/30 ${minHeightClass} ${className}`}
        role="img"
        aria-label="Sponsor advertisement area"
      >
        <Megaphone
          className="mb-2 h-4 w-4 text-slate-300 dark:text-slate-600"
          strokeWidth={1.5}
          aria-hidden
        />
        <p className="max-w-[12rem] text-[11px] font-medium tracking-wide text-slate-400/95 dark:text-slate-500">
          Sponsor Advertisement Area
        </p>
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
