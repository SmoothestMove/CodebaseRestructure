import React from 'react';

/**
 * @interface SkeletonProps
 * @description Defines the properties for the Skeleton component.
 */
export interface SkeletonProps {
  /** The height of the skeleton loader. */
  height?: string | number;
  /** The width of the skeleton loader. */
  width?: string | number;
  /** The shape variant of the skeleton loader. */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Optional additional CSS classes to apply to the skeleton loader. */
  className?: string;
  /** The animation variant of the skeleton loader. */
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * A component that displays a skeleton loader.
 * @param {SkeletonProps} props - The properties for the Skeleton component.
 * @returns {JSX.Element} The rendered Skeleton component.
 */
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
/**
 * A specialized skeleton component for text.
 * @param {object} props - The properties for the SkeletonText component.
 * @param {number} [props.lines=1] - The number of lines of text to display.
 * @param {string | number} [props.width='100%'] - The width of the text.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 * @returns {JSX.Element} The rendered SkeletonText component.
 */
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

/**
 * A specialized skeleton component for an avatar.
 * @param {object} props - The properties for the SkeletonAvatar component.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md'] - The size of the avatar.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 * @returns {JSX.Element} The rendered SkeletonAvatar component.
 */
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

/**
 * A specialized skeleton component for a button.
 * @param {object} props - The properties for the SkeletonButton component.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the button.
 * @param {string | number} [props.width='auto'] - The width of the button.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 * @returns {JSX.Element} The rendered SkeletonButton component.
 */
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
/**
 * A skeleton component for a stats card.
 * @param {object} props - The properties for the StatsCardSkeleton component.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the component.
 * @returns {JSX.Element} The rendered StatsCardSkeleton component.
 */
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

/**
 * A skeleton component for a list of participants.
 * @param {object} props - The properties for the ParticipantsSkeleton component.
 * @param {number} [props.count=3] - The number of participants to display.
 * @returns {JSX.Element} The rendered ParticipantsSkeleton component.
 */
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

/**
 * A skeleton component for a set of quick actions.
 * @param {object} props - The properties for the QuickActionsSkeleton component.
 * @param {number} [props.count=3] - The number of quick actions to display.
 * @returns {JSX.Element} The rendered QuickActionsSkeleton component.
 */
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