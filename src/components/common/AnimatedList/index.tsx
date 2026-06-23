import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shouldReduceMotion } from '@/lib/animations';

interface AnimatedListProps {
  /** Children components to animate */
  children: React.ReactNode;
  /** CSS classes for the container */
  className?: string;
  /** Container element type */
  as?: 'div' | 'ul' | 'ol' | 'section';
  /** Stagger delay between items (in seconds) */
  staggerDelay?: number;
  /** Layout ID for shared element transitions */
  layoutId?: string;
}

interface AnimatedListItemProps {
  /** Children content */
  children: React.ReactNode;
  /** Item index for stagger calculation */
  index: number;
  /** CSS classes for the item */
  className?: string;
  /** Item element type */
  as?: 'div' | 'li' | 'article';
  /** Animation variant to use */
  variant?: 'fadeUp' | 'slideIn' | 'scale';
  /** Layout ID for shared element transitions */
  layoutId?: string;
  /** Custom exit animation */
  exit?: any;
}

// Custom variants for different list item animations
// simple per-item animations are computed inline

/**
 * AnimatedList - Container component for staggered list animations
 */
const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  as: Component = 'div',
  layoutId,
}) => {
  // Skip animations if user prefers reduced motion
  if (shouldReduceMotion()) {
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      layoutId={layoutId}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {children}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * AnimatedListItem - Individual item component with staggered animation
 */
export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  className = '',
  as: Component = 'div',
  variant = 'fadeUp',
  layoutId,
  exit,
}) => {
  // Skip animations if user prefers reduced motion
  if (shouldReduceMotion()) {
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }

  // Compute simple animation per item to avoid Variants typing issues
  const initial = variant === 'slideIn'
    ? { opacity: 0, x: -30, scale: 0.95 }
    : variant === 'scale'
      ? { opacity: 0, scale: 0.8 }
      : { opacity: 0, y: 20 };
  const animate = variant === 'slideIn'
    ? { opacity: 1, x: 0, scale: 1, transition: { duration: 0.25, delay: index * 0.05 } }
    : variant === 'scale'
      ? { opacity: 1, scale: 1, transition: { duration: 0.3, delay: index * 0.05 } }
      : { opacity: 1, y: 0, transition: { duration: 0.3, delay: index * 0.05 } };
  const exitAnim = variant === 'slideIn'
    ? { opacity: 0, x: 30, scale: 0.95, transition: { duration: 0.2 } }
    : variant === 'scale'
      ? { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
      : { opacity: 0, y: -10, transition: { duration: 0.2 } };

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit || exitAnim}
      layoutId={layoutId}
      // Performance optimizations
      style={{
        transformOrigin: 'center top',
        willChange: 'transform, opacity',
      }}
      // Layout animation for reordering
      layout
      // Improve performance by using GPU acceleration
      onAnimationComplete={() => {
        // Remove willChange after animation to free resources
        const element = document.getElementById(layoutId || '');
        if (element) {
          element.style.willChange = 'auto';
        }
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Pre-built animated grid component for cards
 */
export const AnimatedGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  variant?: 'fadeUp' | 'slideIn' | 'scale';
}> = ({ 
  children, 
  className = '', 
  columns = 2, 
  gap = 'md',
  variant = 'fadeUp'
}) => {
  const gridStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapStyles = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <AnimatedList 
      className={`grid ${gridStyles[columns]} ${gapStyles[gap]} ${className}`}
    >
      {React.Children.map(children, (child, index) => (
        <AnimatedListItem
          key={index}
          index={index}
          variant={variant}
          className="w-full"
        >
          {child}
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
};

export default AnimatedList;




