import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { LightbulbIcon } from "../../components/Icons.jsx";

const STATUSES = ["Generated", "Accepted", "Rejected", "Implemented"];
const STATUS_STYLE = {
  Generated: "bg-blue-soft text-teal",
  Accepted: "bg-cream text-ink",
  Rejected: "bg-coral-soft text-coral",
  Implemented: "bg-mint text-teal",
};
const PRIORITY_STYLE = { High: "text-coral", Medium: "text-ink", Low: "text-teal" };

export default function RecommendationCenter() {
  const [recs, setRecs] = useState(null);

  const load = () => api.get("/employee/recommendations").then((res) => setRecs(res.data)).catch(() => setRecs([]));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setRecs((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await api.patch(`/employee/recommendations/${id}/status`, { status });
  };

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <LightbulbIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">AI Recommendation Center</h1>
        </div>

        {!recs ? (
          <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-32" />)}</div>
        ) : (
          <div className="space-y-4">
            {recs.map((r) => (
              <div key={r.id} className="card">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <p className="font-bold text-ink">{r.product}</p>
                    <p className="text-sm text-gray-600 mt-1">{r.recommendation}</p>
                  </div>
                  <span className={`pill whitespace-nowrap ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                  <div><p className="text-gray-400 text-xs">Confidence</p><p className="font-semibold text-ink">{r.confidence}%</p></div>
                  <div><p className="text-gray-400 text-xs">Supporting Feedback</p><p className="font-semibold text-ink">{r.supporting_feedback}</p></div>
                  <div><p className="text-gray-400 text-xs">Business Impact</p><p className="font-semibold text-ink">{r.business_impact}</p></div>
                  <div><p className="text-gray-400 text-xs">Priority</p><p className={`font-semibold ${PRIORITY_STYLE[r.priority]}`}>{r.priority}</p></div>
                </div>
                <p className="text-xs text-gray-400 mb-3">Estimated customers impacted: ~{r.estimated_customer_impact}</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(r.id, s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                        r.status === s ? "bg-teal text-white border-teal" : "bg-white text-teal border-blue-soft hover:border-teal"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!recs.length && <p className="text-gray-400 text-center py-10">No recommendations generated yet.</p>}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
