
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  id, 
  error, 
  options, 
  placeholder, 
  containerClassName = '', 
  className = '', 
  ...props 
}) => {
  const baseClasses = "block w-full pl-4 pr-10 py-2.5 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 sm:text-sm rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm transition-colors duration-150";
  const errorClasses = error 
    ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 text-red-700 dark:text-red-400" 
    : "focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:border-brand-tertiary dark:focus:border-orange-400";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-secondary dark:text-slate-300 mb-1">{label}</label>}
      <select
        id={id}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props} 
      >
        {placeholder && (
          <option value="" disabled selected={props.value === "" || props.value === undefined}>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Select;