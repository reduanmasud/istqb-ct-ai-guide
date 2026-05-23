"use client";
import { useState } from "react";
import { ConceptCard } from "./ConceptCard";
import { QuizQuestion } from "./QuizQuestion";
import { ExerciseShell } from "./ExerciseShell";
import {
  markLessonComplete,
  recordQuizAnswer,
  loadProgress,
} from "@/lib/progress";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/cn";

type Step = "concept" | "quiz" | "exercise" | "complete";

interface Props {
  lesson: Lesson;
  loId: string;
  chapterId: number;
  prevLo: string | null;
  nextLo: string | null;
  nextChapterId: number | null;
}

export function LessonClient({
  lesson,
  loId,
  chapterId,
  prevLo,
  nextLo,
  nextChapterId,
}: Props) {
  const alreadyDone = loadProgress().completedLessons.includes(loId);
  const hasExercise =
    lesson.exercise?.type !== undefined && lesson.exercise.type !== "none";

  const [step, setStep] = useState<Step>(
    alreadyDone ? "complete" : "concept"
  );
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);

  const handleQuizComplete = (correct: boolean) => {
    setQuizCorrect(correct);
    recordQuizAnswer(loId, 0, correct);
    if (hasExercise) {
      setStep("exercise");
    } else {
      markLessonComplete(loId);
      setStep("complete");
    }
  };

  const handleExerciseComplete = () => {
    markLessonComplete(loId);
    setStep("complete");
  };

  const steps = ["concept", "quiz", ...(hasExercise ? ["exercise"] : [])];

  // Suppress unused variable warning
  void prevLo;

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      {step !== "complete" && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-300">→</span>}
              <span
                className={cn(
                  "rounded px-2 py-0.5 font-medium",
                  step === s
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-400"
                )}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Concept card — always shown once reached */}
      {(step === "concept" ||
        step === "quiz" ||
        step === "exercise" ||
        step === "complete") && (
        <ConceptCard
          concept={lesson.concept}
          keyPoints={lesson.keyPoints}
        />
      )}

      {step === "concept" && (
        <button
          onClick={() => setStep("quiz")}
          className="self-start flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Take Quick Check <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Quiz */}
      {step === "quiz" && (
        <QuizQuestion quiz={lesson.quiz} onComplete={handleQuizComplete} />
      )}

      {/* Exercise */}
      {step === "exercise" && (
        <ExerciseShell
          exercise={lesson.exercise}
          onComplete={handleExerciseComplete}
        />
      )}

      {/* Complete */}
      {step === "complete" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-700">
                Lesson Complete!
              </h3>
              <p className="text-xs text-gray-500">
                {quizCorrect === true
                  ? "Quiz answered correctly"
                  : quizCorrect === false
                  ? "Review the explanation above"
                  : "Already completed"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {nextLo && (
              <Link
                href={`/chapter/${chapterId}/lesson/${nextLo}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Next Lesson <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {!nextLo && nextChapterId && (
              <Link
                href={`/chapter/${nextChapterId}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Chapter {nextChapterId} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {!nextLo && !nextChapterId && (
              <Link
                href="/exam"
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                Take Mock Exam <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href={`/chapter/${chapterId}`}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Back to Chapter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
