/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { AstrologicalEvent } from '@/store/eventsStore';

interface EventsAnalytics {
  totalEvents: number;
  eventsThisMonth: number;
  eventsByType: {
    benefic: number;
    challenging: number;
    neutral: number;
  };
  generationStats: {
    generated: number;
    manual: number;
  };
  engagementStats: {
    bookmarked: number;
    averageScore: number;
  };
  usageStats: {
    activeUsers: number;
    eventsPerUser: number;
  };
}


interface UseAdminEventsReturn {
  // Data
  events: AstrologicalEvent[];
  analytics: EventsAnalytics | null;
  
  // Loading states
  isLoadingEvents: boolean;
  isLoadingAnalytics: boolean;
  
  // Error states
  eventsError: string | null;
  analyticsError: string | null;
  
  // Actions
  loadEvents: () => Promise<void>;
  loadAnalytics: () => Promise<void>;
  createEvent: (event: Partial<AstrologicalEvent>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<AstrologicalEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  bulkDeleteEvents: (ids: string[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Mock data for development/fallback
const mockEvents: AstrologicalEvent[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Jupiter Trine Venus - Love & Prosperity',
    date: '2024-01-15',
    time: '14:30',
    type: 'benefic',
    description: 'Excellent time for relationships and financial decisions',
    score: 9,
    isGenerated: true,
    isBookmarked: true,
    createdAt: '2024-01-10T10:00:00Z',
    timingMethod: 'aspects',
    aspects: ['Jupiter conjunction Venus'],
    planetaryPositions: ['Jupiter in Pisces', 'Venus in Pisces']
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Mars Square Saturn - Challenges Ahead',
    date: '2024-01-20',
    time: '09:15',
    type: 'challenging',
    description: 'Exercise caution in business and personal matters',
    score: 3,
    isGenerated: true,
    isBookmarked: false,
    createdAt: '2024-01-10T11:00:00Z',
    timingMethod: 'aspects',
    aspects: ['Mars square Saturn'],
    planetaryPositions: ['Mars in Gemini', 'Saturn in Pisces']
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Wedding Ceremony',
    date: '2024-02-14',
    time: '16:00',
    type: 'benefic',
    description: 'Manually planned wedding ceremony',
    score: 8,
    isGenerated: false,
    isBookmarked: true,
    createdAt: '2024-01-05T15:30:00Z',
    timingMethod: 'electional',
    aspects: ['Moon trine Venus'],
    planetaryPositions: ['Moon in Taurus', 'Venus in Pisces']
  }
];

export function useAdminEvents(): UseAdminEventsReturn {
  const [events, setEvents] = useState<AstrologicalEvent[]>([]);
  const [analytics, setAnalytics] = useState<EventsAnalytics | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Run database migration on mount
  useEffect(() => {
    const runMigration = async () => {
      try {
        await fetch('/api/admin/events-migrate', { method: 'POST' });
      } catch (error) {
        console.warn('Migration check failed:', error);
      }
    };
    runMigration();
  }, []);

  const loadAnalytics = useCallback(async () => {
    setIsLoadingAnalytics(true);
    setAnalyticsError(null);
    
    try {
      const response = await fetch('/api/admin/metrics');
      const data = await response.json();
      
      if (data.success && data.metrics?.events) {
        setAnalytics(data.metrics.events);
      } else {
        throw new Error('Failed to load events analytics');
      }
    } catch (error) {
      console.error('Error loading events analytics:', error);
      setAnalyticsError(error instanceof Error ? error.message : 'Failed to load analytics');
      
      // Generate analytics from current events as fallback
      if (events.length > 0) {
        const now = new Date();
        const thisMonth = events.filter(e => {
          const eventDate = new Date(e.date);
          return eventDate.getMonth() === now.getMonth() && 
                 eventDate.getFullYear() === now.getFullYear();
        });
        
        setAnalytics({
          totalEvents: events.length,
          eventsThisMonth: thisMonth.length,
          eventsByType: {
            benefic: events.filter(e => e.type === 'benefic').length,
            challenging: events.filter(e => e.type === 'challenging').length,
            neutral: events.filter(e => e.type === 'neutral').length,
          },
          generationStats: {
            generated: events.filter(e => e.isGenerated).length,
            manual: events.filter(e => !e.isGenerated).length,
          },
          engagementStats: {
            bookmarked: events.filter(e => e.isBookmarked).length,
            averageScore: events.length > 0 
              ? Math.round(events.reduce((sum, e) => sum + e.score, 0) / events.length) 
              : 0,
          },
          usageStats: {
            activeUsers: new Set(events.map(e => e.userId)).size,
            eventsPerUser: events.length > 0 
              ? Math.round(events.length / new Set(events.map(e => e.userId)).size) 
              : 0,
          }
        });
      }
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [events]);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setEventsError(null);
    
    try {
      const response = await fetch('/api/admin/events');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.events) {
        setEvents(data.events);
      } else {
        throw new Error(data.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEventsError(error instanceof Error ? error.message : 'Failed to load events');
      
      // Fallback to mock data
      setEvents(mockEvents);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: Partial<AstrologicalEvent>) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          userId: eventData.userId || 'admin',
          score: eventData.score || (eventData.type === 'benefic' ? 8 : eventData.type === 'challenging' ? 3 : 5),
          isGenerated: eventData.isGenerated || false,
          isBookmarked: eventData.isBookmarked || false,
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create event');
      }
      
      // Reload events after successful creation
      await loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }, [loadEvents]);

  const updateEvent = useCallback(async (id: string, updates: Partial<AstrologicalEvent>) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update event');
      }
      
      // Update local state optimistically
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete event');
      }
      
      // Update local state optimistically
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }, []);

  const bulkDeleteEvents = useCallback(async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => 
        fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      ));
      
      // Update local state optimistically
      setEvents(prev => prev.filter(event => !ids.includes(event.id)));
    } catch (error) {
      console.error('Error bulk deleting events:', error);
      throw error;
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([loadEvents(), loadAnalytics()]);
  }, [loadEvents, loadAnalytics]);

  // Load data on mount
  useEffect(() => {
    loadEvents();
    loadAnalytics();
  }, [loadEvents, loadAnalytics]);

  return {
    // Data
    events,
    analytics,
    
    // Loading states
    isLoadingEvents,
    isLoadingAnalytics,
    
    // Error states
    eventsError,
    analyticsError,
    
    // Actions
    loadEvents,
    loadAnalytics,
    createEvent,
    updateEvent,
    deleteEvent,
    bulkDeleteEvents,
    refreshData
  };
}