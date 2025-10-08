/* eslint-disable @typescript-eslint/no-unused-vars */

import { createClient } from '@libsql/client/http';
import type { Client } from '@libsql/client';

/**
 * Database Connection Service
 * Centralizes database connection logic following API_DATABASE_PROTOCOL.md
 */
export class DatabaseConnectionService {
  private static connectionPool: Map<string, Client> = new Map();
  private static readonly MAX_POOL_SIZE = 20;

  /**
   * Create a direct database connection
   * Follows the established pattern from the original route
   */
  static async createDirectConnection(): Promise<Client> {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      throw new Error('Database environment variables not configured');
    }
    
    return createClient({
      url: databaseUrl,
      authToken: authToken,
    });
  }

  /**
   * Get a pooled connection (for better performance in high-traffic scenarios)
   */
  static async getPooledConnection(): Promise<Client> {
    const connectionKey = `${process.env.TURSO_DATABASE_URL}_${process.env.TURSO_AUTH_TOKEN}`;
    
    // Check if we have a cached connection
    if (this.connectionPool.has(connectionKey)) {
      const cachedClient = this.connectionPool.get(connectionKey)!;
      return cachedClient;
    }

    // Create new connection if pool isn't full
    if (this.connectionPool.size < this.MAX_POOL_SIZE) {
      const client = await this.createDirectConnection();
      this.connectionPool.set(connectionKey, client);
      return client;
    }

    // Fallback to direct connection if pool is full
    return this.createDirectConnection();
  }

  /**
   * Execute a query with automatic connection management and retry logic
   */
  static async executeQuery(
    sql: string, 
    args: any[] = []
  ): Promise<{ rows: any[]; rowsAffected: number }> {
    return this.executeWithRetry(async () => {
      // Validate parameters before execution
      this.validateQueryParameters(sql, args);
      
      const client = await this.getPooledConnection();
      
      try {
        const result = await client.execute({ sql, args });
        return {
          rows: result.rows,
          rowsAffected: result.rowsAffected
        };
      } catch (error) {
        // Enhanced error logging with more context
        const errorContext = {
          sql: sql,
          args: args,
          argsTypes: args.map(arg => typeof arg),
          undefinedArgs: args.map((arg, index) => arg === undefined ? index : null).filter(i => i !== null),
          error: error
        };
        
        console.error('Database query failed:', errorContext);
        
        // Provide more user-friendly error messages
        if (error instanceof Error && error.message.includes('Unsupported type of value')) {
          const undefinedArgIndex = args.findIndex(arg => arg === undefined);
          if (undefinedArgIndex !== -1) {
            throw new Error(`Database parameter at index ${undefinedArgIndex} is undefined. SQL: ${sql}`);
          }
          throw new Error(`Database parameter validation failed. Check that all required fields are provided.`);
        }
        
        throw error;
      }
    });
  }

  /**
   * Execute multiple queries in a transaction
   */
  static async executeTransaction(queries: Array<{ sql: string; args: any[] }>): Promise<any[]> {
    const client = await this.getPooledConnection();

    try {
      // Begin transaction
      await client.execute({ sql: 'BEGIN TRANSACTION', args: [] });

      const results = [];
      for (const query of queries) {
        const result = await client.execute({ sql: query.sql, args: query.args });
        results.push(result);
      }

      // Commit transaction
      try {
        await client.execute({ sql: 'COMMIT', args: [] });
      } catch (commitError) {
        // Check if error is about no active transaction (transaction was auto-committed by Turso)
        const errorMessage = commitError instanceof Error ? commitError.message : String(commitError);
        if (errorMessage.includes('cannot commit') || errorMessage.includes('no transaction is active')) {
          console.warn('Transaction was auto-committed by database - queries succeeded:', errorMessage);
          // Don't throw - the queries likely succeeded even if explicit commit failed
          return results;
        }
        throw commitError;
      }

      return results;
    } catch (error) {
      // Rollback on error
      try {
        await client.execute({ sql: 'ROLLBACK', args: [] });
      } catch (rollbackError) {
        console.error('Transaction rollback failed:', rollbackError);
      }

      console.error('Transaction failed:', error);
      throw error;
    }
  }

  /**
   * Test database connectivity
   */
  static async testConnection(): Promise<boolean> {
    try {
      const client = await this.createDirectConnection();
      await client.execute({ sql: 'SELECT 1', args: [] });
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Close all pooled connections (useful for cleanup)
   */
  static async closeAllConnections(): Promise<void> {
    for (const [key, client] of this.connectionPool.entries()) {
      try {
        await client.close();
      } catch (error) {
        console.error(`Failed to close connection ${key}:`, error);
      }
    }
    this.connectionPool.clear();
  }

  /**
   * Get connection pool statistics
   */
  static getPoolStats(): { size: number; maxSize: number; usage: number } {
    return {
      size: this.connectionPool.size,
      maxSize: this.MAX_POOL_SIZE,
      usage: this.connectionPool.size / this.MAX_POOL_SIZE
    };
  }

  /**
   * Execute operation with retry logic
   */
  private static async executeWithRetry<T>(
    operation: () => Promise<T>, 
    maxRetries: number = 3, 
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry validation errors or parameter errors
        if (lastError.message.includes('undefined') || 
            lastError.message.includes('validation') ||
            lastError.message.includes('Parameter count mismatch')) {
          throw lastError;
        }
        
        // Log retry attempt
        if (attempt < maxRetries) {
          console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms:`, lastError.message);
          await this.sleep(delayMs * attempt); // Exponential backoff
        }
      }
    }
    
    throw new Error(`Database operation failed after ${maxRetries} attempts. Last error: ${lastError!.message}`);
  }

  /**
   * Sleep utility for retry delays
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate query parameters before execution
   */
  private static validateQueryParameters(sql: string, args: any[]): void {
    if (!sql || typeof sql !== 'string') {
      throw new Error('SQL query must be a non-empty string');
    }

    if (!Array.isArray(args)) {
      throw new Error('Query arguments must be an array');
    }

    // Check for undefined parameters
    const undefinedArgs = args.map((arg, index) => arg === undefined ? index : null).filter(i => i !== null);
    if (undefinedArgs.length > 0) {
      throw new Error(`Database parameters at indices [${undefinedArgs.join(', ')}] are undefined. SQL: ${sql}`);
    }

    // Check parameter count vs placeholders
    const placeholderCount = (sql.match(/\?/g) || []).length;
    if (args.length !== placeholderCount) {
      throw new Error(`Parameter count mismatch: SQL has ${placeholderCount} placeholders but ${args.length} arguments provided. SQL: ${sql}`);
    }

    // Validate parameter types
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const argType = typeof arg;
      
      // Allow null but not undefined
      if (arg === null) continue;
      
      // Check for supported types
      if (!['string', 'number', 'boolean'].includes(argType) && !(arg instanceof Date)) {
        console.warn(`Parameter at index ${i} has potentially unsupported type "${argType}":`, arg);
      }
    }
  }
}