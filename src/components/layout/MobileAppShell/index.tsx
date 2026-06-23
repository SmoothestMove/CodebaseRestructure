import type { ReactNode } from 'react';

interface MobileAppShellProps {
  children: ReactNode;
}

/**
 * Responsive app shell following mobile-first design conventions.
 * 
 * Base (mobile): Full width, minimal padding
 * sm (640px+): Same as mobile
 * md (768px+): Constrained width with more padding
 * lg (1024px+): Wider content area
 * xl (1280px+): Maximum comfortable reading width
 */
export function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* 
        Mobile-first container:
        - Base: w-full (full width on mobile)
        - md+: constrained with max-width
        - Padding scales up at breakpoints
      */}
      <div className="w-full mx-auto md:max-w-3xl lg:max-w-5xl xl:max-w-7xl min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default MobileAppShell;


