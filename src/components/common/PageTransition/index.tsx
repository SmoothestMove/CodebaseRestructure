// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransitions, getPageTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Custom hook to track previous location for transition direction
const usePreviousLocation = () => {
  const location = useLocation();
  const prevLocationRef = React.useRef<string>();
  
  React.useEffect(() => {
    prevLocationRef.current = location.pathname;
  });
  
  return prevLocationRef.current;
};

/**
 * PageTransition wrapper component for smooth page transitions
 * Automatically selects appropriate transition based on route hierarchy
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
