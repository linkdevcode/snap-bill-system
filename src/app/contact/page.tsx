"use client";

import { ContactPageContent } from "@/components/legal/ContactPageContent";
import { PolicyPageShell } from "@/components/layout/PolicyPageShell";
import { getSitePagesContent } from "@/content/site-pages";
import { useInvoice } from "@/context/InvoiceContext";

export default function ContactPage() {
  const { language } = useInvoice();
  const { legal } = getSitePagesContent(language);

  return (
    <PolicyPageShell>
      <ContactPageContent contact={legal.contact} />
    </PolicyPageShell>
  );
}
