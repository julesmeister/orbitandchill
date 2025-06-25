/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Time options and period utilities for event chart time selection
 */

export interface TimeOption {
  value: string;        // 24-hour format (HH:MM)
  label: string;        // Full label with period description
  display: string;      // Display format (12-hour)
}

/**
 * Get default time options for event chart selection
 * 
 * @returns Array of predefined time options
 */
export function getDefaultTimeOptions(): TimeOption[] {
  return [
    { value: '06:00', label: '6:00 AM - Dawn', display: '6:00 AM' },
    { value: '09:00', label: '9:00 AM - Morning', display: '9:00 AM' },
    { value: '12:00', label: '12:00 PM - Noon', display: '12:00 PM' },
    { value: '15:00', label: '3:00 PM - Afternoon', display: '3:00 PM' },
    { value: '18:00', label: '6:00 PM - Evening', display: '6:00 PM' },
    { value: '21:00', label: '9:00 PM - Night', display: '9:00 PM' },
    { value: '00:00', label: '12:00 AM - Midnight', display: '12:00 AM' },
  ];
}

/**
 * Create a time option object
 * 
 * @param time24 - Time in 24-hour format (HH:MM)
 * @param period - Period description (Dawn, Morning, etc.)
 * @returns TimeOption object
 */
export function createTimeOption(time24: string, period?: string): TimeOption {
  const [hours, minutes] = time24.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const display = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  const label = period 
    ? `${display} - ${period}`
    : display;
    
  return {
    value: time24,
    label,
    display
  };
}

/**
 * Get time period description based on hour
 * 
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Period description
 */
export function getTimePeriod(hour: number): string {
  if (hour >= 5 && hour < 8) return 'Dawn';
  if (hour >= 8 && hour < 12) return 'Morning';
  if (hour === 12) return 'Noon';
  if (hour > 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 20) return 'Evening';
  if (hour >= 20 || hour < 5) return 'Night';
  if (hour === 0) return 'Midnight';
  return 'Day';
}

/**
 * Generate time options for a specific range
 * 
 * @param startHour - Starting hour (0-23)
 * @param endHour - Ending hour (0-23)
 * @param interval - Minute interval between options
 * @returns Array of time options
 */
export function generateTimeRange(
  startHour: number,
  endHour: number,
  interval: number = 60
): TimeOption[] {
  const options: TimeOption[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const period = getTimePeriod(hour);
      options.push(createTimeOption(time24, period));
    }
  }
  
  return options;
}