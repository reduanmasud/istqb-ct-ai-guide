"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

interface MRCase {
  input: string;
  transform: string;
  expected: string;
  actual: string;
}

interface Props {
  data: { cases?: MRCase[]; [key: string]: unknown };
  onComplete: () => void;
}

export function MetamorphicWorkshop({ data, onComplete }: Props) {
  const cases: MRCase[] = data.cases ?? [];
  const [step, setStep] = useState<"intro" | "cases" | "done">("intro");
  const [current, setCurrent] = useState(0);

  const mr = cases[current];

  if (step === "intro") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Metamorphic Testing Workshop
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Metamorphic testing uses relations between inputs and outputs to check
          AI model behaviour without a known oracle.
        </p>
        <button
          onClick={() => setStep(cases.length > 0 ? "cases" : "done")}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Start <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (step === "done" || current >= cases.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="text-sm text-green-700 font-medium mb-3">
          Metamorphic workshop complete!
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

  const passes = mr.actual === mr.expected;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          Metamorphic Relation
        </h3>
        <span className="text-xs text-gray-500">
          {current + 1} / {cases.length}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-3">
          <div className="text-xs text-gray-500 mb-1">Input</div>
          <p className="text-sm text-gray-800">{mr.input}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="text-xs text-gray-500 mb-1">Transformation</div>
          <p className="text-sm text-blue-700">{mr.transform}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-3">
            <div className="text-xs text-gray-500 mb-1">Expected</div>
            <p className="text-sm text-gray-800">{mr.expected}</p>
          </div>
          <div
            className={cn(
              "rounded-lg border p-3",
              passes
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            )}
          >
            <div className="text-xs text-gray-500 mb-1">Actual</div>
            <p
              className={cn(
                "text-sm",
                passes ? "text-green-700" : "text-red-700"
              )}
            >
              {mr.actual}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (current + 1 >= cases.length) {
            setStep("done");
          } else {
            setCurrent((p) => p + 1);
          }
        }}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        {current + 1 < cases.length ? "Next Relation" : "Finish"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
