"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  data: { stages: string[] };
  onComplete: () => void;
}

export function WorkflowSequencer({ data, onComplete }: Props) {
  const correct = data.stages;
  const [items, setItems] = useState<string[]>(() => [...correct].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);

  const isCorrect =
    checked && items.every((item, i) => item === correct[i]);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    setChecked(false);
  };

  const check = () => setChecked(true);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
        Workflow Sequencer
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        Drag the stages into the correct order.
      </p>

      <ol className="flex flex-col gap-2 mb-6">
        {items.map((stage, idx) => {
          const correct_ = checked && stage === correct[idx];
          const wrong_ = checked && stage !== correct[idx];
          return (
            <li
              key={stage}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm",
                correct_ && "border-green-500/40 bg-green-500/10 text-green-300",
                wrong_ && "border-red-500/40 bg-red-500/10 text-red-300",
                !checked && "border-slate-700 text-slate-300"
              )}
            >
              <span className="w-5 text-slate-600 font-mono text-xs">
                {idx + 1}.
              </span>
              <span className="flex-1">{stage}</span>
              {!checked && (
                <div className="flex gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="rounded p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="rounded p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {correct_ && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex gap-3">
        {!checked && (
          <button
            onClick={check}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Check Order
          </button>
        )}
        {checked && isCorrect && (
          <button
            onClick={onComplete}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        )}
        {checked && !isCorrect && (
          <button
            onClick={() => setChecked(false)}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
