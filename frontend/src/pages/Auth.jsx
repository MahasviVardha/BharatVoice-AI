import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import { UserIcon, SparkleIcon, IdCardIcon } from "../components/Icons.jsx";

export default function Auth() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") === "employee" ? "employee" : "customer";
  const [mode, setMode] = useState("login");
  const demoDefaults = {
    name: "",
    email: "demo@bharatvoice.ai",
    employeeId: "EMP1001",
    password: role === "employee" ? "employee123" : "demo1234",
  };
  const blankDefaults = { name: "", email: "", employeeId: "", password: "" };
  const [form, setForm] = useState(demoDefaults);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    // Demo credentials are only a convenience for logging in — Register must
    // always start blank so a half-cleared demo password never gets submitted.
    setForm(nextMode === "login" ? demoDefaults : blankDefaults);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = mode === "login" ? "/login" : "/register";
      const base = role === "employee"
        ? { employee_id: form.employeeId, password: form.password }
        : { email: form.email, password: form.password };
      const payload = mode === "login" ? base : { ...base, name: form.name, role };
      const { data } = await api.post(url, payload);
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      navigate(data.role === "employee" ? "/employee/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 bg-gradient-to-br from-blue-soft via-white to-pink-soft py-12">
      <div className="max-w-md w-full animate-fadeUp">
        <div className="card !p-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center mb-5 shadow-soft">
            {role === "employee" ? <IdCardIcon width={22} height={22} /> : <UserIcon width={22} height={22} />}
          </div>
          <span className="pill bg-cream text-teal mb-3 inline-flex">
            {role === "employee" ? "Employee Portal" : "Customer Portal"}
          </span>
          <h2 className="text-2xl font-extrabold text-ink mb-1">
            {mode === "login" ? t("authWelcomeBack") : t("authCreateAccount")}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === "login" ? t("authLoginSubtitle") : t("authRegisterSubtitle")}
          </p>
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <input
                className="input"
                placeholder={t("authFullName")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}

            {role === "employee" ? (
              <input
                className="input"
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                required
              />
            ) : (
              <input
                className="input"
                type="email"
                placeholder={t("authEmail")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            )}

            <PasswordInput
              placeholder={t("authPassword")}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && <p className="text-coral text-sm font-medium">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? (
                <SparkleIcon width={18} height={18} className="animate-pulseSoft" />
              ) : mode === "login" ? (
                t("btnLogin")
              ) : (
                t("btnRegister")
              )}
            </button>
          </form>
          <button
            className="btn-ghost mt-4 w-full text-center"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? t("authNeedAccount") : t("authHaveAccount")}
          </button>
          <p className="text-xs text-gray-400 mt-4 text-center">
            {role === "employee" ? "Demo login — Employee ID: EMP1001 / Password: employee123" : t("authDemoNote")}
          </p>
          <Link to="/role-select" className="text-xs text-teal mt-2 block text-center font-medium">
            ← Switch portal
          </Link>
        </div>
      </div>
    </div>
  );
}
