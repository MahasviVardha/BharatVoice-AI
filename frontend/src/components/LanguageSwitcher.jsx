import { useState, useRef, useEffect } from "react";
import { LANGUAGES } from "../i18n/languages.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { GlobeIcon, CheckIcon } from "./Icons.jsx";

export default function LanguageSwitcher({ align = "right" }) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-teal hover:bg-blue-soft transition-colors"
        aria-label="Change language"
      >
        <GlobeIcon width={17} height={17} />
        <span>{current.label}</span>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-56 max-h-80 overflow-auto rounded-2xl bg-white shadow-lift border border-blue-soft p-2 animate-scaleIn ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                lang.code === language ? "bg-teal text-white" : "hover:bg-blue-soft text-ink"
              }`}
            >
              {lang.label}
              {lang.code === language && <CheckIcon width={16} height={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
