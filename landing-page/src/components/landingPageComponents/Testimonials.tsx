import { ArrowRight } from "lucide-react";
import MaxWidthWrapper from "../MaxWidthWrapper";

type Accent = "orange" | "sky" | "violet" | "emerald" | "amber" | "slate";

type PersonaCard = {
  title: string;
  summary: string;
  prompt: string;
  accent: Accent;
};

const personas: PersonaCard[] = [
  {
    title: "Family with kids",
    summary:
      "Two parents, two kids, and a house full of memories. Smooth Moves keeps everyone on the same page so the essentials never go missing—whether it’s the soccer gear or the coffee maker.",
    prompt: "Tell us how your family’s move could be made easier.",
    accent: "orange",
  },
  {
    title: "Young professional / first apartment",
    summary:
      "Landing your first apartment is exciting—until deposits, checklists, and timelines pile up. Smooth Moves tracks every step so you can focus on making the place feel like home.",
    prompt: "What would make your first big move unforgettable for the right reasons?",
    accent: "sky",
  },
  {
    title: "College student with friends helping",
    summary:
      "Dorms, roommates, borrowed cars, and endless boxes. Smooth Moves keeps nothing left behind—even the bag still riding in your friend’s trunk.",
    prompt: "How could Smooth Moves take stress out of your campus move?",
    accent: "violet",
  },
  {
    title: "Couple relocating together",
    summary:
      "Combining two households means doubling furniture, bills, and to-do lists. Smooth Moves helps couples decide what to keep, sell, or buy—without the headaches.",
    prompt: "What would make your shared move feel less overwhelming?",
    accent: "emerald",
  },
  {
    title: "Remote worker relocation",
    summary:
      "A new role in a new city brings more than boxes to unpack. Smooth Moves organizes logistics so you can focus on starting strong at work and at home.",
    prompt: "How could Smooth Moves support your career transition?",
    accent: "amber",
  },
  {
    title: "Downsizing or empty nester",
    summary:
      "Sorting through decades of belongings can feel heavy. Smooth Moves helps you prioritize, store, and simplify—so the focus stays on the next chapter.",
    prompt: "What would make your downsizing journey easier?",
    accent: "slate",
  },
];

const accentClasses: Record<Accent, { card: string; badge: string; prompt: string; button: string }> = {
  orange: {
    card: "border-orange-200/70 bg-orange-50/60 dark:border-orange-400/30 dark:bg-orange-500/10",
    badge: "bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-200",
    prompt: "text-orange-600 dark:text-orange-200",
    button:
      "text-orange-600 hover:text-orange-500 dark:text-orange-200 dark:hover:text-orange-100",
  },
  sky: {
    card: "border-sky-200/70 bg-sky-50/60 dark:border-sky-500/30 dark:bg-sky-500/10",
    badge: "bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200",
    prompt: "text-sky-600 dark:text-sky-200",
    button: "text-sky-600 hover:text-sky-500 dark:text-sky-200 dark:hover:text-sky-100",
  },
  violet: {
    card: "border-purple-200/70 bg-purple-50/60 dark:border-purple-500/30 dark:bg-purple-500/10",
    badge: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-200",
    prompt: "text-purple-600 dark:text-purple-200",
    button:
      "text-purple-600 hover:text-purple-500 dark:text-purple-200 dark:hover:text-purple-100",
  },
  emerald: {
    card: "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    prompt: "text-emerald-600 dark:text-emerald-200",
    button:
      "text-emerald-600 hover:text-emerald-500 dark:text-emerald-200 dark:hover:text-emerald-100",
  },
  amber: {
    card: "border-amber-200/70 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10",
    badge: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
    prompt: "text-amber-600 dark:text-amber-200",
    button:
      "text-amber-600 hover:text-amber-500 dark:text-amber-200 dark:hover:text-amber-100",
  },
  slate: {
    card: "border-slate-200/80 bg-slate-50/70 dark:border-slate-600/40 dark:bg-slate-800/70",
    badge: "bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200",
    prompt: "text-slate-700 dark:text-slate-200",
    button:
      "text-slate-700 hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-100",
  },
};

function Testimonials() {
  return (
    <MaxWidthWrapper>
      <section id="testimonials" className="my-20 space-y-12 text-slate-800 dark:text-slate-100">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
            Help us grow
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your move, your story
          </h2>
          <p className="text-base font-medium text-slate-600 dark:text-slate-300">
            Smooth Moves is built for all kinds of relocations. These cards spotlight the journeys we’re
            designing for today—and the stories we hope to share tomorrow. Ready to tell us how we can make your move smoother?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {personas.map((persona) => {
            const styles = accentClasses[persona.accent];
            return (
              <article
                key={persona.title}
                className={`flex h-full flex-col justify-between rounded-3xl border p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${styles.card}`}
              >
                <header className="space-y-3">
                  <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles.badge}`}>
                    Persona spotlight
                  </span>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{persona.title}</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{persona.summary}</p>
                </header>
                <footer className="mt-6 space-y-4">
                  <p className={`text-sm font-semibold ${styles.prompt}`}>{persona.prompt}</p>
                  <a
                    href="#waitlist"
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition ${styles.button}`}
                  >
                    Share your move
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </footer>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            These prompts will be replaced with real stories as our beta community grows. Add your voice and help shape Smooth Moves for every kind of relocation.
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Join the waitlist
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}

export default Testimonials;
