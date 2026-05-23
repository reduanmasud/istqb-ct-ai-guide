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
  K1: "bg-gray-100 text-gray-700",
  K2: "bg-blue-50 text-blue-700",
  K3: "bg-orange-50 text-orange-700",
  K4: "bg-red-50 text-red-700",
  H0: "bg-gray-100 text-gray-600",
  H1: "bg-green-50 text-green-700",
  H2: "bg-emerald-50 text-emerald-700",
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
                ? "border-green-200 bg-green-50 hover:bg-green-100"
                : "border-gray-200 bg-white hover:bg-gray-50"
            )}
          >
            <div className="shrink-0">
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
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
                <span className="text-xs text-gray-500 font-mono">
                  {lesson.id.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-800 leading-snug">
                {lesson.title}
              </span>
            </div>

            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
