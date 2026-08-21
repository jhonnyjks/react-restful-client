import type { ReactNode } from 'react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, actionLabel, onAction, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-large border border-dashed border-border bg-surface-subtle px-6 py-12 text-center',
        className,
      )}
    >
      {icon ? <div className="text-3xl text-primary-500">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-content">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-content-subtle">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="primary" onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

