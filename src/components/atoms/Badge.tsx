import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'outline' | 'subtle';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-500 text-content-on-color',
  outline: 'border border-primary-500 text-primary-500 bg-transparent',
  subtle: 'bg-surface-subtle text-content-subtle',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center rounded-small px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    />
  );
}

