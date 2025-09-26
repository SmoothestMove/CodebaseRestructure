import type { LucideIcon } from "lucide-react";
import { BellRing, CalendarCheck2, CalendarX2, MessageSquareWarning, PackageSearch, QrCode, Receipt, Sparkles, Star } from "lucide-react";
import MaxWidthWrapper from "../MaxWidthWrapper";

type ComparisonPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const beforePoints: ComparisonPoint[] = [
  {
    icon: MessageSquareWarning,
    title: "Updates scattered everywhere",
    description: "Texts, voice notes, and sticky reminders make it impossible to see the full picture.",
  },
  {
    icon: PackageSearch,
    title: "Boxes become mysteries",
    description: "You do not know which bin hides night-one essentials until it is already late.",
  },
  {
    icon: Receipt,
    title: "Budgets fall apart",
    description: "Receipts vanish before they are logged, so costs balloon without warning.",
  },
  {
    icon: CalendarX2,
    title: "Tasks slip through cracks",
    description: "Move-day deadlines arrive while you are still juggling what should have been done last week.",
  },
];

const afterPoints: ComparisonPoint[] = [
  {
    icon: CalendarCheck2,
    title: "One shared move timeline",
    description: "Everyone sees what is next, what is done, and who is on point in real time.",
  },
  {
    icon: QrCode,
    title: "QR labels tell all",
    description: "Scan any code to know the room, contents, and delivery order before the truck unloads.",
  },
  {
    icon: Sparkles,
    title: "Budgets stay in bounds",
    description: "Snap a receipt and watch categories update instantly with guardrails you set.",
  },
  {
    icon: BellRing,
    title: "MARVIN flags risks early",
    description: "AI nudges surface deadlines and blockers before they turn into fire drills.",
  },
];

function ComparisonColumn({
  heading,
  points,
  accent,
}: {
  heading: string;
  points: ComparisonPoint[];
  accent: "before" | "after";
}) {
  return (
    <article
      className={`flex w-full flex-col gap-6 rounded-3xl border p-8 shadow-sm transition duration-200 lg:p-10 ${
        accent === "before"
          ? "border-rose-200/60 bg-white/80 hover:shadow-md dark:border-rose-500/30 dark:bg-slate-900"
          : "border-emerald-200/70 bg-emerald-50/70 hover:shadow-lg dark:border-emerald-500/25 dark:bg-emerald-500/10"
      }`}
    >
      <header className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
          {heading}
        </h3>
        <p className="text-xl font-semibold text-slate-900 dark:text-white">
          {accent === "before" ? "Without Smooth Moves" : "With Smooth Moves"}
        </p>
      </header>

      <ul className="space-y-4 text-slate-700 dark:text-slate-200">
        {points.map((point) => (
          <li key={point.title} className="flex items-start gap-4">
            <span
              className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-sm ${
                accent === "before"
                  ? "border-rose-200/60 bg-rose-50 text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
                  : "border-emerald-200/60 bg-emerald-50 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200"
              }`}
            >
              <point.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">{point.title}</p>
              <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                {point.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function BeforeAfter() {
  return (
    <section className="bg-white/85 py-24 transition-colors dark:bg-slate-950/40" id="why">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500 dark:text-emerald-300">
            Proof in contrast
          </p>
          <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl md:leading-[3.5rem] dark:text-white">
            From juggling chaos to smooth control.
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-600 md:text-xl dark:text-slate-300">
            Swap scattered lists and guesswork for a single command center that keeps planning, packing, and budgeting in sync.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <ComparisonColumn heading="Before" points={beforePoints} accent="before" />
          <ComparisonColumn heading="After" points={afterPoints} accent="after" />
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-slate-200 bg-slate-50/70 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="mx-auto flex items-center justify-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className="h-5 w-5 text-yellow-500" fill="currentColor" />
            ))}
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
            "Smooth Moves kept our cross-country relocation on rails. The AI nudges alone saved us hours each week."
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-700 ring-2 ring-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-500/30">
              JP
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900 dark:text-white">Jasmine P.</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Military family - Beta cohort two</p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

export default BeforeAfter;



