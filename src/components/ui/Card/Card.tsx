import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glass-lite' | 'glow';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('rounded-xl transition-all duration-300', {
          'card': variant === 'default',
          'glass-real p-8 hover:bg-white/10 dark:hover:bg-white/20': variant === 'glass',
          'glass-lite p-8': variant === 'glass-lite',
          'card neon-glow p-8': variant === 'glow',
        }, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;