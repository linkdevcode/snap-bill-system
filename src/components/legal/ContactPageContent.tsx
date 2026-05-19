"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { type FormEvent, useCallback } from "react";

import type { SitePagesContent } from "@/content/site-pages";

export interface ContactPageContentProps {
  contact: SitePagesContent["legal"]["contact"];
}

export function ContactPageContent({ contact }: ContactPageContentProps) {
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const name = String(data.get("name") ?? "").trim();
      const email = String(data.get("email") ?? "").trim();
      const message = String(data.get("message") ?? "").trim();

      const subject = encodeURIComponent(`SnapBill contact from ${name || "visitor"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`,
      );
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    },
    [contact.email],
  );

  return (
    <article className="max-w-none">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
          {contact.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {contact.intro}
        </p>
      </header>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-950/50 md:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {contact.emailLabel}
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {contact.email}
        </a>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          {contact.emailHint}
        </p>
      </div>

      <form
        className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
          {contact.formTitle}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              {contact.formName}
            </span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder={contact.formNamePlaceholder}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-indigo-500/0 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              {contact.formEmail}
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={contact.formEmailPlaceholder}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
            {contact.formMessage}
          </span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder={contact.formMessagePlaceholder}
            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900"
        >
          {contact.formSubmit}
        </button>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-500">
          {contact.formNote}
        </p>
      </form>

      <p className="mt-8">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← {contact.backHome}
        </Link>
      </p>
    </article>
  );
}
