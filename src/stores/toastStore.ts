import { create } from 'zustand';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: React.ReactNode;
  severity: ToastSeverity;
  duration: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (message: React.ReactNode, severity?: ToastSeverity, duration?: number) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastIdCounter = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (message, severity = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${++toastIdCounter}`;
    const newToast: ToastItem = { id, message, severity, duration };

    set((state) => ({
      // Keep last 4 toasts max to avoid screen clutter
      toasts: [...state.toasts.slice(-3), newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

// Imperative helper functions for convenience
export const toast = {
  success: (message: React.ReactNode, duration?: number) =>
    useToastStore.getState().addToast(message, 'success', duration),
  error: (message: React.ReactNode, duration?: number) =>
    useToastStore.getState().addToast(message, 'error', duration ?? 5000),
  warning: (message: React.ReactNode, duration?: number) =>
    useToastStore.getState().addToast(message, 'warning', duration),
  info: (message: React.ReactNode, duration?: number) =>
    useToastStore.getState().addToast(message, 'info', duration),
  dismiss: (id: string) => useToastStore.getState().removeToast(id),
  clear: () => useToastStore.getState().clearToasts(),
};
