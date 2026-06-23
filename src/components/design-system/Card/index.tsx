// @ts-nocheck
import React from 'react';
import { colors, spacing, shadows } from '../foundations';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card visual variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Enable hover effects */
  hoverable?: boolean;
  /** Make card clickable (adds cursor pointer and better hover) */
  clickable?: boolean;
  /** Custom background color */
  background?: string;
  /** Add loading state */
  loading?: boolean;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  background,
  loading = false,
  className = '',
  children,
  ...props
}) => {
  // Base styles
  const baseStyles = "rounded-lg transition-all duration-200 ease-in-out touch-manipulation";

  // Variant styles
  const variantStyles = {
    default: `bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${shadows.component.card.default}`,
    elevated: `bg-white dark:bg-slate-800 ${shadows.component.card.elevated}`,
    outlined: `bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600`,
    filled: `bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600`,
  };

  // Padding styles using design tokens
  const paddingStyles = {
    none: '',
    sm: `p-4`, // 16px
    md: `p-6`, // 24px  
    lg: `p-8`, // 32px
    xl: `p-10`, // 40px
  };

  // Hover and interactive styles
  const interactiveStyles = hoverable || clickable ? 
    `hover:shadow-md dark:hover:shadow-lg transform hover:-translate-y-0.5` : '';
  
  const clickableStyles = clickable ? 
    `cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-tertiary focus:ring-opacity-50 dark:focus:ring-orange-400` : '';

  // Loading styles
  const loadingStyles = loading ? 'animate-pulse' : '';

  // Custom background override
  const backgroundStyle = background ? { backgroundColor: background } : {};

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${interactiveStyles}
        ${clickableStyles}
        ${loadingStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={backgroundStyle}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

// Specialized Card components
export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}> = ({ title, value, subtitle, icon, trend, className = '' }) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400', 
    neutral: 'text-slate-600 dark:text-slate-400',
  };

  return (
    <Card variant="default" hoverable className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm font-medium ${trend ? trendColors[trend] : 'text-slate-600 dark:text-slate-400'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {icon && (
          <div className="flex-shrink-0 text-brand-tertiary dark:text-orange-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export const BoxCard: React.FC<{
  title: string;
  description?: string;
  status: string;
  owner?: string;
  space?: string;
  qrCode?: string;
  onClick?: () => void;
  className?: string;
}> = ({ title, description, status, owner, space, qrCode, onClick, className = '' }) => {
  const statusColors = {
    prepared: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600',
    packed: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800',
    loaded: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
    unloaded: 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/20 dark:text-violet-200 dark:border-violet-800',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800',
    unpacked: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
  };

  return (
    <Card 
      variant="default" 
      clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          {qrCode && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded border flex items-center justify-center">
                <span className="text-xs font-mono">QR</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${statusColors[status as keyof typeof statusColors] || statusColors.prepared}
          `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          
          {/* Owner/Space info */}
          {(owner || space) && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              {owner && <span>{owner}</span>}
              {owner && space && <span>•</span>}
              {space && <span>{space}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Card;
