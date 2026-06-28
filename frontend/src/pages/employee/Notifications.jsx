import { useEffect, useState } from "react";
import api from "../../api.js";
import EmployeeLayout from "../../components/EmployeeSidebar.jsx";
import { BellIcon } from "../../components/Icons.jsx";

const SEVERITY_STYLE = {
  high: "bg-coral-soft text-coral",
  medium: "bg-cream text-ink",
  low: "bg-blue-soft text-teal",
};

const SEEN_KEY = "employeeNotificationsSeenIds";

export default function Notifications() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get("/employee/notifications").then((res) => {
      setItems(res.data);
      localStorage.setItem(SEEN_KEY, JSON.stringify(res.data.map((n) => n.id)));
    }).catch(() => setItems([]));
  }, []);

  return (
    <EmployeeLayout>
      <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10 animate-fadeUp">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
            <BellIcon width={20} height={20} />
          </span>
          <h1 className="text-2xl font-extrabold text-ink">Notifications</h1>
        </div>

        {!items ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((n) => (
              <div key={n.id} className="card flex items-start gap-3">
                <span className={`pill shrink-0 mt-0.5 ${SEVERITY_STYLE[n.severity]}`}>{n.severity}</span>
                <div>
                  <p className="font-semibold text-ink">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-14 bg-blue-soft">
            <BellIcon width={28} height={28} className="text-teal mx-auto mb-3" />
            <p className="text-gray-500">No notifications right now — all clear!</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
