import { Boxes, Check } from "lucide-react";
import WaitlistForm from "../WaitlistForm";

const perks = [
  "Moving Day Command Center checklist + Notion template",
  "Weekly progress notes and feature votes",
  "Access to the private Smooth Moves Slack",
];

function FinalPush() {
  return (
    <section className="bg-gradient-to-b from-white via-orange-50 to-white px-5 pb-32 pt-40 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950" id="waitlist-cta">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 rounded-3xl bg-white/80 px-8 py-12 shadow-xl backdrop-blur md:flex-row md:items-center md:px-12 dark:bg-slate-900/80">
        <div className="space-y-6 md:w-1/2">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-4 py-2 text-sm font-semibold text-orange-600 dark:bg-orange-500/20 dark:text-orange-200">
            <Boxes className="h-4 w-4" aria-hidden />
            Moving day without chaos
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
            Moving day does not have to be chaos.
          </h2>
          <p className="text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-200">
            Smooth Moves keeps your timeline, inventory, budget, and MARVIN assistant in lockstep from the first box to the last check mark. Join the beta waitlist to co-create the launch with us.
          </p>
          <ul className="space-y-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" aria-hidden />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:w-1/2 rounded-2xl bg-white/90 p-6 shadow-lg dark:bg-slate-950/80">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Reserve your spot:</h3>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            Invites go out weekly. Share your email to get the beta walkthrough and first crack at new workflows.
          </p>
          <div className="mt-6">
            <WaitlistForm orientation="vertical" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalPush;
