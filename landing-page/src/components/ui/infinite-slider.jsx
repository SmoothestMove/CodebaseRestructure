'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

const baseAnimationMs = 30000;

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 1,
  direction = 'horizontal',
  reverse = false,
  pauseOnHover = true,
  className,
}) {
  const animationName = direction === 'horizontal' ? 'slider-scroll-x' : 'slider-scroll-y';
  const animationDuration = useMemo(() => {
    const parsed = Number(speed);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return baseAnimationMs;
    }
    return baseAnimationMs / parsed;
  }, [speed]);

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'slider-track flex w-max items-center',
          direction === 'horizontal' ? 'flex-row' : 'flex-col'
        )}
        style={{
          gap,
          animationName: `${animationName}-${reverse ? 'reverse' : 'forward'}`,
          animationDuration: `${animationDuration}ms`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
        data-pause-on-hover={pauseOnHover}
      >
        {children}
        {children}
      </div>
    </div>
  );
}