"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Family of 4, Local Move",
    content: "Smooth Moves turned our multi-room chaos into a structured project. The QR system alone saved us hours of digging through boxes on the other end. Best $29 I've spent.",
    stars: 5,
    avatar: "S",
  },
  {
    name: "Mark Thompson",
    role: "Studio Apartment",
    content: "The free tier was exactly what I needed. Simple, effective, and the truck loading visualizer meant I didn't have to play Tetris with my couch for three hours.",
    stars: 5,
    avatar: "M",
  },
  {
    name: "Elena Rodriguez",
    role: "Cross-Country Relocation",
    content: "The Ultimate plan was worth every penny. Having a dedicated move consultant to troubleshoot label issues and coordinate my team's timeline kept me sane.",
    stars: 5,
    avatar: "E",
  },
];

export default function SocialProof() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[40px] p-12 md:p-16 border border-neutral-bg shadow-2xl shadow-primary/5 text-center"
        >
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(testimonials[index].stars)].map((_, i) => (
              <Star key={i} className="text-primary-action fill-primary-action" size={20} />
            ))}
          </div>

          <blockquote className="text-2xl md:text-3xl font-medium text-primary mb-10 leading-relaxed italic">
            "{testimonials[index].content}"
          </blockquote>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mb-4">
              {testimonials[index].avatar}
            </div>
            <h4 className="text-xl font-bold text-primary">{testimonials[index].name}</h4>
            <p className="text-secondary text-sm font-medium">{testimonials[index].role}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        <button 
          onClick={prev}
          className="p-4 rounded-full border border-neutral-bg hover:bg-primary hover:text-white transition-all shadow-lg bg-white"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="p-4 rounded-full border border-neutral-bg hover:bg-primary hover:text-white transition-all shadow-lg bg-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-primary-action" : "w-2 bg-neutral-bg"
            )}
          />
        ))}
      </div>
    </div>
  );
}
