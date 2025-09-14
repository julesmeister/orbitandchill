/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

interface RenameToastState {
  isVisible: boolean;
  eventId: string;
  currentTitle: string;
}

export interface UseEventsRenameReturn {
  // State
  renameToast: RenameToastState;

  // Actions
  handleRenameEvent: (eventId: string, currentTitle: string) => void;
  handleRenameSubmit: (eventId: string, newTitle: string) => void;
  handleRenameCancel: () => void;
}

/**
 * Hook for managing event rename functionality
 */
export function useEventsRename(renameEvent: (eventId: string, newTitle: string) => void): UseEventsRenameReturn {
  const [renameToast, setRenameToast] = useState<RenameToastState>({
    isVisible: false,
    eventId: '',
    currentTitle: ''
  });

  const handleRenameEvent = (eventId: string, currentTitle: string) => {
    setRenameToast({
      isVisible: true,
      eventId,
      currentTitle
    });
  };

  const handleRenameSubmit = (eventId: string, newTitle: string) => {
    renameEvent(eventId, newTitle);
    setRenameToast({
      isVisible: false,
      eventId: '',
      currentTitle: ''
    });
  };

  const handleRenameCancel = () => {
    setRenameToast({
      isVisible: false,
      eventId: '',
      currentTitle: ''
    });
  };

  return {
    // State
    renameToast,

    // Actions
    handleRenameEvent,
    handleRenameSubmit,
    handleRenameCancel
  };
}