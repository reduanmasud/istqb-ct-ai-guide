import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ISTQB CT-AI v2.0 Study Guide",
  description:
    "Interactive practice-first learning guide for the ISTQB Certified Tester AI Testing v2.0 certification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakartaSans.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
