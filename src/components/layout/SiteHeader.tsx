"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthToolbar } from "@/components/auth/AuthToolbar";
import { AdSlot } from "@/components/invoice/AdSlot";
import { AppBrand } from "@/components/layout/AppBrand";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import type { WorkspaceView } from "@/types/workspace";

export interface SiteHeaderProps {
  workspaceView?: WorkspaceView;
  onWorkspaceViewChange?: (view: WorkspaceView) => void;
  signInOpen?: boolean;
  onSignInOpenChange?: (open: boolean) => void;
}

const navLinkBase =
  "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

function navLinkClass(active: boolean): string {
  return active
    ? `${navLinkBase} text-indigo-600 dark:text-indigo-400`
    : `${navLinkBase} text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100`;
}

export function SiteHeader({
  workspaceView = "editor",
  onWorkspaceViewChange,
  signInOpen = false,
  onSignInOpenChange,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const { session, loading } = useAuth();
  const topSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? "";

  const isDocs = pathname === "/docs";
  const isHome = pathname === "/";

  const handleEditorNav = () => {
    if (isHome && onWorkspaceViewChange) {
      onWorkspaceViewChange("editor");
      return;
    }
    if (!isHome) {
      window.location.href = "/";
    }
  };

  const handleInvoicesNav = () => {
    if (!session && !loading) {
      onSignInOpenChange?.(true);
      return;
    }
    if (isHome && onWorkspaceViewChange) {
      onWorkspaceViewChange("dashboard");
      return;
    }
    if (!isHome) {
      window.location.href = "/?view=dashboard";
    }
  };

  return (
    <div className="mb-6">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <AppBrand />

          <nav
            className="order-3 flex w-full flex-wrap items-center justify-center gap-1 sm:order-2 sm:w-auto sm:flex-1 sm:justify-center"
            aria-label="Điều hướng chính"
          >
            <button
              type="button"
              className={navLinkClass(
                isHome && workspaceView === "editor" && !isDocs,
              )}
              onClick={handleEditorNav}
            >
              Trình tạo
            </button>
            <button
              type="button"
              className={navLinkClass(
                isHome && workspaceView === "dashboard" && !isDocs,
              )}
              onClick={handleInvoicesNav}
            >
              Hóa đơn của tôi
            </button>
            <Link href="/docs" className={navLinkClass(isDocs)}>
              Tài liệu
            </Link>
          </nav>

          <div className="order-2 flex shrink-0 items-center gap-2 sm:order-3">
            <ThemeToggle />
            <AuthToolbar
              layout="header"
              signInOpen={signInOpen}
              onSignInOpenChange={onSignInOpenChange}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto mt-4 max-w-[1400px] px-4 md:px-8">
        <AdSlot slotId={topSlotId} layout="banner" />
      </div>
    </div>
  );
}
