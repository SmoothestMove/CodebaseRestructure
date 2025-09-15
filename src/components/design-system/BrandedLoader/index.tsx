// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shouldReduceMotion } from '@/lib/animations';

interface BrandedLoaderProps {
  /** Loading variant */
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'boxes' | 'truck';
  /** Size of the loader */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Loading message */
  message?: string;
  /** Show progress percentage */
  progress?: number;
  /** Color scheme */
  color?: 'brand' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** Custom CSS classes */
  className?: string;
  /** Center the loader */
  centered?: boolean;
}

/**
 * BrandedLoader - Custom loading animations aligned with Smooth Moves branding
 */
const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  progress,
  color = 'brand',
  className = '',
  centered = false,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-6 h-6', text: 'text-sm', dot: 'w-1.5 h-1.5', box: 'w-3 h-3' },
    md: { container: 'w-8 h-8', text: 'text-base', dot: 'w-2 h-2', box: 'w-4 h-4' },
    lg: { container: 'w-12 h-12', text: 'text-lg', dot: 'w-3 h-3', box: 'w-6 h-6' },
    xl: { container: 'w-16 h-16', text: 'text-xl', dot: 'w-4 h-4', box: 'w-8 h-8' },
  };

  const config = sizeConfig[size];

  // Color configurations
  const colorStyles = {
    brand: 'text-brand-tertiary dark:text-orange-400',
    primary: 'text-brand-primary dark:text-blue-400',
    secondary: 'text-brand-secondary dark:text-slate-400',
    success: 'text-green-500 dark:text-green-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    error: 'text-red-500 dark:text-red-400',
  };

  // Animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const dotVariants = {
    animate: (index: number) => ({
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: index * 0.2,
        ease: 'easeInOut',
      },
    }),
  };

  const waveVariants = {
    animate: (index: number) => ({
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: index * 0.1,
        ease: 'easeInOut',
      },
    }),
  };

  const boxVariants = {
    animate: (index: number) => ({
      rotateY: [0, 180, 360],
      rotateX: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: index * 0.3,
        ease: 'easeInOut',
      },
    }),
  };

  const truckVariants = {
    animate: {
      x: [0, 20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Render different loader variants
  const renderLoader = () => {
    if (shouldReduceMotion()) {
      return (
        <div className={`${config.container} ${colorStyles[color]} flex items-center justify-center`}>
          <div className="w-2 h-2 bg-current rounded-full opacity-60" />
        </div>
      );
    }

    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={`${config.container} ${colorStyles[color]}`}
            animate={{ rotate: 360, transition: { duration: 1, repeat: Infinity } }}>
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="60 30"
                className="opacity-75"
              />
            </svg>
          </motion.div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`${config.dot} ${colorStyles[color]} bg-current rounded-full`}
                animate={{ scale: [1,1.5,1], opacity: [0.3,1,0.3], transition: { duration: 0.8, repeat: Infinity, delay: index*0.2 } }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${config.container} ${colorStyles[color]} bg-current rounded-full`}
            animate={{ scale: [1,1.2,1], opacity: [0.7,1,0.7], transition: { duration: 1.5, repeat: Infinity } }}
          />
        );

      case 'wave':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className={`w-1 h-4 ${colorStyles[color]} bg-current rounded-full`}
                animate={{ y: [0,-8,0], transition: { duration: 0.6, repeat: Infinity, delay: index*0.1 } }}
              />
            ))}
          </div>
        );

      case 'boxes':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`${config.box} ${colorStyles[color]} bg-current rounded border-2 border-current`}
                animate={{ rotateY: [0,180,360], rotateX: [0,180,360], transition: { duration: 2, repeat: Infinity, delay: index*0.3 } }}
                style={{ transformStyle: 'preserve-3d' }}
              />
            ))}
          </div>
        );

      case 'truck':
        return (
          <motion.div
            className={`${colorStyles[color]} flex items-center space-x-2`}
            animate={{ x: [0,20,0], transition: { duration: 2, repeat: Infinity } }}
          >
            <svg
              className={`${config.container} fill-current`}
              viewBox="0 0 24 24"
            >
              <path d="M3 4a1 1 0 000 2v10a1 1 0 001 1h1.5a2.5 2.5 0 005 0h3a2.5 2.5 0 005 0H20a1 1 0 001-1V6a1 1 0 100-2H3zm5.5 11a.5.5 0 11-1 0 .5.5 0 011 0zm8 0a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-current rounded-full opacity-60"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    transition: {
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    },
                  }}
                />
              ))}
            </div>
          </motion.div>
        );

      default:
        return renderLoader();
    }
  };

  const containerClasses = `
    ${centered ? 'flex flex-col items-center justify-center' : 'inline-flex flex-col items-center'}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {renderLoader()}
      
      {/* Loading message */}
      {message && (
        <motion.p
          className={`mt-3 ${config.text} font-medium text-slate-600 dark:text-slate-400 text-center`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}

      {/* Progress indicator */}
      {typeof progress === 'number' && (
        <motion.div
          className="mt-3 w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className={`h-2 ${colorStyles[color]} bg-current rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <p className={`text-xs ${config.text} text-slate-500 dark:text-slate-400 text-center mt-1`}>
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </div>
  );
};

/**
 * FullScreenLoader - Full screen loading overlay
 */
export const FullScreenLoader: React.FC<Omit<BrandedLoaderProps, 'centered'> & {
  /** Show backdrop */
  backdrop?: boolean;
  /** Backdrop opacity */
  backdropOpacity?: number;
}> = ({
  backdrop = true,
  backdropOpacity = 0.8,
  ...props
}) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {backdrop && (
        <div
          className="absolute inset-0 bg-white dark:bg-slate-900"
          style={{ opacity: backdropOpacity }}
        />
      )}
      <div className="relative z-10">
        <BrandedLoader {...props} centered />
      </div>
    </motion.div>
  </AnimatePresence>
);

/**
 * InlineLoader - Smaller inline loader for buttons and small spaces
 */
export const InlineLoader: React.FC<Pick<BrandedLoaderProps, 'variant' | 'color'>> = ({
  variant = 'spinner',
  color = 'brand',
}) => (
  <BrandedLoader
    variant={variant}
    size="sm"
    color={color}
    className="inline-flex"
  />
);

export default BrandedLoader;

