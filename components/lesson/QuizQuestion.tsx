"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Quiz } from "@/lib/types";

interface Props {
  quiz: Quiz;
  onComplete: (correct: boolean) => void;
}

export function QuizQuestion({ quiz, onComplete }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isMulti = quiz.multiSelect ?? false;
  const correctAnswers = isMulti
    ? (quiz.correctMulti ?? [quiz.correct as number])
    : [quiz.correct as number];

  const toggle = (idx: number) => {
    if (submitted) return;
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
      );
    } else {
      setSelected([idx]);
    }
  };

  const submit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((s) => correctAnswers.includes(s));
    onComplete(isCorrect);
  };

  const getOptionState = (idx: number) => {
    if (!submitted) {
      return selected.includes(idx) ? "selected" : "idle";
    }
    const isCorrect = correctAnswers.includes(idx);
    const wasSelected = selected.includes(idx);
    if (isCorrect) return "correct";
    if (wasSelected && !isCorrect) return "wrong";
    return "idle";
  };

  const allCorrect =
    submitted &&
    selected.length === correctAnswers.length &&
    selected.every((s) => correctAnswers.includes(s));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">
          {isMulti ? "Select TWO" : "Quick Check"}
        </span>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed mb-4">
        {quiz.question}
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {quiz.options.map((opt, idx) => {
          const state = getOptionState(idx);
          return (
            <button
              key={idx}
              onClick={() => toggle(idx)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all",
                state === "idle" &&
                  "border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50",
                state === "selected" &&
                  "border-blue-500 bg-blue-500/10 text-slate-200",
                state === "correct" &&
                  "border-green-500 bg-green-500/10 text-green-300",
                state === "wrong" &&
                  "border-red-500 bg-red-500/10 text-red-300"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                  state === "idle" && "border-slate-600",
                  state === "selected" &&
                    "border-blue-400 bg-blue-400 text-white",
                  state === "correct" &&
                    "border-green-400 bg-green-400 text-white",
                  state === "wrong" && "border-red-400 bg-red-400 text-white"
                )}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-relaxed">{opt}</span>
              {state === "correct" && (
                <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              )}
              {state === "wrong" && (
                <XCircle className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={selected.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Check Answer <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <div
          className={cn(
            "rounded-lg p-4 text-sm",
            allCorrect
              ? "bg-green-500/10 border border-green-500/30 text-green-300"
              : "bg-orange-500/10 border border-orange-500/30 text-orange-300"
          )}
        >
          <p className="font-medium mb-1">
            {allCorrect ? "Correct!" : "Not quite"}
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            {quiz.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
