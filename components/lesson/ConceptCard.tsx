interface Props {
  concept: string;
  keyPoints: string[];
}

export function ConceptCard({ concept, keyPoints }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
        Concept
      </h2>
      <div className="prose text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">
        {concept}
      </div>
      <div className="border-t border-slate-800 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Key Points
        </h3>
        <ul className="space-y-1.5">
          {keyPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
