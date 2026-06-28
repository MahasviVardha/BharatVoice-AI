import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import {
  HomeIcon, ChatIcon, ListIcon, ChartIcon, CpuIcon, SettingsIcon,
  LogoutIcon, MenuIcon, CloseIcon, SparkleIcon,
} from "./Icons.jsx";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const loggedIn = !!localStorage.getItem("token");
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const navItems = [
    { to: "/", label: t("navHome"), icon: HomeIcon, show: true },
    { to: "/dashboard", label: t("navHome"), icon: HomeIcon, show: loggedIn, hideOnRoot: true },
    { to: "/feedback", label: t("navGiveFeedback"), icon: ChatIcon, show: loggedIn },
    { to: "/history", label: t("navMyFeedback"), icon: ListIcon, show: loggedIn },
    { to: "/insights", label: t("navInsights"), icon: ChartIcon, show: true },
    { to: "/runtime", label: t("navRuntime"), icon: CpuIcon, show: true },
    { to: "/settings", label: t("navSettings"), icon: SettingsIcon, show: true },
  ].filter((i) => i.show && !(i.to === "/" && loggedIn));

  const linkClasses = (to) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
      location.pathname === to
        ? "bg-teal text-white shadow-soft"
        : "text-gray-600 hover:bg-blue-soft hover:text-teal"
    }`;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-blue-soft">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-teal shrink-0">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal to-blue flex items-center justify-center text-white">
            <SparkleIcon width={16} height={16} />
          </span>
          <span className="hidden sm:inline">{t("appName")}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.to + item.label} to={item.to} className={linkClasses(item.to)}>
              <item.icon width={16} height={16} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher />
          {loggedIn ? (
            <button onClick={logout} className="btn-secondary !py-2 !px-4">
              <LogoutIcon width={16} height={16} />
              {t("navLogout")}
            </button>
          ) : (
            <Link to="/role-select" className="btn-primary !py-2 !px-4">
              {t("navLogin")}
            </Link>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-xl text-teal hover:bg-blue-soft"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-blue-soft bg-white px-5 py-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => (
            <Link
              key={item.to + item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={linkClasses(item.to) + " w-full"}
            >
              <item.icon width={16} height={16} />
              {item.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-3 border-t border-blue-soft mt-2">
            <LanguageSwitcher align="left" />
            {loggedIn ? (
              <button onClick={logout} className="btn-secondary !py-2 !px-4">
                <LogoutIcon width={16} height={16} />
                {t("navLogout")}
              </button>
            ) : (
              <Link to="/role-select" className="btn-primary !py-2 !px-4" onClick={() => setMobileOpen(false)}>
                {t("navLogin")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
