"use client";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

interface Constraint {
  description: string;
  passes: boolean;
}

interface Props {
  data: { constraints?: Constraint[]; [key: string]: unknown };
  onComplete: () => void;
}

export function DatasetConstraintTester({ data, onComplete }: Props) {
  const constraints: Constraint[] = data.constraints ?? [];
  const [checked, setChecked] = useState(false);

  const passCount = constraints.filter((c) => c.passes).length;

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-5 w-1 rounded-full bg-blue-500 shrink-0" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Dataset Constraint Tester
        </h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Review each dataset constraint and check results.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {constraints.map((c, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 text-sm",
              !checked && "border-blue-100 text-slate-700 bg-white",
              checked && c.passes && "border-green-200 bg-green-50 text-green-800",
              checked && !c.passes && "border-red-200 bg-red-50 text-red-800"
            )}
          >
            {checked ? (
              c.passes ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )
            ) : (
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-blue-200" />
            )}
            <span>{c.description}</span>
          </div>
        ))}
      </div>

      {checked && (
        <p className="text-sm font-medium text-slate-600 mb-4">
          {passCount} / {constraints.length} constraints passed.
        </p>
      )}

      <div className="flex gap-3">
        {!checked && (
          <button
            onClick={() => setChecked(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Run Checks
          </button>
        )}
        {checked && (
          <button
            onClick={onComplete}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
