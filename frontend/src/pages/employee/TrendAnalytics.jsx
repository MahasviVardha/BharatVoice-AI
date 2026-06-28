import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { TrendUpIcon } from "../../components/Icons.jsx";

function BarList({ data, colorClass = "from-teal to-blue" }) {
  const entries = Object.entries(data || {});
  const max = Math.max(...entries.map(([, v]) => v), 1);
  if (!entries.length) return <p className="text-gray-400 text-sm">No data yet.</p>;
  return (
    <div className="space-y-3">
      {entries.map(([label, value]) => (
        <div key={label}>
          <div className="flex justify-between text-sm mb-1"><span className="font-medium text-ink">{label}</span><span className="text-gray-400">{value}</span></div>
          <div className="w-full bg-blue-soft rounded-full h-2.5 overflow-hidden">
            <div className={`bg-gradient-to-r ${colorClass} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${(value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart({ points, color = "#4B4A8E" }) {
  if (!points || !points.length) return <p className="text-gray-400 text-sm">No data yet.</p>;
  const max = Math.max(...points.map((p) => p.satisfaction), 100);
  const coords = points.map((p, i) => `${(i / Math.max(points.length - 1, 1)) * 100},${40 - (p.satisfaction / max) * 36}`).join(" ");
  return (
    <div>
      <svg viewBox="0 0 100 40" className="w-full h-28" preserveAspectRatio="none">
        <polyline points={coords} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        {points.map((p) => <span key={p.date}>{p.date.slice(5)}</span>)}
      </div>
    </div>
  );
}

export default function TrendAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/employee/trends").then((res) => setData(res.data)).catch(() => setData(false));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <TrendUpIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Trend Analytics</h1>
        </div>

        {!data ? (
          <div className="grid md:grid-cols-2 gap-5">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-56" />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card">
              <h3 className="font-bold text-ink mb-3">Sentiment Distribution</h3>
              <BarList data={data.sentiment} colorClass="from-teal to-mint" />
            </div>
            <div className="card">
              <h3 className="font-bold text-ink mb-3">Satisfaction Trend (last 7 active days)</h3>
              <LineChart points={data.satisfaction_trend} />
            </div>
            <div className="card">
              <h3 className="font-bold text-ink mb-3">Product Comparison</h3>
              <BarList data={data.product_comparison} colorClass="from-blue to-pink" />
            </div>
            <div className="card">
              <h3 className="font-bold text-ink mb-3">Language Distribution</h3>
              <BarList data={data.language_distribution} colorClass="from-coral to-cream" />
            </div>
            <div className="card md:col-span-2">
              <h3 className="font-bold text-ink mb-3">Complaint Categories</h3>
              <BarList data={data.complaint_categories} colorClass="from-pink to-lavender" />
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
