import React from 'react';

export interface SkeletonProps {
  /** Height of the skeleton */
  height?: string | number;
  /** Width of the skeleton */
  width?: string | number;
  /** Border radius variant */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Custom CSS classes */
  className?: string;
  /** Animation variant */
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = '1rem',
  width = '100%',
  variant = 'text',
  className = '',
  animation = 'pulse',
}) => {
  // Base animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could be enhanced with custom wave animation
    none: '',
  };

  // Variant styles
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  // Convert height and width to CSS values
  const heightValue = typeof height === 'number' ? `${height}px` : height;
  const widthValue = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      className={`
        bg-slate-200 dark:bg-slate-700
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={{
        height: heightValue,
        width: widthValue,
      }}
      aria-label="Loading..."
      role="progressbar"
      aria-busy="true"
    />
  );
};

// Specialized skeleton components for common use cases
export const SkeletonText: React.FC<{
  lines?: number;
  width?: string | number;
  className?: string;
}> = ({ lines = 1, width = '100%', className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 && lines > 1 ? '75%' : width}
          variant="text"
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

export const SkeletonButton: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  className?: string;
}> = ({ size = 'md', width = 'auto', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 px-4',
    md: 'h-10 px-6',
    lg: 'h-12 px-8',
  };

  return (
    <Skeleton
      variant="rectangular"
      width={width}
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

// Dashboard-specific skeleton components
export const StatsCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => (
  <div className={`p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg ${className}`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton height="4rem" width="60%" className="mb-3" />
        <SkeletonText width="80%" />
      </div>
      <SkeletonAvatar size="lg" />
    </div>
  </div>
);

export const ParticipantsSkeleton: React.FC<{ count?: number }> = ({ 
  count = 3 
}) => (
  <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
    <SkeletonText width="40%" className="mb-6" />
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <SkeletonAvatar className="mr-4" />
            <div>
              <Skeleton height="1.25rem" width="120px" className="mb-1" />
              <Skeleton height="0.875rem" width="80px" />
            </div>
          </div>
          <div className="flex items-center">
            <Skeleton variant="circular" height="12px" width="12px" className="mr-2" />
            <Skeleton height="0.875rem" width="60px" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const QuickActionsSkeleton: React.FC<{ count?: number }> = ({ 
  count = 3 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {Array.from({ length: count }).map((_, index) => (
      <div 
        key={index} 
        className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl shadow-lg"
      >
        <SkeletonAvatar size="lg" className="mb-4" />
        <SkeletonText lines={2} className="space-y-2" />
      </div>
    ))}
  </div>
);

export default Skeleton;