import SettingsShell, { ToggleRow } from "../components/SettingsShell.jsx";
import { ChatIcon, ListIcon } from "../components/Icons.jsx";

function FeedbackPreferencesTab() {
  return (
    <div className="card divide-y divide-blue-soft">
      <ToggleRow label="Remember my last-used language" />
      <ToggleRow label="Show AI translation alongside original text" />
      <ToggleRow label="Auto-suggest product from recent feedback" defaultChecked={false} />
    </div>
  );
}

function HistoryPreferencesTab() {
  return (
    <div className="card divide-y divide-blue-soft">
      <ToggleRow label="Keep full feedback history" />
      <ToggleRow label="Show sentiment badges in history list" />
    </div>
  );
}

export default function Settings() {
  return (
    <SettingsShell
      title="Settings"
      extraTabs={[
        { key: "feedback-prefs", label: "Feedback Preferences", icon: ChatIcon, render: FeedbackPreferencesTab },
        { key: "history-prefs", label: "History Preferences", icon: ListIcon, render: HistoryPreferencesTab },
      ]}
    />
  );
}
