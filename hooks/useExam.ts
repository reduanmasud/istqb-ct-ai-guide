"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ExamQuestion, ExamAttempt } from "@/lib/types";
import { recordExamAttempt } from "@/lib/progress";

export function useExam(questions: ExamQuestion[]) {
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 min in seconds
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start timer when first answer given
  useEffect(() => {
    if (Object.keys(answers).length > 0 && !timerActive && !submitted) {
      setTimerActive(true);
    }
  }, [answers, timerActive, submitted]);

  useEffect(() => {
    if (timerActive && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, submitted]);

  const answer = useCallback((questionId: number, value: number | number[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const submit = useCallback((): ExamAttempt => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);

    const score = questions.reduce((total, q) => {
      const given = answers[q.id];
      if (given === undefined) return total;
      const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
      const givenArr = Array.isArray(given) ? given : [given];
      const isCorrect =
        correct.length === givenArr.length &&
        givenArr.every((g) => correct.includes(g));
      return total + (isCorrect ? q.points : 0);
    }, 0);

    const maxScore = questions.reduce((t, q) => t + q.points, 0);
    const attempt: ExamAttempt = {
      date: new Date().toISOString(),
      score,
      maxScore,
      answers,
      timeSpent: 3600 - timeLeft,
    };
    recordExamAttempt(attempt);
    return attempt;
  }, [answers, questions, timeLeft]);

  const score = submitted
    ? questions.reduce((total, q) => {
        const given = answers[q.id];
        if (given === undefined) return total;
        const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
        const givenArr = Array.isArray(given) ? given : [given];
        const isCorrect =
          correct.length === givenArr.length &&
          givenArr.every((g) => correct.includes(g));
        return total + (isCorrect ? q.points : 0);
      }, 0)
    : null;

  const maxScore = questions.reduce((t, q) => t + q.points, 0);

  return {
    answers,
    answer,
    submitted,
    submit,
    timeLeft,
    timerActive,
    score,
    maxScore,
  };
}
