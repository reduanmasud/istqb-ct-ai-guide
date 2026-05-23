import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { chapters, chapterColorClass } from "@/lib/content";
import { LessonList } from "@/components/chapter/LessonList";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export function generateStaticParams() {
  return chapters.map((c) => ({ id: String(c.id) }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = chapters.find((c) => c.id === Number(id));
  if (!chapter) notFound();

  const colors = chapterColorClass(chapter.color);

  const lessonsData = await Promise.all(
    chapter.loIds.map(async (loId) => {
      const data = await import(`@/content/lessons/${loId}.json`);
      return {
        id: loId,
        title: data.default.title as string,
        kLevel: data.default.kLevel as string,
      };
    })
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>

        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium mb-4",
            colors.bg,
            colors.text
          )}
        >
          Chapter {chapter.id}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
        <p className="mt-2 text-gray-500 mb-2">{chapter.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {chapter.duration} min
          </span>
          <span>{chapter.loIds.length} learning objectives</span>
        </div>

        <LessonList chapterId={chapter.id} lessons={lessonsData} />
      </main>
    </>
  );
}
