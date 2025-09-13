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
  const { toggleBookmark, addEvent } = useEventsStore();

  const handleBookmarkToggle = async () => {
    if (!userId) {
      console.error('User ID is not available for bookmark toggle. User state:', { userId });
      throw new Error('User ID is required to bookmark events');
    }
    
    const currentEvent = existingEvent || eventFromDb;
    
    if (currentEvent) {
      // Check if this is a local/generated event or a database event
      const isLocalEvent = currentEvent.id.startsWith('bookmark_') || 
                          currentEvent.id.startsWith('local_') || 
                          currentEvent.id.startsWith('astro_') ||
                          currentEvent.isGenerated;
      
      
      // Toggle bookmark through the store (handles both local and API events)
      await toggleBookmark(currentEvent.id, userId);
      
      // Update the eventFromDb state optimistically for immediate UI feedback
      if (eventFromDb) {
        setEventFromDb({ ...eventFromDb, isBookmarked: !eventFromDb.isBookmarked });
      }
    } else if (eventDate) {
      // If event doesn't exist, add it as a new bookmarked event
      const newEvent = createNewBookmarkedEvent(eventTitle, eventDate, eventTime, userId, isOptimal, optimalScore);
      await addEvent(newEvent);
    }
  };

  return {
    handleBookmarkToggle
  };
}