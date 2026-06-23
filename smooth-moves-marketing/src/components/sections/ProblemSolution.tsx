"use client";

import { motion } from "framer-motion";
import { PackageX, Coins, Users2, ShieldCheck, PieChart, BellRing } from "lucide-react";

const pairs = [
  {
    problem: {
      title: "Lost boxes and items",
      desc: "Digging through endless boxes trying to remember if the coffee maker is in 'Kitchen 1' or 'Storage A'.",
      icon: PackageX,
    },
    solution: {
      title: "QR Precision Tracking",
      desc: "Every item logged. Every box labeled. One scan tells you exactly what's inside and where it goes.",
      icon: ShieldCheck,
    },
  },
  {
    problem: {
      title: "Budget overruns",
      desc: "Hidden costs and forgotten receipts leading to that sinking feeling when the credit card bill arrives.",
      icon: Coins,
    },
    solution: {
      title: "Financial Navigator",
      desc: "Real-time expense tracking with OCR receipt scanning. Get alerted before you hit your limits.",
      icon: PieChart,
    },
  },
  {
    problem: {
      title: "Team coordination chaos",
      desc: "Endless text threads and confusion about who is loading what and when the truck actually leaves.",
      icon: Users2,
    },
    solution: {
      title: "Command Center Sync",
      desc: "Live collaborator feeds. Centralized task lists. Everyone stays aligned with zero communication overhead.",
      icon: BellRing,
    },
  },
];

export default function ProblemSolution() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pairs.map((pair, index) => (
        <motion.div
          key={pair.problem.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative h-[400px] perspective-1000 group cursor-pointer"
        >
          <div className="relative w-full h-full transition-all duration-700 preserve-3d group-hover:rotate-y-180">
            {/* Front: Problem */}
            <div className="absolute inset-0 backface-hidden bg-neutral-bg/30 border border-neutral-bg rounded-[32px] p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <pair.problem.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">{pair.problem.title}</h3>
              <p className="text-secondary leading-relaxed">{pair.problem.desc}</p>
              <div className="mt-8 text-sm font-bold text-primary-action uppercase tracking-widest animate-pulse">
                See Solution
              </div>
            </div>

            {/* Back: Solution */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary rounded-[32px] p-8 flex flex-col justify-center items-center text-center text-white">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <pair.solution.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{pair.solution.title}</h3>
              <p className="text-white/80 leading-relaxed">{pair.solution.desc}</p>
              <div className="mt-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                <ShieldCheck className="text-primary-action" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
