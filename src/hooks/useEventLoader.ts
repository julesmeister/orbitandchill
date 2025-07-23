/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { findExistingEvent } from '../utils/eventUtils';

interface UseEventLoaderProps {
  eventDate: string | null;
  eventTime: string;
  eventTitle: string;
  userId: string | undefined;
  existingEvent: any;
  allEvents: Record<string, any>;
}

interface UseEventLoaderReturn {
  eventFromDb: any;
  loadingEvent: boolean;
  isBookmarked: boolean;
}

export function useEventLoader({
  eventDate,
  eventTime,
  eventTitle,
  userId,
  existingEvent,
  allEvents
}: UseEventLoaderProps): UseEventLoaderReturn {
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventFromDb, setEventFromDb] = useState<any>(null);

  // Load event from database if not found in store
  useEffect(() => {
    const loadEventFromDatabase = async () => {
      if (!eventDate || !eventTime || !eventTitle || !userId || existingEvent || loadingEvent) {
        return;
      }

      // Add loop detection
      const now = Date.now();
      const cacheKey = `event_loader_${userId}_${eventTitle}`;
      
      if (typeof window !== 'undefined') {
        // @ts-ignore
        const lastCall = window[cacheKey] || 0;
        if (now - lastCall < 1000) {
          console.warn('🔄 EVENT LOADER LOOP DETECTED - Skipping database call', {
            userId: userId?.slice(-8),
            eventTitle: eventTitle.slice(0, 50),
            timeSinceLastCall: now - lastCall
          });
          return;
        }
        // @ts-ignore
        window[cacheKey] = now;
      }

      setLoadingEvent(true);
      try {
        // Search for the event in the database
        const response = await fetch(`/api/events?userId=${userId}&searchTerm=${encodeURIComponent(eventTitle)}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.events) {
            // Find the matching event
            const matchingEvent = data.events.find((event: any) => 
              event.date === eventDate && 
              event.time === eventTime && 
              event.title === eventTitle
            );
            
            if (matchingEvent) {
              setEventFromDb(matchingEvent);
              console.log('Loaded event from database:', matchingEvent.id, 'isBookmarked:', matchingEvent.isBookmarked);
            }
          }
        }
      } catch (error) {
        console.error('Error loading event from database:', error);
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEventFromDatabase();
  }, [eventDate, eventTime, eventTitle, userId, existingEvent]);

  const isBookmarked = existingEvent?.isBookmarked || eventFromDb?.isBookmarked || false;

  return {
    eventFromDb,
    loadingEvent,
    isBookmarked
  };
}