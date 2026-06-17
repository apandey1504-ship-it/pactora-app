import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pactora | Contract Assurance Platform",
  description:
    "Pactora helps businesses manage agreements, milestones, changes, approvals, payments, disputes, and trust scores."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
