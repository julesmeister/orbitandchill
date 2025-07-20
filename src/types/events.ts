/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Unified event types for the refactored architecture
 */

// Base astrological event interface (unchanged from existing)
export interface AstrologicalEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description?: string;
  aspects: string[];
  planetaryPositions: string[];
  score: number;
  isGenerated: boolean;
  createdAt: string;
  isBookmarked?: boolean;
}

// Event metadata for unified system
export interface EventMetadata {
  source: 'api' | 'generated' | 'manual';
  isPersisted: boolean;
  isBookmarked: boolean;
  createdLocally: boolean;
  userId: string;
  lastModified: string;
  syncStatus: 'synced' | 'pending' | 'error';
}

// Unified event with metadata
export interface UnifiedEvent extends Omit<AstrologicalEvent, 'isBookmarked'> {
  metadata: EventMetadata;
}

// Cache entry for month data
export interface EventCacheEntry {
  eventIds: string[];
  loadedAt: number;
  expiresAt: number;
  monthKey: string;
}

// Store state interface
export interface EventsState {
  // Single source of truth for all events
  allEvents: Record<string, UnifiedEvent>;
  allEventIds: string[];
  
  // Loading and sync state
  isLoading: boolean;
  syncStatus: 'idle' | 'syncing' | 'error';
  
  // Cache management
  cache: Map<string, EventCacheEntry>;
  loadedMonths: Set<string>;
  
  // Actions
  addEvent: (event: AstrologicalEvent) => void;
  updateEvent: (id: string, updates: Partial<AstrologicalEvent>) => void;
  removeEvent: (id: string) => void;
  toggleBookmark: (id: string) => void;
  loadMonthEvents: (userId: string, month: number, year: number) => Promise<void>;
  getEventsByFilter: (filter: EventFilter) => UnifiedEvent[];
  clearCache: () => void;
}

// Event filtering options
export interface EventFilter {
  source?: 'api' | 'generated' | 'manual' | 'all';
  isBookmarked?: boolean;
  type?: 'benefic' | 'challenging' | 'neutral' | 'all';
  userId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// API response types
export interface ApiEventResponse {
  success: boolean;
  events: AstrologicalEvent[];
  error?: string;
}

// Service interfaces
export interface EventService {
  loadMonthEvents(userId: string, month: number, year: number): Promise<AstrologicalEvent[]>;
  saveEvent(event: AstrologicalEvent): Promise<void>;
  deleteEvent(eventId: string, userId: string): Promise<void>;
  toggleBookmark(eventId: string, userId: string): Promise<void>;
}

export interface EventCache {
  get(key: string): EventCacheEntry | null;
  set(key: string, entry: EventCacheEntry): void;
  invalidate(key: string): void;
  clear(): void;
  isExpired(entry: EventCacheEntry): boolean;
}

export interface EventPersistence {
  saveEvents(events: UnifiedEvent[]): Promise<void>;
  loadEvents(): Promise<UnifiedEvent[]>;
  saveEvent(event: UnifiedEvent): Promise<void>;
  removeEvent(eventId: string): Promise<void>;
  clear(): Promise<void>;
}