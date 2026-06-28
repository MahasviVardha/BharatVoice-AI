const COLORS = ["#4B4A8E", "#7B93E0", "#E8714A", "#4FC7C2", "#C0436B", "#F5D9A0", "#8B89C7", "#F2A9A5"];

/** Lightweight dependency-free pie chart (SVG) with a side legend. */
export default function PieChart({ data, size = 180 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (!total) return <p className="text-gray-400 text-sm">No data yet.</p>;

  const radius = size / 2;
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const fraction = d.value / total;
    const startAngle = cumulative * 2 * Math.PI;
    cumulative += fraction;
    const endAngle = cumulative * 2 * Math.PI;

    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(endAngle);
    const y2 = radius - radius * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const path = fraction >= 0.999
      ? `M ${radius} 0 A ${radius} ${radius} 0 1 1 ${radius - 0.01} 0 Z`
      : `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...d, path, color: d.color || COLORS[i % COLORS.length], pct: Math.round(fraction * 100) };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="space-y-2 w-full">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="text-gray-400 whitespace-nowrap ml-3">{s.value} · {s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
