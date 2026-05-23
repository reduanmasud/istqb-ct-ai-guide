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
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="text-sm text-green-700 font-semibold mb-3">
          EDA exploration complete!
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

  const step = steps[current];

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-blue-500 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600">
            EDA Explorer
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
          Step {current + 1} / {steps.length}
        </span>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mb-6">
        <div className="text-sm font-bold text-blue-700 mb-2">{step.label}</div>
        <p className="text-sm text-slate-700 leading-relaxed">{step.description}</p>
      </div>

      <button
        onClick={() => setCurrent((p) => p + 1)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        {current + 1 < steps.length ? "Next Step" : "Finish"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
