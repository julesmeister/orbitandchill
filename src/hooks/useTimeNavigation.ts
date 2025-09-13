/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import {
  navigateTime,
  validateMinuteIncrement,
  extractMinutes
} from '../utils/timeNavigation';

interface UseTimeNavigationProps {
  initialTime: string;
  initialIncrement?: number;
}

interface UseTimeNavigationReturn {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  minuteIncrement: number;
  handleNavigateMinutes: (direction: 'prev' | 'next') => void;
  updateMinuteIncrement: (newIncrement: string) => void;
  getCurrentMinutes: () => string;
}

export function useTimeNavigation({
  initialTime,
  initialIncrement = 5
}: UseTimeNavigationProps): UseTimeNavigationReturn {
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [minuteIncrement, setMinuteIncrement] = useState(initialIncrement);

  // Update selectedTime when initialTime changes (only if different)
  useEffect(() => {
    setSelectedTime(prev => {
      if (prev !== initialTime) {
        return initialTime;
      }
      return prev;
    });
  }, [initialTime]);

  // Navigate minutes with left/right controls using the increment value
  const handleNavigateMinutes = useCallback((direction: 'prev' | 'next') => {
    const newTime = navigateTime(selectedTime, minuteIncrement, direction);
    setSelectedTime(newTime);
  }, [selectedTime, minuteIncrement]);

  // Update the minute increment value
  const updateMinuteIncrement = useCallback((newIncrement: string) => {
    const validIncrement = validateMinuteIncrement(newIncrement);
    if (validIncrement !== null) {
      setMinuteIncrement(validIncrement);
    }
  }, []);

  // Get current minutes for the increment input
  const getCurrentMinutes = useCallback(() => extractMinutes(selectedTime), [selectedTime]);

  return {
    selectedTime,
    setSelectedTime,
    minuteIncrement,
    handleNavigateMinutes,
    updateMinuteIncrement,
    getCurrentMinutes
  };
}