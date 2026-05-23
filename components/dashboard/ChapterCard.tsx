import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { chapterColorClass } from "@/lib/content";
import type { ChapterMeta } from "@/lib/types";

interface Props {
  chapter: ChapterMeta;
  completed: number;
  total: number;
}

export function ChapterCard({ chapter, completed, total }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const colors = chapterColorClass(chapter.color);
  const isDone = completed === total && total > 0;

  return (
    <Link
      href={`/chapter/${chapter.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md shadow-sm bg-white",
        isDone ? "border-green-200" : "border-blue-100 hover:border-blue-200"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold",
            colors.bg,
            colors.text
          )}
        >
          {chapter.id}
        </div>
        {isDone && (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 leading-tight">
          {chapter.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {chapter.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {chapter.duration} min
        </span>
        <span>
          {completed}/{total} lessons
        </span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-blue-100">
        <div
          className={cn(
            "absolute h-full rounded-full transition-all duration-500",
            isDone ? "bg-green-500" : `bg-${chapter.color}-500`
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
