import Image from "next/image";

const features = [
  {
    badge: "Planner",
    title: "Plan every move milestone",
    description:
      "Drag-and-drop timelines, stage-based checklists, and progress tracking keep the entire crew focused on what’s next.",
    image: "/assets/features/planner.png",
    alt: "Planner board showing Smooth Moves task timeline",
  },
  {
    badge: "Inventory",
    title: "See every box at a glance",
    description:
      "Scan QR labels, search by box contents, and filter by move stage to know exactly where things are.",
    image: "/assets/features/inventory.png",
    alt: "Inventory workspace with QR labeled boxes",
  },
  {
    badge: "Budget",
    title: "Guardrails for every expense",
    description:
      "Set smart categories, track receipts, and watch totals auto-balance so the move stays on budget.",
    image: "/assets/features/budget.png",
    alt: "Budget overview showing categorized expenses",
  },
  {
    badge: "MARVIN",
    title: "An AI copilot for relocation",
    description:
      "Ask MARVIN to draft agendas, answer move questions, and trigger automations the second you need them.",
    image: "/assets/features/marvin.png",
    alt: "MARVIN assistant chat interface",
  },
];

function FeatureDisplay() {
  return (
    <section className="bg-slate-50 py-24 pb-16" id="features">
      <div className="mx-auto flex max-w-sm flex-col gap-6 text-slate-800 sm:max-w-2xl lg:max-w-5xl">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">All-in-one workspace</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl lg:leading-[3.5rem]">
            Every core move workflow lives in Smooth Moves.
          </h2>
          <p className="text-base font-medium text-slate-600 md:text-lg">
            From planning boards to AI assistance, the essentials for planner timelines, inventory, budget, and MARVIN come ready to deploy so your crew stays in sync before, during, and after move day.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
                  priority={feature.badge === "Planner"}
                />
              </div>
              <div className="flex flex-col gap-3 p-6">
                <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {feature.badge}
                </span>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureDisplay;
