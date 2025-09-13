/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

interface Event {
  id: string;
}

export function useEventSelection() {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const selectAllEvents = (events: Event[]) => {
    setSelectedEvents(events.map(event => event.id));
  };

  const clearSelection = () => {
    setSelectedEvents([]);
  };

  return {
    selectedEvents,
    setSelectedEvents,
    toggleEventSelection,
    selectAllEvents,
    clearSelection,
  };
}