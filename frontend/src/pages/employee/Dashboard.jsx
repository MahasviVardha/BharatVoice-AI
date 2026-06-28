import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import {
  InboxIcon, ClockIcon, GridIcon, SmileIcon, TrendUpIcon,
  LightbulbIcon, BrainIcon, CpuIcon,
} from "../../components/Icons.jsx";

function Sparkline({ data, color = "#4B4A8E" }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / max) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="w-full h-8 mt-2" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kpi({ icon: Icon, label, value, bg, iconBg, sparkline, suffix = "", tooltip }) {
  return (
    <div className={`card card-hover ${bg} group relative`} title={tooltip}>
      <div className="flex items-center justify-between">
        <span className={`w-10 h-10 rounded-xl ${iconBg} text-white flex items-center justify-center shadow-soft`}>
          <Icon width={18} height={18} />
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-3">{label}</p>
      <p className="text-2xl font-extrabold text-ink mt-1">{value}{suffix}</p>
      {sparkline && <Sparkline data={sparkline} />}
    </div>
  );
}

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/employee/dashboard").then((res) => setData(res.data)).catch(() => setData(false));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <h1 className="text-2xl font-extrabold text-ink mb-1">Executive Dashboard</h1>
        <p className="text-gray-500 mb-8">Real-time synthesis of all customer feedback processed by the AI pipeline.</p>

        {!data ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-32" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Kpi icon={InboxIcon} label="Total Feedback" value={data.total_feedback} bg="bg-blue-soft" iconBg="bg-blue" sparkline={data.feedback_sparkline} tooltip="All processed feedback to date" />
            <Kpi icon={ClockIcon} label="Feedback Today" value={data.feedback_today} bg="bg-cream" iconBg="bg-coral" tooltip="Feedback received today" />
            <Kpi icon={GridIcon} label="Products" value={data.products} bg="bg-lavender" iconBg="bg-teal" tooltip="Products being tracked" />
            <Kpi icon={TrendUpIcon} label="Average Sentiment" value={data.average_sentiment} suffix=" pts" bg="bg-mint" iconBg="bg-teal" tooltip="Net sentiment score (positive % − negative %)" />
            <Kpi icon={SmileIcon} label="Positive %" value={data.positive_pct} suffix="%" bg="bg-mint" iconBg="bg-teal" tooltip="Share of positive feedback" />
            <Kpi icon={SmileIcon} label="Neutral %" value={data.neutral_pct} suffix="%" bg="bg-cream" iconBg="bg-coral" tooltip="Share of neutral feedback" />
            <Kpi icon={SmileIcon} label="Negative %" value={data.negative_pct} suffix="%" bg="bg-coral-soft" iconBg="bg-coral" tooltip="Share of negative feedback" />
            <Kpi icon={LightbulbIcon} label="Active Issues" value={data.active_issues} bg="bg-pink-soft" iconBg="bg-pink" tooltip="Recommendations not yet implemented" />
            <Kpi icon={BrainIcon} label="Recurring Complaints" value={data.recurring_complaints} bg="bg-lavender" iconBg="bg-teal" tooltip="Issues reported more than once (Hindsight memory)" />
            <Kpi icon={LightbulbIcon} label="AI Recommendations" value={data.ai_recommendations} bg="bg-blue-soft" iconBg="bg-blue" tooltip="Total recommendations generated" />
            <Kpi icon={ClockIcon} label="Processing Time" value={data.processing_time_ms} suffix="ms" bg="bg-cream" iconBg="bg-coral" tooltip="Average per-feedback AI pipeline time" />
            <Kpi icon={CpuIcon} label="Runtime Cost Saved" value={`$${data.runtime_cost_saved}`} bg="bg-mint" iconBg="bg-teal" tooltip="Saved by cascadeflow routing simple tasks to the fast model" />
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
