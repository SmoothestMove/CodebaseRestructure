import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Button from '@/components/common/Button';
import { IconXMark } from '@/lib/config/constants';
import { VARIANTS, shouldReduceMotion } from '@/lib/animations';

/**
 * @interface BottomSheetModalProps
 * @description Defines the properties for the BottomSheetModal component.
 */
interface BottomSheetModalProps {
  /** Whether the modal is open or not. */
  isOpen: boolean;
  /** Callback function to be called when the modal is closed. */
  onClose: () => void;
  /** The title of the modal. */
  title: string;
  /** The content to be displayed inside the modal. */
  children: ReactNode;
  /** An optional footer to be displayed at the bottom of the modal. */
  footer?: ReactNode;
  /** The size of the modal on larger screens. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show the close button in the header. */
  showCloseButton?: boolean;
  /** Whether to show the drag handle on mobile. */
  showDragHandle?: boolean;
  /** Whether to close the modal when the backdrop is clicked. */
  dismissOnBackdrop?: boolean;
  /** Whether to allow dismissing the modal by swiping down on mobile. */
  dismissOnSwipe?: boolean;
  /** The maximum height of the modal on mobile. */
  maxHeight?: string;
}

/**
 * A modal component that appears from the bottom of the screen on mobile devices
 * and as a centered dialog on larger screens.
 * @param {BottomSheetModalProps} props - The properties for the BottomSheetModal component.
 * @returns {JSX.Element | null} The rendered BottomSheetModal component or null if it's not open.
 */
const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  showDragHandle = true,
  dismissOnBackdrop = true,
  dismissOnSwipe = true,
  maxHeight = '90vh',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (dismissOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle drag to dismiss
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (!dismissOnSwipe) return;

    const threshold = containerRef.current ? containerRef.current.offsetHeight * 0.3 : 200;
    
    if (info.offset.y > threshold || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-full',
  };

  // Animation variants for mobile vs desktop
  const modalVariants = {
    hidden: isMobile ? { y: '100%', opacity: 1 } : { scale: 0.9, opacity: 0 },
    visible: isMobile 
      ? { 
          y: 0, 
          opacity: 1,
          transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300,
          }
        }
      : { 
          scale: 1, 
          opacity: 1,
          transition: {
            type: 'spring',
            damping: 20,
            stiffness: 300,
          }
        },
    exit: isMobile 
      ? { 
          y: '100%', 
          opacity: 0.8,
          transition: {
            type: 'spring',
            damping: 30,
            stiffness: 400,
          }
        }
      : { 
          scale: 0.9, 
          opacity: 0,
          transition: {
            duration: 0.2,
          }
        },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
      }
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50"
        initial="hidden"
        animate="visible"
        exit="exit"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <motion.div
          variants={shouldReduceMotion() ? undefined : backdropVariants}
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
          onClick={handleBackdropClick}
        />

        {/* Modal Content */}
        <div className={`fixed inset-0 z-10 ${isMobile ? 'flex items-end' : 'flex items-center justify-center p-4'}`}>
          <motion.div
            ref={containerRef}
            variants={shouldReduceMotion() ? undefined : modalVariants}
            drag={isMobile && dismissOnSwipe ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
              ${isMobile 
                ? 'w-full rounded-t-2xl max-h-[90vh] min-h-[50vh]' 
                : `rounded-xl w-full ${sizeClasses[size]}`
              }
              bg-white dark:bg-slate-800 shadow-2xl overflow-hidden
              ${isDragging ? 'cursor-grabbing' : 'cursor-auto'}
            `}
            style={{
              maxHeight: isMobile ? maxHeight : '90vh',
              transformOrigin: isMobile ? 'center bottom' : 'center',
            }}
          >
            {/* Drag Handle (Mobile only) */}
            {isMobile && showDragHandle && (
              <div className="flex justify-center py-2">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full cursor-grab active:cursor-grabbing" />
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 
                className="text-xl font-semibold text-slate-900 dark:text-slate-100" 
                id="modal-title"
              >
                {title}
              </h3>
              {showCloseButton && (
                <motion.div
                  whileTap={shouldReduceMotion() ? undefined : { scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    ariaLabel="Close modal"
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 -mr-2"
                  >
                    <IconXMark className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div 
              ref={modalRef}
              className="flex-1 overflow-y-auto px-6 py-4"
              tabIndex={-1}
              role="document"
            >
              {children}
            </div>

            {/* Footer */}
            {(footer || (!footer && showCloseButton)) && (
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
                {footer || (
                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BottomSheetModal;