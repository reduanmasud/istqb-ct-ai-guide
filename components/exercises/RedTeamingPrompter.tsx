"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

interface Scenario {
  prompt: string;
  risk: string;
  category: string;
}

interface Props {
  data: { scenarios: Scenario[] };
  onComplete: () => void;
}

export function RedTeamingPrompter({ data, onComplete }: Props) {
  const { scenarios } = data;
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const done = current >= scenarios.length;

  const scenario = scenarios[current];

  const next = () => {
    setRevealed(false);
    if (current + 1 >= scenarios.length) {
      setCurrent(scenarios.length);
    } else {
      setCurrent((p) => p + 1);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="text-sm text-green-700 font-semibold mb-3">
          Red-teaming exercise complete!
        </p>
        <button
          onClick={onComplete}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-orange-500 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Red-Teaming Exercise
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
          {current + 1} / {scenarios.length}
        </span>
      </div>

      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 mb-4">
        <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1.5">
          Prompt
        </div>
        <p className="text-sm text-slate-800 leading-relaxed">{scenario.prompt}</p>
      </div>

      {revealed && (
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1.5">
              Risk
            </div>
            <p className="text-sm text-slate-700">{scenario.risk}</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide mr-2">
              Category:
            </span>
            <span className="text-xs text-blue-700 font-medium">{scenario.category}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="rounded-lg border border-orange-200 bg-orange-50 px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
          >
            Reveal Risk
          </button>
        )}
        {revealed && (
          <button
            onClick={next}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {current + 1 < scenarios.length ? "Next Scenario" : "Finish"}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
