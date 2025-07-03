/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from 'react';

interface AstrologicalEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  score: number;
  isGenerated: boolean;
  isBookmarked: boolean;
  createdAt: string;
  timingMethod?: 'electional' | 'aspects' | 'houses';
  planetsInvolved?: string[];
}

interface UseEventFiltersReturn {
  // Filtered data
  filteredEvents: AstrologicalEvent[];
  
  // Filter state
  searchQuery: string;
  selectedType: 'all' | 'benefic' | 'challenging' | 'neutral';
  selectedSource: 'all' | 'generated' | 'manual';
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: 'all' | 'benefic' | 'challenging' | 'neutral') => void;
  setSelectedSource: (source: 'all' | 'generated' | 'manual') => void;
  clearFilters: () => void;
  
  // Filter statistics
  totalEvents: number;
  visibleEvents: number;
}

export function useEventFilters(events: AstrologicalEvent[]): UseEventFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'benefic' | 'challenging' | 'neutral'>('all');
  const [selectedSource, setSelectedSource] = useState<'all' | 'generated' | 'manual'>('all');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = selectedType === 'all' || event.type === selectedType;
      
      // Source filter
      const matchesSource = selectedSource === 'all' || 
                           (selectedSource === 'generated' && event.isGenerated) ||
                           (selectedSource === 'manual' && !event.isGenerated);
      
      return matchesSearch && matchesType && matchesSource;
    });
  }, [events, searchQuery, selectedType, selectedSource]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSource('all');
  };

  return {
    // Filtered data
    filteredEvents,
    
    // Filter state
    searchQuery,
    selectedType,
    selectedSource,
    
    // Filter actions
    setSearchQuery,
    setSelectedType,
    setSelectedSource,
    clearFilters,
    
    // Filter statistics
    totalEvents: events.length,
    visibleEvents: filteredEvents.length
  };
}