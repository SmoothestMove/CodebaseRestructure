"use client";

import { motion } from "framer-motion";
import { QrCode, Monitor, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Set Up Your Move",
    desc: "Create owners, define rooms, and print your colorful QR labels. Every box gets a unique identity.",
    icon: QrCode,
    visual: "Person printing QR sheet",
  },
  {
    title: "Pack & Scan",
    desc: "Attach labels, then use our app to scan and log contents. You'll never wonder what's inside again.",
    icon: Monitor,
    visual: "Phone scanning box QR",
  },
  {
    title: "Load & Track",
    desc: "Log truck position as you load. Our visual truck layout shows you exactly where each zone is.",
    icon: Truck,
    visual: "Truck diagram with zones",
  },
  {
    title: "Unload & Settle",
    desc: "Quick-scan to mark items as delivered. Track your unpacking progress in real-time.",
    icon: CheckCircle2,
    visual: "Checkmarks on box list",
  },
];

export default function HowItWorks() {
  return (
    <div className="relative">
      {/* Connector Line (Desktop) */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary/5 -translate-y-1/2 z-0">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-full bg-primary-action"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon Bubble */}
            <div className="relative mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-full bg-white border-4 border-primary shadow-xl flex items-center justify-center text-primary relative z-10"
              >
                <step.icon size={32} />
              </motion.div>
              {/* Number Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-action text-white font-bold flex items-center justify-center text-sm z-20 shadow-lg">
                {index + 1}
              </div>
            </div>

            <h4 className="text-xl font-bold text-primary mb-3">{step.title}</h4>
            <p className="text-secondary text-sm leading-relaxed mb-6 px-4">
              {step.desc}
            </p>

            {/* Visual Placeholder */}
            <div className="w-full aspect-square bg-white rounded-3xl border border-neutral-bg flex items-center justify-center p-6 group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="text-primary/10 font-bold text-xs uppercase tracking-tighter group-hover:text-primary-action/30 transition-colors">
                {step.visual}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
