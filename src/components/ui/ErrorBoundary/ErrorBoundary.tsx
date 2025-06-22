import { useEffect, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentStack?: string;
  errorInfo?: React.ErrorInfo;
}

const logError = (error: Error, componentStack?: string) => {
  console.error('Error caught by ErrorBoundary:', error);
  console.error('Component stack:', componentStack);
  
  // In a production app, we would send this to an error tracking service
  // Example: Sentry.captureException(error, { extra: { componentStack } });
};

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    logError(error);
  }, [error]);

  return (
    <Card variant="glass" className="p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-neon-red/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-neon-red" />
        </div>
        
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        
        <p className="text-muted mb-6">
          We encountered an unexpected error while trying to display this content.
        </p>
        
        <div className="flex gap-3">
          <Button onClick={resetErrorBoundary}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Link to="/">
            <Button variant="secondary">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mt-6 w-full">
          <button 
            className="text-sm text-neon-blue hover:underline focus:outline-none focus:ring-2 focus:ring-neon-blue rounded"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Technical Details
          </button>
          
          {showDetails && (
            <div className="mt-2 bg-dark-200 p-3 rounded-lg text-left overflow-x-auto">
              <p className="text-sm text-neon-red font-mono">{error.name}: {error.message}</p>
              {error.stack && (
                <pre className="text-xs text-muted mt-2 overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackRender?: (props: ErrorFallbackProps) => React.ReactNode;
  onError?: (error: Error, componentStack: string) => void;
  onReset?: () => void;
  resetKeys?: Array<any>;
}

const ErrorBoundary = ({
  children,
  fallbackRender,
  onError,
  onReset,
  resetKeys,
  ...props
}: ErrorBoundaryProps) => {
  const handleError = (error: Error, info: React.ErrorInfo) => {
    logError(error, info.componentStack);
    if (onError) onError(error, info.componentStack);
  };

  return (
    <ReactErrorBoundary
      fallbackRender={fallbackRender || ((props) => <ErrorFallback {...props} />)}
      onError={handleError}
      onReset={onReset}
      resetKeys={resetKeys}
      {...props}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;