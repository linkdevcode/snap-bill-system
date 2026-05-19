"use client";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { PolicyPageShell } from "@/components/layout/PolicyPageShell";
import { getSitePagesContent } from "@/content/site-pages";
import { useInvoice } from "@/context/InvoiceContext";

export default function TermsPage() {
  const { language } = useInvoice();
  const { legal } = getSitePagesContent(language);

  return (
    <PolicyPageShell>
      <LegalDocument
        title={legal.terms.title}
        intro={legal.terms.intro}
        lastUpdated={legal.lastUpdated}
        sections={legal.terms.sections}
      />
    </PolicyPageShell>
  );
}
