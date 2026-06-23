"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Essentials",
    price: "0",
    description: "Perfect for students or local studio apartment moves.",
    features: [
      "Basic Inventory Tracking",
      "Up to 2 Collaborators",
      "Manual Status Updates",
      "Single Device Login",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Complete",
    price: "29",
    description: "The gold standard for multi-room homes and families.",
    features: [
      "Unlimited QR Inventory",
      "Unlimited Collaborators",
      "Budget Tracking with OCR",
      "Truck Loading Visualizer",
      "In-App Team Chat",
    ],
    cta: "Go Complete",
    popular: true,
  },
  {
    name: "Ultimate",
    price: "79",
    description: "Concierge-level logistics for cross-country relocations.",
    features: [
      "Comprehensive Move Planner",
      "Priority Notification Sync",
      "Dedicated Move Consultant",
      "Packing Supply Calculator",
      "Extended Data Export",
    ],
    cta: "Go Ultimate",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      {tiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "relative p-8 rounded-[40px] border-2 transition-all duration-300",
            tier.popular 
              ? "bg-primary border-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
              : "bg-white border-neutral-bg hover:border-primary/30"
          )}
        >
          {tier.popular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-action text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg">
              MOST POPULAR
            </div>
          )}

          <div className="mb-8">
            <h3 className={cn(
              "text-2xl font-bold mb-2",
              tier.popular ? "text-white" : "text-primary"
            )}>
              {tier.name}
            </h3>
            <p className={cn(
              "text-sm leading-relaxed",
              tier.popular ? "text-white/70" : "text-secondary"
            )}>
              {tier.description}
            </p>
          </div>

          <div className="mb-8 flex items-baseline gap-1">
            <span className={cn(
              "text-5xl font-bold tracking-tight",
              tier.popular ? "text-white" : "text-primary"
            )}>
              ${tier.price}
            </span>
            <span className={cn(
              "text-lg",
              tier.popular ? "text-white/60" : "text-secondary"
            )}>
              /move
            </span>
          </div>

          <ul className="mb-10 space-y-4">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className={cn(
                  "shrink-0 mt-1",
                  tier.popular ? "text-primary-action" : "text-primary"
                )} size={20} />
                <span className={cn(
                  "text-sm font-medium",
                  tier.popular ? "text-white/90" : "text-secondary"
                )}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Button 
            className="w-full" 
            variant={tier.popular ? "primary" : "outline"}
          >
            {tier.cta}
          </Button>

          {tier.name === "Complete" && (
            <p className="mt-4 text-center text-xs text-white/40 italic">
              *One-time payment per move
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
