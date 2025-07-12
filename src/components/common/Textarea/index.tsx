
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, error, containerClassName = '', className = '', ...props }) => {
  const baseClasses = "block w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm placeholder-slate-400 dark:placeholder-slate-300 text-slate-900 dark:text-slate-100 transition-colors duration-150";
  const errorClasses = error 
    ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 focus:border-red-500 dark:focus:border-red-500 text-red-700 dark:text-red-400" 
    : "focus:ring-brand-tertiary dark:focus:ring-orange-400 focus:border-brand-tertiary dark:focus:border-orange-400";

  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-secondary dark:text-slate-300 mb-1">{label}</label>}
      <textarea
        id={id}
        className={`${baseClasses} ${errorClasses} ${className}`}
        rows={4} 
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Textarea;