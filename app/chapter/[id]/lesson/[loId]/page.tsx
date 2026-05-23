import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { chapters, chapterColorClass } from "@/lib/content";
import { LessonClient } from "@/components/lesson/LessonClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return chapters.flatMap((c) =>
    c.loIds.map((loId) => ({ id: String(c.id), loId }))
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; loId: string }>;
}) {
  const { id, loId } = await params;
  const chapter = chapters.find((c) => c.id === Number(id));
  if (!chapter) notFound();

  let lesson;
  try {
    const data = await import(`@/content/lessons/${loId}.json`);
    lesson = data.default;
  } catch {
    notFound();
  }

  const colors = chapterColorClass(chapter.color);
  const loIds = chapter.loIds;
  const currentIndex = loIds.indexOf(loId);
  const prevLo = currentIndex > 0 ? loIds[currentIndex - 1] : null;
  const nextLo =
    currentIndex < loIds.length - 1 ? loIds[currentIndex + 1] : null;
  const isLastInChapter = currentIndex === loIds.length - 1;
  const nextChapterId =
    isLastInChapter && chapter.id < 7 ? chapter.id + 1 : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={`/chapter/${id}`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Ch {id}
          </Link>
          <span className="text-blue-200">/</span>
          <span className={cn("text-sm font-medium truncate max-w-[24ch]", colors.text)}>
            {lesson.title}
          </span>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span
            className={cn(
              "rounded-lg px-2.5 py-0.5 text-xs font-bold",
              colors.bg,
              colors.text
            )}
          >
            {lesson.kLevel}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {loId.toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-8">
          {lesson.title}
        </h1>

        <LessonClient
          lesson={lesson}
          loId={loId}
          chapterId={Number(id)}
          prevLo={prevLo}
          nextLo={nextLo}
          nextChapterId={nextChapterId}
        />
      </main>
    </>
  );
}
