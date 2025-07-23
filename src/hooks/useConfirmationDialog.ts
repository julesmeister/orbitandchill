/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

interface ConfirmationState {
  title: string;
  message: string;
  isVisible: boolean;
  onConfirm: () => void;
  metadata?: any;
}

interface UseConfirmationDialogReturn {
  confirmationState: ConfirmationState;
  showConfirmation: (title: string, message: string, onConfirm: () => void, metadata?: any) => void;
  hideConfirmation: () => void;
}

export function useConfirmationDialog(): UseConfirmationDialogReturn {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    title: '',
    message: '',
    isVisible: false,
    onConfirm: () => {},
    metadata: null
  });

  const showConfirmation = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    metadata?: any
  ) => {
    setConfirmationState({
      title,
      message,
      isVisible: true,
      onConfirm,
      metadata
    });
  };

  const hideConfirmation = () => {
    setConfirmationState(prev => ({ 
      ...prev, 
      isVisible: false 
    }));
  };

  return {
    confirmationState,
    showConfirmation,
    hideConfirmation
  };
}