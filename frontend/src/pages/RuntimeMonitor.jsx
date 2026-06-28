import { useEffect, useState } from "react";
import api from "../api.js";
import PieChart from "../components/PieChart.jsx";
import { CpuIcon, InboxIcon } from "../components/Icons.jsx";

export default function RuntimeMonitor() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => api.get("/ai/runtime").then((res) => setData(res.data)).catch(() => {});
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-12 animate-fadeUp">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
          <CpuIcon width={20} height={20} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">AI Runtime Monitor</h1>
      </div>
      <p className="text-gray-500 mb-8 ml-14">
        Powered by cascadeflow — routes every task to the cheapest model capable of handling it.
      </p>

      {!data ? (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="card bg-blue-soft card-hover">
              <p className="text-sm text-gray-500">Requests Processed</p>
              <p className="text-2xl font-extrabold mt-1 text-ink">{data.requests_processed}</p>
            </div>
            <div className="card bg-coral-soft card-hover">
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-2xl font-extrabold mt-1 text-coral">${data.total_cost.toFixed(4)}</p>
            </div>
            <div className="card bg-mint card-hover">
              <p className="text-sm text-gray-500">Cost Saved by Routing</p>
              <p className="text-2xl font-extrabold mt-1 text-teal">${data.total_cost_saved.toFixed(4)}</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-ink mb-3">Model Usage</h2>
          <div className="card mb-8">
            {Object.entries(data.model_usage).map(([model, count]) => {
              const pct = Math.round((count / data.requests_processed) * 100) || 0;
              return (
                <div key={model} className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-ink">{model}</span>
                    <span className="text-gray-400">{count} calls</span>
                  </div>
                  <div className="w-full bg-blue-soft rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal to-blue h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="text-lg font-bold text-ink mb-3">Recent Routing Decisions by Task</h2>
          {data.recent_logs.length ? (
            <div className="card">
              <PieChart
                data={Object.entries(
                  data.recent_logs.reduce((acc, log) => {
                    acc[log.task] = (acc[log.task] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([label, value]) => ({ label, value }))}
              />
            </div>
          ) : (
            <div className="card text-center py-10 bg-blue-soft">
              <InboxIcon width={28} height={28} className="text-teal mx-auto mb-3" />
              <p className="text-gray-500">No routing activity yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
