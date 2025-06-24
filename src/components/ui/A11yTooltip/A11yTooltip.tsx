import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface A11yTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  id: string;
}

const A11yTooltip = ({ children, content, position = 'top', id }: A11yTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipId = `tooltip-${id}`;

  // Calculate position for the tooltip
  const getTooltipPosition = () => {
    if (!triggerRef.current) return {};
    
    const rect = triggerRef.current.getBoundingClientRect();
    
    switch (position) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' };
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' };
    }
  };

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      className="inline-block relative"
      aria-describedby={isVisible ? tooltipId : undefined}
      tabIndex={0}
      role="button"
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-max max-w-xs px-3 py-2 text-sm bg-dark-200 dark:bg-dark-100 text-white rounded-md shadow-lg pointer-events-none"
            style={getTooltipPosition() as React.CSSProperties}
          >
            {content}
            <div 
              className="absolute w-2 h-2 bg-dark-200 dark:bg-dark-100"
              style={{
                [position === 'bottom' ? 'top' : position === 'top' ? 'bottom' : position === 'left' ? 'right' : 'left']: '-4px',
                [position === 'top' || position === 'bottom' ? 'left' : 'top']: position === 'top' || position === 'bottom' ? 'calc(50% - 4px)' : 'calc(50% - 4px)',
                transform: 'rotate(45deg)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default A11yTooltip;