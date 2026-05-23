"use client";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { loadProgress } from "@/lib/progress";
import { useState, useEffect } from "react";

interface LessonMeta {
  id: string;
  title: string;
  kLevel: string;
}

const kLevelColor: Record<string, string> = {
  K1: "bg-slate-700 text-slate-300",
  K2: "bg-blue-500/20 text-blue-300",
  K3: "bg-orange-500/20 text-orange-300",
  K4: "bg-red-500/20 text-red-300",
  H0: "bg-gray-500/20 text-gray-300",
  H1: "bg-green-500/20 text-green-300",
  H2: "bg-emerald-500/20 text-emerald-300",
};

export function LessonList({
  chapterId,
  lessons,
}: {
  chapterId: number;
  lessons: LessonMeta[];
}) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const p = loadProgress();
    setCompleted(p.completedLessons);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {lessons.map((lesson, idx) => {
        const isDone = completed.includes(lesson.id);

        return (
          <Link
            key={lesson.id}
            href={`/chapter/${chapterId}/lesson/${lesson.id}`}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4 transition-all",
              isDone
                ? "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
                : "border-slate-800 bg-slate-900/60 hover:bg-slate-900"
            )}
          >
            <div className="shrink-0">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                <Circle className="h-5 w-5 text-slate-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                    kLevelColor[lesson.kLevel] ?? kLevelColor.K2
                  )}
                >
                  {lesson.kLevel}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {lesson.id.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-slate-200 leading-snug">
                {lesson.title}
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
