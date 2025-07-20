/* eslint-disable @typescript-eslint/no-unused-vars */

import type { UnifiedEvent, EventPersistence } from '../types/events';

/**
 * EventPersistence handles local storage using IndexedDB
 * Pure persistence logic with no state management
 */
export class EventPersistenceImpl implements EventPersistence {
  private dbName = 'OrbitAndChillEvents';
  private dbVersion = 1;
  private storeName = 'events';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve(); // Server-side rendering
        return;
      }

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('❌ EventPersistence: Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        // console.log('✅ EventPersistence: IndexedDB initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('userId', 'metadata.userId', { unique: false });
          store.createIndex('source', 'metadata.source', { unique: false });
          store.createIndex('isBookmarked', 'metadata.isBookmarked', { unique: false });
          // console.log('✅ EventPersistence: Object store created');
        }
      };
    });
  }

  /**
   * Ensure DB is ready
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    
    return this.db;
  }

  /**
   * Save multiple events to IndexedDB
   */
  async saveEvents(events: UnifiedEvent[]): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      transaction.oncomplete = () => {
        console.log(`✅ EventPersistence: Saved ${events.length} events`);
        resolve();
      };
      
      transaction.onerror = () => {
        console.error('❌ EventPersistence: Failed to save events');
        reject(transaction.error);
      };
      
      events.forEach(event => {
        store.put(event);
      });
    });
  }

  /**
   * Load all events from IndexedDB
   */
  async loadEvents(): Promise<UnifiedEvent[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const events = request.result as UnifiedEvent[];
        console.log(`✅ EventPersistence: Loaded ${events.length} events`);
        resolve(events);
      };
      
      request.onerror = () => {
        console.error('❌ EventPersistence: Failed to load events');
        reject(request.error);
      };
    });
  }

  /**
   * Save single event to IndexedDB
   */
  async saveEvent(event: UnifiedEvent): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(event);
      
      request.onsuccess = () => {
        console.log(`✅ EventPersistence: Saved event ${event.id}`);
        resolve();
      };
      
      request.onerror = () => {
        console.error(`❌ EventPersistence: Failed to save event ${event.id}`);
        reject(request.error);
      };
    });
  }

  /**
   * Remove event from IndexedDB
   */
  async removeEvent(eventId: string): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(eventId);
      
      request.onsuccess = () => {
        console.log(`✅ EventPersistence: Removed event ${eventId}`);
        resolve();
      };
      
      request.onerror = () => {
        console.error(`❌ EventPersistence: Failed to remove event ${eventId}`);
        reject(request.error);
      };
    });
  }

  /**
   * Clear all events from IndexedDB
   */
  async clear(): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log('✅ EventPersistence: Cleared all events');
        resolve();
      };
      
      request.onerror = () => {
        console.error('❌ EventPersistence: Failed to clear events');
        reject(request.error);
      };
    });
  }

  /**
   * Get events by filter criteria
   */
  async getEventsByUserId(userId: string): Promise<UnifiedEvent[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onsuccess = () => {
        const events = request.result as UnifiedEvent[];
        console.log(`✅ EventPersistence: Found ${events.length} events for user ${userId}`);
        resolve(events);
      };
      
      request.onerror = () => {
        console.error(`❌ EventPersistence: Failed to get events for user ${userId}`);
        reject(request.error);
      };
    });
  }
}

// Export singleton instance
export const eventPersistence = new EventPersistenceImpl();