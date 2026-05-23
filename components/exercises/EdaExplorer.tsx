"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface EdaStep {
  label: string;
  description: string;
}

interface Props {
  data: { steps?: EdaStep[]; [key: string]: unknown };
  onComplete: () => void;
}

export function EdaExplorer({ data, onComplete }: Props) {
  const steps: EdaStep[] = data.steps ?? [];
  const [current, setCurrent] = useState(0);
  const done = current >= steps.length;

  if (done || steps.length === 0) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
        <p className="text-sm text-green-300 font-medium mb-3">
          EDA exploration complete!
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

  const step = steps[current];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          EDA Explorer
        </h3>
        <span className="text-xs text-slate-500">
          Step {current + 1} / {steps.length}
        </span>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-6">
        <div className="text-sm font-semibold text-blue-300 mb-2">
          {step.label}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {step.description}
        </p>
      </div>

      <button
        onClick={() => setCurrent((p) => p + 1)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        {current + 1 < steps.length ? "Next Step" : "Finish"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
