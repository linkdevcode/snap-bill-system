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
  /**
   * When true, show a dashed outline in dev if client/slot are missing.
   * Default false — slot renders nothing to avoid empty white gaps.
   */
  showPlaceholder?: boolean;
}

function getAdsClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
}

/** True when both AdSense client ID and slot ID are set (ad may render). */
export function isAdSlotConfigured(slotId: string): boolean {
  return Boolean(getAdsClient() && slotId.trim());
}

function AdPlaceholder({ layout }: { layout: AdSlotLayout }) {
  if (layout === "banner") {
    return (
      <div
        className="flex h-20 min-h-[72px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/60 bg-slate-100/40 px-4 text-center dark:border-slate-600 dark:bg-slate-800/40"
        role="img"
        aria-label="Google AdSense banner placeholder"
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          AdSense banner
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300/60 bg-slate-100/40 px-6 py-8 text-center dark:border-slate-600 dark:bg-slate-800/40"
      role="img"
      aria-label="Google AdSense sidebar placeholder"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        AdSense sidebar
      </p>
    </div>
  );
}

/**
 * Reserved AdSense placement. Renders nothing until client + slot are configured,
 * so the UI does not show empty white blocks before ads are approved.
 */
export function AdSlot({
  slotId,
  layout = "banner",
  className = "",
  showPlaceholder = false,
}: AdSlotProps) {
  const pushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);
  const adsClient = getAdsClient();
  const trimmedSlot = slotId.trim();
  const configured = isAdSlotConfigured(slotId);

  useEffect(() => {
    if (!configured || pushedRef.current) {
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
  }, [configured]);

  if (!configured) {
    if (!showPlaceholder) {
      return null;
    }
    return (
      <div className={`w-full ${className}`.trim()}>
        <AdPlaceholder layout={layout} />
      </div>
    );
  }

  const minHeightClass =
    layout === "sidebar" ? "min-h-[280px] sm:min-h-[600px]" : "min-h-[90px]";

  return (
    <div
      className={`flex w-full justify-center overflow-hidden ${minHeightClass} ${className}`.trim()}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block w-full max-w-full"
        style={{
          display: "block",
          minHeight: layout === "sidebar" ? 280 : 90,
        }}
        data-ad-client={adsClient}
        data-ad-slot={trimmedSlot}
        data-ad-format={layout === "sidebar" ? "vertical" : "horizontal"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
