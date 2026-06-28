import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import RequireRole from "./components/RequireRole.jsx";
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import RoleSelect from "./pages/RoleSelect.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Feedback from "./pages/Feedback.jsx";
import FeedbackResult from "./pages/FeedbackResult.jsx";
import History from "./pages/History.jsx";
import ProductDashboard from "./pages/ProductDashboard.jsx";
import Timeline from "./pages/Timeline.jsx";
import RuntimeMonitor from "./pages/RuntimeMonitor.jsx";
import LanguagePicker from "./pages/LanguagePicker.jsx";
import Settings from "./pages/Settings.jsx";
import { useLanguage } from "./i18n/LanguageContext.jsx";

import EmployeeDashboard from "./pages/employee/Dashboard.jsx";
import ProductIntelligence from "./pages/employee/ProductIntelligence.jsx";
import ProductDetail from "./pages/employee/ProductDetail.jsx";
import FeedbackExplorer from "./pages/employee/FeedbackExplorer.jsx";
import FeedbackSynthesizer from "./pages/employee/FeedbackSynthesizer.jsx";
import RecommendationCenter from "./pages/employee/RecommendationCenter.jsx";
import MemoryIntelligence from "./pages/employee/MemoryIntelligence.jsx";
import TrendAnalytics from "./pages/employee/TrendAnalytics.jsx";
import ExecutiveSummary from "./pages/employee/ExecutiveSummary.jsx";
import EmployeeRuntimeMonitor from "./pages/employee/RuntimeMonitor.jsx";
import Reports from "./pages/employee/Reports.jsx";
import Notifications from "./pages/employee/Notifications.jsx";
import EmployeeSettings from "./pages/employee/Settings.jsx";
import CategoryInsights from "./pages/employee/CategoryInsights.jsx";
import ImprovementIntelligence from "./pages/employee/ImprovementIntelligence.jsx";

export default function App() {
  const { language } = useLanguage();
  const location = useLocation();
  const isEmployeeRoute = location.pathname.startsWith("/employee");

  if (!language) {
    return <LanguagePicker />;
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {!isEmployeeRoute && <Nav />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/insights" element={<ProductDashboard />} />
        <Route path="/insights/:id" element={<ProductDashboard />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/runtime" element={<RuntimeMonitor />} />
        <Route path="/settings" element={<Settings />} />

        {/* Customer-only */}
        <Route path="/dashboard" element={<RequireRole roles={["customer"]}><Dashboard /></RequireRole>} />
        <Route path="/feedback" element={<RequireRole roles={["customer"]}><Feedback /></RequireRole>} />
        <Route path="/feedback/:id" element={<RequireRole roles={["customer"]}><FeedbackResult /></RequireRole>} />
        <Route path="/history" element={<RequireRole roles={["customer"]}><History /></RequireRole>} />

        {/* Employee-only */}
        <Route path="/employee/dashboard" element={<RequireRole roles={["employee"]}><EmployeeDashboard /></RequireRole>} />
        <Route path="/employee/products" element={<RequireRole roles={["employee"]}><ProductIntelligence /></RequireRole>} />
        <Route path="/employee/products/:id" element={<RequireRole roles={["employee"]}><ProductDetail /></RequireRole>} />
        <Route path="/employee/feedback" element={<RequireRole roles={["employee"]}><FeedbackExplorer /></RequireRole>} />
        <Route path="/employee/synthesizer" element={<RequireRole roles={["employee"]}><FeedbackSynthesizer /></RequireRole>} />
        <Route path="/employee/recommendations" element={<RequireRole roles={["employee"]}><RecommendationCenter /></RequireRole>} />
        <Route path="/employee/memory" element={<RequireRole roles={["employee"]}><MemoryIntelligence /></RequireRole>} />
        <Route path="/employee/trends" element={<RequireRole roles={["employee"]}><TrendAnalytics /></RequireRole>} />
        <Route path="/employee/categories" element={<RequireRole roles={["employee"]}><CategoryInsights /></RequireRole>} />
        <Route path="/employee/improvement" element={<RequireRole roles={["employee"]}><ImprovementIntelligence /></RequireRole>} />
        <Route path="/employee/summary" element={<RequireRole roles={["employee"]}><ExecutiveSummary /></RequireRole>} />
        <Route path="/employee/runtime" element={<RequireRole roles={["employee"]}><EmployeeRuntimeMonitor /></RequireRole>} />
        <Route path="/employee/reports" element={<RequireRole roles={["employee"]}><Reports /></RequireRole>} />
        <Route path="/employee/notifications" element={<RequireRole roles={["employee"]}><Notifications /></RequireRole>} />
        <Route path="/employee/settings" element={<RequireRole roles={["employee"]}><EmployeeSettings /></RequireRole>} />
      </Routes>
    </div>
  );
}
