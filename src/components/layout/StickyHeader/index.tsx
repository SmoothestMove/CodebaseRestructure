import type { ReactNode } from 'react';

interface StickyHeaderProps {
  /** Left slot - typically back button or profile avatar */
  leftSlot?: ReactNode;
  /** Center slot - typically page title */
  title?: string;
  /** Right slot - typically action buttons */
  rightSlot?: ReactNode;
  /** Optional subtitle or badge below title */
  subtitle?: ReactNode;
  /** Whether to show border bottom */
  showBorder?: boolean;
}

/**
 * Sticky header component following Stitch design patterns.
 * Features blur backdrop, theme-aware styling, and flexible slot system.
 */
export function StickyHeader({
  leftSlot,
  title,
  rightSlot,
  subtitle,
  showBorder = true,
}: StickyHeaderProps) {
  return (
    <header
      className={`
        sticky top-0 z-40
        bg-background/80 backdrop-blur-md
        ${showBorder ? 'border-b border-border' : ''}
      `}
    >
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left slot */}
        <div className="flex items-center gap-2 min-w-[40px]">
          {leftSlot}
        </div>

        {/* Center - Title */}
        <div className="flex-1 text-center">
          {title && (
            <h1 className="text-lg font-semibold text-text-main truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <div className="text-sm text-text-secondary">
              {subtitle}
            </div>
          )}
        </div>

        {/* Right slot */}
        <div className="flex items-center gap-2 min-w-[40px] justify-end">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}

export default StickyHeader;
