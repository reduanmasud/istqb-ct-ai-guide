import type { Progress, ExamAttempt } from "./types";

const STORAGE_KEY = "ctai_progress";

const defaultProgress = (): Progress => ({
  completedLessons: [],
  quizAnswers: {},
  quizCorrect: {},
  examAttempts: [],
  lastVisited: "/",
});

export function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function markLessonComplete(loId: string): void {
  const p = loadProgress();
  if (!p.completedLessons.includes(loId)) {
    p.completedLessons = [...p.completedLessons, loId];
    saveProgress(p);
  }
}

export function recordQuizAnswer(
  loId: string,
  answer: number | number[],
  correct: boolean
): void {
  const p = loadProgress();
  p.quizAnswers = { ...p.quizAnswers, [loId]: answer };
  p.quizCorrect = { ...p.quizCorrect, [loId]: correct };
  saveProgress(p);
}

export function recordExamAttempt(attempt: ExamAttempt): void {
  const p = loadProgress();
  p.examAttempts = [...p.examAttempts, attempt];
  saveProgress(p);
}

export function setLastVisited(route: string): void {
  const p = loadProgress();
  p.lastVisited = route;
  saveProgress(p);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ── Derived stats ─────────────────────────────────────────────────────────────

export function chapterProgress(
  chapterId: number,
  loIds: string[]
): { completed: number; total: number; pct: number } {
  const p = loadProgress();
  const completed = loIds.filter((id) =>
    p.completedLessons.includes(id)
  ).length;
  return { completed, total: loIds.length, pct: Math.round((completed / loIds.length) * 100) };
}

export function overallProgress(allLoIds: string[]): number {
  const p = loadProgress();
  const done = allLoIds.filter((id) => p.completedLessons.includes(id)).length;
  return Math.round((done / allLoIds.length) * 100);
}

export function examReadiness(allLoIds: string[]): number {
  const p = loadProgress();
  const correct = allLoIds.filter((id) => p.quizCorrect[id] === true).length;
  return Math.round((correct / allLoIds.length) * 100);
}
