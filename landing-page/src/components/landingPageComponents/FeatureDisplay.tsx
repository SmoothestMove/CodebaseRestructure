import Image from "next/image";

type FeatureCard = {
  badge: string;
  title: string;
  description: string;
  differentiator: string;
  caption: string;
  image: string;
  alt: string;
};

const features: FeatureCard[] = [
  {
    badge: "Planner",
    title: "Plan every move milestone",
    description:
      "Drag-and-drop timelines, stage-based checklists, and progress tracking keep the entire crew focused on what is next.",
    differentiator: "Built for move day dependencies, not generic Kanban columns.",
    caption: "Keep your budget, checklist, and packing plan in one shared view.",
    image: "/assets/features/planner.png",
    alt: "Planner board showing Smooth Moves task timeline",
  },
  {
    badge: "Inventory",
    title: "See every box at a glance",
    description:
      "Scan QR labels, search by contents, and filter by stage so the night-one box is never a guessing game.",
    differentiator: "More context than spreadsheets and faster than scrolling group texts.",
    caption: "QR labels instantly show where anything lives from garage to storage.",
    image: "/assets/features/inventory.png",
    alt: "Inventory workspace with QR labeled boxes",
  },
  {
    badge: "Budget",
    title: "Guardrails for every expense",
    description:
      "Set smart categories, track receipts, and watch totals auto-balance before costs get out of hand.",
    differentiator: "No more manual math or missing receipts tucked in glove compartments.",
    caption: "Snap a photo and Smooth Moves reconciles the spend in seconds.",
    image: "/assets/features/budget.png",
    alt: "Budget overview showing categorized expenses",
  },
  {
    badge: "MARVIN",
    title: "An AI copilot for relocation",
    description:
      "Ask MARVIN to draft agendas, answer move questions, and surface risks before they snowball.",
    differentiator: "Your assistant actually speaks the language of moving logistics.",
    caption: "Ask for next steps, timelines, or packing prompts hands-free.",
    image: "/assets/features/marvin.png",
    alt: "MARVIN assistant chat interface",
  },
];

function FeatureDisplay() {
  return (
    <section className="bg-slate-50 py-24 pb-16" id="features">
      <div className="mx-auto flex max-w-sm flex-col gap-6 text-slate-800 sm:max-w-3xl lg:max-w-6xl">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">All-in-one workspace</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl lg:leading-[3.5rem]">
            Every core move workflow lives in Smooth Moves.
          </h2>
          <p className="text-base font-medium text-slate-600 md:text-lg">
            We took the moving binder, the family group text, and the shared spreadsheet and rebuilt them around the moments that derail relocations. Each workspace is designed to keep collaborators informed without creating more homework.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
                  priority={index === 0}
                />
                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 p-4 text-left text-slate-700 shadow-lg backdrop-blur-sm dark:bg-slate-900/85 dark:text-slate-200">
                  <p className="text-sm font-semibold">{feature.caption}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {feature.badge}
                </span>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
                <div className="mt-auto rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700">
                  {feature.differentiator}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureDisplay;
