import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { resolveUploadUrl } from "../api.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { SmileIcon, BrainIcon, SparkleIcon, ListIcon } from "../components/Icons.jsx";

const SENTIMENT_STYLE = {
  Positive: "bg-mint text-teal",
  Negative: "bg-coral-soft text-coral",
  Neutral: "bg-cream text-ink",
};

const PRIORITY_STYLE = {
  High: "bg-coral-soft text-coral",
  Medium: "bg-cream text-ink",
  Low: "bg-mint text-teal",
};

function Skeleton() {
  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-8 py-12 space-y-4">
      <div className="skeleton h-8 w-2/3" />
      <div className="skeleton h-28 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="skeleton h-20" />
        <div className="skeleton h-20" />
      </div>
      <div className="skeleton h-24 w-full" />
    </div>
  );
}

export default function FeedbackResult() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [fb, setFb] = useState(null);

  useEffect(() => {
    api.get(`/feedback/${id}`).then((res) => setFb(res.data));
  }, [id]);

  if (!fb) return <Skeleton />;

  return (
    <div className="max-w-2xl mx-auto px-5 lg:px-8 py-12 animate-fadeUp">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
          <SparkleIcon width={20} height={20} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">{t("resultTitle")}</h1>
      </div>
      <p className="text-gray-500 mb-7 ml-14">{t("resultSubtitle")}</p>

      <div className="card mb-4">
        {fb.product_name && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Product</p>
            <p className="mt-1.5 text-ink font-medium">{fb.product_name}</p>
          </>
        )}
        <p className={`text-xs font-semibold uppercase tracking-wide text-gray-400 ${fb.product_name ? "mt-4" : ""}`}>
          {t("resultOriginal")} ({fb.language})
        </p>
        <p className="mt-1.5 text-ink">{fb.original_text}</p>
        {fb.translated_text && fb.translated_text !== fb.original_text && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-4">{t("resultTranslated")}</p>
            <p className="mt-1.5 text-gray-600">{fb.translated_text}</p>
          </>
        )}
        {fb.image_path && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-4">Proof Photo</p>
            <img src={resolveUploadUrl(fb.image_path)} alt="Proof" className="mt-2 w-full sm:w-64 h-48 object-cover rounded-xl shadow-soft" />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`card ${SENTIMENT_STYLE[fb.sentiment] || ""}`}>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-70">
            <SmileIcon width={14} height={14} /> {t("resultSentiment")}
          </div>
          <p className="text-xl font-extrabold mt-1">{fb.sentiment}</p>
        </div>
        <div className={`card ${PRIORITY_STYLE[fb.priority] || ""}`}>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{t("resultPriority")}</p>
          <p className="text-xl font-extrabold mt-1">{fb.priority}</p>
        </div>
      </div>

      <div className="card mb-4 bg-blue-soft">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">{t("resultProblem")}</p>
        <p className="text-lg font-bold mt-1 text-ink">{fb.problem}</p>
        <p className="text-sm text-gray-600 mt-1">{t("resultCategory")}: {fb.category}</p>
      </div>

      <div className="card mb-4 bg-lavender">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-teal">
          <BrainIcon width={14} height={14} /> {t("resultMemory")}
        </div>
        <p className="mt-1.5 text-ink">{fb.memory_note}</p>
      </div>

      <div className="card mb-7 bg-mint">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal">{t("dashAiRecommendation")}</p>
        <p className="mt-1.5 font-medium text-ink">{fb.recommendation}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/feedback" className="btn-secondary">{t("btnSubmitAnother")}</Link>
        <Link to="/history" className="btn-primary">
          <ListIcon width={16} height={16} />
          {t("resultViewMyFeedback")}
        </Link>
      </div>
    </div>
  );
}
