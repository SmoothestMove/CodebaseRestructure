
import React from 'react';
import { motion } from 'framer-motion';
import { IconCheck } from '@/lib/config/constants';
import { VARIANTS, shouldReduceMotion } from '@/lib/animations'; 

/**
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @description Defines the properties for the Button component.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style of the button. */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  /** The size of the button. */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  /** Whether the button is in a loading state. */
  isLoading?: boolean;
  /** Whether the button is in a success state. */
  isSuccess?: boolean; 
  /** An icon to be displayed to the left of the button's content. */
  leftIcon?: React.ReactNode;
  /** An icon to be displayed to the right of the button's content. */
  rightIcon?: React.ReactNode;
  /** The content of the button. */
  children?: React.ReactNode; 
  /** Whether to show a success icon when in the success state. */
  showSuccessIcon?: boolean;
  /** An accessible label for the button. */
  ariaLabel?: string;
  /** The ID of an element that describes the button. */
  ariaDescribedBy?: string;
}

/**
 * A versatile button component with different styles, sizes, and states.
 * @param {ButtonProps} props - The properties for the Button component.
 * @returns {JSX.Element} The rendered Button component.
 */
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
    primary: "bg-brand-tertiary hover:bg-brand-tertiary-dark text-white focus:ring-brand-tertiary/50 dark:bg-orange-500 dark:hover:bg-orange-600 dark:focus:ring-orange-400/50",
    secondary: "bg-brand-secondary hover:bg-brand-secondary-dark focus:ring-brand-secondary/50 dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:ring-slate-500/50", // Removed text-white and dark:text-slate-100
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400/70",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500/70",
    warning: "bg-brand-accent hover:bg-brand-accent-dark text-white focus:ring-brand-accent/50 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-slate-900 dark:focus:ring-yellow-400/50",
    ghost: "bg-transparent hover:bg-brand-primary/10 text-brand-primary focus:ring-brand-primary/30 dark:hover:bg-slate-700 dark:text-slate-300 dark:focus:ring-slate-600/50",
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
      // Framer Motion animations
      variants={shouldReduceMotion() ? undefined : VARIANTS.button}
      initial="initial"
      whileHover={shouldReduceMotion() ? undefined : "hover"}
      whileTap={shouldReduceMotion() ? undefined : "tap"}
      // Performance optimization
      style={{ 
        transformOrigin: 'center',
        willChange: 'transform',
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.svg 
            className="h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            variants={shouldReduceMotion() ? undefined : VARIANTS.spinner}
            animate={shouldReduceMotion() ? undefined : "animate"}
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
