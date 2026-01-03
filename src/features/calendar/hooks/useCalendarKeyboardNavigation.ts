import { useCallback, useEffect, useRef } from 'react';

type KeyboardNavigationProps = {
  onAddEvent?: (date?: Date) => void;
  onToday?: () => void;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  onViewChange?: (view: string) => void;
  onCloseModal?: () => void;
  isModalOpen?: boolean;
};

export function useCalendarKeyboardNavigation({
  onAddEvent,
  onToday,
  onNavigateBack,
  onNavigateForward,
  onViewChange,
  onCloseModal,
  isModalOpen = false,
}: KeyboardNavigationProps) {
  const calendarRef = useRef<HTMLDivElement>(null);

  // Focus the calendar when it mounts
  useEffect(() => {
    if (calendarRef.current && !isModalOpen) {
      calendarRef.current.focus();
    }
  }, [isModalOpen]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing in an input or textarea
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).getAttribute('role') === 'textbox' ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Handle Escape key to close modals
      if (e.key === 'Escape' && onCloseModal) {
        onCloseModal();
        return;
      }

      // Don't trigger other shortcuts if a modal is open
      if (isModalOpen) return;

      // Prevent default for all shortcut keys to avoid browser conflicts
      const shortcutKeys = ['t', 'm', 'w', 'd', 'a', '+', 'ArrowLeft', 'ArrowRight'];
      if (shortcutKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Navigation shortcuts
      switch (e.key) {
        case 't':
          // T - Go to today
          if (onToday) onToday();
          break;
        case 'm':
          // M - Switch to month view
          if (onViewChange) onViewChange('month');
          break;
        case 'w':
          // W - Switch to week view
          if (onViewChange) onViewChange('week');
          break;
        case 'd':
          // D - Switch to day view
          if (onViewChange) onViewChange('day');
          break;
        case 'a':
          // A - Switch to agenda view
          if (onViewChange) onViewChange('agenda');
          break;
        case '+':
          // + - Add new event
          if (onAddEvent) onAddEvent();
          break;
        case 'ArrowLeft':
          // Left arrow - Previous period
          if (onNavigateBack) onNavigateBack();
          break;
        case 'ArrowRight':
          // Right arrow - Next period
          if (onNavigateForward) onNavigateForward();
          break;
        default:
          break;
      }
    },
    [onAddEvent, onToday, onNavigateBack, onNavigateForward, onViewChange, onCloseModal, isModalOpen]
  );

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    calendarRef,
    // Helper function to add keyboard navigation to interactive elements
    getKeyboardProps: (props: any = {}) => ({
      ...props,
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (props.onClick) props.onClick(e);
        } else if (e.key === 'Escape' && onCloseModal) {
          e.stopPropagation();
          onCloseModal();
        }
      },
      role: 'button',
      'aria-label': props['aria-label'],
    }),
  };
}
