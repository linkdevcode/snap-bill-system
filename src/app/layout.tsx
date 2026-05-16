import type { Metadata } from "next";
import Script from "next/script";

import { AppProviders } from "@/components/providers/AppProviders";

import "./globals.css";

const siteTitle = "SnapBill - Free Professional Invoice Generator";
const siteDescription =
  "Generate, download, and manage professional PDF invoices instantly for free. Perfect for freelancers and small businesses.";

function siteUrlObject(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return undefined;
  }
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: siteUrlObject(),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

function AdsenseBootstrapScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client) {
    return null;
  }

  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;

  return (
    <Script
      id="snapbill-adsense-bootstrap"
      src={src}
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdsenseBootstrapScript />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
