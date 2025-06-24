import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'white';
  label?: string;
  className?: string;
  showText?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue',
  label = 'Loading...',
  className = '',
  showText = true
}: LoadingSpinnerProps) => {
  // Map size to dimensions
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };

  // Map color to classes
  const colorMap = {
    blue: 'border-neon-blue',
    purple: 'border-neon-purple',
    green: 'border-neon-green',
    orange: 'border-neon-orange',
    red: 'border-neon-red',
    white: 'border-white'
  };
  
  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color];
  
  return (
    <div 
      className={clsx(
        'flex flex-col items-center justify-center',
        className
      )}
      role="status"
      aria-label={label}
    >
      <div 
        className={clsx(
          spinnerSize,
          `border-t-transparent rounded-full animate-spin`,
          spinnerColor
        )}
      />
      
      {showText && (
        <span className="mt-2 text-sm text-muted">{label}</span>
      )}
      
      {/* Hidden text for screen readers */}
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;