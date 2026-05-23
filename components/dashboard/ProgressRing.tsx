"use client";

interface Props {
  pct: number;
  size?: number;
  label?: string;
  color?: string;
}

export function ProgressRing({
  pct,
  size = 80,
  label,
  color = "#2563eb",
}: Props) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 absolute inset-0"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={9}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={9}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{pct}%</span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-gray-500 text-center">{label}</span>
      )}
    </div>
  );
}
