import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISTQB CT-AI v2.0 Study Guide",
  description: "Interactive practice-first learning guide for the ISTQB Certified Tester AI Testing v2.0 certification",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
