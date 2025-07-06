/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Custom hook for managing countdown timers
 * 
 * This hook provides countdown functionality for events with automatic
 * updates and proper cleanup. It can handle multiple countdowns simultaneously.
 */

import { useState, useEffect } from 'react';
import { AstrologicalEvent } from '../utils/astrologicalEventDetection';

interface CountdownData {
  [eventId: string]: string;
}

interface UseCountdownTimerResult {
  countdowns: CountdownData;
  getCountdownForEvent: (eventId: string) => string | undefined;
}

/**
 * Formats the time difference into a readable countdown string
 */
const formatCountdown = (timeDiff: number): string => {
  // For current/ongoing events (very close to now)
  if (Math.abs(timeDiff) < 60000) return 'Now'; // Within 1 minute
  
  const absDiff = Math.abs(timeDiff);
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  let timeString;
  if (days > 0) {
    // Only show hours if they're greater than 0
    timeString = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  } else {
    timeString = `${hours}h ${minutes}m`;
  }
  
  // For past events, show "X ago"
  if (timeDiff < 0) {
    return `${timeString} ago`;
  }
  
  // For future events, just show the time
  return timeString;
};

/**
 * Calculates countdown data for all provided events
 */
const calculateCountdowns = (events: AstrologicalEvent[]): CountdownData => {
  const now = new Date();
  const countdowns: CountdownData = {};
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const timeDiff = eventDate.getTime() - now.getTime();
    countdowns[event.id] = formatCountdown(timeDiff);
  });
  
  return countdowns;
};

/**
 * Custom hook for managing countdown timers for astrological events
 * 
 * @param events - Array of events to create countdowns for
 * @param updateInterval - How often to update countdowns in milliseconds (default: 60000 = 1 minute)
 */
export const useCountdownTimer = (
  events: AstrologicalEvent[] = [], 
  updateInterval: number = 60000
): UseCountdownTimerResult => {
  const [countdowns, setCountdowns] = useState<CountdownData>({});

  // Update countdown timers
  const updateCountdowns = () => {
    if (events.length === 0) {
      setCountdowns({});
      return;
    }
    
    const newCountdowns = calculateCountdowns(events);
    setCountdowns(newCountdowns);
  };

  // Set up interval for updating countdowns
  useEffect(() => {
    // Initial calculation
    updateCountdowns();
    
    // Set up interval for regular updates
    const interval = setInterval(updateCountdowns, updateInterval);
    
    // Cleanup on unmount or when events change
    return () => clearInterval(interval);
  }, [events, updateInterval]);

  // Helper function to get countdown for a specific event
  const getCountdownForEvent = (eventId: string): string | undefined => {
    return countdowns[eventId];
  };

  return {
    countdowns,
    getCountdownForEvent
  };
};