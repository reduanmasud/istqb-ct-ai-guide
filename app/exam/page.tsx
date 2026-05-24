"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { getAllExamSetResults } from "@/lib/progress";
import type { ExamSet, ExamSetResult } from "@/lib/types";
import { cn } from "@/lib/cn";
import { CheckCircle2, XCircle, Play, RotateCcw } from "lucide-react";

const SETS: {
  id: ExamSet;
  label: string;
  description: string;
  questions: number;
  points: number;
  color: string;
}[] = [
  {
    id: "a",
    label: "Set A — Official Sample Exam (ISTQB)",
    description: "Official ISTQB CT-AI Sample Exam A questions",
    questions: 40,
    points: 46,
    color: "blue",
  },
  {
    id: "b",
    label: "Set B — Practice Exam (Extended)",
    description: "Extended practice set with AI-generated questions",
    questions: 46,
    points: 46,
    color: "purple",
  },
];

const accentMap: Record<string, { border: string; bar: string; text: string }> =
  {
    blue: {
      border: "border-blue-200",
      bar: "bg-blue-500",
      text: "text-blue-700",
    },
    purple: {
      border: "border-purple-200",
      bar: "bg-purple-500",
      text: "text-purple-700",
    },
  };

export default function ExamHubPage() {
  const [results, setResults] = useState<Record<ExamSet, ExamSetResult | null>>(
    { a: null, b: null }
  );

  useEffect(() => {
    setResults(getAllExamSetResults());
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Mock Exam Sets</h1>
          <p className="mt-1 text-sm text-slate-500">
            CT-AI v2.0 · 60 minutes · Pass: 65%. Take any set to practise for
            the official exam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SETS.map(({ id, label, description, questions, points, color }) => {
            const result = results[id];
            const accent = accentMap[color];
            const pct = result
              ? Math.round((result.score / result.total) * 100)
              : 0;

            return (
              <div
                key={id}
                className={cn(
                  "rounded-xl border bg-white shadow-sm p-5 flex flex-col gap-3",
                  accent.border
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn("h-8 w-1 rounded-full shrink-0", accent.bar)}
                  />
                  <div>
                    <h3 className={cn("text-base font-bold", accent.text)}>
                      {label}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {questions} questions · {points} points · 60 min · Pass:
                      65%
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                  </div>
                </div>

                {result ? (
                  <div
                    className={cn(
                      "rounded-lg border px-3 py-2 flex items-center gap-2",
                      result.passed
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    )}
                  >
                    {result.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        result.passed ? "text-green-700" : "text-red-600"
                      )}
                    >
                      {result.passed ? "Passed" : "Failed"} · {result.score}/
                      {result.total} ({pct}%)
                    </span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 px-3 py-2 text-xs text-slate-500">
                    Not attempted yet
                  </div>
                )}

                <Link
                  href={`/exam/${id}`}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                    result
                      ? "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {result ? (
                    <>
                      <RotateCcw className="h-4 w-4" /> Retake
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" /> Start
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
