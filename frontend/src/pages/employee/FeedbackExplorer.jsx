import { useEffect, useState } from "react";
import api, { resolveUploadUrl } from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { FEEDBACK_CATEGORIES } from "../../constants/categories.js";
import { SearchIcon, InboxIcon, ImageIcon } from "../../components/Icons.jsx";

const SENTIMENT_STYLE = { Positive: "bg-mint text-teal", Negative: "bg-coral-soft text-coral", Neutral: "bg-cream text-ink" };

export default function FeedbackExplorer() {
  const [rows, setRows] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ product_id: "", language: "", sentiment: "", category: "", priority: "", q: "" });
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setRows(null);
    api.get("/employee/feedback", { params }).then((res) => setRows(res.data)).catch(() => setRows([]));
  }, [filters]);

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <SearchIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Feedback Explorer</h1>
        </div>

        <div className="card mb-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <select className="input" value={filters.product_id} onChange={update("product_id")}>
            <option value="">All Products</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="input" value={filters.sentiment} onChange={update("sentiment")}>
            <option value="">All Sentiment</option>
            <option>Positive</option><option>Negative</option><option>Neutral</option>
          </select>
          <select className="input" value={filters.priority} onChange={update("priority")}>
            <option value="">All Priority</option>
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
          <input className="input" placeholder="Language" value={filters.language} onChange={update("language")} />
          <select className="input" value={filters.category} onChange={update("category")}>
            <option value="">All Categories</option>
            {FEEDBACK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Search text..." value={filters.q} onChange={update("q")} />
        </div>

        {!rows ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
        ) : rows.length ? (
          <div className="space-y-3">
            {rows.map((f) => (
              <div key={f.id} className="card card-hover cursor-pointer" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{f.original_text}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {f.product}{f.product_name ? ` · ${f.product_name}` : ""} · {f.language} · {f.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {f.image_path && <ImageIcon width={16} height={16} className="text-teal" />}
                    <span className={`pill whitespace-nowrap ${SENTIMENT_STYLE[f.sentiment] || ""}`}>{f.sentiment}</span>
                  </div>
                </div>
                {expanded === f.id && (
                  <div className="mt-4 pt-4 border-t border-blue-soft grid sm:grid-cols-2 gap-4 text-sm animate-fadeIn">
                    <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Translation</p><p className="text-ink">{f.translated_text}</p></div>
                    <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Problem / Priority</p><p className="text-ink">{f.problem} · {f.priority}</p></div>
                    <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Memory Similarity</p><p className="text-ink">{f.memory_note}</p></div>
                    <div><p className="text-gray-400 text-xs uppercase font-semibold mb-1">Recommendation</p><p className="text-ink">{f.recommendation}</p></div>
                    {f.image_path && (
                      <div className="sm:col-span-2">
                        <p className="text-gray-400 text-xs uppercase font-semibold mb-1">Proof Photo</p>
                        <img src={resolveUploadUrl(f.image_path)} alt="Proof" className="w-full sm:w-56 h-40 object-cover rounded-xl shadow-soft" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-14 bg-blue-soft">
            <InboxIcon width={28} height={28} className="text-teal mx-auto mb-3" />
            <p className="text-gray-500">No feedback matches these filters.</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
