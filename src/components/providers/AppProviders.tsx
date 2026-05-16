"use client";

import { AuthProvider } from "@/context/AuthContext";
import { InvoiceProvider } from "@/context/InvoiceContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InvoiceProvider>{children}</InvoiceProvider>
    </AuthProvider>
  );
}
