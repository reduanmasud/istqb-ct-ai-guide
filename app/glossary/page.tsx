"use client";
import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import glossaryData from "@/content/glossary.json";
import chaptersData from "@/content/chapters.json";
import type { GlossaryTerm, ChapterMeta } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Search, X } from "lucide-react";
import Link from "next/link";

const glossary = glossaryData as GlossaryTerm[];
const chapters = chaptersData as ChapterMeta[];

const CHAPTER_COLORS: Record<number, string> = {
  1: "bg-blue-50 text-blue-700",
  2: "bg-purple-50 text-purple-700",
  3: "bg-green-50 text-green-700",
  4: "bg-orange-50 text-orange-700",
  5: "bg-yellow-50 text-yellow-700",
  6: "bg-red-50 text-red-700",
  7: "bg-teal-50 text-teal-700",
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [filterChapter, setFilterChapter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let terms = glossary;
    if (filterChapter !== null) terms = terms.filter((t) => t.chapter === filterChapter);
    if (search.trim()) {
      const q = search.toLowerCase();
      terms = terms.filter(
        (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      );
    }
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [search, filterChapter]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return map;
  }, [filtered]);

  const letters = Object.keys(grouped).sort();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Glossary</h1>
        <p className="text-gray-500 text-sm mb-6">{glossary.length} AI-specific terms from the official CT-AI v2.0 syllabus</p>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms or definitions…"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterChapter(null)}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filterChapter === null ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
            >All</button>
            {chapters.map((ch) => (
              <button key={ch.id}
                onClick={() => setFilterChapter(filterChapter === ch.id ? null : ch.id)}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filterChapter === ch.id
                    ? cn(CHAPTER_COLORS[ch.id], "ring-1 ring-current")
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >Ch {ch.id}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No terms match your search.</p>
        )}

        {/* Alphabetical groups */}
        <div className="flex flex-col gap-8">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 pb-2 border-b border-gray-200">
                {letter}
              </h2>
              <div className="flex flex-col gap-3">
                {grouped[letter].map((term) => (
                  <div key={term.term} className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <h3 className="font-semibold text-gray-900 text-sm">{term.term}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn("rounded px-2 py-0.5 text-[10px] font-medium", CHAPTER_COLORS[term.chapter] ?? "bg-gray-100 text-gray-700")}>
                          Ch {term.chapter}
                        </span>
                        {term.relatedLo && (
                          <Link href={`/chapter/${term.chapter}/lesson/${term.relatedLo}`}
                            className="text-[10px] font-mono text-blue-600 hover:underline">
                            {term.relatedLo.toUpperCase()}
                          </Link>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{term.definition}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
