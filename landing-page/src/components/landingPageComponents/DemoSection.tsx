import Image from "next/image";

function DemoSection() {
  return (
    <section className="bg-white/80 py-20 transition-colors dark:bg-slate-900/40" id="story">
      <div className="mx-auto flex w-[90%] max-w-3xl flex-col items-center text-gray-700 dark:text-slate-200">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200">
          My Story
        </span>
        <h2 className="mt-6 text-center text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
          Why I am building Smooth Moves
        </h2>
        <p className="mt-3 max-w-prose text-center text-base font-semibold text-slate-600 dark:text-slate-300">
          I am Jay, the developer and founder behind Smooth Moves. This product started as a survival plan for my own family.
        </p>

        <div className="relative my-10 h-28 w-28 overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-700">
          <Image
            src="/assets/DevCariImage.png"
            alt="Smooth Moves founder portrait"
            fill
            sizes="112px"
            priority={false}
            className="object-cover"
          />
        </div>

        <div className="space-y-6 text-center text-lg font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            A sudden relocation left my family juggling sticky notes, spreadsheets, and frantic phone calls. We could not afford movers, and there was no software built for the way real households coordinate a move.
          </p>
          <p>
            Smooth Moves is the command center I wish we had: a single place to plan timelines, track boxes, control the budget, and lean on MARVIN when the to-do list feels endless. I am sharing the beta so other families, renters, and crews can shape it with me.
          </p>
        </div>

        <a
          href="#waitlist"
          className="mt-10 inline-flex items-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-white dark:hover:text-white"
        >
          Join the waitlist to help build Smooth Moves
        </a>
      </div>
    </section>
  );
}

export default DemoSection;
