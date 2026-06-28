import { useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { FileIcon, DownloadIcon } from "../../components/Icons.jsx";

const REPORTS = [
  { type: "feedback", title: "Feedback Report", desc: "All processed feedback with sentiment, category and recommendations." },
  { type: "recommendations", title: "Recommendation Report", desc: "Every AI recommendation generated, with status and impact." },
  { type: "runtime", title: "Runtime Cost Report", desc: "cascadeflow routing decisions, model usage and cost savings." },
];

export default function Reports() {
  const [downloading, setDownloading] = useState(null);

  const download = async (type) => {
    setDownloading(type);
    try {
      const res = await api.get("/employee/reports/excel", {
        params: { report_type: type },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_report.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <EmployeeLayout>
      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <FileIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Reports</h1>
        </div>
        <p className="text-gray-500 mb-8 ml-14">Export the data behind every dashboard as a formatted Excel (.xlsx) workbook.</p>

        <div className="grid sm:grid-cols-3 gap-5">
          {REPORTS.map((r) => (
            <div key={r.type} className="card card-hover flex flex-col">
              <h3 className="font-bold text-ink mb-1">{r.title}</h3>
              <p className="text-sm text-gray-500 mb-5 flex-1">{r.desc}</p>
              <button onClick={() => download(r.type)} className="btn-primary justify-center" disabled={downloading === r.type}>
                <DownloadIcon width={16} height={16} />
                {downloading === r.type ? "Preparing..." : "Download Excel"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </EmployeeLayout>
  );
}
