import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
}

export function Section({ children, className, id, title, subtitle }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold text-primary mb-4"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-secondary max-w-2xl mx-auto"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
