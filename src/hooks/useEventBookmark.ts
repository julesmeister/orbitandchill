/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEventsStore } from '../store/eventsStore';
import { createNewBookmarkedEvent } from '../utils/eventUtils';

interface UseEventBookmarkProps {
  userId: string | undefined;
  existingEvent: any;
  eventFromDb: any;
  setEventFromDb: (event: any) => void;
  eventDate: string | null;
  eventTime: string;
  eventTitle: string;
  isOptimal: boolean;
  optimalScore: number | null;
}

interface UseEventBookmarkReturn {
  handleBookmarkToggle: () => void;
}

export function useEventBookmark({
  userId,
  existingEvent,
  eventFromDb,
  setEventFromDb,
  eventDate,
  eventTime,
  eventTitle,
  isOptimal,
  optimalScore
}: UseEventBookmarkProps): UseEventBookmarkReturn {
  const { toggleBookmark } = useEventsStore();

  const handleBookmarkToggle = () => {
    if (!userId) {
      console.error('User ID is not available for bookmark toggle. User state:', { userId });
      return;
    }
    
    const currentEvent = existingEvent || eventFromDb;
    
    if (currentEvent) {
      // Check if this is a local event (starts with 'bookmark_' or 'local_') or a database event
      const isLocalEvent = currentEvent.id.startsWith('bookmark_') || currentEvent.id.startsWith('local_');
      
      if (isLocalEvent) {
        // For local events, update the local state directly without API calls
        console.log('Event is local, updating local state:', currentEvent.id);
        const store = useEventsStore.getState();
        const updatedEvent = { ...currentEvent, isBookmarked: !currentEvent.isBookmarked };
        
        // Update the events store directly
        store.events = {
          ...store.events,
          [currentEvent.id]: updatedEvent
        };
        
        // Force a re-render by setting the state
        useEventsStore.setState({ events: store.events });
      } else {
        // For database events, use the API
        console.log('Event is in database, toggling bookmark via API:', currentEvent.id);
        toggleBookmark(currentEvent.id, userId);
        
        // Update the eventFromDb state optimistically
        if (eventFromDb) {
          setEventFromDb({ ...eventFromDb, isBookmarked: !eventFromDb.isBookmarked });
        }
      }
    } else if (eventDate) {
      // If event doesn't exist, add it as a new bookmarked event
      const newEvent = createNewBookmarkedEvent(eventTitle, eventDate, eventTime, userId, isOptimal, optimalScore);
      useEventsStore.getState().addEvent(newEvent);
    }
  };

  return {
    handleBookmarkToggle
  };
}