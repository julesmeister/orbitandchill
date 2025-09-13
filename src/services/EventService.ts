/* eslint-disable @typescript-eslint/no-unused-vars */

import type { AstrologicalEvent, EventService, ApiEventResponse } from '../types/events';

/**
 * EventService handles all API operations for events
 * Pure service class with no state management
 */
export class EventServiceImpl implements EventService {
  private baseUrl = '/api';

  /**
   * Load events for a specific month from the API
   */
  async loadMonthEvents(userId: string, month: number, year: number): Promise<AstrologicalEvent[]> {
    // console.log(`🌐 EventService: Loading events for ${userId}, ${year}-${month + 1}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/events?userId=${userId}&month=${month}&year=${year}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data: ApiEventResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load events from API');
      }
      
      // console.log(`✅ EventService: Loaded ${data.events.length} events from API`);
      return data.events;
      
    } catch (error) {
      console.error('❌ EventService: Failed to load month events:', error);
      throw error;
    }
  }

  /**
   * Save a new event to the API
   */
  async saveEvent(event: AstrologicalEvent): Promise<void> {
    console.log(`💾 EventService: Saving event ${event.id}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save event: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save event');
      }
      
      console.log(`✅ EventService: Event ${event.id} saved successfully`);
      
    } catch (error) {
      console.error('❌ EventService: Failed to save event:', error);
      throw error;
    }
  }

  /**
   * Delete an event via API
   */
  async deleteEvent(eventId: string, userId: string): Promise<void> {
    console.log(`🗑️ EventService: Deleting event ${eventId}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/events/${eventId}?userId=${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete event');
      }
      
      console.log(`✅ EventService: Event ${eventId} deleted successfully`);
      
    } catch (error) {
      console.error('❌ EventService: Failed to delete event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event via API
   */
  async updateEvent(event: AstrologicalEvent): Promise<void> {
    console.log(`✏️ EventService: Updating event ${event.id}`);
    
    try {
      // Extract id and userId, send the rest as updateData
      const { id, userId, ...updateData } = event;
      
      const requestBody = {
        id,
        userId,
        ...updateData
      };
      
      console.log(`📤 EventService: Sending PUT request with data:`, {
        id,
        userId,
        updateDataKeys: Object.keys(updateData),
        fullBody: requestBody
      });
      
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update event');
      }
      
      console.log(`✅ EventService: Event ${event.id} updated successfully`);
      
    } catch (error) {
      console.error('❌ EventService: Failed to update event:', error);
      throw error;
    }
  }

  /**
   * Toggle bookmark status via API
   */
  async toggleBookmark(eventId: string, userId: string): Promise<void> {
    console.log(`🔖 EventService: Toggling bookmark for ${eventId}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/events/${eventId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle bookmark: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to toggle bookmark');
      }
      
      console.log(`✅ EventService: Bookmark toggled for ${eventId}`);
      
    } catch (error) {
      console.error('❌ EventService: Failed to toggle bookmark:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const eventService = new EventServiceImpl();