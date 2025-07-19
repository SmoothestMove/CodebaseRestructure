import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  id,
  error,
  className = '',
  containerClassName = '',
  resize = 'vertical',
  rows = 3,
  ...props
}, ref) => {
  // Base textarea classes
  const baseClasses = 'block w-full rounded-lg border-0 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6';
  
  // Resize classes
  const resizeClasses = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y',
  };
  
  // Error state classes
  const errorClasses = error 
    ? 'text-red-900 dark:text-red-400 ring-red-300 dark:ring-red-700 focus:ring-red-500 dark:focus:ring-red-500' 
    : 'text-slate-900 dark:text-slate-100 ring-slate-300 dark:ring-slate-600 focus:ring-brand-primary dark:focus:ring-brand-primary';
  
  // Combined classes
  const textareaClasses = `${baseClasses} ${resizeClasses[resize]} ${errorClasses} ${className}`;

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
      
      <div className="mt-1">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={textareaClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export default Textarea;
