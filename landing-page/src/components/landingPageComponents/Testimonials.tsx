import { ArrowRight, Archive, GraduationCap, HeartHandshake, Laptop2, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MaxWidthWrapper from "../MaxWidthWrapper";

type Accent = "orange" | "sky" | "violet" | "emerald" | "amber" | "slate";

type PersonaCard = {
  title: string;
  summary: string;
  prompt: string;
  accent: Accent;
  icon: LucideIcon;
  layout: string;
};

const personas: PersonaCard[] = [
  {
    title: "Family with kids",
    summary:
      "Two parents, two kids, and a house full of memories. Smooth Moves keeps everyone aligned so the soccer cleats and the coffee maker never go missing.",
    prompt: "Tell us how your family stays in sync during a move.",
    accent: "orange",
    icon: Users,
    layout: "xl:col-span-7 xl:row-span-2",
  },
  {
    title: "Young professional / first apartment",
    summary:
      "Budget trackers, deposits, and handoffs pile up fast. Smooth Moves breaks the chaos into a guided timeline so move-in stays exciting, not exhausting.",
    prompt: "What would make your first solo move unforgettable for the right reasons?",
    accent: "sky",
    icon: User,
    layout: "xl:col-span-5",
  },
  {
    title: "College student with friends helping",
    summary:
      "Dorm swaps, borrowed trunks, and roommates on standby. Smooth Moves makes sure nothing gets left behind, even the bag in your friend\'s car.",
    prompt: "How could Smooth Moves calm the campus move scramble?",
    accent: "violet",
    icon: GraduationCap,
    layout: "xl:col-span-5",
  },
  {
    title: "Couple relocating together",
    summary:
      "Two households become one timeline. Smooth Moves helps you decide what to keep, sell, or donate without losing sight of the budget.",
    prompt: "What would make combining households feel easier?",
    accent: "emerald",
    icon: HeartHandshake,
    layout: "xl:col-span-7 xl:row-span-2",
  },
  {
    title: "Remote worker relocation",
    summary:
      "New role, new city, same workload. Smooth Moves handles the logistics so you can focus on onboarding strong.",
    prompt: "How could we support your next career transition?",
    accent: "amber",
    icon: Laptop2,
    layout: "xl:col-span-4",
  },
  {
    title: "Downsizing or empty nester",
    summary:
      "Decades of belongings and a fresh chapter ahead. Smooth Moves helps you sort, store, and simplify without losing what matters.",
    prompt: "What guidance would make downsizing feel lighter?",
    accent: "slate",
    icon: Archive,
    layout: "xl:col-span-8",
  },
];

const accentClasses: Record<Accent, { card: string; badge: string; prompt: string; icon: string; button: string }> = {
  orange: {
    card: "border-orange-200/70 bg-orange-50/60 dark:border-orange-400/30 dark:bg-orange-500/10",
    badge: "bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-200",
    prompt: "text-orange-600 dark:text-orange-200",
    icon: "bg-orange-500/15 text-orange-600 dark:bg-orange-500/25 dark:text-orange-200",
    button:
      "text-orange-600 hover:text-orange-500 dark:text-orange-200 dark:hover:text-orange-100",
  },
  sky: {
    card: "border-sky-200/70 bg-sky-50/60 dark:border-sky-500/30 dark:bg-sky-500/10",
    badge: "bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200",
    prompt: "text-sky-600 dark:text-sky-200",
    icon: "bg-sky-500/15 text-sky-600 dark:bg-sky-500/25 dark:text-sky-200",
    button: "text-sky-600 hover:text-sky-500 dark:text-sky-200 dark:hover:text-sky-100",
  },
  violet: {
    card: "border-purple-200/70 bg-purple-50/60 dark:border-purple-500/30 dark:bg-purple-500/10",
    badge: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-200",
    prompt: "text-purple-600 dark:text-purple-200",
    icon: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/25 dark:text-purple-200",
    button:
      "text-purple-600 hover:text-purple-500 dark:text-purple-200 dark:hover:text-purple-100",
  },
  emerald: {
    card: "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    prompt: "text-emerald-600 dark:text-emerald-200",
    icon: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-200",
    button:
      "text-emerald-600 hover:text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-100",
  },
  amber: {
    card: "border-amber-200/70 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10",
    badge: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
    prompt: "text-amber-600 dark:text-amber-200",
    icon: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-200",
    button:
      "text-amber-600 hover:text-amber-500 dark:text-amber-200 dark:hover:text-amber-100",
  },
  slate: {
    card: "border-slate-200/80 bg-slate-50/70 dark:border-slate-600/40 dark:bg-slate-800/70",
    badge: "bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200",
    prompt: "text-slate-700 dark:text-slate-200",
    icon: "bg-slate-500/15 text-slate-700 dark:bg-slate-500/25 dark:text-slate-200",
    button:
      "text-slate-700 hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-100",
  },
};

function Testimonials() {
  return (
    <MaxWidthWrapper>
      <section id="testimonials" className="my-24 space-y-12 text-slate-800 dark:text-slate-100">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
            Help us grow
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your move, your story
          </h2>
          <p className="text-base font-medium text-slate-600 dark:text-slate-300">
            Smooth Moves is built for all kinds of relocations. These personas highlight the journeys we are designing for now and the voices we are eager to feature next.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(240px,1fr)] gap-6 md:grid-cols-2 xl:grid-cols-12">
          {personas.map((persona) => {
            const styles = accentClasses[persona.accent];
            const Icon = persona.icon;
            return (
              <article
                key={persona.title}
                className={`group flex h-full flex-col justify-between rounded-3xl border p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${styles.card} ${persona.layout}`}
              >
                <header className="space-y-4">
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles.badge}`}>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full ${styles.icon}`}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    Persona spotlight
                  </span>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{persona.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">{persona.summary}</p>
                </header>
                <footer className="mt-6 space-y-4">
                  <p className={`text-sm font-semibold ${styles.prompt}`}>{persona.prompt}</p>
                  <a
                    href="#waitlist"
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition ${styles.button}`}
                  >
                    Share your move
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </footer>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            These prompts will be replaced with real stories as our beta community grows. Add your perspective and help shape Smooth Moves for every kind of relocation.
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(249,115,22,0.45)] transition hover:shadow-[0_0_26px_rgba(249,115,22,0.55)]"
          >
            Join the waitlist
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}

export default Testimonials;

