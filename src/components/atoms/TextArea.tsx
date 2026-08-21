import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, hasError = false, readOnly, disabled, ...props },
  ref,
) {
  const isReadOnly = readOnly || disabled;

  return (
    <textarea
      ref={ref}
      readOnly={readOnly}
      disabled={disabled}
      {...props}
      className={cn(
        'w-full rounded-medium border bg-surface px-3 py-2 text-sm text-content placeholder:text-content-subtle transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/20',
        hasError ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-border',
        isReadOnly && 'bg-surface-subtle cursor-not-allowed opacity-75',
        className,
      )}
    />
  );
});
