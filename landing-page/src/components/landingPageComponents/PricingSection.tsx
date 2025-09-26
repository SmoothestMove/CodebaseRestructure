"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, MessageCircle, Stars } from "lucide-react";
import MaxWidthWrapper from "../MaxWidthWrapper";

type Tier = {
  name: string;
  timeCommitment: string;
  summary: string;
  bullets: string[];
  cta: string;
  highlight?: string;
  icon: ReactNode;
  accent: string;
};

const tiers: Tier[] = [
  {
    name: "Quick Check",
    timeCommitment: "~5 minutes per week",
    summary: "Give the product a spin, flag anything that feels off, and keep us honest about rough edges.",
    bullets: [
      "Access to every beta feature",
      "Report bugs and blockers as you spot them",
      "Vote on roadmap priorities once a month",
    ],
    cta: "I can do quick check-ins",
    icon: <ClipboardCheck className="h-6 w-6" aria-hidden />,
    accent: "border-slate-200 dark:border-slate-700",
  },
  {
    name: "Feedback Friend",
    timeCommitment: "~15 minutes per week",
    summary: "Share what worked, what felt clunky, and where you still relied on outside tools.",
    bullets: [
      "Everything in Quick Check",
      "Weekly question prompts inside the app",
      "Optional Loom walkthroughs when you have time",
    ],
    cta: "I will share thoughtful feedback",
    highlight: "Most popular",
    icon: <MessageCircle className="h-6 w-6" aria-hidden />,
    accent: "border-orange-400 shadow-lg shadow-orange-500/10",
  },
  {
    name: "Deep Dive",
    timeCommitment: "30+ minutes per week",
    summary: "Partner with us on structured testing sprints and co-design new workflows for release.",
    bullets: [
      "Everything in Feedback Friend",
      "Monthly strategy sessions with the product team",
      "Early access to experimental automations",
    ],
    cta: "Count me in for deep dives",
    icon: <Stars className="h-6 w-6" aria-hidden />,
    accent: "border-emerald-400 shadow-lg shadow-emerald-500/10",
  },
];

function PricingSection() {
  return (
    <section className="bg-[#F8F9FA]" id="waitlist-tiers">
      <MaxWidthWrapper className="py-20">
        <div className="flex flex-col items-center text-center text-slate-700">
          <div className="rounded-full bg-slate-200 px-4 py-2">
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-700">WAITLIST TIERS</p>
          </div>
          <div className="mt-4 max-w-3xl space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Choose your level of involvement - every voice matters.
            </h2>
            <p className="text-lg font-medium text-[#4F5D6D]">
              Smooth Moves is still in beta. Pick the cadence that matches your bandwidth today, and shift up or down whenever life demands it.
            </p>
          </div>
        </div>

        <div className="my-12 grid grid-cols-1 gap-7 md:grid-cols-3 text-[#293A51]">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex h-full flex-col rounded-2xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:text-slate-100 ${tier.accent}`}
            >
              {tier.highlight ? (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {tier.highlight}
                </span>
              ) : null}
              <div className="mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white">
                  {tier.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    {tier.timeCommitment}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed text-[#4F5D6D] dark:text-slate-300">{tier.summary}</p>

              <ul className="mt-6 space-y-3 text-sm font-medium text-[#4F5D6D] dark:text-slate-200">
                {tier.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#waitlist"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white/10"
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto max-w-3xl text-center text-sm font-semibold text-[#4F5D6D] dark:text-slate-300">
          Start light and lean in deeper later - or go all-in from day one. Whatever you choose, you shape the launch.
        </p>
      </MaxWidthWrapper>
    </section>
  );
}

export default PricingSection;
