/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import { AstrologicalEvent } from '../store/eventsStore';

interface EventFilteringOptions {
  events: AstrologicalEvent[];
  selectedTab: 'all' | 'bookmarked' | 'manual' | 'generated';
  selectedType: 'all' | 'benefic' | 'challenging' | 'neutral';
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  showHousesOnly: boolean;
  showAspectsOnly: boolean;
  showElectionalOnly: boolean;
  searchQuery?: string; // Added search functionality
}

interface UseEventFilteringReturn {
  filteredEvents: AstrologicalEvent[];
  totalEvents: number;
  visibleEvents: number;
  filterStats: {
    beneficCount: number;
    challengingCount: number;
    neutralCount: number;
    generatedCount: number;
    manualCount: number;
    bookmarkedCount: number;
  };
}

export function useEventFiltering({
  events,
  selectedTab,
  selectedType,
  hideChallengingDates,
  showCombosOnly,
  showHousesOnly,
  showAspectsOnly,
  showElectionalOnly,
  searchQuery = ''
}: EventFilteringOptions): UseEventFilteringReturn {
  
  const { filteredEvents, filterStats } = useMemo(() => {
    const filtered = events.filter(event => {
      // Search filter (if provided)
      if (searchQuery) {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             event.description.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
      }

      // Tab filter - bookmarked events should only appear in bookmarked tab
      if (selectedTab === 'bookmarked' && !event.isBookmarked) return false;
      if (selectedTab === 'manual' && (event.isGenerated || event.isBookmarked)) return false;
      if (selectedTab === 'generated' && (!event.isGenerated || event.isBookmarked)) return false;

      // Type filter
      if (selectedType !== 'all' && event.type !== selectedType) return false;

      // Hide challenging dates filter
      if (hideChallengingDates) {
        const hasWarning = event.title.includes('⚠️');
        const hasLowScore = event.score < 4;
        const isChallengingType = event.type === 'challenging';
        if (hasWarning || hasLowScore || isChallengingType) return false;
      }

      // Show only combo events filter
      if (showCombosOnly) {
        return event.title.includes('&');
      }

      // Timing method filters
      if (showHousesOnly) {
        return event.timingMethod === 'houses';
      } else if (showAspectsOnly) {
        return event.timingMethod === 'aspects';
      } else if (showElectionalOnly) {
        return event.timingMethod === 'electional';
      }

      return true;
    }).sort((a, b) => {
      // Sort by score when filtering by type
      if (selectedType === 'benefic') {
        return b.score - a.score; // Higher scores first for favorable
      } else if (selectedType === 'challenging') {
        return a.score - b.score; // Lower scores first for challenging
      } else if (selectedType === 'neutral') {
        return b.score - a.score; // Higher scores first for neutral
      }
      // For 'all' view, keep the default chronological order
      return 0;
    });

    // Calculate filter statistics
    const stats = {
      beneficCount: events.filter(e => e.type === 'benefic').length,
      challengingCount: events.filter(e => e.type === 'challenging').length,
      neutralCount: events.filter(e => e.type === 'neutral').length,
      generatedCount: events.filter(e => e.isGenerated).length,
      manualCount: events.filter(e => !e.isGenerated).length,
      bookmarkedCount: events.filter(e => e.isBookmarked).length,
    };

    return { filteredEvents: filtered, filterStats: stats };
  }, [events, selectedTab, selectedType, hideChallengingDates, showCombosOnly, showHousesOnly, showAspectsOnly, showElectionalOnly, searchQuery]);

  return {
    filteredEvents,
    totalEvents: events.length,
    visibleEvents: filteredEvents.length,
    filterStats
  };
}

// Additional utility hook for search-specific filtering
export function useEventSearch(events: AstrologicalEvent[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery.trim()) return events;
    
    return events.filter(event => {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.aspects.some(aspect => aspect.toLowerCase().includes(query)) ||
        event.planetaryPositions.some(position => position.toLowerCase().includes(query))
      );
    });
  }, [events, searchQuery]);
}

// Hook for filter statistics only (for dashboards)
export function useEventStats(events: AstrologicalEvent[]) {
  return useMemo(() => ({
    total: events.length,
    byType: {
      benefic: events.filter(e => e.type === 'benefic').length,
      challenging: events.filter(e => e.type === 'challenging').length,
      neutral: events.filter(e => e.type === 'neutral').length,
    },
    bySource: {
      generated: events.filter(e => e.isGenerated).length,
      manual: events.filter(e => !e.isGenerated).length,
    },
    bookmarked: events.filter(e => e.isBookmarked).length,
    averageScore: events.reduce((sum, e) => sum + e.score, 0) / events.length || 0,
    highScoreEvents: events.filter(e => e.score >= 8).length,
    lowScoreEvents: events.filter(e => e.score < 4).length,
  }), [events]);
}