"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface MatrixData {
  TP: number;
  TN: number;
  FP: number;
  FN: number;
}

interface Props {
  data: MatrixData;
  onComplete: () => void;
}

function fmt(n: number) {
  return n.toLocaleString();
}

export function ConfusionMatrixExercise({ data, onComplete }: Props) {
  const { TP, TN, FP, FN } = data;
  const total = TP + TN + FP + FN;

  const metrics = {
    Accuracy: (((TP + TN) / total) * 100).toFixed(1) + "%",
    Precision: ((TP / (TP + FP)) * 100).toFixed(1) + "%",
    Recall: ((TP / (TP + FN)) * 100).toFixed(1) + "%",
    "F1-Score": (
      (2 * TP) /
      (2 * TP + FP + FN) *
      100
    ).toFixed(1) + "%",
  };

  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
        Confusion Matrix Exercise
      </h3>

      {/* Matrix grid */}
      <div className="grid grid-cols-3 gap-1 mb-6 text-center text-sm max-w-xs">
        <div />
        <div className="text-xs text-gray-500 py-1">Predicted Pos</div>
        <div className="text-xs text-gray-500 py-1">Predicted Neg</div>

        <div className="text-xs text-gray-500 flex items-center justify-end pr-2">
          Actual Pos
        </div>
        <div className="rounded bg-green-50 border border-green-200 p-3">
          <div className="text-xs text-gray-500">TP</div>
          <div className="font-bold text-green-600">{fmt(TP)}</div>
        </div>
        <div className="rounded bg-red-50 border border-red-200 p-3">
          <div className="text-xs text-gray-500">FN</div>
          <div className="font-bold text-red-600">{fmt(FN)}</div>
        </div>

        <div className="text-xs text-gray-500 flex items-center justify-end pr-2">
          Actual Neg
        </div>
        <div className="rounded bg-orange-50 border border-orange-300 p-3">
          <div className="text-xs text-gray-500">FP</div>
          <div className="font-bold text-orange-600">{fmt(FP)}</div>
        </div>
        <div className="rounded bg-green-50 border border-green-200 p-3">
          <div className="text-xs text-gray-500">TN</div>
          <div className="font-bold text-green-600">{fmt(TN)}</div>
        </div>
      </div>

      {/* Calculated metrics */}
      {revealed && (
        <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
          {Object.entries(metrics).map(([name, val]) => (
            <div
              key={name}
              className="rounded-lg border border-gray-200 bg-gray-100 p-3 text-center"
            >
              <div className="text-xs text-gray-500 mb-1">{name}</div>
              <div className="text-lg font-bold text-blue-600">{val}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Calculate Metrics
          </button>
        )}
        {revealed && (
          <button
            onClick={onComplete}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
