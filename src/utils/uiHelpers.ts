/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * UI helper utilities for common patterns and calculations
 */

/**
 * Calculate grid border classes for time options grid
 * 
 * @param index - Current item index
 * @param totalItems - Total number of items
 * @param columns - Number of columns in grid
 * @returns Border class names
 */
export function calculateGridBorders(
  index: number, 
  totalItems: number, 
  columns: number = 7
): string {
  const isLastColumn = (index + 1) % columns === 0 || index === totalItems - 1;
  const itemsInLastRow = totalItems % columns === 0 ? columns : totalItems % columns;
  const lastRowStartIndex = totalItems - itemsInLastRow;
  const isInLastRow = index >= lastRowStartIndex;

  const borderClasses = [];
  
  if (!isInLastRow) {
    borderClasses.push('border-b');
  }
  
  if (!isLastColumn) {
    borderClasses.push('border-r');
  }
  
  return borderClasses.join(' ');
}

/**
 * Generate conditional class names for selected/unselected states
 * 
 * @param isSelected - Whether item is selected
 * @param selectedClasses - Classes for selected state
 * @param unselectedClasses - Classes for unselected state
 * @returns Combined class string
 */
export function getSelectionClasses(
  isSelected: boolean,
  selectedClasses: string,
  unselectedClasses: string
): string {
  return isSelected ? selectedClasses : unselectedClasses;
}

/**
 * Create bookmark button classes based on bookmark state
 * 
 * @param isBookmarked - Whether item is bookmarked
 * @returns Bookmark button class string
 */
export function getBookmarkClasses(isBookmarked: boolean): string {
  const baseClasses = 'ml-4 p-3 rounded-xl transition-all duration-200';
  const bookmarkedClasses = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
  const unbookmarkedClasses = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  
  return `${baseClasses} ${isBookmarked ? bookmarkedClasses : unbookmarkedClasses}`;
}

/**
 * Generate loading state content
 * 
 * @param eventDate - Event date for loading message
 * @param selectedTime - Selected time for loading message  
 * @param formatTime12Hour - Time formatting function
 * @returns Loading content object
 */
export function createLoadingContent(
  eventDate?: string,
  selectedTime?: string,
  formatTime12Hour?: (time: string) => string
) {
  if (!eventDate || !selectedTime || !formatTime12Hour) {
    return {
      message: 'Loading chart...',
      formattedDate: '',
      formattedTime: ''
    };
  }

  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    message: `Generating chart for ${formattedDate} at ${formatTime12Hour(selectedTime)}...`,
    formattedDate,
    formattedTime: formatTime12Hour(selectedTime)
  };
}

/**
 * Generate time input classes based on optimal timing state
 * 
 * @param isOptimal - Whether timing is optimal
 * @param selectedTime - Current selected time
 * @param eventTime - Original event time
 * @returns Time input class string
 */
export function getTimeInputClasses(
  isOptimal: boolean,
  selectedTime: string,
  eventTime: string
): string {
  const baseClasses = 'px-3 py-2 border-2 border-black border-r-0 text-sm font-medium h-[38px] transition-all duration-200 focus:outline-none';
  const optimalClasses = 'bg-yellow-50 text-black';
  const normalClasses = 'bg-white text-black focus:bg-gray-50';
  
  const conditionalClasses = (isOptimal && selectedTime === eventTime) 
    ? optimalClasses 
    : normalClasses;
    
  return `${baseClasses} ${conditionalClasses}`;
}

/**
 * Validate component props for event chart
 * 
 * @param eventDate - Event date to validate
 * @param user - User object to validate
 * @returns Validation result
 */
export function validateEventChartProps(
  eventDate: string | null,
  user: any
): { isValid: boolean; error?: string } {
  if (!eventDate) {
    return {
      isValid: false,
      error: 'No event date provided.'
    };
  }
  
  if (!user?.birthData) {
    return {
      isValid: false,
      error: 'User birth data required for chart generation.'
    };
  }
  
  return { isValid: true };
}