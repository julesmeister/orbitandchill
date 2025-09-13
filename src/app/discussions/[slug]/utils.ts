/* eslint-disable @typescript-eslint/no-unused-vars */

import { formatShortDate } from '@/utils/dateFormatting';

// Synapsas color mapping for categories
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Natal Chart Analysis': return '#6bdbff';     // blue
    case 'Transits & Predictions': return '#f2e356';   // yellow
    case 'Chart Reading Help': return '#51bd94';       // green
    case 'Synapsas & Compatibility': return '#ff91e9'; // purple
    case 'Mundane Astrology': return '#19181a';        // black
    case 'Learning Resources': return '#6bdbff';       // blue
    case 'General Discussion': return '#51bd94';       // green
    default: return '#6bdbff';                          // default blue
  }
};

// Get appropriate text color for category badges
export const getCategoryTextColor = (category: string) => {
  switch (category) {
    case 'Mundane Astrology': return '#ffffff';        // white text for black background
    default: return '#000000';                          // black text for other backgrounds
  }
};

// Safely parse date - handle timestamps, strings, and date formats
export const getValidDate = (dateValue: string | Date | number) => {
  try {
    // Handle Unix timestamps (from database)
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue * 1000); // Convert from Unix timestamp
      return isNaN(date.getTime()) ? new Date() : date;
    }
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
};

// Format date for display without time to avoid "00:00" issue
export const formatDate = (date: Date) => {
  return formatShortDate(date);
};