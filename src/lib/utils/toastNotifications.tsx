import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ICONS } from '../../features/budget/constants/constants';

// Toast notification types
type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

// Toast notification component
export const showToast = (
  message: string, 
  type: ToastType = 'default',
  options: ToastOptions = {}
) => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    ...options,
  };

  switch (type) {
    case 'success':
      return toast.success(message, {
        ...defaultOptions,
        icon: () => ICONS.CheckCircle,
      });
    case 'error':
      return toast.error(message, {
        ...defaultOptions,
        icon: () => ICONS.AlertCircle,
      });
    case 'warning':
      return toast.warning(message, {
        ...defaultOptions,
        icon: () => ICONS.AlertTriangle,
      });
    case 'info':
      return toast.info(message, {
        ...defaultOptions,
        icon: () => ICONS.Info,
      });
    default:
      return toast(message, defaultOptions);
  }
};

// Toast container component
export const ToastNotifications: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
      className="p-4 text-sm"
      closeButton={({ closeToast }) => (
        <button 
          onClick={closeToast}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors absolute top-2 right-2 p-1"
          aria-label="Close"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    />
  );
};