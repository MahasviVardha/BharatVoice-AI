import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api.js";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import {
  GridIcon, ChartIcon, SearchIcon, LayersIcon, LightbulbIcon, BrainIcon,
  TrendUpIcon, CpuIcon, MegaphoneIcon, FileIcon, BellIcon, SettingsIcon,
  LogoutIcon, MenuIcon, CloseIcon, SparkleIcon, ListIcon, ThumbsUpIcon,
} from "./Icons.jsx";

const ITEMS = [
  { to: "/employee/dashboard", label: "Dashboard", icon: GridIcon },
  { to: "/employee/products", label: "Product Intelligence", icon: ChartIcon },
  { to: "/employee/feedback", label: "Feedback Explorer", icon: SearchIcon },
  { to: "/employee/synthesizer", label: "Feedback Synthesizer", icon: LayersIcon },
  { to: "/employee/recommendations", label: "AI Recommendations", icon: LightbulbIcon },
  { to: "/employee/memory", label: "Memory Intelligence", icon: BrainIcon },
  { to: "/employee/trends", label: "Trend Analytics", icon: TrendUpIcon },
  { to: "/employee/categories", label: "Category Insights", icon: ListIcon },
  { to: "/employee/improvement", label: "Improvement Intelligence", icon: ThumbsUpIcon },
  { to: "/employee/runtime", label: "Runtime Monitor", icon: CpuIcon },
  { to: "/employee/summary", label: "Executive Summary", icon: MegaphoneIcon },
  { to: "/employee/reports", label: "Reports", icon: FileIcon },
  { to: "/employee/notifications", label: "Notifications", icon: BellIcon },
  { to: "/employee/settings", label: "Settings", icon: SettingsIcon },
];

function SidebarLinks({ pathname, onNavigate, unreadCount }) {
  return (
    <nav className="space-y-1">
      {ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            pathname === item.to ? "bg-teal text-white shadow-soft" : "text-gray-600 hover:bg-blue-soft hover:text-teal"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <item.icon width={17} height={17} />
            {item.label}
          </span>
          {item.to === "/employee/notifications" && unreadCount > 0 && (
            <span className="bg-coral text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export default function EmployeeLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userName = localStorage.getItem("userName") || "Employee";

  useEffect(() => {
    const seen = JSON.parse(localStorage.getItem("employeeNotificationsSeenIds") || "[]");
    api.get("/employee/notifications").then((res) => {
      const unseen = res.data.filter((n) => !seen.includes(n.id));
      setUnreadCount(unseen.length);
    }).catch(() => {});
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-[#f8f7fc]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-blue-soft px-4 py-6">
        <Link to="/employee/dashboard" className="flex items-center gap-2 font-extrabold text-lg text-teal px-2 mb-8">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal to-blue flex items-center justify-center text-white">
            <SparkleIcon width={16} height={16} />
          </span>
          BharatVoice <span className="text-coral">Staff</span>
        </Link>
        <div className="flex-1 overflow-y-auto">
          <SidebarLinks pathname={location.pathname} unreadCount={unreadCount} />
        </div>
        <div className="border-t border-blue-soft pt-4 mt-4 space-y-3">
          <LanguageSwitcher align="left" />
          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-ink truncate">{userName}</p>
            <button onClick={logout} className="text-coral hover:text-coral" aria-label="Logout">
              <LogoutIcon width={17} height={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-blue-soft flex items-center justify-between px-4 h-16">
        <Link to="/employee/dashboard" className="flex items-center gap-2 font-extrabold text-teal">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal to-blue flex items-center justify-center text-white">
            <SparkleIcon width={16} height={16} />
          </span>
          Staff
        </Link>
        <button onClick={() => setMobileOpen((o) => !o)} className="p-2 rounded-xl text-teal hover:bg-blue-soft" aria-label="Menu">
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-white pt-20 px-5 pb-6 overflow-y-auto animate-fadeIn">
          <SidebarLinks pathname={location.pathname} onNavigate={() => setMobileOpen(false)} unreadCount={unreadCount} />
          <div className="border-t border-blue-soft pt-4 mt-4 flex items-center justify-between">
            <LanguageSwitcher align="left" />
            <button onClick={logout} className="btn-secondary !py-2 !px-4">
              <LogoutIcon width={16} height={16} />
              Logout
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 lg:pt-0 pt-16">{children}</main>
    </div>
  );
}
