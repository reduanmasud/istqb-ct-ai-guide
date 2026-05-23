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
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
        Workflow Sequencer
      </h3>
      <p className="text-sm text-gray-600 mb-4">
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
                correct_ && "border-green-200 bg-green-50 text-green-700",
                wrong_ && "border-red-200 bg-red-50 text-red-700",
                !checked && "border-gray-200 text-gray-700"
              )}
            >
              <span className="w-5 text-gray-400 font-mono text-xs">
                {idx + 1}.
              </span>
              <span className="flex-1">{stage}</span>
              {!checked && (
                <div className="flex gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="rounded p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {correct_ && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
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
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
