import { useEffect } from 'react';
import { clsx } from 'clsx';
import { useToastStore } from '@/store/toastStore';
import { cn } from '@/utils/cn';

const variantStyles: Record<string, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-primary-200 bg-primary-50 text-primary-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
};

export function Toaster() {
  const { toasts, remove } = useToastStore();

  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (!toast.duration) {
        return null;
      }
      return window.setTimeout(() => remove(toast.id), toast.duration);
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) {
          clearTimeout(timer);
        }
      });
    };
  }, [remove, toasts]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 p-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-lg transition-all',
            variantStyles[toast.variant ?? 'info'],
          )}
        >
          <div className="flex-1">
            {toast.title ? <p className="text-sm font-semibold">{toast.title}</p> : null}
            {toast.description ? <p className="mt-1 text-sm leading-5 text-slate-700">{toast.description}</p> : null}
          </div>
          <button
            type="button"
            aria-label="Fechar notificação"
            className={clsx(
              'rounded-full border border-transparent px-2 py-1 text-xs font-medium transition-colors',
              'hover:border-current hover:bg-white/40',
            )}
            onClick={() => remove(toast.id)}
          >
            Fechar
          </button>
        </div>
      ))}
    </div>
  );
}

