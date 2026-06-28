import { useNavigate } from "react-router-dom";
import { ChatIcon, ChartIcon, ListIcon, BrainIcon, GridIcon, LayersIcon, SparkleIcon, ArrowRightIcon } from "../components/Icons.jsx";

const ROLES = [
  {
    key: "customer",
    title: "Customer",
    bg: "bg-blue-soft",
    iconBg: "bg-blue",
    points: [
      { icon: ChatIcon, text: "Submit multilingual feedback" },
      { icon: BrainIcon, text: "View AI analysis" },
      { icon: ListIcon, text: "Track history" },
    ],
    cta: "Continue as Customer",
  },
  {
    key: "employee",
    title: "Employee",
    bg: "bg-mint",
    iconBg: "bg-teal",
    points: [
      { icon: ChartIcon, text: "Analyze customer feedback" },
      { icon: GridIcon, text: "Product intelligence" },
      { icon: LayersIcon, text: "Executive dashboards & AI synthesis" },
    ],
    cta: "Continue as Employee",
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 py-16 bg-[#f4f4f8]">
      <div className="max-w-3xl w-full animate-fadeUp">
        <div className="text-center mb-10">
          <span className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center mb-4 shadow-lift">
            <SparkleIcon width={26} height={26} />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Who's logging in?</h1>
          <p className="text-gray-500 mt-2">Choose how you'd like to use BharatVoice AI</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {ROLES.map((role, i) => (
            <div
              key={role.key}
              className={`card card-hover ${role.bg} flex flex-col animate-fadeUp`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="font-extrabold text-xl text-ink mb-4">{role.title}</h3>
              <ul className="space-y-3 mb-6 flex-1">
                {role.points.map((p) => (
                  <li key={p.text} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <span className={`w-7 h-7 rounded-lg ${role.iconBg} text-white flex items-center justify-center shrink-0`}>
                      <p.icon width={14} height={14} />
                    </span>
                    {p.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(`/auth?role=${role.key}`)}
                className="btn-primary w-full justify-center"
              >
                {role.cta}
                <ArrowRightIcon width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
