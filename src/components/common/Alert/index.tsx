import React, { useEffect, useState } from 'react';
import { IconCheck, IconXMark, IconPlus, IconCamera } from '@/lib/config/constants'; 

/**
 * Defines the properties for the Alert component.
 * @interface AlertProps
 */
interface AlertProps {
  /** The message to be displayed in the alert. */
  message: string;
  /** The type of the alert, which determines its color and icon. */
  type: 'success' | 'error' | 'info' | 'warning';
  /** An optional callback function that is called when the alert is closed. */
  onClose?: () => void;
  /** Optional additional CSS classes to apply to the alert. */
  className?: string;
  /** The duration in milliseconds after which the alert should automatically close. */
  duration?: number; 
}

/**
 * A component that displays an alert message to the user.
 * @param {AlertProps} props - The properties for the Alert component.
 * @returns {JSX.Element | null} The rendered Alert component or null if no message is provided.
 */
const Alert: React.FC<AlertProps> = ({ message, type, onClose, className = '', duration }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      if (duration && onClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);


  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
        if (onClose) onClose();
    }, 300) 
  }


  const baseClasses = "p-4 rounded-lg shadow-lg mb-4 flex items-start space-x-3 transition-all duration-300 ease-in-out transform";
  let typeClasses = "";
  let IconComponent;

  switch (type) {
    case 'success':
      typeClasses = "bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-600/50 text-green-700 dark:text-dark-green-success"; // Using dark-green-success from table
      IconComponent = <IconCheck className="w-5 h-5 text-green-500 dark:text-dark-green-success mt-0.5" />;
      break;
    case 'error':
      typeClasses = "bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-dark-red-error"; // Using dark-red-error from table
      IconComponent = <IconXMark className="w-5 h-5 text-red-500 dark:text-dark-red-error mt-0.5" />;
      break;
    case 'info':
      typeClasses = "bg-brand-secondary/10 dark:bg-slate-700/50 border-brand-secondary/30 dark:border-slate-600/70 text-brand-secondary-dark dark:text-slate-300";
      IconComponent = <IconCamera className="w-5 h-5 text-brand-secondary dark:text-slate-400 mt-0.5" />; 
      break;
    case 'warning':
      typeClasses = "bg-brand-accent/10 dark:bg-yellow-800/30 border-brand-accent/30 dark:border-yellow-600/50 text-brand-accent-dark dark:text-yellow-300";
      IconComponent = <IconPlus className="w-5 h-5 text-brand-accent dark:text-yellow-400 mt-0.5" />; 
      break;
  }
  
  const visibilityClasses = isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4";

  if (!message && !isVisible) return null; 

  return (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses} ${className}`} role="alert">
      <div className="flex-shrink-0">
        {IconComponent}
      </div>
      <div className="flex-grow text-sm">
        {message}
      </div>
      {onClose && (
        <button
          onClick={handleClose}
          className="ml-auto -mr-1 -mt-1 p-1.5 rounded-md hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Close alert"
        >
          <IconXMark className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;