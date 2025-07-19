import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string | React.ReactNode;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  id,
  error,
  className = '',
  containerClassName = '',
  options,
  placeholder,
  ...props
}, ref) => {
  // Base select classes
  const baseClasses = 'block w-full rounded-lg border-0 py-1.5 pl-3 pr-10 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6';
  
  // Error state classes
  const errorClasses = error 
    ? 'text-red-900 dark:text-red-400 ring-red-300 dark:ring-red-700 focus:ring-red-500 dark:focus:ring-red-500' 
    : 'text-slate-900 dark:text-slate-100 ring-slate-300 dark:ring-slate-600 focus:ring-brand-primary dark:focus:ring-brand-primary';
  
  // Combined classes
  const selectClasses = `${baseClasses} ${errorClasses} ${className}`;
  
  // Check if the current value is empty (for placeholder)
  const isEmpty = props.value === '' || props.value === undefined || props.value === null;

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
      
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={selectClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled={!isEmpty}>
              {placeholder}
            </option>
          )}
          
          {/* Options */}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {typeof option.label === 'string' ? option.label : String(option.value)}
            </option>
          ))}
        </select>
        
        {/* Dropdown icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg 
            className="h-5 w-5 text-slate-400" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
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

Select.displayName = 'Select';

export default Select;
