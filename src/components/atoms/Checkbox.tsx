import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, children, ...props },
  ref,
) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3 text-sm text-slate-700', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="h-4 w-4 rounded border border-secondary-400/80 text-primary-500 focus:ring-primary-400"
        {...props}
      />
      {children ? <span>{children}</span> : null}
    </label>
  );
});

