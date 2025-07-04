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
  if (timeDiff <= 0) return 'Now';
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
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