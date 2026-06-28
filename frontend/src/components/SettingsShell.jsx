import { useState } from "react";
import { Link } from "react-router-dom";
import { LANGUAGES } from "../i18n/languages.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import api from "../api.js";
import PasswordInput from "./PasswordInput.jsx";
import { UserIcon, GlobeIcon, CheckIcon, BellIcon, ShieldIcon, SettingsIcon, CpuIcon, ArrowRightIcon } from "./Icons.jsx";

/**
 * Shared Settings architecture used by both the Customer and Employee portals.
 * Common sections (Profile/Language/Notifications/Security/AI Runtime/Account)
 * are rendered here in a left-nav layout; each portal appends its own
 * role-specific sections via `extraTabs`.
 */
function LanguageTab() {
  const { language, setLanguage, t } = useLanguage();
  const [picking, setPicking] = useState(false);
  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="card bg-blue-soft">
      <div className="flex items-center gap-2 text-sm text-teal font-semibold mb-1">
        <GlobeIcon width={16} height={16} />
        {t("settingsAppLanguage")}
      </div>
      <p className="text-xl font-bold text-ink mt-1 mb-5">
        {t("settingsCurrentLanguage")}: {current?.label}
      </p>
      {!picking ? (
        <button className="btn-primary" onClick={() => setPicking(true)}>{t("btnChangeLanguage")}</button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fadeIn">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setPicking(false); }}
              className={`flex items-center justify-between rounded-xl py-2.5 px-3.5 text-sm font-semibold border transition-all ${
                lang.code === language ? "bg-teal text-white border-teal shadow-soft" : "bg-white text-teal border-blue-soft hover:border-teal"
              }`}
            >
              {lang.label}
              {lang.code === language && <CheckIcon width={15} height={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab() {
  const name = localStorage.getItem("userName") || "—";
  const role = localStorage.getItem("userRole") || "customer";
  return (
    <div className="card flex items-center gap-4">
      <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft">
        <UserIcon width={24} height={24} />
      </span>
      <div>
        <p className="text-lg font-bold text-ink">{name}</p>
        <p className="text-sm text-gray-500 capitalize">{role} account</p>
      </div>
    </div>
  );
}

export function ToggleRow({ label, defaultChecked = true }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-ink">{label}</span>
      <button
        onClick={() => setOn((o) => !o)}
        className={`w-11 h-6 rounded-full transition-colors relative ${on ? "bg-teal" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="card divide-y divide-blue-soft">
      <ToggleRow label="Email notifications" />
      <ToggleRow label="In-app notifications" />
      <ToggleRow label="Weekly summary digest" defaultChecked={false} />
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className="card divide-y divide-blue-soft">
        <div className="flex items-center gap-2 text-sm font-semibold text-teal mb-1 pb-2">
          <ShieldIcon width={16} height={16} /> Security
        </div>
        <ToggleRow label="Two-factor authentication" defaultChecked={false} />
        <ToggleRow label="Require password on sensitive actions" />
      </div>
      <div className="card divide-y divide-blue-soft">
        <p className="text-sm font-semibold text-teal mb-1 pb-2">Privacy</p>
        <ToggleRow label="Allow anonymized feedback in AI training" />
        <ToggleRow label="Share usage analytics" defaultChecked={false} />
      </div>
    </div>
  );
}

function AIRuntimeTab() {
  const role = localStorage.getItem("userRole") || "customer";
  const runtimePath = role === "employee" ? "/employee/runtime" : "/runtime";
  return (
    <div className="card bg-lavender">
      <div className="flex items-center gap-2 text-sm font-semibold text-teal mb-1">
        <CpuIcon width={16} height={16} /> AI Runtime
      </div>
      <p className="text-sm text-gray-600 mb-4">
        BharatVoice AI routes every pipeline step through cascadeflow, picking the cheapest model
        tier capable of the task. See live routing decisions and cost savings on the Runtime Monitor.
      </p>
      <ToggleRow label="Show detailed cost breakdown" />
      <ToggleRow label="Alert me on routing anomalies" defaultChecked={false} />
      <Link to={runtimePath} className="btn-primary mt-4 inline-flex">
        Open Runtime Monitor <ArrowRightIcon width={15} height={15} />
      </Link>
    </div>
  );
}

function AccountTab() {
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (form.new_password !== form.confirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await api.post("/change-password", {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setMessage({ type: "success", text: "Password updated successfully." });
      setForm({ current_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Could not update password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md">
      <p className="font-semibold text-ink mb-4">Change Password</p>
      <form onSubmit={submit} className="space-y-3">
        <PasswordInput
          placeholder="Current password"
          value={form.current_password}
          onChange={(e) => setForm({ ...form, current_password: e.target.value })}
          required
        />
        <PasswordInput
          placeholder="New password"
          value={form.new_password}
          onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          required
        />
        <PasswordInput
          placeholder="Confirm new password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          required
        />
        {message && (
          <p className={`text-sm font-medium ${message.type === "error" ? "text-coral" : "text-teal"}`}>{message.text}</p>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

const COMMON_TABS = [
  { key: "profile", label: "Profile", icon: UserIcon, render: ProfileTab },
  { key: "language", label: "Language", icon: GlobeIcon, render: LanguageTab },
  { key: "notifications", label: "Notifications", icon: BellIcon, render: NotificationsTab },
  { key: "security", label: "Security", icon: ShieldIcon, render: SecurityTab },
  { key: "ai-runtime", label: "AI Runtime", icon: CpuIcon, render: AIRuntimeTab },
  { key: "account", label: "Account", icon: UserIcon, render: AccountTab },
];

export default function SettingsShell({ title, extraTabs = [] }) {
  const tabs = [...COMMON_TABS, ...extraTabs];
  const [active, setActive] = useState(tabs[0].key);
  const ActiveContent = tabs.find((t) => t.key === active)?.render;

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
          <SettingsIcon width={20} height={20} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
      </div>

      <div className="lg:flex lg:gap-8">
        <nav className="flex lg:flex-col gap-1.5 mb-6 lg:mb-0 lg:w-56 shrink-0 overflow-x-auto lg:overflow-visible pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors text-left ${
                active === t.key ? "bg-teal text-white shadow-soft" : "bg-white text-gray-600 hover:bg-blue-soft hover:text-teal"
              }`}
            >
              <t.icon width={16} height={16} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0 animate-fadeIn">{ActiveContent && <ActiveContent />}</div>
      </div>
    </div>
  );
}
