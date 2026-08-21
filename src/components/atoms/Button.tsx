import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'ripple bg-primary-500 text-content-on-color hover:bg-primary-600 active:bg-primary-700 disabled:bg-primary-500/50',
  secondary: 'ripple bg-surface border border-border text-content hover:bg-surface-subtle active:bg-surface-pressed disabled:bg-surface-subtle disabled:text-content-disabled',
  ghost: 'ripple bg-transparent text-content-subtle hover:bg-surface-subtle-on-subtle hover:text-content active:bg-surface-pressed disabled:text-content-disabled',
  danger: 'ripple bg-rose-500 text-content-on-color hover:bg-rose-600 active:bg-rose-700 disabled:bg-rose-500/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm font-medium',
  md: 'h-10 px-5 text-sm font-medium',
  lg: 'h-12 px-6 text-base font-medium',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading = false, disabled, leftIcon, rightIcon, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      {...props}
      disabled={loading || disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-medium transition-colors disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {loading ? (
        <Spinner className="h-5 w-5" />
      ) : (
        <>
          {leftIcon ? <span className="inline-flex">{leftIcon}</span> : null}
          <span>{children}</span>
          {rightIcon ? <span className="inline-flex">{rightIcon}</span> : null}
        </>
      )}
    </button>
  );
});

