// Adapted from shadcn/ui toast component
import { useState, useCallback } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 3000 }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, description, variant, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((prevToasts) => prevToasts.filter(t => t.id !== toastId));
    } else {
      setToasts([]);
    }
  }, []);

  return { toast, dismiss, toasts };
} 