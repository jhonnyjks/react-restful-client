import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from '@/components/atoms/Spinner';

type ResourceStateProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  children: ReactNode;
  onRetry?: () => void;
  className?: string;
};

export function ResourceState({
  isLoading,
  isError,
  errorMessage,
  children,
  onRetry,
  className,
}: ResourceStateProps) {
  if (isLoading) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 py-12 text-slate-600', className)}>
        <Spinner className="h-8 w-8 text-primary-500" />
        <p className="text-sm font-medium">Carregando informações...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
          Erro
        </span>
        <p className="text-sm text-slate-600">{errorMessage ?? 'Não foi possível carregar os dados.'}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-primary-400"
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}

