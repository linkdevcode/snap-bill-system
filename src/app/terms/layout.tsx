import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SnapBill",
  description:
    "Terms for using the free SnapBill invoice generator, including lawful use and user responsibility for invoice data.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
