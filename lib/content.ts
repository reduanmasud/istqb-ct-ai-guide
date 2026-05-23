import chaptersData from "@/content/chapters.json";
import glossaryData from "@/content/glossary.json";
import type { ChapterMeta, GlossaryTerm, Lesson } from "./types";

export const chapters: ChapterMeta[] = chaptersData as ChapterMeta[];
export const glossary: GlossaryTerm[] = glossaryData as GlossaryTerm[];

export function getAllLoIds(): string[] {
  return chapters.flatMap((c) => c.loIds);
}

export function getChapter(id: number): ChapterMeta | undefined {
  return chapters.find((c) => c.id === id);
}

export async function getLesson(loId: string): Promise<Lesson> {
  const data = await import(`@/content/lessons/${loId}.json`);
  return data.default as Lesson;
}

export async function getAllLessons(): Promise<Lesson[]> {
  const ids = getAllLoIds();
  return Promise.all(ids.map(getLesson));
}

export function chapterColorClass(color: string): {
  bg: string;
  text: string;
  border: string;
  ring: string;
} {
  const map: Record<
    string,
    { bg: string; text: string; border: string; ring: string }
  > = {
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/40",
      ring: "ring-blue-500",
    },
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/40",
      ring: "ring-purple-500",
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/40",
      ring: "ring-green-500",
    },
    orange: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/40",
      ring: "ring-orange-500",
    },
    yellow: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/40",
      ring: "ring-yellow-500",
    },
    red: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/40",
      ring: "ring-red-500",
    },
    teal: {
      bg: "bg-teal-500/20",
      text: "text-teal-400",
      border: "border-teal-500/40",
      ring: "ring-teal-500",
    },
  };
  return map[color] ?? map.blue;
}
