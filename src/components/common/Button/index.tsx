
import React from 'react';
import { IconCheck } from '@/lib/config/constants'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isSuccess?: boolean; 
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode; 
  showSuccessIcon?: boolean; 
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
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none";
  
  const sizeStyles = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    icon: "p-2.5", 
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
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[currentVariant]} ${loadingStyles} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children && <span>Processing...</span>}
        </>
      ) : isSuccess && showSuccessIcon ? (
         <>
            <IconCheck className="h-5 w-5" />
            {children && <span>Success!</span>}
         </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
