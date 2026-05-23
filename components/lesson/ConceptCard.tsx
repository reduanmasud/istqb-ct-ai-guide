interface Props {
  concept: string;
  keyPoints: string[];
}

export function ConceptCard({ concept, keyPoints }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
        Concept
      </h2>
      <div className="prose text-gray-700 text-base leading-relaxed whitespace-pre-wrap mb-4">
        {concept}
      </div>
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Key Points
        </h3>
        <ul className="space-y-1.5">
          {keyPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-base text-gray-700 leading-relaxed">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
