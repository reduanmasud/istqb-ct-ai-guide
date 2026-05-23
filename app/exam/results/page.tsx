"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { loadProgress } from "@/lib/progress";
import questionsData from "@/content/exam/questions.json";
import chaptersData from "@/content/chapters.json";
import type { ExamAttempt, ExamQuestion, ChapterMeta } from "@/lib/types";
import { cn } from "@/lib/cn";
import Link from "next/link";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  BarChart2,
  RefreshCw,
  BookOpen,
} from "lucide-react";

const questions = questionsData as ExamQuestion[];
const chapters = chaptersData as ChapterMeta[];

export default function ExamResultsPage() {
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastAttempt");
    if (raw) {
      setAttempt(JSON.parse(raw) as ExamAttempt);
    } else {
      const p = loadProgress();
      if (p.examAttempts.length > 0) {
        setAttempt(p.examAttempts[p.examAttempts.length - 1]);
      }
    }
  }, []);

  if (!attempt) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-8 text-center">
          <p className="text-gray-500">
            No exam results found.{" "}
            <Link href="/exam" className="text-blue-600 underline">
              Take the exam
            </Link>
            .
          </p>
        </main>
      </>
    );
  }

  const pct = Math.round((attempt.score / attempt.maxScore) * 100);
  const passed = pct >= 65;
  const timeMin = Math.floor(attempt.timeSpent / 60);
  const timeSec = attempt.timeSpent % 60;

  // Per-chapter breakdown
  const chapterStats = chapters.map((ch) => {
    const chQs = questions.filter((q) => q.chapter === ch.id);
    const correct = chQs.filter((q) => {
      const given = attempt.answers[q.id];
      if (given === undefined) return false;
      const corr = Array.isArray(q.correct) ? q.correct : [q.correct];
      const gArr = Array.isArray(given) ? given : [given];
      return (
        corr.length === gArr.length && gArr.every((g) => corr.includes(g))
      );
    });
    return {
      chapter: ch,
      total: chQs.length,
      correct: correct.length,
      pct: chQs.length > 0 ? Math.round((correct.length / chQs.length) * 100) : 0,
    };
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Result card */}
        <div
          className={cn(
            "rounded-xl border p-8 text-center mb-8",
            passed
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          )}
        >
          {passed ? (
            <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          )}
          <h1
            className={cn(
              "text-4xl font-bold mb-1",
              passed ? "text-green-600" : "text-red-600"
            )}
          >
            {pct}%
          </h1>
          <p className="text-gray-500 mb-2">
            {attempt.score}/{attempt.maxScore} points
          </p>
          <p
            className={cn(
              "text-lg font-semibold mb-4",
              passed ? "text-green-700" : "text-gray-700"
            )}
          >
            {passed
              ? "🎉 PASS — You met the 65% threshold!"
              : "❌ Not quite — keep studying!"}
          </p>
          <p className="text-xs text-gray-500">
            Time: {timeMin}m {timeSec}s ·{" "}
            {new Date(attempt.date).toLocaleDateString()}
          </p>
        </div>

        {/* Chapter breakdown */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-600" /> Chapter Breakdown
        </h2>
        <div className="flex flex-col gap-3 mb-8">
          {chapterStats.map(
            ({ chapter, total, correct, pct: cPct }) =>
              total > 0 && (
                <div
                  key={chapter.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-gray-500">
                        Ch {chapter.id}
                      </span>
                      <span className="ml-2 text-sm text-gray-800">
                        {chapter.title}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        cPct >= 65 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {correct}/{total} ({cPct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        cPct >= 65 ? "bg-green-500" : "bg-red-500"
                      )}
                      style={{ width: `${cPct}%` }}
                    />
                  </div>
                  {cPct < 65 && (
                    <Link
                      href={`/chapter/${chapter.id}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-3 w-3" /> Review this chapter
                    </Link>
                  )}
                </div>
              )
          )}
        </div>

        {/* Question review */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Question Review
        </h2>
        <div className="flex flex-col gap-3 mb-8">
          {questions.map((q) => {
            const given = attempt.answers[q.id];
            const corr = Array.isArray(q.correct) ? q.correct : [q.correct];
            const gArr =
              given !== undefined
                ? Array.isArray(given)
                  ? given
                  : [given]
                : [];
            const isCorrect =
              given !== undefined &&
              corr.length === gArr.length &&
              gArr.every((g) => corr.includes(g));
            const skipped = given === undefined;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-xl border p-4 text-sm",
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                )}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">
                        Q{q.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {q.loRef} · Ch{q.chapter}
                      </span>
                      {skipped && (
                        <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-[10px] text-yellow-700">
                          Skipped
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed mb-2 line-clamp-2">
                      {q.stem}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-medium text-gray-700">
                          Explanation:{" "}
                        </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/exam"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4" /> Retake Exam
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
