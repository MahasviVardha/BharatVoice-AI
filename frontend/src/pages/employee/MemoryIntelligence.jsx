import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { BrainIcon } from "../../components/Icons.jsx";

export default function MemoryIntelligence() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    api.get("/employee/memory").then((res) => setRecords(res.data)).catch(() => setRecords([]));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
            <BrainIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Memory Intelligence</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-14">Visualizing the Hindsight Memory Agent — what the AI remembers across every customer interaction.</p>

        {!records ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28" />)}</div>
        ) : (
          <div className="space-y-4">
            {records.map((r) => (
              <div key={r.id} className="card">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <p className="font-bold text-ink">{r.problem}</p>
                    <p className="text-sm text-gray-400">{r.product}</p>
                  </div>
                  <span className="pill bg-blue-soft text-teal whitespace-nowrap">{r.occurrences}× seen</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                  <div><p className="text-gray-400 text-xs">Similarity</p><p className="font-semibold text-ink">{r.similarity_score}%</p></div>
                  <div><p className="text-gray-400 text-xs">Growth</p><p className="font-semibold text-teal">{r.frequency_growth}</p></div>
                  <div><p className="text-gray-400 text-xs">First Seen</p><p className="font-semibold text-ink">{new Date(r.first_seen).toLocaleDateString()}</p></div>
                  <div><p className="text-gray-400 text-xs">Latest Seen</p><p className="font-semibold text-ink">{new Date(r.latest_seen).toLocaleDateString()}</p></div>
                </div>
                <p className="text-sm bg-lavender rounded-xl px-3 py-2 text-ink">
                  <span className="font-semibold text-teal">AI Conclusion: </span>{r.ai_conclusion}
                </p>
              </div>
            ))}
            {!records.length && <p className="text-gray-400 text-center py-10">No memory records yet.</p>}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
