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
  console.log('🔍 ensureDatabase() called, db status:', {
    hasDb: !!db,
    dbType: db ? typeof db : 'undefined'
  });
  
  if (!db) {
    console.log('🚀 Database not initialized, attempting to initialize...');
    try {
      const result = await initializeDatabase();
      console.log('📋 initializeDatabase() result:', {
        hasResult: !!result,
        hasClient: !!result?.client,
        hasDb: !!result?.db,
        clientType: result?.client ? typeof result.client : 'undefined',
        dbType: result?.db ? typeof result.db : 'undefined'
      });
      
      if (result?.db) {
        console.log('✅ Database initialized successfully in ensureDatabase()');
        // Update the global db variable
        if (!db) {
          console.log('🔄 Updating global db variable');
        }
        return result.db;
      } else {
        console.log('⚠️ Database initialization returned null/undefined');
        return null;
      }
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Continue without throwing - we'll handle this gracefully
      return null;
    }
  }
  
  if (!db) {
    console.log('⚠️ Database not available - using fallback mode');
    return null;
  }
  
  console.log('✅ Using existing database connection');
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
    // Check database availability manually first
    console.log('🔍 Database availability check:', {
      hasDb: !!db,
      hasClient: !!db?.client,
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      isAvailable: !!db && (!!db.client || !!process.env.TURSO_DATABASE_URL)
    });
    
    // Temporarily bypass resilience wrapper to debug manual events issue
    const bypassResilience = false;
    
    if (bypassResilience) {
      console.log('🚨 BYPASSING resilience wrapper for debugging');
      return await (async () => {
      console.log('🔍 EventService.getEvents called with filters:', filters);
      
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const conditions = [];
      
      if (filters.userId) {
        console.log('🎯 Adding userId filter:', filters.userId);
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
      
      console.log('🔍 Building raw SQL query with', conditions.length, 'conditions');
      console.log('🔍 Full conditions array:', JSON.stringify(conditions, null, 2));
      
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
      
      console.log(`📊 EventService.getEvents returning ${filteredRows.length} events for filters:`, filters);
      
      return filteredRows.map((row: any) => dbRowToEvent(transformDatabaseRow(row)));
      })();
    }
    
    // Original resilience wrapper path (when bypassResilience is false)
    return resilient.array(db, 'getEvents', async () => {
      console.log('🔍 EventService.getEvents called with filters (via resilience):', filters);
      
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const conditions = [];
      
      if (filters.userId) {
        console.log('🎯 Adding userId filter:', filters.userId);
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
      
      console.log('🔍 Building raw SQL query with', conditions.length, 'conditions');
      console.log('🔍 Full conditions array:', JSON.stringify(conditions, null, 2));
      
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
      
      console.log(`📊 EventService.getEvents returning ${filteredRows.length} events for filters:`, filters);
      
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
    console.log('🚀 EventService.createEvent called with data:', {
      userId: eventData.userId,
      title: eventData.title,
      date: eventData.date,
      type: eventData.type,
      hasLocationData: !!(eventData.locationName || eventData.latitude || eventData.longitude)
    });

    // Ensure database is available before proceeding
    const database = await ensureDatabase();
    if (!database) {
      console.error('❌ Database not available in createEvent');
      return null;
    }

    try {
      const dbData = eventToDbRow(eventData);
      console.log('📝 Converted to database format:', {
        id: dbData.id,
        userId: dbData.userId,
        title: dbData.title,
        locationName: dbData.locationName,
        latitude: dbData.latitude,
        longitude: dbData.longitude,
        timezone: dbData.timezone
      });
      
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
        
        console.log('💾 Raw SQL insert result:', {
          rowsAffected: insertResult.rowsAffected,
          lastInsertRowid: insertResult.lastInsertRowid
        });
        
        console.log('🔍 Inserted event details for debugging:', {
          id: dbData.id,
          title: dbData.title,
          isGenerated: dbData.isGenerated,
          isGeneratedType: typeof dbData.isGenerated,
          userId: dbData.userId
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
        
        console.log('✅ Event created successfully:', {
          id: convertedEvent.id,
          title: convertedEvent.title,
          locationName: convertedEvent.locationName
        });
        
        // DEBUG: Immediately check if event exists after creation
        try {
          const checkResult = await client.execute({
            sql: 'SELECT id, title, is_generated, is_bookmarked FROM astrological_events WHERE id = ?',
            args: [convertedEvent.id]
          });
          console.log('🔍 Event verification after creation:', {
            found: checkResult.rows.length > 0,
            event: checkResult.rows[0] || 'NOT_FOUND'
          });
        } catch (verifyError) {
          console.error('❌ Could not verify event after creation:', verifyError);
        }
        
        return convertedEvent;
    } catch (error) {
      console.error('❌ Database insert failed:', error);
      return null;
    }
  }

  // Update an existing event
  static async updateEvent(id: string, updateData: UpdateEventData): Promise<AstrologicalEvent | null> {
    return resilient.item(db, 'updateEvent', async () => {
      console.log('🔄 Updating event:', id, 'with data:', updateData);
      
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
      updateValues.push(new Date().toISOString());
      
      // Add the ID parameter for WHERE clause
      updateValues.push(id);
      
      if (updateFields.length === 1) { // Only updated_at was added
        console.log('⚠️ No fields to update');
        return await this.getEventById(id);
      }
      
      const sql = `UPDATE astrological_events SET ${updateFields.join(', ')} WHERE id = ? RETURNING *`;
      
      console.log('🔍 Update SQL:', sql);
      console.log('🔍 Update values:', updateValues);
      
      const updateResult = await client.execute({
        sql,
        args: updateValues
      });
      
      console.log('✅ Update result:', {
        rowsAffected: updateResult.rowsAffected,
        updatedRows: updateResult.rows.length
      });
      
      if (updateResult.rows.length > 0) {
        return dbRowToEvent(updateResult.rows[0]);
      }
      
      return null;
    });
  }

  // Delete an event
  static async deleteEvent(id: string, userId?: string): Promise<boolean> {
    const result = await resilient.item(db, 'deleteEvent', async () => {
      console.log('🗑️ Deleting event with ID:', id, 'by user:', userId);
      
      // Security check: if userId provided, verify ownership first
      if (userId) {
        const existingEvent = await this.getEventById(id);
        if (!existingEvent) {
          console.log('❌ Event not found:', id);
          return false;
        }
        
        if (existingEvent.userId !== userId) {
          console.log('❌ User not authorized to delete this event:', { eventUserId: existingEvent.userId, requestUserId: userId });
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
      
      console.log('✅ Delete result:', {
        rowsAffected: deleteResult.rowsAffected,
        deletedRows: deleteResult.rows.length
      });
      
      return (deleteResult.rowsAffected || 0) > 0;
    });
    
    // Handle null result from resilient wrapper (e.g., database unavailable)
    return result ?? false;
  }

  // Toggle bookmark status
  static async toggleBookmark(id: string, userId?: string): Promise<AstrologicalEvent | null> {
    return resilient.item(db, 'toggleBookmark', async () => {
      console.log('🔄 Toggling bookmark for event:', id, 'by user:', userId);
      
      // Get current event
      const currentEvent = await this.getEventById(id);
      if (!currentEvent) {
        console.log('❌ Event not found:', id);
        return null;
      }
      
      // Security check: if userId provided, ensure it matches the event owner
      if (userId && currentEvent.userId !== userId) {
        console.log('❌ User not authorized to bookmark this event:', { eventUserId: currentEvent.userId, requestUserId: userId });
        throw new Error('Not authorized to bookmark this event');
      }
      
      console.log('🔄 Toggling bookmark for event:', id, 'from', currentEvent.isBookmarked, 'to', !currentEvent.isBookmarked);
      
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
      
      console.log('✅ Bookmark toggle result:', {
        rowsAffected: updateResult.rowsAffected,
        updatedRows: updateResult.rows.length
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
      console.log('EventService.createManyEvents called with', eventsData.length, 'events');
      
      // Ensure database is initialized
      const dbInstance = await ensureDatabase();
      
      if (!dbInstance) {
        console.log('⚠️ Database not available - events cannot be persisted to database');
        console.log('🔄 Returning events as local-only (they will be managed by client state)');
        
        // Return the events as if they were saved, but with local IDs
        // This allows the UI to work even when the database is unavailable
        const localEvents: AstrologicalEvent[] = eventsData.map((eventData, index) => ({
          id: `local_${Date.now()}_${index}`,
          userId: eventData.userId,
          title: eventData.title,
          date: eventData.date,
          time: eventData.time || undefined,
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
        
        console.log(`📝 Created ${localEvents.length} local-only events (database unavailable)`);
        return localEvents;
      }
      
      console.log('Database initialized successfully');
      
      // Force create astrological_events table if it doesn't exist
      console.log('🔧 Ensuring astrological_events table exists...');
      try {
        // Get the raw client from the database mock
        const client = (dbInstance as any).client;
        if (client) {
          // Check if table exists
          const existsResult = await client.execute(
            'SELECT name FROM sqlite_master WHERE type="table" AND name="astrological_events"'
          );
          
          if (existsResult.rows.length === 0) {
            console.log('🔧 Creating astrological_events table...');
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
            console.log('✅ astrological_events table created successfully');
          } else {
            console.log('✅ astrological_events table already exists');
          }
        }
      } catch (tableError) {
        console.error('⚠️ Error checking/creating table:', tableError);
        // Continue with the insert attempt - might work anyway
      }
      
      // Ensure the user exists before inserting events
      if (eventsData.length > 0 && eventsData[0].userId) {
        const userId = eventsData[0].userId;
        console.log('🔧 Ensuring user exists:', userId);
        
        try {
          const client = (dbInstance as any).client;
          if (client) {
            // Check if user exists
            const userExists = await client.execute(
              'SELECT id FROM users WHERE id = ?',
              [userId]
            );
            
            if (userExists.rows.length === 0) {
              console.log('🔧 Creating user for events:', userId);
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
              console.log('✅ User created successfully');
            } else {
              console.log('✅ User already exists');
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
          console.log(`📝 Processing event ${i + 1}/${eventsData.length}: "${eventData.title?.substring(0, 30)}..."`);
          
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
          
          if (i === 0) {
            console.log('🔍 First event dbRow conversion:', {
              id: dbRow.id,
              userId: dbRow.userId,
              title: dbRow.title,
              date: dbRow.date,
              type: dbRow.type,
              hasDescription: !!dbRow.description,
              isGenerated: dbRow.isGenerated, // Check if this field is being set
              keys: Object.keys(dbRow)
            });
          }
          
          console.log(`💾 Inserting event ${i + 1}/${eventsData.length} into database...`);
          const [insertedRow] = await db
            .insert(astrologicalEvents)
            .values(dbRow)
            .returning();

          const convertedEvent = dbRowToEvent(insertedRow);
          insertedEvents.push(convertedEvent);
          
          if (i === 0) {
            console.log('✅ First event successfully inserted:', {
              id: convertedEvent.id,
              title: convertedEvent.title,
              date: convertedEvent.date
            });
          }
          
          // Log progress every 5 events
          if ((i + 1) % 5 === 0 || i === eventsData.length - 1) {
            console.log(`📊 Progress: ${i + 1}/${eventsData.length} events inserted successfully`);
          }
          
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

      console.log('Successfully inserted', insertedEvents.length, 'events');
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
      console.log(`🗑️ EventService.clearGeneratedEvents called for user: ${userId}${month !== undefined && year !== undefined ? ` for ${year}-${(month + 1).toString().padStart(2, '0')}` : ' (all months)'}`);
      
      // Ensure database is initialized
      const dbInstance = await ensureDatabase();
      
      if (!dbInstance) {
        console.error('❌ Database not available for clearGeneratedEvents');
        console.log('🔄 Returning 0 deleted count (database unavailable - no generated events to clear)');
        // Return 0 instead of throwing - this allows the UI to continue working
        return 0;
      }
      
      // QUICK FIX: Clear ALL generated events for the user
      // This handles anonymous user ID inconsistency issues
      console.log('🔧 Clearing generated events for user (with month/year filtering if provided)');
      
      console.log('✅ Database available, proceeding with deletion...');
      
      // Use raw SQL for better debugging and to handle the mock database
      const client = (dbInstance as any).client;
      if (client) {
        console.log('🔄 Using raw SQL for bulk delete...');
        
        // Build query with month/year filtering if provided
        let checkSql = 'SELECT id, title, is_generated, is_bookmarked, user_id, date FROM astrological_events WHERE is_generated = 1 AND user_id = ?';
        const checkArgs: string[] = [userId];
        
        if (month !== undefined && year !== undefined) {
          checkSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          checkArgs.push((month + 1).toString().padStart(2, '0'), year.toString());
          console.log(`📅 Filtering by month/year: ${year}-${(month + 1).toString().padStart(2, '0')}`);
        }
        
        // Check generated events for this user (with optional month/year filter)
        const allGeneratedEventsResult = await client.execute({
          sql: checkSql,
          args: checkArgs
        });
        
        // Also check ALL events to see what user IDs exist
        const allUsersEventsResult = await client.execute({
          sql: 'SELECT DISTINCT user_id, COUNT(*) as count FROM astrological_events GROUP BY user_id'
        });
        
        console.log(`🔍 ALL USER IDs in database:`, allUsersEventsResult.rows);
        console.log(`🎯 Looking for events for user: ${userId}`);
        if (month !== undefined && year !== undefined) {
          console.log(`📅 Limited to month: ${year}-${(month + 1).toString().padStart(2, '0')}`);
        }
        
        console.log(`📊 Generated events found:`, {
          total: allGeneratedEventsResult.rows.length,
          bookmarked: allGeneratedEventsResult.rows.filter((r: { is_bookmarked: number; }) => r.is_bookmarked === 1).length,
          notBookmarked: allGeneratedEventsResult.rows.filter((r: { is_bookmarked: number; }) => r.is_bookmarked === 0).length,
          unique_user_ids: Array.from(new Set(allGeneratedEventsResult.rows.map((r: { user_id: any; }) => r.user_id))),
          sample_events: allGeneratedEventsResult.rows.slice(0, 5).map((r: { title: string; is_generated: any; user_id: any; is_bookmarked: any; }) => ({ 
            title: r.title?.substring(0, 30), 
            is_generated: r.is_generated, 
            user_id: r.user_id,
            is_bookmarked: r.is_bookmarked
          }))
        });
        
        // Debug: Show sample events to see their actual structure
        console.log(`🔍 Sample events structure:`, allGeneratedEventsResult.rows.slice(0, 3).map((row: { id: any; title: string; is_generated: any; is_bookmarked: any; type: any; }) => ({
          id: row.id,
          title: row.title?.substring(0, 30),
          is_generated: row.is_generated,
          is_bookmarked: row.is_bookmarked,
          type: row.type
        })));
        
        // Method 1: Try standard deletion with userId and optional month/year filtering
        let standardSql = 'SELECT id, title FROM astrological_events WHERE user_id = ? AND is_generated = 1 AND is_bookmarked = 0';
        const standardArgs: string[] = [userId];
        
        if (month !== undefined && year !== undefined) {
          // Add month and year filtering using SQLite date functions
          standardSql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
          standardArgs.push((month + 1).toString().padStart(2, '0'), year.toString());
          console.log(`📅 Adding month/year filter: ${year}-${(month + 1).toString().padStart(2, '0')}`);
        }
        
        const standardCheckResult = await client.execute({
          sql: standardSql,
          args: standardArgs
        });
        
        console.log(`📋 Method 1 - Standard: Found ${standardCheckResult.rows.length} generated events to delete${month !== undefined ? ` in ${year}-${(month + 1).toString().padStart(2, '0')}` : ''}`);
        
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
          console.log(`✅ Successfully deleted ${deletedCount} generated events using standard method${month !== undefined ? ` from ${year}-${(month + 1).toString().padStart(2, '0')}` : ''}`);
          return deletedCount;
        }
        
        // Method 2: If no standard generated events, try aggressive pattern matching
        console.log('🔄 Method 2 - Aggressive: No properly marked generated events found, trying pattern matching...');
        
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
        
        console.log(`📋 Method 2 - Aggressive: Found ${patternCheckResult.rows.length} events matching generated patterns:`,
          patternCheckResult.rows.slice(0, 5).map((row: { id: any; title: any; }) => ({ id: row.id, title: row.title }))
        );
        
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
          console.log(`✅ Successfully deleted ${deletedCount} events using aggressive pattern matching`);
          return deletedCount;
        }
        
        // Method 3: If all else fails, delete ALL non-bookmarked GENERATED events (nuclear option)
        console.log('🔄 Method 3 - Nuclear: No events found with previous methods, trying to delete ALL non-bookmarked GENERATED events...');
        
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
        
        console.log(`📋 Method 3 - Nuclear: Found ${nuclearCheckResult.rows.length} non-bookmarked events to delete${month !== undefined ? ` in ${year}-${(month + 1).toString().padStart(2, '0')}` : ''}`);
        
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
          console.log(`✅ Nuclear method deleted ${deletedCount} non-bookmarked events`);
          return deletedCount;
        }
        
        console.log('✅ No events to delete found with any method');
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