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
  K1: "bg-slate-100 text-slate-600",
  K2: "bg-blue-100 text-blue-700",
  K3: "bg-orange-100 text-orange-700",
  K4: "bg-red-100 text-red-700",
  H0: "bg-slate-100 text-slate-600",
  H1: "bg-green-100 text-green-700",
  H2: "bg-emerald-100 text-emerald-700",
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
      {lessons.map((lesson) => {
        const isDone = completed.includes(lesson.id);

        return (
          <Link
            key={lesson.id}
            href={`/chapter/${chapterId}/lesson/${lesson.id}`}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-4 transition-all",
              isDone
                ? "border-green-200 bg-green-50 hover:bg-green-100"
                : "border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200"
            )}
          >
            <div className="shrink-0">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-blue-300" />
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
                <span className="text-xs text-slate-400 font-mono">
                  {lesson.id.toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700 leading-snug">
                {lesson.title}
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-blue-400 shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
