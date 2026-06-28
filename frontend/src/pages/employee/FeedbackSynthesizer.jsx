import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { LayersIcon, TrendUpIcon } from "../../components/Icons.jsx";

const IMPACT_STYLE = { High: "bg-coral-soft text-coral", Medium: "bg-cream text-ink", Low: "bg-mint text-teal" };

export default function FeedbackSynthesizer() {
  const [clusters, setClusters] = useState(null);

  useEffect(() => {
    api.get("/employee/clusters").then((res) => setClusters(res.data)).catch(() => setClusters([]));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
            <LayersIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Feedback Synthesizer</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-14">AI-clustered complaints grouped by underlying problem, across every product and language.</p>

        {!clusters ? (
          <div className="grid md:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-40" />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {clusters.map((c, i) => (
              <div key={c.problem} className="card card-hover animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-ink">{c.problem}</h3>
                  <span className={`pill whitespace-nowrap ${IMPACT_STYLE[c.business_impact]}`}>{c.business_impact} impact</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{c.related_feedback_count} related feedback · {c.products.length} product(s)</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.products.map((p) => <span key={p} className="pill bg-blue-soft text-teal">{p}</span>)}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.languages.map((l) => <span key={l} className="pill bg-lavender text-ink">{l}</span>)}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                  <div className="bg-blue-soft rounded-xl py-2">
                    <p className="font-bold text-teal flex items-center justify-center gap-1"><TrendUpIcon width={13} height={13} />{c.trend}</p>
                    <p className="text-[11px] text-gray-400">Trend</p>
                  </div>
                  <div className="bg-mint rounded-xl py-2">
                    <p className="font-bold text-teal">{c.confidence}%</p>
                    <p className="text-[11px] text-gray-400">Confidence</p>
                  </div>
                  <div className="bg-coral-soft rounded-xl py-2">
                    <p className="font-bold text-coral">{c.priority}</p>
                    <p className="text-[11px] text-gray-400">Priority</p>
                  </div>
                </div>

                {c.recommendation && (
                  <p className="text-sm bg-cream/60 rounded-xl px-3 py-2 text-ink">
                    <span className="font-semibold text-coral">AI Recommendation: </span>{c.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
