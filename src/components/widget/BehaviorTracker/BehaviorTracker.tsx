import { useEffect, useRef } from 'react';

interface BehaviorTrackerProps {
  sessionId: string;
  isActive: boolean;
  children: React.ReactNode;
}

/**
 * Enhanced component that tracks user behavior for bot detection
 * Captures complex behavioral patterns for ML analysis
 */
const BehaviorTracker = ({ sessionId, isActive, children }: BehaviorTrackerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<boolean>(false);
  const pointerPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const idleTimerRef = useRef<number | null>(null);
  const interactionCountRef = useRef<number>(0);
  const lastActivityRef = useRef<number>(Date.now());

  // Enhanced tracking that captures sophisticated patterns
  useEffect(() => {
    if (!isActive || !sessionId) return;

    trackingRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    // Reset tracking metrics
    interactionCountRef.current = 0;
    lastActivityRef.current = Date.now();
    
    // Helper function to safely call trackUserInteraction
    const safeTrackUserInteraction = (sessionId: string, eventData: any) => {
      import('../../../lib/bot-detection').then(({ trackUserInteraction }) => {
        trackUserInteraction(sessionId, eventData);
      }).catch(err => {
        console.warn('Failed to track user interaction:', err);
      });
    };

    // Track mouse movement with velocity and acceleration
    const handleMouseMove = (e: MouseEvent) => {
      if (!trackingRef.current) return;
      
      const timestamp = Date.now();
      const x = e.clientX;
      const y = e.clientY;
      
      // Only track significant movements to reduce data volume
      const prevPos = pointerPositionRef.current;
      const distance = Math.sqrt(Math.pow(x - prevPos.x, 2) + Math.pow(y - prevPos.y, 2));
      
      if (distance > 5) { // Minimum pixel distance to track
        safeTrackUserInteraction(sessionId, {
          type: 'mousemove',
          data: {
            x,
            y,
            timestamp
          }
        });
        
        pointerPositionRef.current = { x, y };
        updateLastActivity();
      }
    };

    // Track mouse clicks with enhanced context
    const handleClick = (e: MouseEvent) => {
      if (!trackingRef.current) return;
      
      safeTrackUserInteraction(sessionId, {
        type: 'click',
        data: {
          x: e.clientX,
          y: e.clientY,
          button: e.button,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          target: (e.target as Element)?.tagName?.toLowerCase(),
          timestamp: Date.now()
        }
      });
      
      updateLastActivity();
    };

    // Enhanced keyboard tracking with keystroke dynamics
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!trackingRef.current) return;
      
      // Skip tracking modifier keys by themselves
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      
      safeTrackUserInteraction(sessionId, {
        type: 'keydown',
        data: {
          key: e.key,
          code: e.code,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          repeat: e.repeat,
          timestamp: Date.now()
        }
      });
      
      updateLastActivity();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!trackingRef.current) return;
      
      // Skip tracking modifier keys by themselves
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      
      safeTrackUserInteraction(sessionId, {
        type: 'keyup',
        data: {
          key: e.key,
          code: e.code,
          timestamp: Date.now()
        }
      });
    };

    // Enhanced touch event tracking
    const handleTouchStart = (e: TouchEvent) => {
      if (!trackingRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      pointerPositionRef.current = { x: touch.clientX, y: touch.clientY };
      
      safeTrackUserInteraction(sessionId, {
        type: 'click', // Map to click for analysis consistency
        data: {
          x: touch.clientX,
          y: touch.clientY,
          touchCount: e.touches.length,
          timestamp: Date.now(),
          touchEvent: true,
          target: (e.target as Element)?.tagName?.toLowerCase(),
        }
      });
      
      updateLastActivity();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!trackingRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      
      // Only track significant movements
      const prevPos = pointerPositionRef.current;
      const distance = Math.sqrt(Math.pow(x - prevPos.x, 2) + Math.pow(y - prevPos.y, 2));
      
      if (distance > 10) { // Higher threshold for touch to reduce volume
        safeTrackUserInteraction(sessionId, {
          type: 'mousemove', // Map to mousemove for analysis consistency
          data: {
            x,
            y,
            touchCount: e.touches.length,
            timestamp: Date.now(),
            touchEvent: true
          }
        });
        
        pointerPositionRef.current = { x, y };
        updateLastActivity();
      }
    };

    // Enhanced scroll tracking
    const handleScroll = () => {
      if (!trackingRef.current) return;
      
      safeTrackUserInteraction(sessionId, {
        type: 'scroll',
        data: {
          scrollTop: window.scrollY,
          scrollLeft: window.scrollX,
          viewportHeight: window.innerHeight,
          documentHeight: document.body.scrollHeight,
          timestamp: Date.now()
        }
      });
      
      updateLastActivity();
    };
    
    // Track window focus events for attention analysis
    const handleFocus = () => {
      if (!trackingRef.current) return;
      
      safeTrackUserInteraction(sessionId, {
        type: 'focus',
        data: {
          timestamp: Date.now()
        }
      });
      
      updateLastActivity();
    };
    
    const handleBlur = () => {
      if (!trackingRef.current) return;
      
      safeTrackUserInteraction(sessionId, {
        type: 'blur',
        data: {
          timestamp: Date.now()
        }
      });
    };
    
    // Track device orientation for mobile devices
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!trackingRef.current) return;
      
      // Only track significant orientation changes
      if (e.beta !== null && e.gamma !== null) {
        safeTrackUserInteraction(sessionId, {
          type: 'orientation',
          data: {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma,
            timestamp: Date.now()
          }
        });
      }
    };
    
    // Helper to update last activity timestamp
    const updateLastActivity = () => {
      lastActivityRef.current = Date.now();
      interactionCountRef.current++;
      
      // Reset idle timer
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      
      // Set new idle timer
      idleTimerRef.current = window.setTimeout(() => {
        // Track idle period when we reach it
        // Import trackUserInteraction dynamically to avoid circular dependency
        import('../../../lib/bot-detection').then(({ trackUserInteraction }) => {
          trackUserInteraction(sessionId, {
            type: 'idle',
            data: {
              duration: 3000, // 3 seconds of idle time
              timestamp: Date.now()
            }
          });
        });
      }, 3000);
    };

    // Add event listeners with passive option for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('keyup', handleKeyUp, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    // Cleanup on component unmount or when inactive
    return () => {
      trackingRef.current = false;
      
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('deviceorientation', handleOrientation);
      
      // Track session summary when component unmounts
      if (interactionCountRef.current > 0) {
        const sessionDuration = Date.now() - lastActivityRef.current;
        safeTrackUserInteraction(sessionId, {
          type: 'session_summary',
          data: {
            interactionCount: interactionCountRef.current,
            duration: sessionDuration,
            timestamp: Date.now()
          }
        });
      }
    };
  }, [sessionId, isActive]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};

export default BehaviorTracker;