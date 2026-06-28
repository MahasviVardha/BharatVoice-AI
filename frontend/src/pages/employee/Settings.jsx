import { useState } from "react";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import SettingsShell, { ToggleRow } from "../../components/SettingsShell.jsx";
import { CpuIcon, LightbulbIcon, GridIcon, FileIcon, MegaphoneIcon } from "../../components/Icons.jsx";

function SliderRow({ label, defaultValue = 70 }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <div className="py-2.5">
      <div className="flex justify-between text-sm mb-1"><span className="text-ink">{label}</span><span className="text-gray-400">{val}%</span></div>
      <input type="range" min="0" max="100" value={val} onChange={(e) => setVal(e.target.value)} className="w-full accent-teal" />
    </div>
  );
}

const RuntimePreferencesTab = () => (
  <div className="card divide-y divide-blue-soft">
    <ToggleRow label="Prefer fast model for low-complexity tasks" />
    <ToggleRow label="Alert on routing anomalies" />
    <ToggleRow label="Daily runtime cost email" defaultChecked={false} />
  </div>
);

const AIThresholdsTab = () => (
  <div className="card divide-y divide-blue-soft">
    <SliderRow label="Complaint spike sensitivity" defaultValue={75} />
    <SliderRow label="Minimum recommendation confidence" defaultValue={60} />
    <SliderRow label="Memory cluster growth alert threshold" defaultValue={50} />
  </div>
);

const DashboardPreferencesTab = () => (
  <div className="card divide-y divide-blue-soft">
    <ToggleRow label="Show sparklines on KPI cards" />
    <ToggleRow label="Compact table view in Feedback Explorer" defaultChecked={false} />
    <ToggleRow label="Default to last viewed product" />
  </div>
);

const ReportPreferencesTab = () => (
  <div className="card divide-y divide-blue-soft">
    <ToggleRow label="Auto-generate weekly report" />
    <ToggleRow label="Include runtime cost in reports" />
  </div>
);

const BusinessNotificationRulesTab = () => (
  <div className="card divide-y divide-blue-soft">
    <ToggleRow label="Notify on complaint spikes" />
    <ToggleRow label="Notify on product health decline" />
    <ToggleRow label="Notify when memory clusters grow" />
  </div>
);

export default function EmployeeSettings() {
  return (
    <EmployeeLayout>
      <SettingsShell
        title="Settings"
        extraTabs={[
          { key: "runtime-prefs", label: "Runtime Preferences", icon: CpuIcon, render: RuntimePreferencesTab },
          { key: "ai-thresholds", label: "AI Thresholds", icon: LightbulbIcon, render: AIThresholdsTab },
          { key: "dashboard-prefs", label: "Dashboard Preferences", icon: GridIcon, render: DashboardPreferencesTab },
          { key: "report-prefs", label: "Report Preferences", icon: FileIcon, render: ReportPreferencesTab },
          { key: "biz-notifications", label: "Business Notification Rules", icon: MegaphoneIcon, render: BusinessNotificationRulesTab },
        ]}
      />
    </EmployeeLayout>
  );
}
