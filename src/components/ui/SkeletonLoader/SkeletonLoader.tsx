import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card' | 'button' | 'avatar';
  width?: string;
  height?: string;
  count?: number;
  animated?: boolean;
  dark?: boolean;
}

const SkeletonLoader = ({ 
  className,
  variant = 'text',
  width,
  height,
  count = 1,
  animated = true,
  dark = false
}: SkeletonLoaderProps) => {
  const baseStyle = clsx(
    'skeleton',
    {
      'skeleton-text': variant === 'text',
      'skeleton-circle': variant === 'circle',
      'skeleton-rect': variant === 'rect',
      'skeleton-card': variant === 'card',
      'skeleton-button': variant === 'button',
      'skeleton-avatar': variant === 'avatar',
      'animate-pulse': animated,
      'bg-gray-200 dark:bg-gray-700': !dark,
      'bg-gray-300 dark:bg-gray-600': dark
    },
    className
  );

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={baseStyle}
      style={{
        width: width || (variant === 'text' ? '100%' : ''),
        height: height || '',
        marginBottom: index < count - 1 ? '0.5rem' : '',
        borderRadius: variant === 'circle' ? '50%' : (variant === 'rect' ? '0.375rem' : ''),
      }}
      aria-hidden="true"
      role="presentation"
    />
  ));

  return <>{skeletons}</>;
};

export default SkeletonLoader;