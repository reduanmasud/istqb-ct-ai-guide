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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
        Dataset Constraint Tester
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        Review each dataset constraint and check results.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {constraints.map((c, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 text-sm",
              !checked && "border-slate-700 text-slate-300",
              checked && c.passes && "border-green-500/30 bg-green-500/5 text-green-300",
              checked && !c.passes && "border-red-500/30 bg-red-500/5 text-red-300"
            )}
          >
            {checked ? (
              c.passes ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              )
            ) : (
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-slate-600" />
            )}
            <span>{c.description}</span>
          </div>
        ))}
      </div>

      {checked && (
        <p className="text-sm text-slate-400 mb-4">
          {passCount} / {constraints.length} constraints passed.
        </p>
      )}

      <div className="flex gap-3">
        {!checked && (
          <button
            onClick={() => setChecked(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Run Checks
          </button>
        )}
        {checked && (
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
