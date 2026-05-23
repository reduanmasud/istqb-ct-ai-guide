"use client";
import { useState, useCallback } from "react";
import {
  loadProgress,
  markLessonComplete,
  recordQuizAnswer,
  recordExamAttempt,
  chapterProgress,
  overallProgress,
  examReadiness,
} from "@/lib/progress";
import type { Progress, ExamAttempt } from "@/lib/types";

export function useProgress(allLoIds: string[]) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const refresh = useCallback(() => setProgress(loadProgress()), []);

  const completeLesson = useCallback(
    (loId: string) => {
      markLessonComplete(loId);
      refresh();
    },
    [refresh]
  );

  const answerQuiz = useCallback(
    (loId: string, answer: number | number[], correct: boolean) => {
      recordQuizAnswer(loId, answer, correct);
      refresh();
    },
    [refresh]
  );

  const submitExam = useCallback(
    (attempt: ExamAttempt) => {
      recordExamAttempt(attempt);
      refresh();
    },
    [refresh]
  );

  const getChapterProgress = useCallback(
    (chapterId: number, loIds: string[]) => chapterProgress(chapterId, loIds),
    []
  );

  return {
    progress,
    overallPct: overallProgress(allLoIds),
    readinessPct: examReadiness(allLoIds),
    completeLesson,
    answerQuiz,
    submitExam,
    getChapterProgress,
    refresh,
  };
}
