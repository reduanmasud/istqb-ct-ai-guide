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
        "group flex flex-col gap-3 rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg",
        colors.border,
        "bg-slate-900/60 hover:bg-slate-900"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
            colors.bg,
            colors.text
          )}
        >
          {chapter.id}
        </div>
        {isDone && (
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-100 leading-tight">
          {chapter.title}
        </h3>
        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
          {chapter.description}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {chapter.duration} min
        </span>
        <span>
          {completed}/{total} lessons
        </span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-slate-800">
        <div
          className={cn(
            "absolute h-full rounded-full transition-all duration-500",
            `bg-${chapter.color}-500`
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
