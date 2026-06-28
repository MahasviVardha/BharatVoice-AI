import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { BrainIcon, GlobeIcon, SparkleIcon, ArrowRightIcon, ChartIcon, ChatIcon } from "../components/Icons.jsx";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    { icon: BrainIcon, title: t("landingHowItWorksTitle"), desc: t("landingHowItWorksDesc"), bg: "bg-blue-soft", iconBg: "bg-blue" },
    { icon: SparkleIcon, title: t("landingHindsightTitle"), desc: t("landingHindsightDesc"), bg: "bg-mint", iconBg: "bg-teal" },
    { icon: GlobeIcon, title: t("landingMultilingualTitle"), desc: t("landingMultilingualDesc"), bg: "bg-pink-soft", iconBg: "bg-pink" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative px-5 lg:px-8 pt-16 pb-24 bg-[#f4f4f8] overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-white blur-3xl opacity-90 animate-floatSlow" />
        <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-white blur-3xl opacity-80 animate-floatSlow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-white blur-3xl opacity-80 animate-floatSlow" style={{ animationDelay: "3s" }} />

        <div className="relative max-w-4xl mx-auto text-center animate-fadeUp">
          <span className="pill bg-cream text-teal mx-auto mb-6 inline-flex">
            <SparkleIcon width={14} height={14} /> AI-powered &middot; Multilingual &middot; Memory-driven
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink mb-5">
            <span className="gradient-text">{t("appName")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">{t("landingSubtitle")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/feedback" className="btn-primary text-base">
              <ChatIcon width={18} height={18} />
              {t("navGiveFeedback")}
              <ArrowRightIcon width={16} height={16} />
            </Link>
            <Link to="/insights" className="btn-secondary text-base">
              <ChartIcon width={18} height={18} />
              {t("btnViewInsights")}
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card card-hover ${f.bg} animate-fadeUp`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${f.iconBg} text-white flex items-center justify-center mb-4 shadow-soft`}>
                <f.icon width={22} height={22} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-ink">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-5xl mx-auto px-5 lg:px-8 pb-20">
        <div className="card bg-gradient-to-br from-teal to-blue text-white flex flex-col sm:flex-row items-center justify-between gap-6 !p-8">
          <div>
            <h3 className="text-xl font-bold mb-1">10 Indian languages, one intelligent pipeline</h3>
            <p className="text-white/80 text-sm">English &middot; Hindi &middot; Telugu &middot; Tamil &middot; Kannada &middot; Malayalam &middot; Marathi &middot; Bengali &middot; Gujarati &middot; Punjabi</p>
          </div>
          <Link to="/feedback" className="bg-white text-teal font-semibold rounded-xl px-6 py-3 whitespace-nowrap hover:shadow-lift transition-shadow flex items-center gap-2">
            {t("navGiveFeedback")} <ArrowRightIcon width={16} height={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
