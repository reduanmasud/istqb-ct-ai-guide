"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import questionsData from "@/content/exam/questions.json";
import type { ExamQuestion } from "@/lib/types";
import { useExam } from "@/hooks/useExam";
import { cn } from "@/lib/cn";
import { Clock, AlertCircle, Send } from "lucide-react";

const questions = questionsData as ExamQuestion[];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ExamPage() {
  const router = useRouter();
  const {
    answers,
    answer,
    submitted,
    submit,
    timeLeft,
    timerActive,
    score,
    maxScore,
  } = useExam(questions);
  const [currentQ, setCurrentQ] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isMulti = q.multiSelect ?? false;
  const qAnswer = answers[q.id];
  const selectedArr: number[] =
    qAnswer === undefined
      ? []
      : Array.isArray(qAnswer)
        ? qAnswer
        : [qAnswer];

  const toggleOption = (idx: number) => {
    if (submitted) return;
    if (isMulti) {
      const curr = Array.isArray(answers[q.id])
        ? (answers[q.id] as number[])
        : [];
      const updated = curr.includes(idx)
        ? curr.filter((x) => x !== idx)
        : [...curr, idx];
      answer(q.id, updated);
    } else {
      answer(q.id, idx);
      // Auto-advance after short delay
      setTimeout(() => {
        if (currentQ < questions.length - 1) setCurrentQ((c) => c + 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    const attempt = submit();
    // Store score in session for results page
    sessionStorage.setItem("lastAttempt", JSON.stringify(attempt));
    router.push("/exam/results");
  };

  const getOptionState = (
    idx: number
  ): "idle" | "selected" | "correct" | "wrong" => {
    if (!submitted) return selectedArr.includes(idx) ? "selected" : "idle";
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct];
    if (correct.includes(idx)) return "correct";
    if (selectedArr.includes(idx)) return "wrong";
    return "idle";
  };

  // Suppress unused var warning — score is available post-submit for potential display
  void score;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Mock Exam</h1>
            <p className="text-sm text-slate-400">
              CT-AI v2.0 · 46 questions · {maxScore} points · Pass: 33/50 (65%)
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-mono font-medium",
              timeLeft < 600
                ? "border-red-500/50 text-red-400 bg-red-500/10"
                : "border-slate-700 text-slate-300"
            )}
          >
            <Clock className="h-4 w-4" />
            {timerActive ? formatTime(timeLeft) : "60:00"}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${((currentQ + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs text-slate-400 shrink-0">
            {currentQ + 1}/{questions.length}
          </span>
        </div>

        {/* Question navigator dots */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={cn(
                "h-6 w-6 rounded text-[10px] font-medium transition-colors",
                i === currentQ
                  ? "bg-blue-600 text-white"
                  : answers[questions[i].id] !== undefined
                    ? "bg-green-600/30 text-green-400 border border-green-600/40"
                    : "bg-slate-800 text-slate-500 hover:bg-slate-700"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <span className="shrink-0 rounded bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
              Q{q.id} · {q.points}pt · {q.loRef} · Ch{q.chapter}
            </span>
            {isMulti && (
              <span className="rounded bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-300">
                Select TWO
              </span>
            )}
          </div>

          <p className="text-slate-100 text-sm leading-relaxed mb-5">
            {q.stem}
          </p>

          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => {
              const state = getOptionState(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleOption(idx)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all",
                    state === "idle" &&
                      "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50",
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
                      state === "idle" && "border-slate-600 text-slate-500",
                      state === "selected" &&
                        "border-blue-400 bg-blue-500 text-white",
                      state === "correct" &&
                        "border-green-500 bg-green-500 text-white",
                      state === "wrong" && "border-red-500 bg-red-500 text-white"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="mt-4 rounded-lg p-3 text-xs bg-slate-800 border border-slate-700 text-slate-300">
              <span className="font-semibold text-slate-200">
                Explanation:{" "}
              </span>
              {q.explanation}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
            disabled={currentQ === 0}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <span className="text-xs text-slate-500">
            {answeredCount}/{questions.length} answered
          </span>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() =>
                setCurrentQ((c) => Math.min(questions.length - 1, c + 1))
              }
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Next →
            </button>
          ) : (
            !submitted && (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                <Send className="h-4 w-4" /> Submit Exam
              </button>
            )
          )}
        </div>

        {/* Confirm modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 max-w-sm w-full mx-4">
              <AlertCircle className="h-8 w-8 text-yellow-400 mb-3" />
              <h3 className="font-semibold text-slate-100 mb-1">
                Submit Exam?
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {answeredCount < questions.length
                  ? `You have ${questions.length - answeredCount} unanswered questions.`
                  : "All questions answered. Ready to submit?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
