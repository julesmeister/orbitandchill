/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface ConfirmationToastState {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText: string;
  cancelText: string;
  confirmButtonColor: 'red' | 'green' | 'blue';
}

export function useConfirmationToast() {
  const [toast, setToast] = useState<ConfirmationToastState>({
    isVisible: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonColor: 'red'
  });

  const showConfirmation = useCallback(({
    title,
    message,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonColor = 'red' as const
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: 'red' | 'green' | 'blue';
  }) => {
    setToast({
      isVisible: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      confirmButtonColor
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showConfirmation,
    hideConfirmation
  };
}