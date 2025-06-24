import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-lg hover:shadow-neon-blue/25 hover:scale-105 dark:disabled:text-gray-300 disabled:text-gray-600 disabled:hover:scale-100 disabled:hover:shadow-none',
        secondary: 'glass text-white hover:bg-glass-light hover:scale-105 disabled:hover:scale-100 disabled:hover:bg-transparent',
        ghost: 'text-neon-blue hover:text-neon-purple hover:bg-glass-light disabled:text-gray-400 disabled:hover:bg-transparent',
        danger: 'bg-neon-red text-white hover:bg-red-600 hover:shadow-lg hover:shadow-neon-red/25 disabled:bg-red-300 dark:disabled:bg-red-900 disabled:hover:shadow-none',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;