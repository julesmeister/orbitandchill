/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

export type ToastStatus = 'loading' | 'success' | 'error';

interface ToastState {
  title: string;
  message: string;
  status: ToastStatus;
  isVisible: boolean;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (title: string, message: string, status: ToastStatus) => void;
  hideToast: () => void;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>({
    title: '',
    message: '',
    status: 'success',
    isVisible: false
  });

  const showToast = (title: string, message: string, status: ToastStatus) => {
    setToast({ title, message, status, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return {
    toast,
    showToast,
    hideToast
  };
}