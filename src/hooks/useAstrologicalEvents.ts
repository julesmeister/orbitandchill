/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Custom hook for managing astrological events
 * 
 * This hook handles event generation, caching, and organization for the
 * AstrologicalEvents component. It provides a clean interface for accessing
 * real-time astronomical event data.
 */

import { useState, useEffect } from 'react';
import React from 'react';
import { differenceInDays } from 'date-fns';
import { 
  AstrologicalEvent,
  detectRetrogrades,
  detectStelliums,
  detectGrandTrines,
  detectConjunctions,
  detectMoonPhases,
  detectVoidMoon,
  detectMoonSignChanges
} from '../utils/astrologicalEventDetection';

interface UseAstrologicalEventsResult {
  // Raw event data
  allEvents: AstrologicalEvent[];
  isLoading: boolean;
  
  // Processed event data
  upcomingEvents: AstrologicalEvent[];
  eventsByType: Record<string, AstrologicalEvent[]>;
  sortedEvents: AstrologicalEvent[];
  
  // Statistics
  totalEventCount: number;
  mostCommonEventType: string | null;
  nextMajorEvent: AstrologicalEvent | null;
  
  // Actions
  refreshEvents: () => void;
}

export const useAstrologicalEvents = (): UseAstrologicalEventsResult => {
  const [realTimeEvents, setRealTimeEvents] = useState<AstrologicalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate real astronomical events
  const generateRealEvents = async () => {
    setIsLoading(true);
    const events: AstrologicalEvent[] = [];
    const today = new Date();
    
    // Scan next 90 days for astronomical events
    for (let i = 0; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      try {
        // Check conjunctions less frequently since they last for weeks
        if (i % 14 === 0) { // Every 2 weeks for slow-moving planet conjunctions
          const [retrogrades, stelliums, grandTrines, conjunctions] = await Promise.all([
            detectRetrogrades(date),
            detectStelliums(date), 
            detectGrandTrines(date),
            detectConjunctions(date)
          ]);
          
          events.push(...retrogrades, ...stelliums, ...grandTrines, ...conjunctions);
        }
        
        // Check moon events every few days since they change more frequently
        if (i % 3 === 0) {
          const [moonPhases, voidMoon, moonSignChanges] = await Promise.all([
            detectMoonPhases(date),
            detectVoidMoon(date),
            detectMoonSignChanges(date)
          ]);
          
          events.push(...moonPhases, ...voidMoon, ...moonSignChanges);
        }
      } catch (error) {
        console.warn(`Error calculating events for ${date.toDateString()}:`, error);
      }
      
      // Add small delay to prevent overwhelming the calculation engine
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Deduplicate events more intelligently
    const uniqueEvents = events.filter((event, index, array) => {
      // First occurrence of this ID
      const firstOccurrence = array.findIndex(e => e.id === event.id) === index;
      if (firstOccurrence) return true;
      
      // For conjunctions, avoid duplicates within 1 week
      if (event.type === 'conjunction') {
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          Math.abs(e.date.getTime() - event.date.getTime()) < 7 * 24 * 60 * 60 * 1000
        );
        return !isDuplicate;
      }
      
      // For other events, check exact date and name match
      return array.findIndex(e => e.name === event.name && e.date.getTime() === event.date.getTime()) === index;
    });
    
    setRealTimeEvents(uniqueEvents.sort((a, b) => a.date.getTime() - b.date.getTime()));
    setIsLoading(false);
  };

  // Initialize events on mount
  useEffect(() => {
    generateRealEvents();
  }, []);

  // Memoize sorted events using real-time data
  const sortedEvents = React.useMemo(() => 
    [...realTimeEvents].sort((a, b) => a.date.getTime() - b.date.getTime()),
    [realTimeEvents]
  );

  // Memoize upcoming events (next 90 days)
  const upcomingEvents = React.useMemo(() => 
    sortedEvents.filter(event => {
      const daysUntil = differenceInDays(event.date, new Date());
      return daysUntil >= 0 && daysUntil <= 90;
    }),
    [sortedEvents]
  );

  // Memoize events by type
  const eventsByType = React.useMemo(() => 
    realTimeEvents.reduce((acc, event) => {
      if (!acc[event.type]) acc[event.type] = [];
      acc[event.type].push(event);
      return acc;
    }, {} as Record<string, AstrologicalEvent[]>),
    [realTimeEvents]
  );

  // Memoize statistics
  const statistics = React.useMemo(() => {
    const totalEventCount = realTimeEvents.length;
    
    // Find most common event type
    const mostCommonEventType = Object.entries(eventsByType).length > 0 
      ? Object.entries(eventsByType)
          .sort(([,a], [,b]) => b.length - a.length)[0]?.[0] || null
      : null;
    
    // Find next major event
    const nextMajorEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    
    return {
      totalEventCount,
      mostCommonEventType,
      nextMajorEvent
    };
  }, [realTimeEvents, eventsByType, upcomingEvents]);

  return {
    // Raw data
    allEvents: realTimeEvents,
    isLoading,
    
    // Processed data
    upcomingEvents,
    eventsByType,
    sortedEvents,
    
    // Statistics
    totalEventCount: statistics.totalEventCount,
    mostCommonEventType: statistics.mostCommonEventType,
    nextMajorEvent: statistics.nextMajorEvent,
    
    // Actions
    refreshEvents: generateRealEvents
  };
};