import { useMemo } from 'react';
import { AstrologicalEvent } from '../store/eventsStore';

export interface EventStats {
  challengingEventsCount: number;
  comboEventsCount: number;
}

export const useEventStats = (events: AstrologicalEvent[]): EventStats => {
  return useMemo(() => {
    // Calculate challenging events count
    const challengingEventsCount = events.filter(event => {
      const hasWarning = event.title.includes('⚠️');
      const hasLowScore = event.score < 4;
      const isChallengingType = event.type === 'challenging';
      return hasWarning || hasLowScore || isChallengingType;
    }).length;

    // Calculate combo events count (events with specific planetary combinations)
    const comboEventsCount = events.filter(event => {
      // Check if title contains the "&" symbol, which indicates a combo event
      return event.title.includes('&');
    }).length;

    return {
      challengingEventsCount,
      comboEventsCount
    };
  }, [events]);
};