interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  max?: number;
  unit?: string;
}

export function BarChart({ data, max, unit = '' }: BarChartProps) {
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-slate-700">{d.label}</span>
            <span className="text-slate-500">
              {d.value}
              {unit}
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${d.color ?? 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (d.value / maxVal) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  max?: number;
  unit?: string;
}

export function LineChart({ data, max, unit = '' }: LineChartProps) {
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);
  const width = 100;
  const height = 100;
  const step = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - (d.value / maxVal) * height;
    return `${x},${y}`;
  });

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height: '160px' }}>
        {[25, 50, 75].map((pct) => (
          <line
            key={pct}
            x1="0"
            y1={height - (pct / 100) * height}
            x2={width}
            y2={height - (pct / 100) * height}
            stroke="#e2e8f0"
            strokeWidth="0.3"
          />
        ))}
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = i * step;
          const y = height - (d.value / maxVal) * height;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#2563eb" vectorEffect="non-scaling-stroke" />
          );
        })}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        {data.map((d, i) => (
          <span key={i} className="text-center">
            {d.value}
            {unit}
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        {data.map((d, i) => (
          <span key={i} className="text-center">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ segments, size = 140 }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <svg width={size} height={size} viewBox="0 0 100 100" className="flex-shrink-0">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circumference;
          const circle = (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
          offset += dash;
          return circle;
        })}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="fill-slate-700 text-sm font-bold">
          {total}m
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-slate-600">{seg.label}</span>
            <span className="text-slate-400 ml-auto">{seg.value}m</span>
          </div>
        ))}
      </div>
    </div>
  );
}
