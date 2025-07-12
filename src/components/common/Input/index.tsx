
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, error, containerClassName = '', className = '', leftIcon, ...props }) => {
  const baseClasses = "block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm placeholder-slate-400 dark:placeholder-slate-300 text-slate-900 dark:text-slate-100 transition-colors duration-150";
  const errorClasses = error 
    ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 focus:border-red-500 dark:focus:border-red-500 text-red-700 dark:text-red-400" 
    : "focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:border-brand-tertiary dark:focus:border-orange-400";
  const paddingLeftClass = leftIcon ? "pl-10" : "px-4";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-secondary dark:text-slate-300 mb-1">{label}</label>}
      <div className="relative">
        {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                {leftIcon}
            </div>
        )}
        <input
            id={id}
            className={`${baseClasses} ${errorClasses} ${paddingLeftClass} ${className}`}
            {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;