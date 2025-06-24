import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import Button from '../Button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Get size-specific classes
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  }[size];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap>
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeOnOutsideClick ? onClose : undefined}
              aria-hidden="true"
            />
            
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`glass relative z-10 rounded-xl shadow-xl ${sizeClasses} ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 border-b border-primary">
                  {title && (
                    <h2 id="modal-title" className="text-xl font-bold text-primary">
                      {title}
                    </h2>
                  )}
                  
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      aria-label="Close modal"
                      className="rounded-full h-8 w-8 flex items-center justify-center p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-auto max-h-[calc(80vh-7rem)]">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-4 border-t border-primary">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );

  // Use portal to render the modal at the end of document body
  return createPortal(modalContent, document.body);
};

export default Modal;