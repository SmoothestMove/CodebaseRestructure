import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransitions, getPageTransition } from '@/lib/animations';

/**
 * @interface PageTransitionProps
 * @description Defines the properties for the PageTransition component.
 */
interface PageTransitionProps {
  /** The content to be rendered within the transition. */
  children: React.ReactNode;
  /** Optional additional CSS classes to apply to the transition container. */
  className?: string;
}

/**
 * A custom hook that tracks the previous location for transition direction.
 * @returns {string | undefined} The previous location's pathname.
 */
const usePreviousLocation = () => {
  const location = useLocation();
  const prevLocationRef = React.useRef<string>();
  
  React.useEffect(() => {
    prevLocationRef.current = location.pathname;
  });
  
  return prevLocationRef.current;
};

/**
 * A wrapper component that provides smooth page transitions.
 * It automatically selects an appropriate transition based on the route hierarchy.
 * @param {PageTransitionProps} props - The properties for the PageTransition component.
 * @returns {JSX.Element} The rendered PageTransition component.
 */
const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const location = useLocation();
  const previousPath = usePreviousLocation();
  
  // Get the appropriate transition for current route
  const transitionType = getPageTransition(location.pathname, previousPath);
  const variants = pageTransitions[transitionType];
  
  return (
    <AnimatePresence 
      mode="wait" 
      initial={false}
      onExitComplete={() => {
        // Scroll to top on page change for better UX
        window.scrollTo(0, 0);
      }}
    >
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={className}
        // Performance optimizations
        style={{
          // Use GPU acceleration for transforms
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;