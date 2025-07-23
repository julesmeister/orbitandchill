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
  detectGrandTrines,
  detectCurrentPlanetaryPositions,
  detectUpcomingPlanetarySignChanges
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

interface LocationData {
  latitude?: number;
  longitude?: number;
}

export const useAstrologicalEvents = (location?: LocationData): UseAstrologicalEventsResult => {
  const [realTimeEvents, setRealTimeEvents] = useState<AstrologicalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate real astronomical events
  const generateRealEvents = async () => {
    setIsLoading(true);
    const events: AstrologicalEvent[] = [];
    const today = new Date();
    
    // First, scan the entire current year for retrogrades (important annual events)
    const currentYear = today.getFullYear();
    const yearStart = new Date(currentYear, 0, 1); // January 1st
    const yearEnd = new Date(currentYear, 11, 31); // December 31st
    const daysInYear = Math.floor((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check for retrogrades throughout the year (every 7 days for efficiency)
    for (let i = 0; i <= daysInYear; i += 7) {
      const date = new Date(yearStart);
      date.setDate(date.getDate() + i);
      
      try {
        const retrogradeEvents = await detectRetrogrades(date, location?.latitude || 0, location?.longitude || 0);
        events.push(...retrogradeEvents);
      } catch (error) {
        console.warn(`Error checking retrogrades for ${date.toDateString()}:`, error);
      }
      
      // Add small delay every 20 iterations to prevent overwhelming
      if (i % 140 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    // Then scan next 90 days for other astronomical events
    for (let i = 0; i <= 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      try {
        // Use comprehensive detection with smart frequency
        // Check at different intervals based on event types
        if (i === 0 || i % 14 === 0) {
          // Every 14 days: Check grand trines (very slow)
          const grandTrineEvents = await detectGrandTrines(date);
          events.push(...grandTrineEvents);
        }
        
        if (i === 0 || i % 5 === 0) {
          // Every 5 days: Check stelliums (they can change with fast planets)
          const stelliumEvents = await detectStelliums(date);
          events.push(...stelliumEvents);
        }
        
        if (i === 0 || i % 7 === 0) {
          // Every 7 days: Check conjunctions
          const conjunctionEvents = await detectConjunctions(date);
          events.push(...conjunctionEvents);
        }
        
        // Check current planetary positions only once (on first day)
        if (i === 0) {
          const currentPositions = await detectCurrentPlanetaryPositions(date);
          events.push(...currentPositions);
        }
        
        // Check for upcoming planetary sign changes daily (to catch all ingresses)
        const upcomingSignChanges = await detectUpcomingPlanetarySignChanges(date);
        events.push(...upcomingSignChanges);
        
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
      // First check for exact ID duplicates (most strict)
      const exactIdDuplicate = array.some((e, i) => 
        i < index && e.id === event.id
      );
      if (exactIdDuplicate) {
        return false;
      }

      // For ongoing events (retrogrades, conjunctions, stelliums), only show the first occurrence
      if (event.type === 'retrograde') {
        // Retrogrades last weeks/months - dedupe within their full duration
        const getDedupeDays = (eventName: string) => {
          if (eventName.toLowerCase().includes('mercury')) return 21; // 3 weeks
          if (eventName.toLowerCase().includes('venus')) return 42; // 6 weeks  
          if (eventName.toLowerCase().includes('mars')) return 70; // 10 weeks
          if (eventName.toLowerCase().includes('jupiter')) return 112; // 16 weeks
          if (eventName.toLowerCase().includes('saturn')) return 140; // 20 weeks
          if (eventName.toLowerCase().includes('uranus')) return 140; // 20 weeks
          if (eventName.toLowerCase().includes('neptune')) return 161; // 23 weeks
          if (eventName.toLowerCase().includes('pluto')) return 147; // 21 weeks
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
      
      if (event.type === 'planetInSign') {
        // Current planetary positions - only show once per planet/sign combination
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          e.type === 'planetInSign'
        );
        return !isDuplicate;
      }
      
      if (event.type === 'planetSignChange') {
        // Upcoming sign changes - avoid duplicates within same day
        const isDuplicate = array.some((e, i) => 
          i < index && 
          e.name === event.name && 
          e.type === 'planetSignChange' &&
          Math.abs(e.date.getTime() - event.date.getTime()) < 24 * 60 * 60 * 1000 // same day
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

  // Memoize sorted events using real-time data with smart sorting
  const sortedEvents = React.useMemo(() => 
    [...realTimeEvents].sort((a, b) => {
      const now = new Date();
      const aTime = a.date.getTime();
      const bTime = b.date.getTime();
      const nowTime = now.getTime();
      
      // Categorize events by time status
      const getTimeStatus = (eventTime: number) => {
        const diff = Math.abs(eventTime - nowTime);
        if (diff < 60000) return 'now'; // Within 1 minute = ongoing
        if (eventTime > nowTime) return 'future';
        return 'past';
      };
      
      const aStatus = getTimeStatus(aTime);
      const bStatus = getTimeStatus(bTime);
      
      // Priority order: now > future > past
      const statusOrder = { now: 0, future: 1, past: 2 };
      
      if (aStatus !== bStatus) {
        return statusOrder[aStatus] - statusOrder[bStatus];
      }
      
      // Within same status, sort by time
      if (aStatus === 'future') {
        return aTime - bTime; // Future: earliest first
      } else {
        return bTime - aTime; // Now/Past: most recent first
      }
    }),
    [realTimeEvents]
  );

  // Memoize upcoming events (next 90 days + current ongoing events + all year retrogrades)
  const upcomingEvents = React.useMemo(() => 
    sortedEvents.filter(event => {
      const today = new Date();
      const daysUntil = differenceInDays(event.date, today);
      
      // Include current ongoing planetary positions (happening now)
      if (event.type === 'planetInSign' && daysUntil >= -1 && daysUntil <= 1) {
        return true;
      }
      
      // Include all retrogrades from current year (past and future)
      if (event.type === 'retrograde') {
        const eventYear = event.date.getFullYear();
        const currentYear = today.getFullYear();
        return eventYear === currentYear;
      }
      
      // Include upcoming events within 90 days
      return daysUntil >= 0 && daysUntil <= 90;
    }),
    [sortedEvents]
  );

  // Memoize events by type (combine planetary sign events)
  const eventsByType = React.useMemo(() => 
    realTimeEvents.reduce((acc, event) => {
      // Combine planetInSign and planetSignChange into one category
      const eventType = (event.type === 'planetInSign' || event.type === 'planetSignChange') 
        ? 'planetarySigns' 
        : event.type;
      
      if (!acc[eventType]) acc[eventType] = [];
      acc[eventType].push(event);
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