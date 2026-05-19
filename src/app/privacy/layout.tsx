import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SnapBill",
  description:
    "How SnapBill handles your data: client-side invoice drafting, optional cloud save, and no sale of invoice content.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
