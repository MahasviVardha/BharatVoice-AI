import { useEffect, useState } from "react";
import api from "../api.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { ChartIcon, InboxIcon, SmileIcon, GlobeIcon } from "../components/Icons.jsx";

const DEFAULT_PRODUCTS = ["Amazon", "Flipkart", "Swiggy", "Zomato", "PhonePe", "Netflix", "Ola", "Uber"];

export default function ProductDashboard() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
      if (res.data.length) setProductId(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (productId) {
      setInsights(null);
      api.get(`/product/insights?product_id=${productId}`).then((res) => setInsights(res.data));
    }
  }, [productId]);

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12 animate-fadeUp">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <ChartIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">{t("insightsTitle")}</h1>
        </div>
        <select className="input max-w-xs" value={productId} onChange={(e) => setProductId(e.target.value)}>
          {(products.length ? products : DEFAULT_PRODUCTS.map((n, i) => ({ id: i, name: n }))).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {!insights ? (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card bg-blue-soft card-hover">
              <p className="text-sm text-gray-500">{t("dashTotalFeedback")}</p>
              <p className="text-2xl font-extrabold mt-1 text-ink">{insights.total_feedback}</p>
            </div>
            <div className="card bg-mint card-hover">
              <p className="text-sm text-gray-500">{t("dashCustomerSatisfaction")}</p>
              <p className="text-2xl font-extrabold mt-1 text-teal">{insights.satisfaction_score}%</p>
            </div>
            <div className="card bg-coral-soft card-hover">
              <p className="text-sm text-gray-500">{t("insightsNegative")}</p>
              <p className="text-2xl font-extrabold mt-1 text-coral">{insights.sentiment_counts.Negative}</p>
            </div>
            <div className="card bg-cream card-hover">
              <p className="text-sm text-gray-500">{t("insightsPositive")}</p>
              <p className="text-2xl font-extrabold mt-1 text-ink">{insights.sentiment_counts.Positive}</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
            <SmileIcon width={18} height={18} className="text-teal" />
            {t("insightsTopComplaints")}
          </h2>
          <div className="space-y-4 mb-8">
            {insights.top_complaints.map((c, i) => (
              <div key={i} className="card card-hover animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-bold text-ink">{c.problem}</p>
                    <p className="text-sm text-gray-400">
                      {c.category} · {t("insightsReported")} {c.frequency} {t("insightsTimes")}
                    </p>
                  </div>
                  <span className="pill bg-blue-soft text-teal whitespace-nowrap">
                    {t("insightsImpact")} {c.impact_score}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-3 bg-mint/40 rounded-xl p-3">
                  <span className="font-semibold text-teal">{t("dashAiRecommendation")}: </span>
                  {c.recommendation}
                </p>
              </div>
            ))}
            {!insights.top_complaints.length && (
              <div className="card text-center py-10 bg-blue-soft">
                <InboxIcon width={28} height={28} className="text-teal mx-auto mb-3" />
                <p className="text-gray-500">{t("insightsNoData")}</p>
              </div>
            )}
          </div>

          <h2 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
            <GlobeIcon width={18} height={18} className="text-teal" />
            {t("insightsLanguageBreakdown")}
          </h2>
          <div className="card">
            {Object.entries(insights.language_breakdown).map(([lang, count]) => {
              const pct = Math.round((count / insights.total_feedback) * 100) || 0;
              return (
                <div key={lang} className="mb-3">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-ink">{lang}</span>
                    <span className="text-gray-400">{pct}%</span>
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
            {!Object.keys(insights.language_breakdown).length && (
              <p className="text-gray-400 text-sm">{t("insightsNoData")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
