/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Raw SQL utilities for Turso HTTP client WHERE clause workaround
 * 
 * Context: Drizzle ORM's WHERE clause parsing is completely broken with Turso HTTP client.
 * All WHERE clauses using eq(), and(), or other Drizzle functions get ignored, 
 * causing queries to return unfiltered results.
 * 
 * This utility provides a standardized approach for executing raw SQL queries
 * to bypass the Drizzle ORM WHERE clause parsing issues.
 */

export interface RawSqlCondition {
  column: string;
  value: any;
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'IS NULL' | 'IS NOT NULL';
}

export interface RawSqlQueryOptions {
  table: string;
  conditions?: RawSqlCondition[];
  orderBy?: { column: string; direction: 'ASC' | 'DESC' }[];
  limit?: number;
  offset?: number;
  columns?: string[];
}

/**
 * Execute a raw SQL SELECT query with WHERE conditions
 * Bypasses Drizzle ORM to work around Turso HTTP client WHERE clause parsing issues
 */
export async function executeRawSelect(
  db: any,
  options: RawSqlQueryOptions
): Promise<any[]> {
  const dbObj = db as any;
  const client = dbObj?.client;
  
  if (!client) {
    console.error('❌ Database client not available for raw SQL execution');
    return [];
  }

  try {
    // Build SELECT clause
    const columns = options.columns ? options.columns.join(', ') : '*';
    let sql = `SELECT ${columns} FROM ${options.table}`;
    const args: any[] = [];

    // Build WHERE clause
    if (options.conditions && options.conditions.length > 0) {
      const whereConditions: string[] = [];
      
      for (const condition of options.conditions) {
        const operator = condition.operator || '=';
        
        if (operator === 'IS NULL') {
          whereConditions.push(`${condition.column} IS NULL`);
        } else if (operator === 'IS NOT NULL') {
          whereConditions.push(`${condition.column} IS NOT NULL`);
        } else if (operator === 'IN' && Array.isArray(condition.value)) {
          const placeholders = condition.value.map(() => '?').join(', ');
          whereConditions.push(`${condition.column} IN (${placeholders})`);
          args.push(...condition.value);
        } else {
          whereConditions.push(`${condition.column} ${operator} ?`);
          args.push(condition.value);
        }
      }
      
      if (whereConditions.length > 0) {
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }
    }

    // Build ORDER BY clause
    if (options.orderBy && options.orderBy.length > 0) {
      const orderClauses = options.orderBy.map(
        order => `${order.column} ${order.direction}`
      );
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Build LIMIT and OFFSET
    if (options.limit !== undefined) {
      sql += ` LIMIT ?`;
      args.push(options.limit);
    }
    
    if (options.offset !== undefined) {
      sql += ` OFFSET ?`;
      args.push(options.offset);
    }

    // SQL query execution (no logging to reduce noise)
    
    const result = await client.execute({ sql, args });
    return result.rows || [];
    
  } catch (error) {
    console.error(`❌ Raw SQL query failed for table ${options.table}:`, error);
    return [];
  }
}

/**
 * Execute a raw SQL SELECT query to find a single record
 * Returns the first matching record or null
 */
export async function executeRawSelectOne(
  db: any,
  options: RawSqlQueryOptions
): Promise<any | null> {
  const results = await executeRawSelect(db, {
    ...options,
    limit: 1
  });
  
  return results.length > 0 ? results[0] : null;
}

/**
 * Execute a raw SQL UPDATE query with WHERE conditions
 */
export async function executeRawUpdate(
  db: any,
  table: string,
  updates: Record<string, any>,
  conditions: RawSqlCondition[]
): Promise<number> {
  const dbObj = db as any;
  const client = dbObj?.client;
  
  if (!client) {
    console.error('❌ Database client not available for raw SQL execution');
    return 0;
  }

  try {
    // Build UPDATE clause
    const updateClauses: string[] = [];
    const args: any[] = [];
    
    for (const [column, value] of Object.entries(updates)) {
      updateClauses.push(`${column} = ?`);
      args.push(value);
    }
    
    let sql = `UPDATE ${table} SET ${updateClauses.join(', ')}`;
    
    // Build WHERE clause
    if (conditions && conditions.length > 0) {
      const whereConditions: string[] = [];
      
      for (const condition of conditions) {
        const operator = condition.operator || '=';
        whereConditions.push(`${condition.column} ${operator} ?`);
        args.push(condition.value);
      }
      
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    // SQL update execution (no logging to reduce noise)
    
    const result = await client.execute({ sql, args });
    return result.rowsAffected || 0;
    
  } catch (error) {
    console.error(`❌ Raw SQL UPDATE failed for table ${table}:`, error);
    return 0;
  }
}

/**
 * Execute a raw SQL DELETE query with WHERE conditions
 */
export async function executeRawDelete(
  db: any,
  table: string,
  conditions: RawSqlCondition[]
): Promise<number> {
  const dbObj = db as any;
  const client = dbObj?.client;
  
  if (!client) {
    console.error('❌ Database client not available for raw SQL execution');
    return 0;
  }

  try {
    let sql = `DELETE FROM ${table}`;
    const args: any[] = [];
    
    // Build WHERE clause
    if (conditions && conditions.length > 0) {
      const whereConditions: string[] = [];
      
      for (const condition of conditions) {
        const operator = condition.operator || '=';
        whereConditions.push(`${condition.column} ${operator} ?`);
        args.push(condition.value);
      }
      
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    // SQL delete execution (no logging to reduce noise)
    
    const result = await client.execute({ sql, args });
    return result.rowsAffected || 0;
    
  } catch (error) {
    console.error(`❌ Raw SQL DELETE failed for table ${table}:`, error);
    return 0;
  }
}

/**
 * Helper function to convert camelCase field names to snake_case for database columns
 * Based on the existing mapping patterns from DATABASE.md documentation
 */
export function camelToSnakeCase(camelField: string): string {
  // Handle specific mappings documented in DATABASE.md
  const specificMappings: Record<string, string> = {
    'authorId': 'author_id',
    'authorName': 'author_name',
    'userId': 'user_id',
    'discussionId': 'discussion_id',
    'parentReplyId': 'parent_reply_id',
    'replyId': 'reply_id',
    'voteType': 'vote_type',
    'chartType': 'chart_type',
    'shareToken': 'share_token',
    'chartData': 'chart_data',
    'isPublic': 'is_public',
    'isGenerated': 'is_generated',
    'isBookmarked': 'is_bookmarked',
    'isBlogPost': 'is_blog_post',
    'isPublished': 'is_published',
    'isPinned': 'is_pinned',
    'isLocked': 'is_locked',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at',
    'lastActivity': 'last_activity',
    'embeddedChart': 'embedded_chart',
    'embeddedVideo': 'embedded_video',
    'profilePictureUrl': 'profile_picture_url',
    'authProvider': 'auth_provider',
    'dateOfBirth': 'date_of_birth',
    'timeOfBirth': 'time_of_birth',
    'locationOfBirth': 'location_of_birth',
    'sunSign': 'sun_sign',
    'stelliumSigns': 'stellium_signs',
    'stelliumHouses': 'stellium_houses',
    'hasNatalChart': 'has_natal_chart',
    'showZodiacPublicly': 'show_zodiac_publicly',
    'showStelliumsPublicly': 'show_stelliums_publicly',
    'showBirthInfoPublicly': 'show_birth_info_publicly',
    'allowDirectMessages': 'allow_direct_messages',
    'showOnlineStatus': 'show_online_status',
    // Current location fields for void moon calculations
    'currentLocationName': 'current_location_name',
    'currentLatitude': 'current_latitude',
    'currentLongitude': 'current_longitude',
    'currentLocationUpdatedAt': 'current_location_updated_at'
  };

  // Check specific mappings first
  if (specificMappings[camelField]) {
    return specificMappings[camelField];
  }

  // Default camelCase to snake_case conversion
  return camelField.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Helper function to convert snake_case database columns to camelCase for frontend
 */
export function snakeToCamelCase(snakeField: string): string {
  return snakeField.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform database result row from snake_case to camelCase
 */
export function transformDatabaseRow(row: any): any {
  if (!row || typeof row !== 'object') return row;
  
  const transformed: any = {};
  
  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamelCase(key);
    transformed[camelKey] = value;
  }
  
  return transformed;
}

/**
 * Helper to prepare conditions with automatic camelCase to snake_case conversion
 */
export function prepareConditions(conditions: Record<string, any>): RawSqlCondition[] {
  return Object.entries(conditions)
    .filter(([_, value]) => value !== undefined)
    .map(([field, value]) => ({
      column: camelToSnakeCase(field),
      value: value,
      operator: '=' as const
    }));
}

/**
 * Common query patterns for different use cases
 */
export class RawSqlPatterns {
  /**
   * Find a record by ID
   */
  static async findById(db: any, table: string, id: string): Promise<any | null> {
    return executeRawSelectOne(db, {
      table,
      conditions: [{ column: 'id', value: id }]
    });
  }

  /**
   * Find records by user ID
   */
  static async findByUserId(db: any, table: string, userId: string): Promise<any[]> {
    return executeRawSelect(db, {
      table,
      conditions: [{ column: 'user_id', value: userId }],
      orderBy: [{ column: 'created_at', direction: 'DESC' }]
    });
  }

  /**
   * Update a record by ID
   */
  static async updateById(
    db: any, 
    table: string, 
    id: string, 
    updates: Record<string, any>
  ): Promise<number> {
    // Convert camelCase updates to snake_case
    const snakeUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      snakeUpdates[camelToSnakeCase(key)] = value;
    }

    return executeRawUpdate(db, table, snakeUpdates, [
      { column: 'id', value: id }
    ]);
  }

  /**
   * Delete a record by ID
   */
  static async deleteById(db: any, table: string, id: string): Promise<number> {
    return executeRawDelete(db, table, [
      { column: 'id', value: id }
    ]);
  }
}