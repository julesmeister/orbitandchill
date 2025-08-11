/* eslint-disable @typescript-eslint/no-unused-vars */

import { createClient } from '@libsql/client/http';
import type { Client } from '@libsql/client';

/**
 * Database Connection Service
 * Centralizes database connection logic following API_DATABASE_PROTOCOL.md
 */
export class DatabaseConnectionService {
  private static connectionPool: Map<string, Client> = new Map();
  private static readonly MAX_POOL_SIZE = 10;

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
   * Execute a query with automatic connection management
   */
  static async executeQuery(
    sql: string, 
    args: any[] = []
  ): Promise<{ rows: any[]; rowsAffected: number }> {
    const client = await this.createDirectConnection();
    
    try {
      const result = await client.execute({ sql, args });
      return {
        rows: result.rows,
        rowsAffected: result.rowsAffected
      };
    } catch (error) {
      console.error('Database query failed:', { sql, args, error });
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  static async executeTransaction(queries: Array<{ sql: string; args: any[] }>): Promise<any[]> {
    const client = await this.createDirectConnection();
    
    try {
      // Begin transaction
      await client.execute({ sql: 'BEGIN TRANSACTION', args: [] });
      
      const results = [];
      for (const query of queries) {
        const result = await client.execute({ sql: query.sql, args: query.args });
        results.push(result);
      }
      
      // Commit transaction
      await client.execute({ sql: 'COMMIT', args: [] });
      
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
}