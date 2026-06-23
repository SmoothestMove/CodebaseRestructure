import { motion } from "framer-motion";
import { 
  QrCode, 
  Users, 
  Truck, 
  CheckCircle2, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "QR Code Inventory System",
    description: "Unique QR labels for every box. Scan to log contents, track status, and locate items instantly.",
    icon: QrCode,
    size: "large",
    color: "bg-primary/5 text-primary",
  },
  {
    title: "Real-Time Collaboration",
    description: "Share your move code. Your family sees every update in real-time—no more text chains.",
    icon: Users,
    size: "medium",
    color: "bg-primary-action/5 text-primary-action",
  },
  {
    title: "Strategic Truck Loading",
    description: "Visual truck layout shows exactly where each box goes. Unload in perfect order.",
    icon: Truck,
    size: "medium",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Status Workflow",
    description: "Guide every box through Prep → Packed → Loaded → Delivered → Unpacked.",
    icon: CheckCircle2,
    size: "small",
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Financial Navigator",
    description: "Scan receipts with OCR. Track spending by category. Get alerts before you overspend.",
    icon: BarChart3,
    size: "small",
    color: "bg-primary/5 text-primary",
  },
  {
    title: "Move Planner",
    description: "Dynamic timeline adapts to your move date. Never miss a critical task.",
    icon: Calendar,
    size: "medium",
    color: "bg-primary-action/5 text-primary-action",
  },
  {
    title: "In-App Chat",
    description: "Channel-based team chat. Link boxes, create polls, and keep all communication in one place.",
    icon: MessageSquare,
    size: "small",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Smart Notifications",
    description: "Timely alerts for milestones, collaborator actions, and budget thresholds.",
    icon: Bell,
    size: "small",
    color: "bg-secondary/10 text-secondary",
  },
];

export default function FeaturesBento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[250px]">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "group relative p-8 rounded-[32px] overflow-hidden border border-neutral-bg bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-end",
            feature.size === "large" ? "md:col-span-2 md:row-span-2" : "",
            feature.size === "medium" ? "md:col-span-2 md:row-span-1" : "",
            feature.size === "small" ? "md:col-span-1 md:row-span-1" : ""
          )}
        >
          {/* Subtle background decoration */}
          <div className={cn(
            "absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 rounded-full blur-[80px] -z-10 group-hover:scale-125 transition-transform duration-500",
            feature.color.split(' ')[0]
          )} />

          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6",
            feature.color
          )}>
            <feature.icon className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-primary mb-2">
            {feature.title}
          </h3>
          <p className="text-secondary text-sm leading-relaxed">
            {feature.description}
          </p>

          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="text-primary text-lg">→</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
