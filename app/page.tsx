"use client";
import { Header } from "@/components/layout/Header";
import { ChapterCard } from "@/components/dashboard/ChapterCard";
import { chapters, getAllLoIds } from "@/lib/content";
import { useProgress } from "@/hooks/useProgress";
import Link from "next/link";
import { BookOpen, Target, Trophy, Zap } from "lucide-react";

const allLoIds = getAllLoIds();

export default function Dashboard() {
  const { progress, overallPct, readinessPct, getChapterProgress } =
    useProgress(allLoIds);

  const bestScore =
    progress.examAttempts.length > 0
      ? `${Math.max(
          ...progress.examAttempts.map((a) =>
            Math.round((a.score / a.maxScore) * 100)
          )
        )}%`
      : "—";

  const stats = [
    {
      icon: BookOpen,
      label: "Progress",
      value: `${overallPct}%`,
      color: "text-blue-400",
    },
    {
      icon: Target,
      label: "Quiz Accuracy",
      value: `${readinessPct}%`,
      color: "text-green-400",
    },
    {
      icon: Trophy,
      label: "Exam Attempts",
      value: progress.examAttempts.length,
      color: "text-yellow-400",
    },
    {
      icon: Zap,
      label: "Best Score",
      value: bestScore,
      color: "text-purple-400",
    },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400 border border-blue-500/20 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            ISTQB CT-AI v2.0 — 3-day certification
          </div>
          <h1 className="text-3xl font-bold text-slate-100">
            AI Testing Study Guide
          </h1>
          <p className="mt-2 text-slate-400">
            7 chapters · 43 learning objectives · Practice-first approach
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <Icon className={`h-4 w-4 mb-2 ${color}`} />
              <div className="text-2xl font-bold text-slate-100">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">
              Overall Progress
            </span>
            <span className="text-sm text-slate-400">
              {overallPct}% complete
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            <span>
              {progress.completedLessons.length}/{allLoIds.length} lessons
              complete
            </span>
            <span>·</span>
            <span>65% needed to pass exam</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/exam"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Take Mock Exam
          </Link>
          <Link
            href="/glossary"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Browse Glossary
          </Link>
        </div>

        {/* Chapters grid */}
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Chapters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const { completed, total } = getChapterProgress(
              chapter.id,
              chapter.loIds
            );
            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                completed={completed}
                total={total}
              />
            );
          })}
        </div>
      </main>
    </>
  );
}
