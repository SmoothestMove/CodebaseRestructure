"use client";

import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";
import ProblemSolution from "@/components/sections/ProblemSolution";
import FeaturesBento from "@/components/sections/FeaturesBento";
import UseCases from "@/components/sections/UseCases";
import HowItWorks from "@/components/sections/HowItWorks";
import Differentiation from "@/components/sections/Differentiation";
import Pricing from "@/components/sections/Pricing";
import SocialProof from "@/components/sections/SocialProof";
import ResourceHub from "@/components/sections/ResourceHub";
import FinalCTA from "@/components/sections/FinalCTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-6 leading-[1.1]"
          >
            Professional Grade Moving Logistics, <br />
            <span className="text-primary-action">Without the Professional Grade Cost</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-secondary mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Track every box, coordinate your team, and stay on budget—all from your phone. Moving made manageable.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="px-10">
              Start Your Move Free
            </Button>
            <Button variant="ghost" size="lg" className="group">
              Watch Demo
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-secondary font-semibold text-sm tracking-wider uppercase"
          >
            Join 10,000+ stress-free movers
          </motion.div>
        </div>
        
        {/* Hero Visual Element (Abstract for now) */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary-action/5 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Problem/Solution Section */}
      <Section 
        id="problem"
        title="Moving Shouldn't Feel Like Chaos"
        subtitle="Common pain points managed with precision. Flip a card to see how Smooth Moves guides you through the stress."
        className="bg-white"
      >
        <ProblemSolution />
      </Section>

      {/* Core Features Bento Grid */}
      <Section
        id="features"
        title="Everything You Need, Nothing You Don't"
        subtitle="Professional-grade tools redesigned for the DIY mover. Powerful features, simplified for your phone."
        className="bg-neutral-bg"
      >
        <FeaturesBento />
      </Section>

      {/* Use Cases Section */}
      <Section
        id="use-cases"
        title="Built for Every Type of Move"
        subtitle="Whether you're moving a studio or a five-bedroom home, Smooth Moves adapts to your needs."
        className="bg-white"
      >
        <UseCases />
      </Section>

      {/* How It Works Section */}
      <Section
        id="how-it-works"
        title="Four Steps to a Stress-Free Move"
        subtitle="Our guided workflow removes the uncertainty from your relocation."
        className="bg-neutral-bg"
      >
        <HowItWorks />
      </Section>

      {/* Differentiation Section */}
      <Section
        id="differentiation"
        title="Why Choose Smooth Moves?"
        subtitle="We've re-engineered the moving experience from the ground up."
        className="bg-white"
      >
        <Differentiation />
      </Section>

      {/* Pricing Section */}
      <Section
        id="pricing"
        title="Simple, Transparent Pricing"
        subtitle="No hidden fees. No complex contracts. Just the tools you need for a better move."
        className="bg-neutral-bg"
      >
        <Pricing />
      </Section>

      {/* Social Proof Section */}
      <Section
        id="testimonials"
        title="Trusted by Stress-Free Movers"
        subtitle="Don't just take our word for it. Here's what our community has to say about their Smooth Moves experience."
        className="bg-white"
      >
        <SocialProof />
      </Section>

      {/* Resource Hub Section */}
      <Section
        id="docs"
        title="Knowledge is Power"
        subtitle="Explore our library of guides, videos, and checklists designed to make you a moving pro."
        className="bg-neutral-bg"
      >
        <ResourceHub />
      </Section>

      {/* Final CTA Section */}
      <Section className="bg-white">
        <FinalCTA />
      </Section>

      <Footer />
    </main>
  );
}
