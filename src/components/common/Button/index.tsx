import React from 'react';
import { motion } from 'framer-motion';
import { IconCheck } from '@/lib/config/constants';
import { VARIANTS, shouldReduceMotion } from '@/lib/animations'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  /**
   * @warning When using the 'icon' size, you MUST provide an `ariaLabel`
   * if there are no visible children to ensure accessibility.
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isSuccess?: boolean; 
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode; 
  showSuccessIcon?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  showSuccessIcon = false,
  leftIcon,
  rightIcon,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none touch-manipulation";
  
  const sizeStyles = {
    sm: "px-4 py-3 text-xs min-h-[40px]",
    md: "px-5 py-3 text-sm min-h-[44px]",
    lg: "px-7 py-4 text-base min-h-[48px]",
    icon: "p-3 min-w-[44px] min-h-[44px]",
  };

  const variantStyles = {
    primary: "bg-accent hover:bg-accent-hover hover:border-accent-hover text-background border border-slate-300 dark:border-slate-600 focus:ring-accent/50 shadow-lg shadow-accent/20 transition-all duration-200",
    secondary: "bg-surface hover:bg-surface-elevated hover:border-accent text-text-main border border-slate-300 dark:border-slate-600 focus:ring-accent/30 transition-all duration-200",
    danger: "bg-semantic-error hover:opacity-90 text-white border border-slate-300 dark:border-slate-600 focus:ring-semantic-error/50 shadow-md transition-all duration-200",
    success: "bg-semantic-success hover:opacity-90 text-white border border-slate-300 dark:border-slate-600 focus:ring-semantic-success/50 shadow-md transition-all duration-200",
    warning: "bg-semantic-warning hover:opacity-90 text-background border border-slate-300 dark:border-slate-600 focus:ring-semantic-warning/50 shadow-md transition-all duration-200",
    ghost: "bg-transparent hover:bg-accent/10 text-accent border border-transparent hover:border-accent/30 focus:ring-accent/30 transition-all duration-200",
  };

  const loadingStyles = isLoading ? "opacity-75 cursor-not-allowed" : "";
  const currentVariant = isSuccess && showSuccessIcon ? 'success' : variant;


  return (
    <motion.button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[currentVariant]} ${loadingStyles} ${className}`}
      disabled={isLoading || props.disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={isLoading}
      // Minimal animations to satisfy typing
      initial={shouldReduceMotion() ? undefined : { opacity: 1 }}
      whileHover={shouldReduceMotion() ? undefined : { scale: 1.02 }}
      whileTap={shouldReduceMotion() ? undefined : { scale: 0.98 }}
      style={{ 
        transformOrigin: 'center',
        willChange: 'transform',
      }}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <motion.svg 
            className="h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            animate={shouldReduceMotion() ? undefined : { rotate: 360 }}
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </motion.svg>
          {children && <span>Processing...</span>}
        </>
      ) : isSuccess && showSuccessIcon ? (
         <>
            <motion.div
              variants={shouldReduceMotion() ? undefined : VARIANTS.feedback}
              initial="initial"
              animate="animate"
            >
              <IconCheck className="h-5 w-5" />
            </motion.div>
            {children && <span>Success!</span>}
         </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </motion.button>
  );
};

export default Button;
