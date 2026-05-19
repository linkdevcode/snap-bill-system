"use client";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { PolicyPageShell } from "@/components/layout/PolicyPageShell";
import { getSitePagesContent } from "@/content/site-pages";
import { useInvoice } from "@/context/InvoiceContext";

export default function PrivacyPage() {
  const { language } = useInvoice();
  const { legal } = getSitePagesContent(language);

  return (
    <PolicyPageShell>
      <LegalDocument
        title={legal.privacy.title}
        intro={legal.privacy.intro}
        lastUpdated={legal.lastUpdated}
        sections={legal.privacy.sections}
      />
    </PolicyPageShell>
  );
}
