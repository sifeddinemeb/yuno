import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
  retryFn?: () => Promise<any>;
}

const NetworkErrorHandler = ({ children, retryFn }: NetworkErrorHandlerProps) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // Handle initial state and listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hide the message after 2 seconds when we come back online
      setTimeout(() => setShowMessage(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true);
    };

    // Set up listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // If we're offline when the component mounts, show the message
    if (!isOnline) {
      setShowMessage(true);
    }

    // Clean up on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle retry logic
  const handleRetry = useCallback(async () => {
    if (retryFn && !isRetrying) {
      try {
        setIsRetrying(true);
        await retryFn();
        setShowMessage(false);
      } catch (error) {
        console.error('Retry failed:', error);
        // If retry fails, keep showing the error message
      } finally {
        setIsRetrying(false);
      }
    } else if (isOnline) {
      // If we're online but there's no retry function, just hide the message
      setShowMessage(false);
    }
  }, [retryFn, isRetrying, isOnline]);

  if (!showMessage) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div 
        className={isOnline ? 'opacity-25 pointer-events-none transition-opacity duration-300' : ''}
        aria-hidden={!isOnline}
      >
        {children}
      </div>

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" aria-live="assertive">
        <Card variant="glass" className="p-6 max-w-md shadow-lg border-2 border-neon-red/30">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-neon-red/20 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-neon-red" />
            </div>
            
            <h2 className="text-xl font-bold mb-2">
              {isOnline ? 'Connection Problem' : 'You\'re Offline'}
            </h2>
            
            <p className="text-muted mb-6">
              {isOnline 
                ? 'We\'re having trouble reaching our servers. Please check your internet connection and try again.'
                : 'Please check your internet connection and try again when you\'re back online.'}
            </p>
            
            <Button 
              onClick={handleRetry}
              disabled={!isOnline || isRetrying}
              className="px-6"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isOnline ? 'Try Again' : 'Retry When Online'}
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NetworkErrorHandler;