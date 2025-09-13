/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { useAstronomicalContext } from './useAstronomicalContext';

interface ToastState {
  message: string;
  isVisible: boolean;
}

export function useFilterToast(currentDate?: Date) {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    isVisible: false
  });

  const { getContextualMessage } = useAstronomicalContext(currentDate);

  const showToast = useCallback((message: string) => {
    setToast({
      message,
      isVisible: true
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const showFilterResult = useCallback((filterName: string, filterValue: string) => {
    // Use astronomical context for Mercury, Moon Phase, and Traditional filters
    const contextualFilters = ['Mercury', 'Moon Phase', 'Traditional'];
    
    let message = '';
    
    if (contextualFilters.includes(filterName)) {
      message = getContextualMessage(filterName, filterValue);
    } else {
      // Handle other filters with static educational context
      if (filterName === 'Dignity' && filterValue === 'All Dignity') {
        message = `Showing all planetary dignities - stronger dignified planets generally provide better timing`;
      } else if (filterName === 'Malefics' && filterValue === 'All Malefics') {
        message = `Showing all malefic aspects - soft aspects or contained malefics are traditionally preferred`;
      } else if (filterName === 'Score' && filterValue === 'All Scores') {
        message = `Showing all timing scores - higher scores typically indicate more favorable conditions`;
      } else {
        // For specific filter selections, show what they chose
        if (filterValue === 'No Debility') {
          message = `Filtering for planets without debility - ensures stronger planetary support`;
        } else if (filterValue === 'Exalted') {
          message = `Filtering for exalted planets - maximum planetary strength and favorable outcomes`;
        } else if (filterValue === 'Soft Aspects') {
          message = `Filtering for soft malefic aspects - minimizes challenging planetary influences`;
        } else if (filterValue === 'No Mars/Saturn') {
          message = `Filtering to avoid Mars/Saturn - eliminating the most challenging planetary combinations`;
        } else if (filterValue === '6+ Score') {
          message = `Filtering for 6+ scores - focusing on good quality timing`;
        } else if (filterValue === '8+ Score') {
          message = `Filtering for 8+ scores - showing only excellent timing opportunities`;
        } else if (filterValue === 'Benefics Angular') {
          message = `Filtering for angular benefics - Venus & Jupiter in prominent houses (1st, 4th, 7th, 10th)`;
        } else {
          message = `Now filtering for ${filterName}: ${filterValue}`;
        }
      }
    }

    showToast(message);
  }, [showToast, getContextualMessage]);

  const showQuickFilterResult = useCallback((filterName: string, isActive: boolean) => {
    let message = '';
    
    if (isActive) {
      if (filterName === 'Hide Challenging') {
        message = `Hiding challenging dates - showing only favorable timing windows`;
      } else if (filterName === 'Combos Only') {
        message = `Showing combo events only - multiple planetary influences on single dates`;
      } else if (filterName === 'Show Aspects') {
        message = `Showing planetary aspects - angular relationships between planets`;
      } else {
        message = `${filterName} filter activated`;
      }
    } else {
      if (filterName === 'Hide Challenging') {
        message = `Now showing all dates including challenging ones - be mindful of difficult timing`;
      } else if (filterName === 'Combos Only') {
        message = `Showing all events including single planetary influences`;
      } else if (filterName === 'Show Aspects') {
        message = `Hiding planetary aspects - showing other event types`;
      } else {
        message = `${filterName} filter removed`;
      }
    }

    showToast(message);
  }, [showToast]);

  const showResetResult = useCallback(() => {
    showToast(`Filters reset to optimal defaults - Mercury direct, waxing moon, and favorable conditions selected`);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showFilterResult,
    showQuickFilterResult,
    showResetResult
  };
}