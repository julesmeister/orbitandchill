/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Event utility functions for event management and creation
 */

import type { AstrologicalEvent } from '../store/eventsStore';

/**
 * Create a new bookmarked event object
 * 
 * @param eventTitle - Title of the event
 * @param eventDate - Date of the event
 * @param eventTime - Time of the event
 * @param isOptimal - Whether this is optimal timing
 * @param optimalScore - Score if optimal timing
 * @returns New event object
 */
export function createNewBookmarkedEvent(
  eventTitle: string,
  eventDate: string, 
  eventTime: string,
  userId: string,
  isOptimal: boolean = false,
  optimalScore: number | null = null
): AstrologicalEvent {
  return {
    id: `bookmark_${Date.now()}`,
    userId,
    title: eventTitle,
    date: eventDate,
    time: eventTime,
    type: 'benefic' as const,
    description: isOptimal ? `Optimal timing (Score: ${optimalScore}/10)` : 'Event chart',
    aspects: [],
    planetaryPositions: [],
    score: optimalScore || 7,
    isGenerated: false,
    createdAt: new Date().toISOString(),
    isBookmarked: true
  };
}

/**
 * Find existing event in events array
 * 
 * @param events - Array of events to search
 * @param eventDate - Date to match
 * @param eventTime - Time to match  
 * @param eventTitle - Title to match
 * @returns Found event or undefined
 */
export function findExistingEvent(
  events: AstrologicalEvent[],
  eventDate: string,
  eventTime: string,
  eventTitle: string
): AstrologicalEvent | undefined {
  return events.find(e => 
    e.date === eventDate && 
    e.time === eventTime && 
    e.title === eventTitle
  );
}

/**
 * Format date for display in event charts
 * 
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Generate event chart name/title
 * 
 * @param eventTitle - Base event title
 * @param eventDate - Event date
 * @param eventTime - Event time (24-hour format)
 * @returns Formatted chart name
 */
export function generateEventChartName(
  eventTitle: string,
  eventDate: string,
  eventTime: string
): string {
  const formattedDate = formatEventDate(eventDate);
  const [hours, minutes] = eventTime.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  
  return `${eventTitle} - ${formattedDate} ${formattedTime}`;
}