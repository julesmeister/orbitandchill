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
}

export function useEventFiltering({
  events,
  selectedTab,
  selectedType,
  hideChallengingDates,
  showCombosOnly,
  showHousesOnly,
  showAspectsOnly,
  showElectionalOnly
}: EventFilteringOptions) {
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // First filter by tab
      if (selectedTab === 'bookmarked' && !event.isBookmarked) return false;
      if (selectedTab === 'manual' && event.isGenerated) return false;
      if (selectedTab === 'generated' && !event.isGenerated) return false;

      // Filter by type
      if (selectedType !== 'all' && event.type !== selectedType) return false;

      // Filter out challenging dates if hide toggle is enabled
      if (hideChallengingDates) {
        // Hide events with warning symbols (challenging combos) or low scores or challenging type
        const hasWarning = event.title.includes('⚠️');
        const hasLowScore = event.score < 4;
        const isChallengingType = event.type === 'challenging';

        if (hasWarning || hasLowScore || isChallengingType) return false;
      }

      // Show only combo events if combo toggle is enabled
      if (showCombosOnly) {
        // Check if title contains the "&" symbol, which indicates a combo event
        return event.title.includes('&');
      }

      // Apply timing method filters
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
  }, [events, selectedTab, selectedType, hideChallengingDates, showCombosOnly, showHousesOnly, showAspectsOnly, showElectionalOnly]);

  return filteredEvents;
}