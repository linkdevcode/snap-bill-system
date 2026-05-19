import type { LegalSection } from "@/content/site-pages";

export interface LegalDocumentProps {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
}

export function LegalDocument({
  title,
  intro,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <article className="prose-snapbill max-w-none">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          {lastUpdated}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {intro}
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
