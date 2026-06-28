import { LANGUAGES } from "../i18n/languages.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { SparkleIcon } from "../components/Icons.jsx";

const CARD_COLORS = ["bg-pink-soft", "bg-blue-soft", "bg-mint", "bg-cream", "bg-lavender", "bg-coral-soft"];

export default function LanguagePicker() {
  const { setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-16 overflow-hidden bg-gradient-to-br from-blue-soft via-white to-pink-soft">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-pink hero-blob animate-floatSlow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal hero-blob animate-floatSlow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-3xl w-full animate-fadeUp">
        <div className="text-center mb-10">
          <span className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center mb-4 shadow-lift">
            <SparkleIcon width={26} height={26} />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">{t("chooseLanguageTitle")}</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`card card-hover ${CARD_COLORS[i % CARD_COLORS.length]} text-center font-bold text-lg animate-scaleIn`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
