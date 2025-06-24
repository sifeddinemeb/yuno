import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            className="block text-sm font-medium text-secondary mb-2"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
              {startIcon}
            </div>
          )}
          
          <input
            className={clsx(
              'input-field',
              error && 'ring-2 ring-neon-red border-neon-red',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              (error && props.id ? `${props.id}-error` : undefined) ||
              (helperText && props.id ? `${props.id}-helper` : undefined)
            }
            {...props}
          />
          
          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted">
              {endIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p 
            id={props.id ? `${props.id}-error` : undefined} 
            className="mt-1 text-sm text-neon-red" 
            role="alert"
          >
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p 
            id={props.id ? `${props.id}-helper` : undefined}
            className="mt-1 text-xs text-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;