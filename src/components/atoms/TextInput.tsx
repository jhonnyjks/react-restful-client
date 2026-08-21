import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, hasError = false, startAdornment, endAdornment, readOnly, disabled, ...props },
  ref,
) {
  const isReadOnly = readOnly || disabled;
  
  return (
    <div
      className={cn(
        'flex h-10 items-center gap-2 rounded-medium border bg-surface px-3 transition-colors focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/20',
        hasError ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500/20' : 'border-border',
        isReadOnly && 'bg-surface-subtle cursor-not-allowed opacity-75',
        className,
      )}
    >
      {startAdornment ? <span className="text-content-subtle">{startAdornment}</span> : null}
      <input
        ref={ref}
        readOnly={readOnly}
        disabled={disabled}
        {...props}
        className={cn(
          'h-full w-full border-none bg-transparent text-sm text-content placeholder:text-content-subtle focus:outline-none',
          isReadOnly && 'cursor-not-allowed',
        )}
      />
      {endAdornment ? <span className="text-content-subtle">{endAdornment}</span> : null}
    </div>
  );
});

