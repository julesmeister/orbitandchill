/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Time navigation utilities for handling minute/hour navigation with proper boundary wrapping
 */

/**
 * Navigate time by a specified number of minutes in either direction
 * Handles hour and day boundary wrapping automatically
 * 
 * @param currentTime - Current time in HH:MM format (24-hour)
 * @param increment - Number of minutes to add/subtract
 * @param direction - Direction to navigate ('next' for forward, 'prev' for backward)
 * @returns New time in HH:MM format
 */
export function navigateTime(
  currentTime: string, 
  increment: number, 
  direction: 'next' | 'prev'
): string {
  const [hours, minutes] = currentTime.split(':').map(Number);
  let newHours = hours;
  let newMinutes = minutes;
  
  if (direction === 'next') {
    newMinutes = minutes + increment;
    while (newMinutes >= 60) {
      newMinutes = newMinutes - 60;
      newHours = newHours + 1;
      if (newHours >= 24) {
        newHours = 0; // Wrap to next day
      }
    }
  } else {
    newMinutes = minutes - increment;
    while (newMinutes < 0) {
      newMinutes = newMinutes + 60;
      newHours = newHours - 1;
      if (newHours < 0) {
        newHours = 23; // Wrap to previous day
      }
    }
  }
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

/**
 * Validate and normalize minute increment value
 * 
 * @param increment - Increment value as string
 * @returns Valid increment number or null if invalid
 */
export function validateMinuteIncrement(increment: string): number | null {
  const incrementNum = parseInt(increment);
  if (isNaN(incrementNum) || incrementNum < 1 || incrementNum > 59) {
    return null;
  }
  return incrementNum;
}

/**
 * Convert 24-hour time to 12-hour format with AM/PM
 * 
 * @param time24 - Time in HH:MM format (24-hour)
 * @returns Time in 12-hour format with AM/PM
 */
export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Extract minutes from time string
 * 
 * @param time - Time in HH:MM format
 * @returns Minutes as string
 */
export function extractMinutes(time: string): string {
  const [, minutes] = time.split(':');
  return minutes;
}

/**
 * Validate time format (HH:MM)
 * 
 * @param time - Time string to validate
 * @returns True if valid HH:MM format
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}