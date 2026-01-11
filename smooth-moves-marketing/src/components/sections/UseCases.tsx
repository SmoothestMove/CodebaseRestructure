"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users2, Home, Landmark, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "family",
    title: "Family Move",
    icon: Users2,
    desc: "Coordinate kids, pets, and a houseful of belongings across town or across the country.",
    features: [
      "Color-coded boxes per family member",
      "Shared task lists and budget tracking",
      "Real-time updates keep everyone aligned",
    ],
    image: "/images/use-case-family.jpg", // Placeholder
  },
  {
    id: "downsizing",
    title: "Downsizing",
    icon: Landmark,
    desc: "Simplify the process with clear organization and collaborative decision-making for senior relocations or estate planning.",
    features: [
      "Detailed inventory for estate planning",
      "Easy decluttering workflow",
      "Family members can join remotely",
    ],
    image: "/images/use-case-downsizing.jpg", // Placeholder
  },
  {
    id: "first-time",
    title: "First-Time Mover",
    icon: Home,
    desc: "Step-by-step guidance removes the guesswork from your first big move. From dorm to your first apartment.",
    features: [
      "Pre-built timeline with common tasks",
      "Budget templates and cost estimates",
      "Resource hub with tutorials and links",
    ],
    image: "/images/use-case-first-time.jpg", // Placeholder
  },
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* Tab Selectors */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "group p-6 rounded-2xl text-left transition-all duration-300 border-2",
              activeTab === tab.id
                ? "bg-white border-primary shadow-xl"
                : "bg-transparent border-transparent hover:bg-white/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                activeTab === tab.id ? "bg-primary text-white" : "bg-primary/5 text-primary group-hover:bg-primary/10"
              )}>
                <tab.icon size={24} />
              </div>
              <div>
                <h4 className={cn(
                  "font-bold text-lg",
                  activeTab === tab.id ? "text-primary" : "text-secondary"
                )}>
                  {tab.title}
                </h4>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full lg:w-2/3 bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 min-h-[500px] flex items-center">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <h3 className="text-3xl font-bold text-primary mb-6">{tab.title}</h3>
                  <p className="text-secondary text-lg mb-8 leading-relaxed">
                    {tab.desc}
                  </p>
                  <ul className="space-y-4">
                    {tab.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="text-primary-action shrink-0 mt-1" size={20} />
                        <span className="text-secondary font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-10 btn-primary px-8">
                    Plan Your {tab.title}
                  </button>
                </div>
                <div className="relative aspect-[4/5] bg-neutral-bg rounded-[32px] overflow-hidden group">
                  {/* Decorative element since we don't have real images yet */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                    <tab.icon size={80} className="text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-primary">
                    Recommended
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
