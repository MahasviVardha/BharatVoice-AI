import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { ListIcon, InboxIcon, ChatIcon } from "../components/Icons.jsx";

const SENTIMENT_DOT = { Positive: "bg-teal", Negative: "bg-coral", Neutral: "bg-pink" };

export default function History() {
  const { t } = useLanguage();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    api.get("/feedback/history").then((res) => setHistory(res.data)).catch(() => setHistory([]));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 animate-fadeUp">
      <div className="flex items-center gap-3 mb-7">
        <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
          <ListIcon width={20} height={20} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">{t("historyTitle")}</h1>
      </div>

      {history === null && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20 w-full" />)}
        </div>
      )}

      <div className="space-y-4">
        {(history || []).map((fb, i) => (
          <Link
            to={`/feedback/${fb.id}`}
            key={fb.id}
            className="card card-hover block animate-fadeUp"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${SENTIMENT_DOT[fb.sentiment] || "bg-gray-300"}`} />
                <div>
                  <p className="font-semibold text-ink">{fb.original_text}</p>
                  <p className="text-sm text-gray-400 mt-1">{fb.platform} · {fb.category}</p>
                </div>
              </div>
              <span className="pill bg-blue-soft text-teal whitespace-nowrap">{fb.sentiment}</span>
            </div>
          </Link>
        ))}
      </div>

      {history !== null && !history.length && (
        <div className="card text-center py-14 bg-blue-soft">
          <span className="w-16 h-16 rounded-2xl bg-white text-teal flex items-center justify-center mx-auto mb-4 shadow-soft">
            <InboxIcon width={28} height={28} />
          </span>
          <p className="text-gray-500 mb-5">{t("historyEmpty")}</p>
          <Link to="/feedback" className="btn-primary inline-flex">
            <ChatIcon width={16} height={16} />
            {t("navGiveFeedback")}
          </Link>
        </div>
      )}
    </div>
  );
}
