import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, hasError = false, children, disabled, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'relative flex h-10 items-center overflow-hidden rounded-medium border bg-surface px-3 transition focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/20',
        hasError ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/20' : 'border-border',
        disabled && 'bg-surface-subtle cursor-not-allowed opacity-75',
        className,
      )}
    >
      <select
        ref={ref}
        disabled={disabled}
        {...props}
        className={cn(
          'h-full w-full appearance-none border-none bg-transparent text-sm text-content placeholder:text-content-subtle focus:outline-none',
          disabled && 'cursor-not-allowed',
        )}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 text-content-subtle">▾</span>
    </div>
  );
});

