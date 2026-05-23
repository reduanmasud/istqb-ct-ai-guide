"use client";
import Link from "next/link";
import { BookOpen, GraduationCap, BookMarked } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: BookOpen },
  { href: "/exam", label: "Mock Exam", icon: GraduationCap },
  { href: "/glossary", label: "Glossary", icon: BookMarked },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-gray-900"
        >
          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-bold text-white">
            CT-AI
          </span>
          <span className="hidden sm:inline">v2.0 Study Guide</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                pathname === href
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
