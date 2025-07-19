import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { FaSpinner } from 'react-icons/fa';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary/50',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-300 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-200 dark:hover:bg-slate-700',
    link: 'bg-transparent text-brand-primary hover:underline p-0 h-auto',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Success state
  const successClasses = isSuccess ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500' : '';
  
  // Full width
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    successClasses,
    widthClass,
    className,
  ].filter(Boolean).join(' ');
  
  // Loading spinner
  const spinner = (
    <FaSpinner className="animate-spin mr-2" />
  );
  
  // Success checkmark (using a simple check emoji for now)
  const successIcon = (
    <span className="mr-2">✓</span>
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isLoading || isSuccess}
      {...props}
    >
      {isLoading && spinner}
      {isSuccess && !isLoading && successIcon}
      {!isLoading && !isSuccess && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && !isSuccess && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
