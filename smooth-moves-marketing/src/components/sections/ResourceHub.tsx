"use client";

import { motion } from "framer-motion";
import { BookOpen, PlayCircle, FileText, HelpCircle } from "lucide-react";

const resources = [
  {
    title: "Quick Start Guide",
    desc: "From app install to your first box scan in under 5 minutes.",
    icon: BookOpen,
    tag: "Guide",
  },
  {
    title: "Mastering Labels",
    desc: "Best practices for QR placement and inventory logging.",
    icon: PlayCircle,
    tag: "Video",
  },
  {
    title: "Moving Checklist",
    desc: "A comprehensive 8-week timeline for a stress-free transition.",
    icon: FileText,
    tag: "PDF",
  },
  {
    title: "FAQ & Support",
    desc: "Got questions? Our support team and community have answers.",
    icon: HelpCircle,
    tag: "Help",
  },
];

export default function ResourceHub() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {resources.map((resource, index) => (
        <motion.div
          key={resource.title}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group p-8 rounded-[32px] bg-white border border-neutral-bg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-neutral-bg/50 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <resource.icon size={28} />
          </div>
          
          <div className="inline-block px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            {resource.tag}
          </div>

          <h4 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-action transition-colors">
            {resource.title}
          </h4>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            {resource.desc}
          </p>

          <button className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
            Explore
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      ))}
    </div>
  );
}
