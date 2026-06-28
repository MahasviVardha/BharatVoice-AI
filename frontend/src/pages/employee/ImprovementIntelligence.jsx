import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { ThumbsUpIcon, AlertTriangleIcon, InboxIcon } from "../../components/Icons.jsx";

const PRIORITY_STYLE = { High: "bg-coral-soft text-coral", Medium: "bg-cream text-ink", Low: "bg-mint text-teal" };

export default function ImprovementIntelligence() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/employee/improvement-intelligence").then((res) => setData(res.data)).catch(() => setData(false));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-coral text-white flex items-center justify-center shadow-soft">
            <ThumbsUpIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Company Improvement Intelligence</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-14">
          Where the company is excelling, and where it needs to improve — synthesized by AI, not left for you to interpret from charts.
        </p>

        {!data ? (
          <div className="grid md:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-40" />)}</div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-lg font-bold text-teal mb-4 flex items-center gap-2">
                <ThumbsUpIcon width={18} height={18} /> Strengths
              </h2>
              <div className="space-y-4">
                {data.strengths.map((s) => (
                  <div key={s.category} className="card bg-mint">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-ink">{s.category}</h3>
                      <span className="pill bg-white text-teal whitespace-nowrap">{s.positive_pct}% positive</span>
                    </div>
                    <p className="text-sm text-ink">{s.highlight}</p>
                    <p className="text-xs text-gray-500 mt-2">Based on {s.total_feedback} feedback entries</p>
                  </div>
                ))}
                {!data.strengths.length && (
                  <div className="card text-center py-10 bg-blue-soft">
                    <InboxIcon width={24} height={24} className="text-teal mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No category currently has net-positive sentiment.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-coral mb-4 flex items-center gap-2">
                <AlertTriangleIcon width={18} height={18} /> Areas Requiring Improvement
              </h2>
              <div className="space-y-4">
                {data.improvements.map((i) => (
                  <div key={i.category} className="card bg-coral-soft">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-ink">{i.category}</h3>
                      <span className={`pill whitespace-nowrap ${PRIORITY_STYLE[i.priority]}`}>{i.priority} priority</span>
                    </div>
                    <p className="text-sm text-ink mb-3"><span className="font-semibold">Root cause:</span> {i.root_cause}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div className="bg-white rounded-lg py-1.5">
                        <p className="font-bold text-ink">{i.supporting_feedback_count}</p>
                        <p className="text-gray-400">Reports</p>
                      </div>
                      <div className="bg-white rounded-lg py-1.5">
                        <p className="font-bold text-ink">{i.business_impact}</p>
                        <p className="text-gray-400">Impact</p>
                      </div>
                      <div className="bg-white rounded-lg py-1.5">
                        <p className="font-bold text-ink">{i.ai_confidence}%</p>
                        <p className="text-gray-400">Confidence</p>
                      </div>
                    </div>
                    <p className="text-sm bg-white rounded-xl px-3 py-2 text-ink">
                      <span className="font-semibold text-coral">Recommended Action: </span>{i.recommended_action}
                    </p>
                  </div>
                ))}
                {!data.improvements.length && (
                  <div className="card text-center py-10 bg-blue-soft">
                    <InboxIcon width={24} height={24} className="text-teal mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No category currently shows net-negative sentiment.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
