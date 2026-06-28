import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { MegaphoneIcon } from "../../components/Icons.jsx";

export default function ExecutiveSummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/employee/executive-summary").then((res) => setData(res.data)).catch(() => setData(false));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
            <MegaphoneIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Executive Summary</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-14">AI-generated daily business briefing.</p>

        {!data ? (
          <div className="skeleton h-64 w-full" />
        ) : (
          <>
            <div className="card bg-gradient-to-br from-teal to-blue text-white mb-6">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-2">{new Date(data.generated_at).toLocaleString()}</p>
              <p className="text-lg font-semibold leading-relaxed">{data.headline}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="card bg-mint"><p className="text-sm text-gray-500">Satisfaction</p><p className="text-2xl font-extrabold text-teal">{data.satisfaction}%</p></div>
              <div className="card bg-blue-soft"><p className="text-sm text-gray-500">Total Feedback</p><p className="text-2xl font-extrabold text-ink">{data.total_feedback}</p></div>
              <div className="card bg-cream"><p className="text-sm text-gray-500">Recommendations</p><p className="text-2xl font-extrabold text-coral">{data.recommendation_count}</p></div>
            </div>

            <h2 className="text-lg font-bold text-ink mb-3">Top Recurring Issues</h2>
            <div className="space-y-3 mb-6">
              {data.top_recurring_issues.map((i, idx) => (
                <div key={idx} className="card">
                  <p className="font-semibold text-ink">{i.problem} · <span className="text-gray-400 font-normal">{i.frequency}× reported</span></p>
                  <p className="text-sm text-gray-600 mt-1">{i.recommendation}</p>
                </div>
              ))}
              {!data.top_recurring_issues.length && <p className="text-gray-400">No recurring issues currently flagged.</p>}
            </div>

            <h2 className="text-lg font-bold text-ink mb-3">Products Requiring Attention</h2>
            <div className="flex flex-wrap gap-2">
              {data.products_requiring_attention.map((p) => <span key={p} className="pill bg-coral-soft text-coral">{p}</span>)}
              {!data.products_requiring_attention.length && <p className="text-gray-400">None — all products healthy.</p>}
            </div>
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
