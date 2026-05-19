import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SnapBill",
  description: "Contact SnapBill support for questions about invoices, privacy, and accounts.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
