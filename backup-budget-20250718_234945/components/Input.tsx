import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  leftAdornment?: string;
  rightAdornment?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  id,
  error,
  className = '',
  containerClassName = '',
  leftIcon,
  leftAdornment,
  rightAdornment,
  ...props
}, ref) => {
  // Base input classes
  const baseClasses = 'block w-full rounded-lg border-0 py-1.5 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6';
  
  // Error state classes
  const errorClasses = error 
    ? 'text-red-900 dark:text-red-400 ring-red-300 dark:ring-red-700 focus:ring-red-500 dark:focus:ring-red-500' 
    : 'text-slate-900 dark:text-slate-100 ring-slate-300 dark:ring-slate-600 focus:ring-brand-primary dark:focus:ring-brand-primary';
  
  // Padding for left icon or adornment
  const paddingLeft = leftIcon || leftAdornment ? 'pl-10' : 'pl-3';
  const paddingRight = rightAdornment ? 'pr-10' : 'pr-3';
  
  // Combined classes
  const inputClasses = `${baseClasses} ${errorClasses} ${paddingLeft} ${paddingRight} ${className}`;

  return (
    <div className={containerClassName}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {/* Left icon */}
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}
        
        {/* Left adornment (text) */}
        {leftAdornment && !leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              {leftAdornment}
            </span>
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        
        {/* Right adornment */}
        {rightAdornment && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 dark:text-slate-400 sm:text-sm">
              {rightAdornment}
            </span>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p 
          className="mt-1 text-sm text-red-600 dark:text-red-400" 
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
