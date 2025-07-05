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
  detectAllEvents,
  detectMoonPhases,
  detectVoidMoon,
  detectMoonSignChanges,
  detectRetrogrades,
  detectConjunctions,
  detectStelliums,
  detectGrandTrines
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
        // Use comprehensive detection with smart frequency
        // Check at different intervals based on event types
        if (i === 0 || i % 14 === 0) {
          // Every 14 days: Check retrogrades and grand trines (very slow)
          const verySlowEvents = await Promise.all([
            detectRetrogrades(date),
            detectGrandTrines(date)
          ]);
          events.push(...verySlowEvents.flat());
        }
        
        if (i === 0 || i % 5 === 0) {
          // Every 5 days: Check stelliums (they can change with fast planets)
          const stelliumEvents = await detectStelliums(date);
          events.push(...stelliumEvents);
        }
        
        if (i === 0 || i % 7 === 0) {
          // Every 7 days: Check conjunctions (faster than retrogrades but slower than moon)
          const conjunctionEvents = await detectConjunctions(date);
          events.push(...conjunctionEvents);
        }
        
        // Check moon events daily (they are precise astronomical events)
        const moonEvents = await Promise.all([
          detectMoonPhases(date),
          detectVoidMoon(date), 
          detectMoonSignChanges(date)
        ]);
        events.push(...moonEvents.flat());
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
      // For ongoing events (retrogrades, conjunctions, stelliums), only show the first occurrence
      if (event.type === 'retrograde') {
        // Retrogrades last weeks/months - dedupe within their full duration
        const getDedupeDays = (eventName: string) => {
          if (eventName.toLowerCase().includes('mercury')) return 21; // 3 weeks
          if (eventName.toLowerCase().includes('venus')) return 42; // 6 weeks  
          if (eventName.toLowerCase().includes('mars')) return 70; // 10 weeks
          if (eventName.toLowerCase().includes('jupiter')) return 112; // 16 weeks
          if (eventName.toLowerCase().includes('saturn')) return 140; // 20 weeks
          return 21; // Default 3 weeks
        };
        
        const dedupeDays = getDedupeDays(event.name);
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          Math.abs(e.date.getTime() - event.date.getTime()) < dedupeDays * 24 * 60 * 60 * 1000
        );
        return !isDuplicate;
      }
      
      if (event.type === 'conjunction') {
        // Longer deduplication window for conjunctions (they can last weeks for slow planets)
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          Math.abs(e.date.getTime() - event.date.getTime()) < 21 * 24 * 60 * 60 * 1000 // 3 weeks
        );
        return !isDuplicate;
      }
      
      if (event.type === 'stellium') {
        // Stelliums can change composition, so be more lenient with deduplication
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          Math.abs(e.date.getTime() - event.date.getTime()) < 7 * 24 * 60 * 60 * 1000 // 1 week
        );
        return !isDuplicate;
      }
      
      // For moon events and other short-term events, check by exact name and day
      // But be more lenient with moon phases since they're distinct events
      if (event.type === 'moonPhase') {
        // Allow different moon phases on the same day, but not identical ones
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          Math.abs(e.date.getTime() - event.date.getTime()) < 12 * 60 * 60 * 1000 // 12 hours
        );
        return !isDuplicate;
      }
      
      // For other events, use 1-day deduplication
      const dayMs = 24 * 60 * 60 * 1000;
      const isDuplicate = array.some((e, i) => 
        i < index && 
        e.name === event.name && 
        Math.abs(e.date.getTime() - event.date.getTime()) < dayMs
      );
      return !isDuplicate;
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