import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { ChartIcon, SmileIcon } from "../../components/Icons.jsx";

function healthColor(score) {
  if (score >= 70) return "text-teal";
  if (score >= 40) return "text-cream";
  return "text-coral";
}

export default function ProductIntelligence() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    api.get("/employee/products").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <ChartIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Product Intelligence</h1>
        </div>

        {!products ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <Link to={`/employee/products/${p.id}`} key={p.id} className="card card-hover">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-ink">{p.name}</h3>
                  <span className={`text-2xl font-extrabold ${healthColor(p.health_score)}`}>{p.health_score}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Health Score</p>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-gray-400 text-xs">Satisfaction</p>
                    <p className="font-semibold text-ink">{p.satisfaction}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Feedback</p>
                    <p className="font-semibold text-ink">{p.total_feedback}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Pos/Neg Ratio</p>
                    <p className="font-semibold text-ink">{p.pos_neg_ratio}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Growth</p>
                    <p className={`font-semibold ${p.complaint_growth === "Rising" ? "text-coral" : "text-teal"}`}>{p.complaint_growth}</p>
                  </div>
                </div>
                {p.top_complaint && (
                  <p className="text-sm bg-coral-soft text-coral rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <SmileIcon width={14} height={14} /> Top complaint: {p.top_complaint}
                  </p>
                )}
                <span className="pill bg-blue-soft text-teal mt-3 inline-flex">{p.recommendation_status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
