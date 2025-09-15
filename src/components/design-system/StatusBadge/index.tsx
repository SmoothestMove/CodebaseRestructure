// @ts-nocheck
import React from 'react';
import { colors } from '../foundations';

export interface StatusBadgeProps {
  /** The status type determines the color scheme */
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'prepared' | 'packed' | 'loaded' | 'unloaded' | 'delivered' | 'unpacked';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Display variant */
  variant?: 'solid' | 'soft' | 'outlined';
  /** Optional icon */
  icon?: React.ReactNode;
  /** Badge text */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  variant = 'soft',
  icon,
  children,
  className = '',
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors duration-200 touch-manipulation";

  // Size styles
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1 min-h-[20px]",
    md: "px-2.5 py-0.5 text-xs gap-1.5 min-h-[24px]", 
    lg: "px-3 py-1 text-sm gap-2 min-h-[28px]",
  };

  // Status color configurations
  const statusConfigs = {
    // Semantic statuses
    success: {
      solid: "bg-green-500 text-white border-green-500",
      soft: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800",
      outlined: "bg-transparent text-green-700 border-green-500 dark:text-green-400 dark:border-green-400",
    },
    warning: {
      solid: "bg-amber-500 text-white border-amber-500",
      soft: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800",
      outlined: "bg-transparent text-amber-700 border-amber-500 dark:text-amber-400 dark:border-amber-400",
    },
    error: {
      solid: "bg-red-500 text-white border-red-500",
      soft: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800",
      outlined: "bg-transparent text-red-700 border-red-500 dark:text-red-400 dark:border-red-400",
    },
    info: {
      solid: "bg-blue-500 text-white border-blue-500",
      soft: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800",
      outlined: "bg-transparent text-blue-700 border-blue-500 dark:text-blue-400 dark:border-blue-400",
    },
    neutral: {
      solid: "bg-slate-500 text-white border-slate-500",
      soft: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600",
      outlined: "bg-transparent text-slate-700 border-slate-500 dark:text-slate-400 dark:border-slate-400",
    },

    // Box-specific statuses
    prepared: {
      solid: "bg-slate-500 text-white border-slate-500",
      soft: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600",
      outlined: "bg-transparent text-slate-700 border-slate-500 dark:text-slate-300 dark:border-slate-500",
    },
    packed: {
      solid: "bg-amber-500 text-white border-amber-500",
      soft: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800",
      outlined: "bg-transparent text-amber-700 border-amber-500 dark:text-amber-400 dark:border-amber-400",
    },
    loaded: {
      solid: "bg-blue-500 text-white border-blue-500", 
      soft: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800",
      outlined: "bg-transparent text-blue-700 border-blue-500 dark:text-blue-400 dark:border-blue-400",
    },
    unloaded: {
      solid: "bg-violet-500 text-white border-violet-500",
      soft: "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/20 dark:text-violet-200 dark:border-violet-800",
      outlined: "bg-transparent text-violet-700 border-violet-500 dark:text-violet-400 dark:border-violet-400",
    },
    delivered: {
      solid: "bg-emerald-500 text-white border-emerald-500",
      soft: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800",
      outlined: "bg-transparent text-emerald-700 border-emerald-500 dark:text-emerald-400 dark:border-emerald-400",
    },
    unpacked: {
      solid: "bg-green-500 text-white border-green-500",
      soft: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800",
      outlined: "bg-transparent text-green-700 border-green-500 dark:text-green-400 dark:border-green-400",
    },
  };

  // Get the appropriate color classes
  const colorClasses = statusConfigs[status][variant];
  
  // Add border for outlined and soft variants
  const borderClasses = variant !== 'solid' ? 'border' : '';

  return (
    <span
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${colorClasses}
        ${borderClasses}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      role="status"
      aria-label={`Status: ${children}`}
    >
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

// Utility component for box status badges specifically
export const BoxStatusBadge: React.FC<{
  status: 'prepared' | 'packed' | 'loaded' | 'unloaded' | 'delivered' | 'unpacked';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'soft' | 'outlined';
  className?: string;
}> = ({ status, size = 'md', variant = 'soft', className = '' }) => {
  // Status display names and icons
  const statusConfig = {
    prepared: { label: 'Prepared', icon: '📋' },
    packed: { label: 'Packed', icon: '📦' },
    loaded: { label: 'Loaded', icon: '🚚' },
    unloaded: { label: 'Unloaded', icon: '📤' },
    delivered: { label: 'Delivered', icon: '🏠' },
    unpacked: { label: 'Unpacked', icon: '✅' },
  };

  const config = statusConfig[status];

  return (
    <StatusBadge
      status={status}
      size={size}
      variant={variant}
      className={className}
      icon={<span className="text-current">{config.icon}</span>}
    >
      {config.label}
    </StatusBadge>
  );
};

export default StatusBadge;
