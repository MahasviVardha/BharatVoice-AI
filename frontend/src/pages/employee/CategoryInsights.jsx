import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { ListIcon, InboxIcon } from "../../components/Icons.jsx";

export default function CategoryInsights() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    api.get("/employee/categories").then((res) => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
            <ListIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Category Insights</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-14">Feedback grouped by the category customers selected at submission time.</p>

        {!categories ? (
          <div className="grid md:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-48" />)}</div>
        ) : categories.length ? (
          <div className="grid md:grid-cols-2 gap-5">
            {categories.map((c) => {
              const total = c.total_feedback || 1;
              const posPct = Math.round((c.sentiment_counts.Positive / total) * 100);
              const negPct = Math.round((c.sentiment_counts.Negative / total) * 100);
              const neuPct = 100 - posPct - negPct;
              return (
                <div key={c.category} className="card card-hover">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-ink">{c.category}</h3>
                    <span className="pill bg-blue-soft text-teal whitespace-nowrap">{c.total_feedback} feedback</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full overflow-hidden flex mb-2">
                    <div className="bg-teal h-full" style={{ width: `${posPct}%` }} />
                    <div className="bg-cream h-full" style={{ width: `${neuPct}%` }} />
                    <div className="bg-coral h-full" style={{ width: `${negPct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mb-4">
                    <span>{posPct}% positive</span>
                    <span>{negPct}% negative</span>
                  </div>

                  {c.recurring_issues.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Recurring Issues</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.recurring_issues.map((i, idx) => (
                          <span key={idx} className="pill bg-coral-soft text-coral">{i.problem} ({i.frequency}×)</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.top_recommendation && (
                    <p className="text-sm bg-mint/40 rounded-xl px-3 py-2 text-ink">
                      <span className="font-semibold text-teal">AI Recommendation: </span>{c.top_recommendation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-14 bg-blue-soft">
            <InboxIcon width={28} height={28} className="text-teal mx-auto mb-3" />
            <p className="text-gray-500">No categorized feedback yet.</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
