
import React from 'react';

/**
 * @interface SelectProps
 * @extends React.SelectHTMLAttributes<HTMLSelectElement>
 * @description Defines the properties for the Select component.
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The label to be displayed above the select element. */
  label?: string;
  /** An error message to be displayed below the select element. */
  error?: string;
  /** Optional additional CSS classes to apply to the container of the select element. */
  containerClassName?: string;
  /** An array of options to be displayed in the select element. */
  options: { value: string | number; label: string }[];
  /** A placeholder to be displayed as the first option. */
  placeholder?: string;
}

/**
 * A styled select component with support for labels, errors, and options.
 * @param {SelectProps} props - The properties for the Select component.
 * @returns {JSX.Element} The rendered Select component.
 */
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