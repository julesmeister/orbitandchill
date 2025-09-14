/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AstrologicalEvent } from '../../types/events';
import { eventService } from '../EventService';

export interface EventLoadingFilters {
  userId: string;
  tab?: 'all' | 'bookmarked' | 'manual' | 'generated';
  month?: number;
  year?: number;
  type?: 'benefic' | 'challenging' | 'neutral' | 'all';
  hideChallengingDates?: boolean;
  showCombosOnly?: boolean;
}

export interface EventLoadingResult {
  events: AstrologicalEvent[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Centralized service for loading events from API/Turso database
 * Replaces scattered loading logic with unified approach
 */
export class EventLoadingService {
  /**
   * Load all events for a user (replaces loadPersistedEvents)
   */
  static async loadAllUserEvents(userId: string): Promise<AstrologicalEvent[]> {
    try {
      console.log(`🔄 EventLoadingService: Loading all events for user ${userId}`);

      const response = await fetch(`/api/events/user/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to load user events: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load user events');
      }

      console.log(`✅ EventLoadingService: Loaded ${data.events.length} events for user`);
      return data.events;

    } catch (error) {
      console.error('❌ EventLoadingService: Failed to load user events:', error);
      throw error;
    }
  }

  /**
   * Load events for a specific month (existing functionality)
   */
  static async loadMonthEvents(
    userId: string,
    month: number,
    year: number
  ): Promise<AstrologicalEvent[]> {
    try {
      console.log(`🔄 EventLoadingService: Loading month events for ${userId}, ${year}-${month + 1}`);
      return await eventService.loadMonthEvents(userId, month, year);
    } catch (error) {
      console.error('❌ EventLoadingService: Failed to load month events:', error);
      throw error;
    }
  }

  /**
   * Load filtered events based on tab and criteria
   */
  static async loadFilteredEvents(filters: EventLoadingFilters): Promise<EventLoadingResult> {
    const { userId, tab, month, year, type, hideChallengingDates, showCombosOnly } = filters;

    try {
      let events: AstrologicalEvent[] = [];

      // Determine loading strategy based on tab
      if (tab === 'bookmarked' || tab === 'manual' || tab === 'all') {
        // Load all user events for comprehensive tabs
        events = await this.loadAllUserEvents(userId);
      } else if (month !== undefined && year !== undefined) {
        // Load specific month for time-based views
        events = await this.loadMonthEvents(userId, month, year);
      } else {
        // Default to current month
        const now = new Date();
        events = await this.loadMonthEvents(userId, now.getMonth(), now.getFullYear());
      }

      // Apply client-side filtering
      const filteredEvents = this.applyFilters(events, {
        tab,
        type,
        hideChallengingDates,
        showCombosOnly
      });

      return {
        events: filteredEvents,
        totalCount: filteredEvents.length,
        hasMore: false // API returns complete datasets
      };

    } catch (error) {
      console.error('❌ EventLoadingService: Failed to load filtered events:', error);
      throw error;
    }
  }

  /**
   * Apply client-side filters to events array
   */
  static applyFilters(
    events: AstrologicalEvent[],
    filters: {
      tab?: string;
      type?: string;
      hideChallengingDates?: boolean;
      showCombosOnly?: boolean;
    }
  ): AstrologicalEvent[] {
    let filtered = [...events];

    // Tab filtering
    if (filters.tab) {
      switch (filters.tab) {
        case 'bookmarked':
          filtered = filtered.filter(e => e.isBookmarked);
          break;
        case 'manual':
          filtered = filtered.filter(e => !e.isGenerated && !e.isBookmarked);
          break;
        case 'generated':
          filtered = filtered.filter(e => e.isGenerated && !e.isBookmarked);
          break;
        // 'all' shows everything
      }
    }

    // Type filtering
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(e => e.type === filters.type);
    }

    // Hide challenging dates
    if (filters.hideChallengingDates) {
      filtered = filtered.filter(e => e.type !== 'challenging');
    }

    // Show combos only (high scores)
    if (filters.showCombosOnly) {
      filtered = filtered.filter(e => e.score >= 8);
    }

    return filtered;
  }

  /**
   * Get event loading strategy for a given tab
   */
  static getLoadingStrategy(tab: string): 'user' | 'month' {
    switch (tab) {
      case 'bookmarked':
      case 'manual':
      case 'all':
        return 'user'; // Load all user events
      case 'generated':
      default:
        return 'month'; // Load month-specific events
    }
  }
}