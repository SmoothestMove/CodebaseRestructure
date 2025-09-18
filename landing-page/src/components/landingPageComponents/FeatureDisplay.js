import { Bot, CalendarCheck, QrCode, Wallet } from "lucide-react";

function FeatureDisplay() {
  const features = [
    { icon: CalendarCheck, label: "Collaborative move planner" },
    { icon: QrCode, label: "QR-powered box tracking" },
    { icon: Wallet, label: "Live budget guardrails" },
    { icon: Bot, label: "MARVIN AI copilot" },
  ];

  return (
    <section className="bg-slate-50 py-24 pb-16" id="features">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto flex flex-col gap-4 text-slate-800">
        <h2 className="tracking-tight font-bold text-center md:text-left text-3xl lg:text-5xl lg:leading-[3.5rem] text-slate-900">
          Everything your move needs, finally in one workspace.
        </h2>
        <p className="font-semibold my-4 text-center md:text-left text-slate-600">
          Smooth Moves keeps timelines, inventory, budgets, and automation in lockstep so everyone - from family to hired crew - knows the plan before the truck pulls up.
        </p>

        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-8 md:gap-0 mt-4">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 group cursor-pointer text-slate-700"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <Icon className="h-6 w-6 text-slate-900 group-hover:text-emerald-600 transition-colors duration-200" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-wide text-center group-hover:text-slate-900 transition-colors duration-200">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureDisplay;
