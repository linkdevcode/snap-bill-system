"use client";

import Link from "next/link";
import { BookOpen, FileText, Shield } from "lucide-react";

import { SiteHeader } from "@/components/layout/SiteHeader";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] px-4 pb-16 md:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <BookOpen className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Tài liệu SnapBill
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Hướng dẫn nhanh để tạo, xuất PDF và lưu hóa đơn trên đám mây.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-950/50">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                <FileText className="h-4 w-4 text-indigo-600" aria-hidden />
                Trình tạo hóa đơn
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <li>
                  Điền thông tin người gửi, khách hàng và dòng sản phẩm/dịch vụ
                  tại mục{" "}
                  <Link href="/" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    Trình tạo
                  </Link>
                  .
                </li>
                <li>Xem trước thời gian thực ở cột bên phải (desktop).</li>
                <li>Tải PDF trực tiếp từ nút Download PDF trên preview.</li>
              </ul>
            </section>

            <section className="rounded-lg border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-950/50">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                <Shield className="h-4 w-4 text-indigo-600" aria-hidden />
                Tài khoản &amp; bảo mật
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <li>
                  Khách vãng lai: tạo và tải PDF miễn phí, dữ liệu chỉ lưu trên
                  trình duyệt.
                </li>
                <li>
                  Đăng nhập bằng email OTP 6 số hoặc Google để lưu hóa đơn lên
                  Supabase.
                </li>
                <li>
                  Quản lý lịch sử tại{" "}
                  <Link href="/?view=dashboard" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                    Hóa đơn của tôi
                  </Link>{" "}
                  sau khi đăng nhập.
                </li>
              </ul>
            </section>
          </div>

          <p className="mt-8 text-xs text-slate-500 dark:text-slate-500">
            SnapBill — công cụ tạo hóa đơn miễn phí cho freelancer và doanh nghiệp
            nhỏ.
          </p>
        </div>
      </main>
    </div>
  );
}
