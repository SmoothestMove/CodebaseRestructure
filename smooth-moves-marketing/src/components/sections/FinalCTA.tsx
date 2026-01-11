"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <div className="relative overflow-hidden bg-primary rounded-[60px] py-24 px-8 md:px-16 text-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-action/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
          Ready to Make Your Next Move <span className="text-primary-action">Actually Smooth?</span>
        </h2>
        <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of families who have replaced moving chaos with professional precision. Start your move inventory in under 5 minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button size="lg" className="px-12 py-5 text-xl h-auto shadow-2xl shadow-primary-action/40">
            Get Started for Free
          </Button>
          <div className="text-white/60 text-sm font-medium">
            No credit card required. <br />
            Unlimited scans on free tier.
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-10 opacity-30 group">
          {/* Abstract partner/trust logos scale-on-hover */}
          {[1,2,3,4].map(i => (
            <div key={i} className="h-8 w-24 bg-white rounded transition-all duration-500 hover:opacity-100 cursor-default" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
