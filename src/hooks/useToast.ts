import { useCallback } from 'react';
import { useToastStore } from '@/store/toastStore';
import type { ToastVariant } from '@/store/toastStore';

type ToastPayload = {
  title?: string;
  description?: string;
  duration?: number;
  id?: string;
};

export function useToast() {
  const pushToast = useToastStore((state) => state.push);
  const removeToast = useToastStore((state) => state.remove);

  const push = useCallback(
    (variant: ToastVariant, payload: ToastPayload) =>
      pushToast({
        id: payload.id,
        title: payload.title,
        description: payload.description,
        duration: payload.duration,
        variant,
      }),
    [pushToast],
  );

  const success = useCallback((payload: ToastPayload) => push('success', payload), [push]);
  const error = useCallback((payload: ToastPayload) => push('error', payload), [push]);
  const info = useCallback((payload: ToastPayload) => push('info', payload), [push]);
  const warning = useCallback((payload: ToastPayload) => push('warning', payload), [push]);

  return {
    success,
    error,
    info,
    warning,
    remove: removeToast,
  };
}

