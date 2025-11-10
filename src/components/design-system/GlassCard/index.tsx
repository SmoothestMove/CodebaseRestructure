import React from 'react';
import { motion } from 'framer-motion';
import { shouldReduceMotion } from '@/lib/animations';

/**
 * @interface GlassCardProps
 * @description Defines the properties for the GlassCard component.
 */
interface GlassCardProps {
  /** The content to be displayed inside the card. */
  children: React.ReactNode;
  /** The intensity of the glass effect. */
  intensity?: number;
  /** The strength of the blur effect. */
  blur?: number;
  /** The visual variant of the card. */
  variant?: 'subtle' | 'medium' | 'strong' | 'frosted';
  /** The style of the border. */
  border?: 'none' | 'subtle' | 'visible';
  /** The intensity of the shadow. */
  shadow?: 'none' | 'subtle' | 'medium' | 'strong';
  /** Optional additional CSS classes to apply to the card. */
  className?: string;
  /** An optional callback function that is called when the card is clicked. */
  onClick?: () => void;
  /** Whether to enable hover effects. */
  hover?: boolean;
  /** Whether to enable interactive scaling. */
  interactive?: boolean;
  /** The direction of the gradient overlay. */
  gradientDirection?: 'top' | 'bottom' | 'left' | 'right' | 'radial';
}

/**
 * A modern glassmorphism card component that creates beautiful glass-like effects
 * with backdrop blur and transparency.
 * @param {GlassCardProps} props - The properties for the GlassCard component.
 * @returns {JSX.Element} The rendered GlassCard component.
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 15,
  blur = 16,
  variant = 'medium',
  border = 'subtle',
  shadow = 'medium',
  className = '',
  onClick,
  hover = false,
  interactive = false,
  gradientDirection = 'top',
}) => {
  // Variant configurations
  const variants = {
    subtle: {
      background: `rgba(255, 255, 255, ${intensity * 0.005})`,
      darkBackground: `rgba(15, 23, 42, ${intensity * 0.006})`,
      blur: Math.max(8, blur * 0.5),
    },
    medium: {
      background: `rgba(255, 255, 255, ${intensity * 0.01})`,
      darkBackground: `rgba(15, 23, 42, ${intensity * 0.012})`,
      blur: blur,
    },
    strong: {
      background: `rgba(255, 255, 255, ${intensity * 0.015})`,
      darkBackground: `rgba(15, 23, 42, ${intensity * 0.018})`,
      blur: blur * 1.5,
    },
    frosted: {
      background: `rgba(255, 255, 255, ${intensity * 0.02})`,
      darkBackground: `rgba(15, 23, 42, ${intensity * 0.025})`,
      blur: blur * 2,
    },
  };

  const variantConfig = variants[variant];

  // Border styles
  const borderStyles = {
    none: '',
    subtle: 'border border-white/10 dark:border-white/5',
    visible: 'border border-white/20 dark:border-white/10',
  };

  // Shadow styles
  const shadowStyles = {
    none: '',
    subtle: 'shadow-sm',
    medium: 'shadow-lg shadow-black/5 dark:shadow-black/20',
    strong: 'shadow-xl shadow-black/10 dark:shadow-black/30',
  };

  // Gradient overlay styles
  const gradientOverlays = {
    top: 'bg-gradient-to-b from-white/5 to-transparent dark:from-white/3 dark:to-transparent',
    bottom: 'bg-gradient-to-t from-white/5 to-transparent dark:from-white/3 dark:to-transparent',
    left: 'bg-gradient-to-r from-white/5 to-transparent dark:from-white/3 dark:to-transparent',
    right: 'bg-gradient-to-l from-white/5 to-transparent dark:from-white/3 dark:to-transparent',
    radial: 'bg-radial-gradient from-white/5 via-transparent to-transparent dark:from-white/3',
  };

  // Animation variants
  const cardVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.02, 
      rotateY: hover ? 2 : 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }
    },
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={`
        relative overflow-hidden rounded-xl backdrop-blur-sm
        ${borderStyles[border]}
        ${shadowStyles[shadow]}
        ${onClick ? 'cursor-pointer' : ''}
        ${interactive ? 'transform-gpu' : ''}
        ${className}
      `}
      style={{
        background: `${variantConfig.background}`,
        backdropFilter: `blur(${variantConfig.blur}px) saturate(1.5)`,
        WebkitBackdropFilter: `blur(${variantConfig.blur}px) saturate(1.5)`,
        // Dark mode background
        backgroundImage: `
          linear-gradient(
            135deg,
            ${variantConfig.background} 0%,
            ${variantConfig.background} 100%
          )
        `,
      }}
      variants={shouldReduceMotion() ? undefined : cardVariants}
      initial="initial"
      whileHover={hover ? "hover" : undefined}
      whileTap={onClick && interactive ? "tap" : undefined}
      onClick={onClick}
    >
      {/* Dark mode overlay */}
      <div 
        className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-200"
        style={{
          background: variantConfig.darkBackground,
        }}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${gradientOverlays[gradientDirection]}`} />

      {/* Subtle inner border highlight */}
      <div className="absolute inset-0 rounded-xl border border-white/5 dark:border-white/3" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover light effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 rounded-xl"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Component>
  );
};

/**
 * A glass section for larger content areas.
 * @param {Omit<GlassCardProps, 'variant'> & { title?: string; subtitle?: string; }} props - The properties for the GlassSection component.
 * @returns {JSX.Element} The rendered GlassSection component.
 */
export const GlassSection: React.FC<Omit<GlassCardProps, 'variant'> & {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
}> = ({
  children,
  title,
  subtitle,
  className = '',
  ...props
}) => (
  <GlassCard
    variant="subtle"
    className={`p-6 ${className}`}
    {...props}
  >
    {(title || subtitle) && (
      <div className="mb-4">
        {title && (
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    )}
    {children}
  </GlassCard>
);

/**
 * An interactive glass button.
 * @param {Omit<GlassCardProps, 'onClick'> & { children: React.ReactNode; onClick: () => void; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; }} props - The properties for the GlassButton component.
 * @returns {JSX.Element} The rendered GlassButton component.
 */
export const GlassButton: React.FC<Omit<GlassCardProps, 'onClick'> & {
  /** Button text */
  children: React.ReactNode;
  /** Click handler */
  onClick: () => void;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
}> = ({
  children,
  onClick,
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <GlassCard
      variant="medium"
      hover={!disabled}
      interactive={!disabled}
      onClick={disabled ? undefined : onClick}
      className={`
        ${sizeStyles[size]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-medium text-slate-900 dark:text-white
        ${className}
      `}
      {...props}
    >
      {children}
    </GlassCard>
  );
};

export default GlassCard;