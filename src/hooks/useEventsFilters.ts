/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';

type EventType = 'all' | 'benefic' | 'challenging' | 'neutral';
type SourceType = 'all' | 'generated' | 'manual';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'benefic' | 'challenging' | 'neutral';
  isGenerated: boolean;
}

export function useEventsFilters(events: Event[]) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType>('all');
  const [selectedSource, setSelectedSource] = useState<SourceType>('all');

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || event.type === selectedType;
      const matchesSource = selectedSource === 'all' || 
                           (selectedSource === 'generated' && event.isGenerated) ||
                           (selectedSource === 'manual' && !event.isGenerated);
      
      return matchesSearch && matchesType && matchesSource;
    });
    
    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedType, selectedSource]);

  return {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedSource,
    setSelectedSource,
  };
}