/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * SQL Query Builder Utilities
 * Provides type-safe, dynamic SQL query construction
 */

export interface QueryResult {
  sql: string;
  args: any[];
}

export interface UpdateField {
  field: string;
  value: any;
  sqlType?: 'string' | 'number' | 'boolean' | 'json';
}

export interface WhereCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN';
  value: any;
}

export interface JoinClause {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  condition: string;
}

export interface OrderBy {
  field: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Dynamic SQL Query Builder
 * Provides fluent interface for building type-safe SQL queries
 */
export class SQLQueryBuilder {
  /**
   * Build dynamic UPDATE query with type safety
   */
  static buildUpdateQuery(
    table: string,
    updates: Record<string, any>,
    whereConditions: WhereCondition[]
  ): QueryResult {
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Process update fields
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const dbField = this.camelToSnakeCase(key);
        updateFields.push(`${dbField} = ?`);
        updateValues.push(this.convertValueForDatabase(key, value));
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    // Add timestamp update
    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());

    // Build WHERE clause
    const whereClause = this.buildWhereClause(whereConditions);
    updateValues.push(...whereClause.args);

    const sql = `UPDATE ${table} SET ${updateFields.join(', ')} WHERE ${whereClause.sql}`;

    return { sql, args: updateValues };
  }

  /**
   * Build dynamic SELECT query with joins and filtering
   */
  static buildSelectQuery(options: {
    table: string;
    columns?: string[];
    joins?: JoinClause[];
    where?: WhereCondition[];
    orderBy?: OrderBy[];
    limit?: number;
    offset?: number;
  }): QueryResult {
    const { table, columns = ['*'], joins = [], where = [], orderBy = [], limit, offset } = options;

    // Build SELECT clause
    const selectClause = columns.join(', ');
    
    // Build FROM clause
    let fromClause = table;
    
    // Add JOINs
    if (joins.length > 0) {
      const joinClauses = joins.map(join => 
        `${join.type} JOIN ${join.table} ON ${join.condition}`
      );
      fromClause += ` ${joinClauses.join(' ')}`;
    }

    let sql = `SELECT ${selectClause} FROM ${fromClause}`;
    const args: any[] = [];

    // Add WHERE clause
    if (where.length > 0) {
      const whereClause = this.buildWhereClause(where);
      sql += ` WHERE ${whereClause.sql}`;
      args.push(...whereClause.args);
    }

    // Add ORDER BY clause
    if (orderBy.length > 0) {
      const orderClauses = orderBy.map(order => `${order.field} ${order.direction}`);
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT and OFFSET
    if (limit !== undefined) {
      sql += ` LIMIT ?`;
      args.push(limit);
    }

    if (offset !== undefined) {
      sql += ` OFFSET ?`;
      args.push(offset);
    }

    return { sql, args };
  }

  /**
   * Build INSERT query with conflict handling
   */
  static buildInsertQuery(
    table: string,
    data: Record<string, any>,
    onConflict?: 'IGNORE' | 'REPLACE' | 'UPDATE'
  ): QueryResult {
    const fields: string[] = [];
    const placeholders: string[] = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(this.camelToSnakeCase(key));
        placeholders.push('?');
        values.push(this.convertValueForDatabase(key, value));
      }
    }

    let sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;

    // Handle conflict resolution
    if (onConflict === 'IGNORE') {
      sql = sql.replace('INSERT INTO', 'INSERT OR IGNORE INTO');
    } else if (onConflict === 'REPLACE') {
      sql = sql.replace('INSERT INTO', 'INSERT OR REPLACE INTO');
    } else if (onConflict === 'UPDATE') {
      const updateClauses = fields.map(field => `${field} = excluded.${field}`);
      sql += ` ON CONFLICT DO UPDATE SET ${updateClauses.join(', ')}`;
    }

    return { sql, args: values };
  }

  /**
   * Build DELETE query with safety checks
   */
  static buildDeleteQuery(
    table: string,
    whereConditions: WhereCondition[]
  ): QueryResult {
    if (whereConditions.length === 0) {
      throw new Error('DELETE queries must have WHERE conditions for safety');
    }

    const whereClause = this.buildWhereClause(whereConditions);
    const sql = `DELETE FROM ${table} WHERE ${whereClause.sql}`;

    return { sql, args: whereClause.args };
  }

  /**
   * Build WHERE clause from conditions
   */
  private static buildWhereClause(conditions: WhereCondition[]): QueryResult {
    if (conditions.length === 0) {
      return { sql: '1=1', args: [] };
    }

    const clauses: string[] = [];
    const args: any[] = [];

    for (const condition of conditions) {
      const field = this.camelToSnakeCase(condition.field);
      
      if (condition.operator === 'IN' || condition.operator === 'NOT IN') {
        const placeholders = Array(condition.value.length).fill('?').join(', ');
        clauses.push(`${field} ${condition.operator} (${placeholders})`);
        args.push(...condition.value);
      } else {
        clauses.push(`${field} ${condition.operator} ?`);
        args.push(condition.value);
      }
    }

    return { sql: clauses.join(' AND '), args };
  }

  /**
   * Convert camelCase to snake_case for database fields
   */
  private static camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Convert values for database storage
   */
  private static convertValueForDatabase(key: string, value: any): any {
    // Handle specific field conversions
    if (key === 'coordinates' && value !== null) {
      return JSON.stringify(value);
    }
    
    if (key === 'isDefault' && typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    // Handle birthData nested object
    if (key === 'birthData' && typeof value === 'object' && value !== null) {
      return {
        dateOfBirth: value.dateOfBirth,
        timeOfBirth: value.timeOfBirth,
        locationOfBirth: value.locationOfBirth,
        coordinates: value.coordinates ? JSON.stringify(value.coordinates) : null
      };
    }

    return value;
  }

  /**
   * Create transaction queries for complex operations
   */
  static createTransaction(queries: QueryResult[]): string[] {
    const transactionQueries = ['BEGIN TRANSACTION'];
    
    queries.forEach(query => {
      // In a real implementation, you'd need to bind parameters
      // This is a simplified version for demonstration
      transactionQueries.push(query.sql);
    });
    
    transactionQueries.push('COMMIT');
    
    return transactionQueries;
  }

  /**
   * Helper to create common person queries
   */
  static PersonQueries = {
    /**
     * Find duplicate birth data
     */
    findDuplicate: (userId: string, relationship: string, birthData: any): QueryResult => {
      return this.buildSelectQuery({
        table: 'people',
        columns: ['id'],
        where: [
          { field: 'userId', operator: '=', value: userId },
          { field: 'relationship', operator: '=', value: relationship },
          { field: 'dateOfBirth', operator: '=', value: birthData.dateOfBirth },
          { field: 'timeOfBirth', operator: '=', value: birthData.timeOfBirth },
          { field: 'coordinates', operator: '=', value: JSON.stringify(birthData.coordinates) }
        ]
      });
    },

    /**
     * Remove default flag from all user's people
     */
    removeAllDefaults: (userId: string): QueryResult => {
      return this.buildUpdateQuery(
        'people',
        { isDefault: false },
        [{ field: 'userId', operator: '=', value: userId }]
      );
    },

    /**
     * Set new default person
     */
    setAsDefault: (personId: string, userId: string): QueryResult => {
      return this.buildUpdateQuery(
        'people',
        { isDefault: true },
        [
          { field: 'id', operator: '=', value: personId },
          { field: 'userId', operator: '=', value: userId }
        ]
      );
    }
  };
}