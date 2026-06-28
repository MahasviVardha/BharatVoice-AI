import { SparkleIcon } from "../components/Icons.jsx";

export default function Timeline() {
  const stages = [
    {
      title: "Login failures reported",
      before: "Users complained about repeated login/OTP failures during peak hours.",
      suggestion: "Improve authentication reliability and add backup OTP delivery channels.",
      after: "Login failure reports dropped by 62% after the fix shipped.",
    },
    {
      title: "Delivery delays during rain",
      before: "Customers across multiple cities reported late deliveries whenever it rained.",
      suggestion: "Use weather-based delivery prediction and add delivery partners during heavy rainfall.",
      after: "On-time delivery rate during rainy days improved from 58% to 84%.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12 animate-fadeUp">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-11 h-11 rounded-2xl bg-teal text-white flex items-center justify-center shadow-soft">
          <SparkleIcon width={20} height={20} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">Product Improvement Timeline</h1>
      </div>
      <div className="space-y-8">
        {stages.map((s, i) => (
          <div key={i} className="card card-hover animate-fadeUp" style={{ animationDelay: `${i * 0.1}s` }}>
            <h3 className="font-bold text-lg mb-3 text-ink">{s.title}</h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-coral-soft rounded-xl p-3.5">
                <p className="text-xs font-bold text-coral mb-1 uppercase tracking-wide">Before</p>
                <p className="text-sm text-ink">{s.before}</p>
              </div>
              <div className="bg-blue-soft rounded-xl p-3.5">
                <p className="text-xs font-bold text-teal mb-1 uppercase tracking-wide">AI Suggestion</p>
                <p className="text-sm text-ink">{s.suggestion}</p>
              </div>
              <div className="bg-mint rounded-xl p-3.5">
                <p className="text-xs font-bold text-teal mb-1 uppercase tracking-wide">After</p>
                <p className="text-sm text-ink">{s.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
