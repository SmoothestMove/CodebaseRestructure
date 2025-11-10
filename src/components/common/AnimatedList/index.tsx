import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VARIANTS, shouldReduceMotion } from '@/lib/animations';

/**
 * @interface AnimatedListProps
 * @description Defines the properties for the AnimatedList component.
 */
interface AnimatedListProps {
  /** Children components to animate. */
  children: React.ReactNode;
  /** CSS classes for the container. */
  className?: string;
  /** Container element type. */
  as?: 'div' | 'ul' | 'ol' | 'section';
  /** Stagger delay between items in seconds. */
  staggerDelay?: number;
  /** Animation variant to use. */
  variant?: 'fadeUp' | 'slideIn' | 'scale';
  /** Layout ID for shared element transitions. */
  layoutId?: string;
}

/**
 * @interface AnimatedListItemProps
 * @description Defines the properties for the AnimatedListItem component.
 */
interface AnimatedListItemProps {
  /** Children content. */
  children: React.ReactNode;
  /** Item index for stagger calculation. */
  index: number;
  /** CSS classes for the item. */
  className?: string;
  /** Item element type. */
  as?: 'div' | 'li' | 'article';
  /** Animation variant to use. */
  variant?: 'fadeUp' | 'slideIn' | 'scale';
  /** Layout ID for shared element transitions. */
  layoutId?: string;
  /** Custom exit animation. */
  exit?: any;
}

// Custom variants for different list item animations
const listItemVariants = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  },
  slideIn: {
    initial: { opacity: 0, x: -30, scale: 0.95 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: {
      opacity: 0,
      x: 30,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.6, 1],
      },
    },
  },
};

/**
 * A container component that animates a list of items with a staggered effect.
 * @param {AnimatedListProps} props - The properties for the AnimatedList component.
 * @returns {JSX.Element} The rendered AnimatedList component.
 */
const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  as: Component = 'div',
  variant = 'fadeUp',
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
 * An individual list item component that animates as part of an AnimatedList.
 * @param {AnimatedListItemProps} props - The properties for the AnimatedListItem component.
 * @returns {JSX.Element} The rendered AnimatedListItem component.
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

  const variants = listItemVariants[variant];

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit={exit || "exit"}
      custom={index}
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
 * A pre-built animated grid component for displaying items in a grid layout.
 * @param {object} props - The properties for the AnimatedGrid component.
 * @param {React.ReactNode} props.children - The child elements to be rendered in the grid.
 * @param {string} [props.className] - Additional CSS classes for the grid container.
 * @param {1 | 2 | 3 | 4} [props.columns=2] - The number of columns in the grid.
 * @param {'sm' | 'md' | 'lg'} [props.gap='md'] - The gap between grid items.
 * @param {'fadeUp' | 'slideIn' | 'scale'} [props.variant='fadeUp'] - The animation variant to use.
 * @returns {JSX.Element} The rendered AnimatedGrid component.
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
      variant={variant}
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