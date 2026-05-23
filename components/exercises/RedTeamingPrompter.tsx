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
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
        <p className="text-sm text-green-300 font-medium mb-3">
          Red-teaming exercise complete!
        </p>
        <button
          onClick={onComplete}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Red-Teaming Exercise
        </h3>
        <span className="text-xs text-slate-500">
          {current + 1} / {scenarios.length}
        </span>
      </div>

      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 mb-4">
        <div className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-1">
          Prompt
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{scenario.prompt}</p>
      </div>

      {revealed && (
        <div className="space-y-3 mb-4">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">
              Risk
            </div>
            <p className="text-sm text-slate-300">{scenario.risk}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-2">
              Category:
            </span>
            <span className="text-xs text-blue-300">{scenario.category}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Reveal Risk
          </button>
        )}
        {revealed && (
          <button
            onClick={next}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {current + 1 < scenarios.length ? "Next Scenario" : "Finish"}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
