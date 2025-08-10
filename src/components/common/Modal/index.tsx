
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import Button from '@/components/common/Button'; 
import { IconXMark } from '@/lib/config/constants'; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean; 
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md', 
  showCloseButton = true 
}) => {
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
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
      const timer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = 'auto';
        
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 300); 
      return () => clearTimeout(timer);
    }
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

  if (!show && !isOpen) return null; 

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={onClose} 
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" /> {/* Darker overlay in dark mode */}
      <div 
        ref={modalRef}
        className={`glassmorphism rounded-xl shadow-2xl transform transition-all duration-300 ease-out w-full ${sizeClasses[size]} ${isOpen ? 'scale-100 opacity-100 animate-slide-up' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="document"
      >
        <div className="px-6 py-4 border-b border-slate-300/30 dark:border-slate-700/50 flex justify-between items-center">
          <h3 className="text-xl leading-6 font-semibold text-brand-primary dark:text-slate-100" id="modal-title">
            {title}
          </h3>
          {showCloseButton && ( 
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              ariaLabel="Close modal"
              className="text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 focus:ring-red-400 -mr-2"
            >
              <IconXMark className="w-6 h-6" />
            </Button>
          )}
        </div>
        <div className="px-6 py-5 text-brand-secondary dark:text-slate-300"> 
          {children}
        </div>
        {footer && (
          <div className="bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-xl">
            {footer}
          </div>
        )}
         {!footer && showCloseButton && ( // Only show default close if explicit footer isn't there AND showCloseButton is true
            <div className="bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-xl">
                 <Button
                    variant="secondary" 
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Modal;