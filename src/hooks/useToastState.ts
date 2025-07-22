/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';

export type ToastStatus = 'loading' | 'success' | 'error' | 'info';

export interface ToastState {
  isVisible: boolean;
  title: string;
  message: string;
  status: ToastStatus;
}

export interface UseToastStateReturn {
  toast: ToastState;
  showToast: (title: string, message: string, status: ToastStatus) => void;
  hideToast: () => void;
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
  showInfoToast: (title: string, message: string) => void;
}

export function useToastState(): UseToastStateReturn {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    title: '',
    message: '',
    status: 'info'
  });

  const showToast = (title: string, message: string, status: ToastStatus) => {
    setToast({
      isVisible: true,
      title,
      message,
      status
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const showLoadingToast = (title: string, message: string) => {
    showToast(title, message, 'loading');
  };

  const showSuccessToast = (title: string, message: string) => {
    showToast(title, message, 'success');
  };

  const showErrorToast = (title: string, message: string) => {
    showToast(title, message, 'error');
  };

  const showInfoToast = (title: string, message: string) => {
    showToast(title, message, 'info');
  };

  return {
    toast,
    showToast,
    hideToast,
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast
  };
}