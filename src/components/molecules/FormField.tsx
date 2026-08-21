import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
};

export function FormField({ label, htmlFor, description, error, children, required, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-content">
          {label}
          {required ? <span className="ml-1 text-xs font-medium text-rose-500">*</span> : null}
        </label>
        {description ? <span className="text-xs text-content-subtle">{description}</span> : null}
      </div>
      {children}
      {error ? <span className="text-xs font-medium text-rose-500">{error}</span> : null}
    </div>
  );
}

