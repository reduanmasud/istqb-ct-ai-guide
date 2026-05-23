import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0f1e] text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
