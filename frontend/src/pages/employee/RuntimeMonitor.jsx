import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import PieChart from "../../components/PieChart.jsx";
import { CpuIcon, ArrowRightIcon, DownloadIcon } from "../../components/Icons.jsx";

const STAGES = ["Language", "Translation", "Sentiment", "Problem", "Memory", "Recommendation"];

export default function EmployeeRuntimeMonitor() {
  const [data, setData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = () => api.get("/ai/runtime").then((res) => setData(res.data)).catch(() => {});
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const downloadBreakdown = async () => {
    setDownloading(true);
    try {
      const res = await api.get("/employee/reports/excel", {
        params: { report_type: "routing_breakdown" },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "routing_breakdown_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
            <CpuIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Runtime Monitor</h1>
        </div>
        <p className="text-gray-500 mb-6 ml-14">cascadeflow routes every AI pipeline task to the cheapest model tier capable of handling it.</p>

        <div className="card mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span className="pill bg-blue-soft text-teal whitespace-nowrap">{stage}</span>
                {i < STAGES.length - 1 && <ArrowRightIcon width={14} height={14} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        {!data ? (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24" />)}</div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="card bg-blue-soft"><p className="text-sm text-gray-500">Requests Processed</p><p className="text-2xl font-extrabold text-ink">{data.requests_processed}</p></div>
              <div className="card bg-coral-soft"><p className="text-sm text-gray-500">Total Cost</p><p className="text-2xl font-extrabold text-coral">${data.total_cost.toFixed(4)}</p></div>
              <div className="card bg-mint"><p className="text-sm text-gray-500">Cost Saved</p><p className="text-2xl font-extrabold text-teal">${data.total_cost_saved.toFixed(4)}</p></div>
            </div>

            <h2 className="text-lg font-bold text-ink mb-3">Model Usage</h2>
            <div className="card mb-8">
              {Object.entries(data.model_usage).map(([model, count]) => {
                const pct = Math.round((count / data.requests_processed) * 100) || 0;
                return (
                  <div key={model} className="mb-3">
                    <div className="flex justify-between text-sm mb-1.5"><span className="font-medium text-ink">{model}</span><span className="text-gray-400">{count} calls</span></div>
                    <div className="w-full bg-blue-soft rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-teal to-blue h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-ink">Recent Routing Decisions by Task</h2>
              <button onClick={downloadBreakdown} className="btn-secondary !py-2 !px-3.5 text-sm" disabled={downloading}>
                <DownloadIcon width={15} height={15} />
                {downloading ? "Preparing..." : "Download Excel"}
              </button>
            </div>
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
          </>
        )}
      </div>
    </EmployeeLayout>
  );
}
