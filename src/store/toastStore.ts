import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastState = {
  toasts: ToastMessage[];
  push: (toast: Omit<ToastMessage, 'id'> & { id?: string }) => string;
  remove: (id: string) => void;
  clear: () => void;
};

const randomId = () => Math.random().toString(36).slice(2, 10);

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = toast.id ?? randomId();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          duration: toast.duration ?? 5000,
          variant: toast.variant ?? 'info',
          title: toast.title,
          description: toast.description,
        },
      ],
    }));
    return id;
  },
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clear: () => set({ toasts: [] }),
}));

