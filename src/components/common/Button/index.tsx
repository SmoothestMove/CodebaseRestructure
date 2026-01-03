
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
    sm: "px-4 py-3 text-xs min-h-[40px]", // 40px for small buttons (close to 44px)
    md: "px-5 py-3 text-sm min-h-[44px]", // 44px minimum touch target
    lg: "px-7 py-4 text-base min-h-[48px]", // 48px for large buttons
    icon: "p-3 min-w-[44px] min-h-[44px]", // 44x44px minimum for icon buttons
  };

  const variantStyles = {
    primary: "bg-primary hover:bg-primary-dark text-text-on-primary focus:ring-primary/50 dark:bg-primary-light dark:hover:bg-primary dark:focus:ring-primary-light/50",
    secondary: "bg-secondary hover:bg-secondary-dark text-text-on-secondary focus:ring-secondary/50 dark:bg-secondary-dark dark:hover:bg-secondary dark:focus:ring-secondary-dark/50",
    danger: "bg-danger hover:bg-danger-dark text-text-on-danger focus:ring-danger/50 dark:bg-danger-dark dark:hover:bg-danger dark:focus:ring-danger-dark/50",
    success: "bg-success hover:bg-success-dark text-text-on-primary focus:ring-success/50 dark:bg-success-dark dark:hover:bg-success dark:focus:ring-success-dark/50",
    warning: "bg-accent hover:bg-accent-dark text-white focus:ring-accent/50 dark:bg-accent-dark dark:hover:bg-accent dark:focus:ring-accent-dark/50",
    ghost: "bg-transparent hover:bg-primary/10 text-primary focus:ring-primary/30 dark:text-primary-light dark:hover:bg-primary-light/10 dark:focus:ring-primary-light/30",
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
