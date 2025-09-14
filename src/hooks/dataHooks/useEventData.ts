/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from 'react';
import type { AstrologicalEvent } from '../../types/events';
import {
  EventLoadingService,
  type EventLoadingFilters,
  type EventLoadingResult
} from '../../services/businessServices/eventLoadingService';

export interface UseEventDataProps {
  userId?: string;
  autoLoad?: boolean;
  initialFilters?: Partial<EventLoadingFilters>;
}

export interface UseEventDataReturn {
  // State
  events: AstrologicalEvent[];
  isLoading: boolean;
  error: string | null;
  lastLoaded: Date | null;

  // Actions
  loadEvents: (filters?: Partial<EventLoadingFilters>) => Promise<void>;
  refreshEvents: () => Promise<void>;
  clearEvents: () => void;
  clearError: () => void;

  // Computed
  totalCount: number;
  hasEvents: boolean;
}

/**
 * Reusable hook for event data management
 * Centralizes event loading logic following protocol patterns
 */
export function useEventData({
  userId,
  autoLoad = false,
  initialFilters = {}
}: UseEventDataProps = {}): UseEventDataReturn {
  const [events, setEvents] = useState<AstrologicalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Partial<EventLoadingFilters>>(initialFilters);

  const loadEvents = useCallback(async (filters: Partial<EventLoadingFilters> = {}) => {
    if (!userId) {
      console.warn('useEventData: No userId provided, skipping load');
      return;
    }

    const loadingFilters = {
      ...currentFilters,
      ...filters,
      userId
    } as EventLoadingFilters;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 useEventData: Loading events with filters:', loadingFilters);

      const result = await EventLoadingService.loadFilteredEvents(loadingFilters);

      setEvents(result.events);
      setCurrentFilters(loadingFilters);
      setLastLoaded(new Date());

      console.log(`✅ useEventData: Loaded ${result.events.length} events`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      setError(errorMessage);
      console.error('❌ useEventData: Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentFilters]);

  const refreshEvents = useCallback(async () => {
    await loadEvents(currentFilters);
  }, [loadEvents, currentFilters]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setError(null);
    setLastLoaded(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load on mount or userId change
  useEffect(() => {
    if (autoLoad && userId) {
      loadEvents();
    }
  }, [autoLoad, userId, loadEvents]);

  return {
    // State
    events,
    isLoading,
    error,
    lastLoaded,

    // Actions
    loadEvents,
    refreshEvents,
    clearEvents,
    clearError,

    // Computed
    totalCount: events.length,
    hasEvents: events.length > 0
  };
}