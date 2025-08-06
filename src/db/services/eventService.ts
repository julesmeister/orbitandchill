/* eslint-disable @typescript-eslint/no-unused-vars */
import { db, initializeDatabase, astrologicalEvents } from '@/db/index';
import { eq, desc, and, or, like } from 'drizzle-orm';
import { AstrologicalEvent } from '@/store/eventsStore';
import { createResilientService } from '@/db/resilience';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow, prepareConditions } from '@/db/rawSqlUtils';

// Create resilient service instance
const resilient = createResilientService('EventService');

// Helper function to ensure database is initialized
async function ensureDatabase() {
  if (!db) {
    try {
      const result = await initializeDatabase();
      
      if (result?.db) {
        // Update the global db variable
        return result.db;
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Continue without throwing - we'll handle this gracefully
      return null;
    }
  }
  
  if (!db) {
    return null;
  }
  
  return db;
}

interface EventFilters {
  userId?: string;
  type?: 'all' | 'benefic' | 'challenging' | 'neutral';
  isBookmarked?: boolean;
  isGenerated?: boolean;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  // Location-based filtering
  nearLocation?: {
    latitude: number;
    longitude: number;
    radiusKm?: number; // Default 50km radius
  };
  timezone?: string;
}

interface CreateEventData {
  userId: string;
  title: string;
  date: string;
  time?: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  aspects?: string[];
  planetaryPositions?: string[];
  score?: number;
  isGenerated?: boolean;
  priorities?: string[];
  chartData?: {
    planets?: Array<{
      name: string;
      retrograde?: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  timeWindow?: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  // Location data for location-specific events
  locationName?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  // TODO: Re-enable after database migration
  // electionalData?: {
  //   mercuryStatus: 'direct' | 'retrograde';
  //   moonPhase: string;
  //   beneficsAngular: boolean;
  //   maleficAspects: string[];
  //   prohibitions: string[];
  //   dignifiedPlanets: { planet: string; dignity: string }[];
  //   electionalReady: boolean;
  // };
  // timingMethod?: 'houses' | 'aspects' | 'electional';
}

interface UpdateEventData {
  title?: string;
  date?: string;
  time?: string;
  type?: 'benefic' | 'challenging' | 'neutral';
  description?: string;
  aspects?: string[];
  planetaryPositions?: string[];
  score?: number;
  priorities?: string[];
  chartData?: {
    planets?: Array<{
      name: string;
      retrograde?: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  timeWindow?: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  isBookmarked?: boolean;
}

// Helper function to convert database row to AstrologicalEvent
function dbRowToEvent(row: any): AstrologicalEvent {
  return {
    id: row.id,
    userId: row.userId || row.user_id, // Handle both camelCase and snake_case
    title: row.title,
    date: row.date,
    time: row.time || undefined,
    type: row.type,
    description: row.description,
    aspects: row.aspects ? JSON.parse(row.aspects) : [],
    planetaryPositions: row.planetaryPositions || row.planetary_positions ? JSON.parse(row.planetaryPositions || row.planetary_positions) : [],
    score: row.score,
    isGenerated: Boolean(row.isGenerated || row.is_generated), // Handle both camelCase and snake_case
    priorities: row.priorities ? JSON.parse(row.priorities) : undefined,
    chartData: row.chartData || row.chart_data ? JSON.parse(row.chartData || row.chart_data) : undefined,
    isBookmarked: Boolean(row.isBookmarked || row.is_bookmarked), // Handle both camelCase and snake_case
    timeWindow: row.timeWindow || row.time_window ? JSON.parse(row.timeWindow || row.time_window) : undefined,
    // Location data
    locationName: row.locationName || row.location_name || undefined,
    latitude: row.latitude || undefined,
    longitude: row.longitude || undefined,
    timezone: row.timezone || undefined,
    // timingMethod: row.timingMethod || undefined, // TODO: Re-enable after migration
    // electionalData: row.electionalData ? JSON.parse(row.electionalData) : undefined, // TODO: Re-enable after migration
    createdAt: row.createdAt || row.created_at ? (typeof (row.createdAt || row.created_at) === 'number' ? new Date((row.createdAt || row.created_at) * 1000).toISOString() : (row.createdAt || row.created_at).toISOString()) : new Date().toISOString(),
  };
}

// Helper function to convert AstrologicalEvent to database format
function eventToDbRow(eventData: CreateEventData) {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: eventData.userId,
    title: eventData.title,
    date: eventData.date,
    time: eventData.time || null,
    type: eventData.type,
    description: eventData.description,
    aspects: JSON.stringify(eventData.aspects || []),
    planetaryPositions: JSON.stringify(eventData.planetaryPositions || []),
    score: eventData.score || 5,
    isGenerated: eventData.isGenerated === true ? 1 : 0, // Explicitly convert to integer for SQLite, default false
    priorities: eventData.priorities ? JSON.stringify(eventData.priorities) : null,
    chartData: eventData.chartData ? JSON.stringify(eventData.chartData) : null,
    timeWindow: eventData.timeWindow ? JSON.stringify(eventData.timeWindow) : null,
    // Location data - ensure proper type conversion
    locationName: eventData.locationName || null,
    latitude: eventData.latitude !== undefined ? Number(eventData.latitude) : null,
    longitude: eventData.longitude !== undefined ? Number(eventData.longitude) : null,
    timezone: eventData.timezone || null,
    // timingMethod: eventData.timingMethod || null, // TODO: Re-enable after migration
    // electionalData: eventData.electionalData ? JSON.stringify(eventData.electionalData) : null, // TODO: Re-enable after migration
    isBookmarked: 0, // Explicitly convert to integer for SQLite
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export class EventService {
  // Get all events for a user with optional filtering
  static async getEvents(filters: EventFilters = {}): Promise<AstrologicalEvent[]> {
    // Temporarily bypass resilience wrapper to debug manual events issue
    const bypassResilience = false;
    
    if (bypassResilience) {
      return await (async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const conditions = [];
      
      if (filters.userId) {
        conditions.push({ column: 'user_id', value: filters.userId });
      }
      
      if (filters.type && filters.type !== 'all') {
        conditions.push({ column: 'type', value: filters.type });
      }
      
      if (filters.isBookmarked !== undefined) {
        conditions.push({ column: 'is_bookmarked', value: filters.isBookmarked ? 1 : 0 });
      }
      
      if (filters.isGenerated !== undefined) {
        conditions.push({ column: 'is_generated', value: filters.isGenerated ? 1 : 0 });
      }
      
      if (filters.dateFrom) {
        conditions.push({ column: 'date', value: filters.dateFrom, operator: '>=' as const });
      }
      
      if (filters.dateTo) {
        conditions.push({ column: 'date', value: filters.dateTo, operator: '<=' as const });
      }
      
      // Handle search term with raw SQL LIKE queries
      let searchSql = '';
      if (filters.searchTerm) {
        searchSql = ` AND (title LIKE '%${filters.searchTerm}%' OR description LIKE '%${filters.searchTerm}%')`;
      }
      
      const rows = await executeRawSelect(db, {
        table: 'astrological_events',
        conditions,
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });
      
      // Apply search filter if needed (raw SQL approach)
      let filteredRows = rows;
      if (filters.searchTerm) {
        filteredRows = rows.filter((row: any) => 
          row.title?.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
          row.description?.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        );
      }
      
      return filteredRows.map((row: any) => dbRowToEvent(transformDatabaseRow(row)));
      })();
    }
    
    // Original resilience wrapper path (when bypassResilience is false)
    return resilient.array(db, 'getEvents', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const conditions = [];
      
      if (filters.userId) {
        conditions.push({ column: 'user_id', value: filters.userId });
      }
      
      if (filters.type && filters.type !== 'all') {
        conditions.push({ column: 'type', value: filters.type });
      }
      
      if (filters.isBookmarked !== undefined) {
        conditions.push({ column: 'is_bookmarked', value: filters.isBookmarked ? 1 : 0 });
      }
      
      if (filters.isGenerated !== undefined) {
        conditions.push({ column: 'is_generated', value: filters.isGenerated ? 1 : 0 });
      }
      
      if (filters.dateFrom) {
        conditions.push({ column: 'date', value: filters.dateFrom, operator: '>=' as const });
      }
      
      if (filters.dateTo) {
        conditions.push({ column: 'date', value: filters.dateTo, operator: '<=' as const });
      }
      
      // Handle search term with raw SQL LIKE queries
      let searchSql = '';
      if (filters.searchTerm) {
        searchSql = ` AND (title LIKE '%${filters.searchTerm}%' OR description LIKE '%${filters.searchTerm}%')`;
      }
      
      const rows = await executeRawSelect(db, {
        table: 'astrological_events',
        conditions,
        orderBy: [{ column: 'created_at', direction: 'DESC' }]
      });
      
      // Apply search filter if needed (raw SQL approach)
      let filteredRows = rows;
      if (filters.searchTerm) {
        filteredRows = rows.filter((row: any) => 
          row.title?.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
          row.description?.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        );
      }
      
      return filteredRows.map((row: any) => dbRowToEvent(transformDatabaseRow(row)));
    });
  }

  // Get a single event by ID
  static async getEventById(id: string): Promise<AstrologicalEvent | null> {
    return resilient.item(db, 'getEventById', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const row = await RawSqlPatterns.findById(db, 'astrological_events', id);

      return row ? dbRowToEvent(transformDatabaseRow(row)) : null;
    });
  }

  // Create a new event
  static async createEvent(eventData: CreateEventData): Promise<AstrologicalEvent | null> {
    // Ensure database is available before proceeding
    const database = await ensureDatabase();
    if (!database) {
      console.error('❌ Database not available in createEvent');
      return null;
    }

    try {
      const dbData = eventToDbRow(eventData);
      
      // BYPASS DRIZZLE ORM - Use raw SQL for INSERT to avoid Turso HTTP client issues
      const client = (database as any).client;
      if (!client) {
        console.error('❌ Database client not available');
        throw new Error('Database client not available');
      }
        
        const insertSql = `
          INSERT INTO astrological_events (
            id, user_id, title, date, time, type, description, 
            aspects, planetary_positions, score, is_generated, 
            priorities, chart_data, is_bookmarked, time_window,
            location_name, latitude, longitude, timezone,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const insertResult = await client.execute({
          sql: insertSql,
          args: [
            dbData.id,
            dbData.userId,
            dbData.title,
            dbData.date,
            dbData.time,
            dbData.type,
            dbData.description,
            dbData.aspects,
            dbData.planetaryPositions,
            dbData.score,
            dbData.isGenerated,
            dbData.priorities,
            dbData.chartData,
            dbData.isBookmarked,
            dbData.timeWindow,
            // Location fields
            dbData.locationName,
            dbData.latitude,
            dbData.longitude,
            dbData.timezone,
            // Timestamps (convert to Unix timestamp for SQLite)
            Math.floor(dbData.createdAt.getTime() / 1000),
            Math.floor(dbData.updatedAt.getTime() / 1000)
          ]
        });
        
        if (insertResult.rowsAffected !== 1) {
          console.error('❌ Insert affected', insertResult.rowsAffected, 'rows, expected 1');
          throw new Error(`Insert affected ${insertResult.rowsAffected} rows, expected 1`);
        }
        
        // Retrieve the inserted row to return it
        const selectResult = await client.execute({
          sql: 'SELECT * FROM astrological_events WHERE id = ?',
          args: [dbData.id]
        });
        
        if (!selectResult.rows || selectResult.rows.length === 0) {
          console.error('❌ Could not retrieve inserted event');
          throw new Error('Could not retrieve inserted event');
        }
        
        const insertedRow = selectResult.rows[0];
        const convertedEvent = dbRowToEvent(transformDatabaseRow(insertedRow));
        
        return convertedEvent;
    } catch (error) {
      console.error('❌ Database insert failed:', error);
      return null;
    }
  }

  // Update an existing event
  static async updateEvent(id: string, updateData: UpdateEventData): Promise<AstrologicalEvent | null> {
    console.log('📝 EventService.updateEvent called with:', { id, updateDataKeys: Object.keys(updateData), updateData });
    
    return resilient.item(db, 'updateEvent', async () => {
      // Use raw SQL for update to avoid Drizzle ORM WHERE clause issues and column naming problems
      const client = (db as any).client;
      if (!client) {
        console.error('❌ Database client not available');
        throw new Error('Database client not available');
      }
      
      // Build dynamic update query based on provided fields
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      
      if (updateData.title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(updateData.title);
      }
      if (updateData.date !== undefined) {
        updateFields.push('date = ?');
        updateValues.push(updateData.date);
      }
      if (updateData.time !== undefined) {
        updateFields.push('time = ?');
        updateValues.push(updateData.time);
      }
      if (updateData.type !== undefined) {
        updateFields.push('type = ?');
        updateValues.push(updateData.type);
      }
      if (updateData.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(updateData.description);
      }
      if (updateData.aspects !== undefined) {
        updateFields.push('aspects = ?');
        updateValues.push(JSON.stringify(updateData.aspects));
      }
      if (updateData.planetaryPositions !== undefined) {
        updateFields.push('planetary_positions = ?');
        updateValues.push(JSON.stringify(updateData.planetaryPositions));
      }
      if (updateData.score !== undefined) {
        updateFields.push('score = ?');
        updateValues.push(updateData.score);
      }
      if (updateData.priorities !== undefined) {
        updateFields.push('priorities = ?');
        updateValues.push(updateData.priorities ? JSON.stringify(updateData.priorities) : null);
      }
      if (updateData.chartData !== undefined) {
        updateFields.push('chart_data = ?');
        updateValues.push(updateData.chartData ? JSON.stringify(updateData.chartData) : null);
      }
      if (updateData.timeWindow !== undefined) {
        updateFields.push('time_window = ?');
        updateValues.push(updateData.timeWindow ? JSON.stringify(updateData.timeWindow) : null);
      }
      if (updateData.isBookmarked !== undefined) {
        updateFields.push('is_bookmarked = ?');
        updateValues.push(updateData.isBookmarked ? 1 : 0);
      }
      
      // Always update the updated_at timestamp (using correct snake_case column name)
      updateFields.push('updated_at = ?');
      updateValues.push(Math.floor(Date.now() / 1000));
      
      // Add the ID parameter for WHERE clause
      updateValues.push(id);
      
      if (updateFields.length === 1) { // Only updated_at was added
        return await this.getEventById(id);
      }
      
      const sql = `UPDATE astrological_events SET ${updateFields.join(', ')} WHERE id = ? RETURNING *`;
      
      console.log('🔧 EventService: Executing SQL update:', { 
        sql, 
        args: updateValues,
        updateFieldsCount: updateFields.length 
      });
      
      const updateResult = await client.execute({
        sql,
        args: updateValues
      });
      
      console.log('📊 EventService: SQL update result:', {
        rowsAffected: updateResult.rowsAffected,
        rowsReturned: updateResult.rows?.length || 0,
        firstRow: updateResult.rows?.[0]
      });
      
      if (updateResult.rows.length > 0) {
        const updatedEvent = dbRowToEvent(updateResult.rows[0]);
        console.log('✅ EventService: Event updated successfully:', { id: updatedEvent.id, title: updatedEvent.title });
        return updatedEvent;
      }
      
      console.warn('⚠️ EventService: No rows returned after update');
      return null;
    });
  }

  // Delete an event
  static async deleteEvent(id: string, userId?: string): Promise<boolean> {
    const result = await resilient.item(db, 'deleteEvent', async () => {
      // Security check: if userId provided, verify ownership first
      if (userId) {
        const existingEvent = await this.getEventById(id);
        if (!existingEvent) {
          return false;
        }
        
        if (existingEvent.userId !== userId) {
          throw new Error('Not authorized to delete this event');
        }
      }
      
      // Use raw SQL for delete to avoid Drizzle ORM WHERE clause issues
      const client = (db as any).client;
      if (!client) {
        console.error('❌ Database client not available');
        throw new Error('Database client not available');
      }
      
      const deleteResult = await client.execute({
        sql: 'DELETE FROM astrological_events WHERE id = ? RETURNING *',
        args: [id]
      });
      
      return (deleteResult.rowsAffected || 0) > 0;
    });
    
    // Handle null result from resilient wrapper (e.g., database unavailable)
    return result ?? false;
  }

  // Toggle bookmark status
  static async toggleBookmark(id: string, userId?: string): Promise<AstrologicalEvent | null> {
    return resilient.item(db, 'toggleBookmark', async () => {
      // Get current event
      const currentEvent = await this.getEventById(id);
      if (!currentEvent) {
        return null;
      }
      
      // Security check: if userId provided, ensure it matches the event owner
      if (userId && currentEvent.userId !== userId) {
        throw new Error('Not authorized to bookmark this event');
      }
      
      // Use raw SQL for update to avoid Drizzle ORM WHERE clause issues
      const client = (db as any).client;
      if (!client) {
        console.error('❌ Database client not available');
        throw new Error('Database client not available');
      }
      
      const newBookmarkStatus = !currentEvent.isBookmarked;
      const updateResult = await client.execute({
        sql: 'UPDATE astrological_events SET is_bookmarked = ?, updated_at = ? WHERE id = ? RETURNING *',
        args: [newBookmarkStatus ? 1 : 0, Math.floor(Date.now() / 1000), id]
      });
      
      if (updateResult.rows.length > 0) {
        return dbRowToEvent(transformDatabaseRow(updateResult.rows[0]));
      }
      
      return null;
    });
  }

  // Bulk create events (for generated events)
  static async createManyEvents(eventsData: CreateEventData[]): Promise<AstrologicalEvent[]> {
    try {
      // Ensure database is initialized
      const dbInstance = await ensureDatabase();
      
      if (!dbInstance) {
        // Return the events as if they were saved, but with local IDs
        // This allows the UI to work even when the database is unavailable
        const localEvents: AstrologicalEvent[] = eventsData.map((eventData, index) => ({
          id: `local_${Date.now()}_${index}`,
          userId: eventData.userId,
          title: eventData.title,
          date: eventData.date,
          time: eventData.time || '12:00',
          type: eventData.type,
          description: eventData.description,
          aspects: eventData.aspects || [],
          planetaryPositions: eventData.planetaryPositions || [],
          score: eventData.score || 5,
          isGenerated: eventData.isGenerated || false,
          priorities: eventData.priorities,
          chartData: eventData.chartData,
          isBookmarked: false,
          timeWindow: eventData.timeWindow,
          createdAt: new Date().toISOString()
        }));
        
        return localEvents;
      }
      
      // Force create astrological_events table if it doesn't exist
      try {
        // Get the raw client from the database mock
        const client = (dbInstance as any).client;
        if (client) {
          // Check if table exists
          const existsResult = await client.execute(
            'SELECT name FROM sqlite_master WHERE type="table" AND name="astrological_events"'
          );
          
          if (existsResult.rows.length === 0) {
            await client.execute(`
              CREATE TABLE astrological_events (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT,
                type TEXT NOT NULL CHECK (type IN ('benefic', 'challenging', 'neutral')),
                description TEXT NOT NULL,
                aspects TEXT NOT NULL,
                planetary_positions TEXT NOT NULL,
                score INTEGER NOT NULL DEFAULT 5,
                is_generated INTEGER NOT NULL DEFAULT 0,
                priorities TEXT,
                chart_data TEXT,
                is_bookmarked INTEGER NOT NULL DEFAULT 0,
                time_window TEXT,
                created_at INTEGER NOT NULL,
                updated_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
              )
            `);
          }
        }
      } catch (tableError) {
        console.error('⚠️ Error checking/creating table:', tableError);
        // Continue with the insert attempt - might work anyway
      }
      
      // Ensure the user exists before inserting events
      if (eventsData.length > 0 && eventsData[0].userId) {
        const userId = eventsData[0].userId;
        
        try {
          const client = (dbInstance as any).client;
          if (client) {
            // Check if user exists
            const userExists = await client.execute(
              'SELECT id FROM users WHERE id = ?',
              [userId]
            );
            
            if (userExists.rows.length === 0) {
              // Create the user with minimal required fields
              await client.execute(`
                INSERT INTO users (
                  id, username, auth_provider, created_at, updated_at,
                  show_zodiac_publicly, show_stelliums_publicly, show_birth_info_publicly,
                  allow_direct_messages, show_online_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `, [
                userId,
                'Anonymous',
                'anonymous',
                Math.floor(Date.now() / 1000), // created_at
                Math.floor(Date.now() / 1000), // updated_at
                0, // show_zodiac_publicly
                0, // show_stelliums_publicly
                0, // show_birth_info_publicly
                1, // allow_direct_messages
                1  // show_online_status
              ]);
            }
          }
        } catch (userError) {
          console.error('⚠️ Error ensuring user exists:', userError);
          // Continue anyway - maybe the foreign key constraint is disabled
        }
      }
      
      // Insert events one by one to avoid bulk insert issues with the mock database
      const insertedEvents: AstrologicalEvent[] = [];
      
      for (let i = 0; i < eventsData.length; i++) {
        const eventData = eventsData[i];
        
        try {
          // Validate event data before conversion
          if (!eventData.userId || !eventData.title || !eventData.date || !eventData.type || !eventData.description) {
            const missingFields = [];
            if (!eventData.userId) missingFields.push('userId');
            if (!eventData.title) missingFields.push('title');
            if (!eventData.date) missingFields.push('date');
            if (!eventData.type) missingFields.push('type');
            if (!eventData.description) missingFields.push('description');
            
            console.error(`❌ Event ${i} missing required fields:`, {
              missingFields,
              eventData: {
                userId: eventData.userId || 'MISSING',
                title: eventData.title || 'MISSING',
                date: eventData.date || 'MISSING',
                type: eventData.type || 'MISSING',
                description: eventData.description ? 'present' : 'MISSING'
              }
            });
            throw new Error(`Event ${i} missing required fields: ${missingFields.join(', ')}`);
          }
          
          const dbRow = eventToDbRow(eventData);
          
          const [insertedRow] = await db
            .insert(astrologicalEvents)
            .values(dbRow)
            .returning();

          const convertedEvent = dbRowToEvent(insertedRow);
          insertedEvents.push(convertedEvent);
          
        } catch (error) {
          console.error(`❌ Error inserting event ${i + 1}:`, {
            eventIndex: i,
            eventTitle: eventData.title?.substring(0, 50),
            eventDate: eventData.date,
            eventType: eventData.type,
            error: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined
          });
          
          // Re-throw with more context
          const contextualError = new Error(`Failed to insert event ${i + 1}/${eventsData.length} ("${eventData.title?.substring(0, 30)}"): ${error instanceof Error ? error.message : String(error)}`);
          contextualError.stack = error instanceof Error ? error.stack : undefined;
          throw contextualError;
        }
      }

      return insertedEvents;
    } catch (error) {
      console.error('Error creating multiple events:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new Error('Failed to create events');
    }
  }

  // Delete all generated events for a user (except bookmarked ones)
  static async clearGeneratedEvents(userId: string, month?: number, year?: number): Promise<number> {
    try {
      // Ensure database is initialized
      const dbInstance = await ensureDatabase();
      
      if (!dbInstance) {
        console.error('❌ Database not available for clearGeneratedEvents');
        // Return 0 instead of throwing - this allows the UI to continue working
        return 0;
      }
      
      // Use raw SQL for better debugging and to handle the mock database
      const client = (dbInstance as any).client;
      if (client) {
        // Build query with month/year filtering if provided
        let checkSql = 'SELECT id, title, is_generated, is_bookmarked, user_id, date FROM astrological_events WHERE is_generated = 1 AND user_id = ?';
        const checkArgs: string[] = [userId];
        
        if (month !== undefined && year !== undefined) {
          checkSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          checkArgs.push((month + 1).toString().padStart(2, '0'), year.toString());
        }
        
        // Check generated events for this user (with optional month/year filter)
        const allGeneratedEventsResult = await client.execute({
          sql: checkSql,
          args: checkArgs
        });
        
        // Method 1: Try standard deletion with userId and optional month/year filtering
        let standardSql = 'SELECT id, title FROM astrological_events WHERE user_id = ? AND is_generated = 1 AND is_bookmarked = 0';
        const standardArgs: string[] = [userId];
        
        if (month !== undefined && year !== undefined) {
          // Add month and year filtering using SQLite date functions
          standardSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          standardArgs.push((month + 1).toString().padStart(2, '0'), year.toString());
        }
        
        const standardCheckResult = await client.execute({
          sql: standardSql,
          args: standardArgs
        });
        
        if (standardCheckResult.rows.length > 0) {
          let deleteSql = 'DELETE FROM astrological_events WHERE user_id = ? AND is_generated = 1 AND is_bookmarked = 0';
          if (month !== undefined && year !== undefined) {
            deleteSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          }
          
          const deleteResult = await client.execute({
            sql: deleteSql,
            args: standardArgs
          });
          
          const deletedCount = deleteResult.rowsAffected || standardCheckResult.rows.length;
          return deletedCount;
        }
        
        // Method 2: If no standard generated events, try aggressive pattern matching
        let patternSql = `SELECT id, title FROM astrological_events 
                          WHERE user_id = ? 
                          AND is_bookmarked = 0 
                          AND (
                            title LIKE '%Jupiter%' OR 
                            title LIKE '%Venus%' OR 
                            title LIKE '%&%' OR
                            title LIKE '%exalted%' OR
                            title LIKE '%House%' OR
                            title LIKE '%Moon%' OR
                            title LIKE '%Mars%' OR
                            title LIKE '%Mercury%' OR
                            title LIKE '%Saturn%' OR
                            title LIKE '%Sun%' OR
                            title LIKE '%Pluto%' OR
                            title LIKE '%Neptune%' OR
                            title LIKE '%Uranus%'
                          )`;
        
        const patternArgs: string[] = [userId];
        if (month !== undefined && year !== undefined) {
          patternSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          patternArgs.push((month + 1).toString().padStart(2, '0'), year.toString());
        }
        
        const patternCheckResult = await client.execute({
          sql: patternSql,
          args: patternArgs
        });
        
        if (patternCheckResult.rows.length > 0) {
          let aggressiveDeleteSql = `DELETE FROM astrological_events 
                                     WHERE user_id = ?
                                     AND is_bookmarked = 0 
                                     AND (
                                       title LIKE '%Jupiter%' OR 
                                       title LIKE '%Venus%' OR 
                                       title LIKE '%&%' OR
                                       title LIKE '%exalted%' OR
                                       title LIKE '%House%' OR
                                       title LIKE '%Moon%' OR
                                       title LIKE '%Mars%' OR
                                       title LIKE '%Mercury%' OR
                                       title LIKE '%Saturn%' OR
                                       title LIKE '%Sun%' OR
                                       title LIKE '%Pluto%' OR
                                       title LIKE '%Neptune%' OR
                                       title LIKE '%Uranus%'
                                     )`;
          
          if (month !== undefined && year !== undefined) {
            aggressiveDeleteSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          }
          
          const aggressiveDeleteResult = await client.execute({
            sql: aggressiveDeleteSql,
            args: patternArgs
          });
          
          const deletedCount = aggressiveDeleteResult.rowsAffected || patternCheckResult.rows.length;
          return deletedCount;
        }
        
        // Method 3: If all else fails, delete ALL non-bookmarked GENERATED events (nuclear option)
        let nuclearSql = 'SELECT id, title FROM astrological_events WHERE user_id = ? AND is_bookmarked = 0 AND is_generated = 1';
        const nuclearArgs: string[] = [userId];
        
        if (month !== undefined && year !== undefined) {
          nuclearSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          nuclearArgs.push((month + 1).toString().padStart(2, '0'), year.toString());
        }
        
        const nuclearCheckResult = await client.execute({
          sql: nuclearSql,
          args: nuclearArgs
        });
        
        if (nuclearCheckResult.rows.length > 0) {
          let nuclearDeleteSql = 'DELETE FROM astrological_events WHERE user_id = ? AND is_bookmarked = 0 AND is_generated = 1';
          if (month !== undefined && year !== undefined) {
            nuclearDeleteSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          }
          
          const nuclearDeleteResult = await client.execute({
            sql: nuclearDeleteSql,
            args: nuclearArgs
          });
          
          const deletedCount = nuclearDeleteResult.rowsAffected || nuclearCheckResult.rows.length;
          return deletedCount;
        }
        
        return 0;
        
      } else {
        console.error('❌ Database client not available');
        throw new Error('Database client not available');
      }
      
    } catch (error) {
      console.error('❌ Error clearing generated events:', error);
      throw new Error(`Failed to clear generated events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get events count by type for a user
  static async getEventsCounts(userId: string) {
    try {
      const events = await this.getEvents({ userId });
      
      const counts = {
        total: events.length,
        benefic: events.filter(e => e.type === 'benefic').length,
        challenging: events.filter(e => e.type === 'challenging').length,
        neutral: events.filter(e => e.type === 'neutral').length,
        bookmarked: events.filter(e => e.isBookmarked).length,
        generated: events.filter(e => e.isGenerated).length,
        manual: events.filter(e => !e.isGenerated).length,
      };

      return counts;
    } catch (error) {
      console.error('Error getting events counts:', error);
      throw new Error('Failed to get events counts');
    }
  }

  // Get global events analytics for admin dashboard
  static async getGlobalAnalytics() {
    return resilient.operation(db, 'getGlobalAnalytics', async () => {
      // Get all events for global analytics
      const allEvents = await db.select().from(astrologicalEvents);
      
      const analytics = {
        totalEvents: allEvents.length,
        eventsThisMonth: allEvents.filter((e: { createdAt: string | number | Date; }) => {
          const eventDate = new Date(e.createdAt);
          const now = new Date();
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return eventDate >= oneMonthAgo;
        }).length,
        eventsByType: {
          benefic: allEvents.filter((e: { type: string; }) => e.type === 'benefic').length,
          challenging: allEvents.filter((e: { type: string; }) => e.type === 'challenging').length,
          neutral: allEvents.filter((e: { type: string; }) => e.type === 'neutral').length,
        },
        generationStats: {
          generated: allEvents.filter((e: { isGenerated: any; }) => e.isGenerated).length,
          manual: allEvents.filter((e: { isGenerated: any; }) => !e.isGenerated).length,
        },
        engagementStats: {
          bookmarked: allEvents.filter((e: { isBookmarked: any; }) => e.isBookmarked).length,
          averageScore: allEvents.length > 0 
            ? Math.round((allEvents.reduce((sum: any, e: { score: any; }) => sum + e.score, 0) / allEvents.length) * 10) / 10
            : 0,
        },
        usageStats: {
          activeUsers: Array.from(new Set(allEvents.map((e: { userId: any; }) => e.userId))).length,
          eventsPerUser: allEvents.length > 0 
            ? Math.round((allEvents.length / Array.from(new Set(allEvents.map((e: { userId: any; }) => e.userId))).length) * 10) / 10
            : 0,
        }
      };

      return analytics;
    }, {
      totalEvents: 0,
      eventsThisMonth: 0,
      eventsByType: { benefic: 0, challenging: 0, neutral: 0 },
      generationStats: { generated: 0, manual: 0 },
      engagementStats: { bookmarked: 0, averageScore: 0 },
      usageStats: { activeUsers: 0, eventsPerUser: 0 }
    });
  }
}

export default EventService;