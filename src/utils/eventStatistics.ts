/* eslint-disable @typescript-eslint/no-unused-vars */
import { AstrologicalEvent } from '../store/eventsStore';

export function calculateChallengingEventsCount(events: AstrologicalEvent[]): number {
  return events.filter(event => {
    const hasWarning = event.title.includes('⚠️');
    const hasLowScore = event.score < 4;
    const isChallengingType = event.type === 'challenging';
    return hasWarning || hasLowScore || isChallengingType;
  }).length;
}

export function calculateComboEventsCount(events: AstrologicalEvent[]): number {
  return events.filter(event => {
    // Check if title contains the "&" symbol, which indicates a combo event
    return event.title.includes('&');
  }).length;
}

export function getEventStatistics(events: AstrologicalEvent[]) {
  return {
    total: events.length,
    bookmarked: events.filter(e => e.isBookmarked).length,
    generated: events.filter(e => e.isGenerated).length,
    manual: events.filter(e => !e.isGenerated).length,
    challenging: calculateChallengingEventsCount(events),
    combos: calculateComboEventsCount(events),
    benefic: events.filter(e => e.type === 'benefic').length,
    neutral: events.filter(e => e.type === 'neutral').length,
    byTimingMethod: {
      houses: events.filter(e => e.timingMethod === 'houses').length,
      aspects: events.filter(e => e.timingMethod === 'aspects').length,
      electional: events.filter(e => e.timingMethod === 'electional').length
    }
  };
}