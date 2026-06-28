import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { ChatIcon, ListIcon, InboxIcon, GlobeIcon, CheckIcon, ArrowRightIcon } from "../components/Icons.jsx";

export default function Dashboard() {
  const { t } = useLanguage();
  const [history, setHistory] = useState(null);
  const userName = localStorage.getItem("userName") || "";

  useEffect(() => {
    api.get("/feedback/history").then((res) => setHistory(res.data)).catch(() => setHistory([]));
  }, []);

  const loading = history === null;
  const languages = new Set((history || []).map((h) => h.language));
  const pending = (history || []).filter((h) => !h.recommendation).length;

  const stats = [
    { label: t("dashTotalFeedback"), value: history?.length ?? 0, icon: InboxIcon, bg: "bg-blue-soft", iconBg: "bg-blue" },
    { label: t("dashLanguagesUsed"), value: languages.size, icon: GlobeIcon, bg: "bg-mint", iconBg: "bg-teal" },
    {
      label: t("dashFeedbackStatus"),
      value: `${(history?.length ?? 0) - pending} ${t("dashProcessed")}`,
      icon: CheckIcon,
      bg: "bg-pink-soft",
      iconBg: "bg-pink",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
      <h1 className="text-3xl font-extrabold text-ink mb-1">
        {t("dashGreeting")}, <span className="gradient-text">{userName}</span> 👋
      </h1>
      <p className="text-gray-500 mb-8">{t("dashSummary")}</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className={`card ${s.bg} card-hover`}>
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} text-white flex items-center justify-center mb-3 shadow-soft`}>
              <s.icon width={18} height={18} />
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            {loading ? (
              <div className="skeleton h-8 w-16 mt-2" />
            ) : (
              <p className="text-3xl font-extrabold mt-1 text-ink">{s.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/feedback" className="btn-primary">
          <ChatIcon width={17} height={17} />
          {t("navGiveFeedback")}
          <ArrowRightIcon width={15} height={15} />
        </Link>
        <Link to="/history" className="btn-secondary">
          <ListIcon width={17} height={17} />
          {t("navMyFeedback")}
        </Link>
      </div>
    </div>
  );
}
