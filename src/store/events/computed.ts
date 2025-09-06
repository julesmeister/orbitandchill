/* eslint-disable @typescript-eslint/no-unused-vars */
import { AstrologicalEvent } from './types';

export const createGetAllEvents = (get: () => any) => {
  let cachedEvents: AstrologicalEvent[] = [];
  let lastEventIdsLength = 0;
  let lastGeneratedEventIdsLength = 0;
  let lastEventIdsHash = '';
  let lastGeneratedEventIdsHash = '';
  
  return () => {
    const { events, generatedEvents, eventIds, generatedEventIds } = get();
    
    // Quick length check first
    if ((eventIds?.length || 0) === lastEventIdsLength && (generatedEventIds?.length || 0) === lastGeneratedEventIdsLength) {
      // Create simple hash for deeper comparison
      const eventIdsHash = (eventIds || []).join(',');
      const generatedEventIdsHash = (generatedEventIds || []).join(',');
      
      if (eventIdsHash === lastEventIdsHash && generatedEventIdsHash === lastGeneratedEventIdsHash) {
        return cachedEvents;
      }
    }
    
    // Recalculate only when needed
    const regularEvents = (eventIds || []).map((id: string) => events[id]).filter(Boolean);
    const generatedEventsArray = (generatedEventIds || []).map((id: string) => generatedEvents[id]).filter(Boolean);
    const allEvents = [...regularEvents, ...generatedEventsArray];
    
    // Update cache
    cachedEvents = allEvents;
    lastEventIdsLength = eventIds?.length || 0;
    lastGeneratedEventIdsLength = generatedEventIds?.length || 0;
    lastEventIdsHash = (eventIds || []).join(',');
    lastGeneratedEventIdsHash = (generatedEventIds || []).join(',');
    
    return allEvents;
  };
};