import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { ArrowRightIcon, BrainIcon } from "../../components/Icons.jsx";

const SENTIMENT_DOT = { Positive: "bg-teal", Negative: "bg-coral", Neutral: "bg-pink" };
const STATUS_STYLE = {
  Generated: "bg-blue-soft text-teal",
  Accepted: "bg-cream text-ink",
  Rejected: "bg-coral-soft text-coral",
  Implemented: "bg-mint text-teal",
};

export default function ProductDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/employee/products/${id}`).then((res) => setData(res.data)).catch(() => setData(false));
  }, [id]);

  return (
    <EmployeeLayout>
      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <Link to="/employee/products" className="text-sm text-teal font-semibold mb-4 inline-block">
          ← All Products
        </Link>

        {!data ? (
          <div className="space-y-4">
            <div className="skeleton h-10 w-1/3" />
            <div className="skeleton h-28 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-extrabold text-ink">{data.name}</h1>
              <span className="text-3xl font-extrabold text-teal">{data.health_score}</span>
            </div>
            <p className="text-gray-500 mb-6">{data.category}</p>

            <div className="card bg-blue-soft mb-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal mb-1">Executive Summary</p>
              <p className="text-ink">{data.executive_summary}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="card"><p className="text-sm text-gray-500">Satisfaction</p><p className="text-2xl font-extrabold text-ink">{data.satisfaction}%</p></div>
              <div className="card"><p className="text-sm text-gray-500">Total Feedback</p><p className="text-2xl font-extrabold text-ink">{data.total_feedback}</p></div>
              <div className="card"><p className="text-sm text-gray-500">Pos/Neg Ratio</p><p className="text-2xl font-extrabold text-ink">{data.pos_neg_ratio}</p></div>
            </div>

            <h2 className="text-lg font-bold text-ink mb-3">Sentiment Timeline</h2>
            <div className="card mb-8 flex flex-wrap gap-2">
              {data.sentiment_timeline.length ? data.sentiment_timeline.map((s, i) => (
                <span key={i} className={`w-3 h-3 rounded-full ${SENTIMENT_DOT[s.sentiment] || "bg-gray-300"}`} title={`${s.date}: ${s.sentiment}`} />
              )) : <p className="text-gray-400 text-sm">No timeline data yet.</p>}
            </div>

            <h2 className="text-lg font-bold text-ink mb-3">Complaint Categories</h2>
            <div className="card mb-8">
              {Object.entries(data.complaint_categories).map(([cat, count]) => {
                const max = Math.max(...Object.values(data.complaint_categories), 1);
                return (
                  <div key={cat} className="mb-3">
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-ink">{cat}</span><span className="text-gray-400">{count}</span></div>
                    <div className="w-full bg-blue-soft rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-teal to-blue h-2.5 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
              {!Object.keys(data.complaint_categories).length && <p className="text-gray-400 text-sm">No complaints recorded.</p>}
            </div>

            <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2"><BrainIcon width={18} height={18} className="text-teal" /> Recurring Problems</h2>
            <div className="space-y-3 mb-8">
              {data.recurring_problems.map((p, i) => (
                <div key={i} className="card flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{p.problem}</p>
                    <p className="text-sm text-gray-400">Reported {p.frequency} times</p>
                  </div>
                  <span className={`pill ${STATUS_STYLE[p.status] || "bg-blue-soft text-teal"}`}>{p.status}</span>
                </div>
              ))}
              {!data.recurring_problems.length && <p className="text-gray-400 text-sm">No recurring problems detected.</p>}
            </div>

            <h2 className="text-lg font-bold text-ink mb-3">Recommendation Timeline</h2>
            <div className="space-y-3">
              {data.recommendation_timeline.map((r, i) => (
                <div key={i} className="card">
                  <div className="flex justify-between items-start gap-3 mb-1.5">
                    <p className="font-semibold text-ink">{r.problem}</p>
                    <span className={`pill whitespace-nowrap ${STATUS_STYLE[r.status] || "bg-blue-soft text-teal"}`}>{r.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-start gap-1.5">
                    <ArrowRightIcon width={14} height={14} className="text-teal shrink-0 mt-0.5" /> {r.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
