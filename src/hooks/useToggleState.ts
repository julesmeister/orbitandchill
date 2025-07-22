/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from 'react';

export interface UseToggleStateReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

export function useToggleState(initialValue: boolean = false): UseToggleStateReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  };
}

// Convenience hook for multiple toggles
export interface UseMultipleToggleStatesReturn {
  [key: string]: UseToggleStateReturn;
}

export function useMultipleToggleStates(
  keys: string[], 
  initialValues?: Record<string, boolean>
): UseMultipleToggleStatesReturn {
  const toggleStates: UseMultipleToggleStatesReturn = {};
  
  keys.forEach(key => {
    const initialValue = initialValues?.[key] ?? false;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    toggleStates[key] = useToggleState(initialValue);
  });

  return toggleStates;
}