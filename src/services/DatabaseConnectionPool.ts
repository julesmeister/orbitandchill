/* eslint-disable @typescript-eslint/no-unused-vars */

import { createClient } from '@libsql/client/http';
import type { Client } from '@libsql/client';

interface PoolConfig {
  maxConnections: number;
  minConnections: number;
  maxIdleTime: number; // milliseconds
  acquireTimeout: number; // milliseconds
  healthCheckInterval: number; // milliseconds
}

interface ConnectionMetrics {
  id: string;
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  isIdle: boolean;
}

interface PoolStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
  totalAcquisitions: number;
  totalReleases: number;
  averageAcquisitionTime: number;
  connectionMetrics: ConnectionMetrics[];
}

/**
 * Advanced database connection pool with monitoring and health checks
 */
export class DatabaseConnectionPool {
  private connections: Map<string, Client> = new Map();
  private connectionMetrics: Map<string, ConnectionMetrics> = new Map();
  private config: PoolConfig;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private acquisitionTimes: number[] = [];
  private totalAcquisitions = 0;
  private totalReleases = 0;
  private isShuttingDown = false;

  constructor(config: Partial<PoolConfig> = {}) {
    this.config = {
      maxConnections: 25,
      minConnections: 5,
      maxIdleTime: 300000, // 5 minutes
      acquireTimeout: 10000, // 10 seconds
      healthCheckInterval: 60000, // 1 minute
      ...config,
    };

    this.startHealthCheck();
  }

  /**
   * Create a new database connection
   */
  private async createConnection(): Promise<Client> {
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
   * Generate unique connection ID
   */
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  /**
   * Acquire a connection from the pool
   */
  async acquire(): Promise<Client> {
    if (this.isShuttingDown) {
      throw new Error('Connection pool is shutting down');
    }

    const startTime = Date.now();

    try {
      // Try to find an idle connection first
      for (const [id, client] of this.connections.entries()) {
        const metrics = this.connectionMetrics.get(id);
        if (metrics && metrics.isIdle) {
          metrics.isIdle = false;
          metrics.lastUsed = new Date();
          metrics.usageCount++;
          
          this.recordAcquisitionTime(Date.now() - startTime);
          this.totalAcquisitions++;
          
          return client;
        }
      }

      // If no idle connections and we haven't reached max, create new connection
      if (this.connections.size < this.config.maxConnections) {
        const connectionId = this.generateConnectionId();
        const client = await this.createConnection();
        
        this.connections.set(connectionId, client);
        this.connectionMetrics.set(connectionId, {
          id: connectionId,
          createdAt: new Date(),
          lastUsed: new Date(),
          usageCount: 1,
          isIdle: false,
        });

        this.recordAcquisitionTime(Date.now() - startTime);
        this.totalAcquisitions++;
        
        return client;
      }

      // Wait for a connection to become available
      return await this.waitForAvailableConnection(startTime);

    } catch (error) {
      console.error('Failed to acquire database connection:', error);
      throw error;
    }
  }

  /**
   * Wait for a connection to become available
   */
  private async waitForAvailableConnection(startTime: number): Promise<Client> {
    const timeout = this.config.acquireTimeout;
    const checkInterval = 100; // Check every 100ms
    
    while (Date.now() - startTime < timeout) {
      // Check for idle connections
      for (const [id, client] of this.connections.entries()) {
        const metrics = this.connectionMetrics.get(id);
        if (metrics && metrics.isIdle) {
          metrics.isIdle = false;
          metrics.lastUsed = new Date();
          metrics.usageCount++;
          
          this.recordAcquisitionTime(Date.now() - startTime);
          this.totalAcquisitions++;
          
          return client;
        }
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    throw new Error(`Failed to acquire connection within ${timeout}ms timeout`);
  }

  /**
   * Release a connection back to the pool
   */
  async release(client: Client): Promise<void> {
    try {
      // Find the connection in our pool
      for (const [id, poolClient] of this.connections.entries()) {
        if (poolClient === client) {
          const metrics = this.connectionMetrics.get(id);
          if (metrics) {
            metrics.isIdle = true;
            metrics.lastUsed = new Date();
          }
          
          this.totalReleases++;
          return;
        }
      }

      // Connection not found in pool - this shouldn't happen
      console.warn('Attempted to release connection not in pool');
    } catch (error) {
      console.error('Failed to release database connection:', error);
    }
  }

  /**
   * Execute a query using a pooled connection
   */
  async execute<T = any>(
    operation: (client: Client) => Promise<T>
  ): Promise<T> {
    const client = await this.acquire();
    
    try {
      const result = await operation(client);
      return result;
    } finally {
      await this.release(client);
    }
  }

  /**
   * Record acquisition time for metrics
   */
  private recordAcquisitionTime(time: number): void {
    this.acquisitionTimes.push(time);
    
    // Keep only last 100 acquisition times for rolling average
    if (this.acquisitionTimes.length > 100) {
      this.acquisitionTimes = this.acquisitionTimes.slice(-100);
    }
  }

  /**
   * Start health check timer
   */
  private startHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * Perform health check and cleanup idle connections
   */
  private async performHealthCheck(): Promise<void> {
    if (this.isShuttingDown) return;

    const now = Date.now();
    const connectionsToRemove: string[] = [];

    // Check for connections that have been idle too long
    for (const [id, metrics] of this.connectionMetrics.entries()) {
      if (metrics.isIdle && now - metrics.lastUsed.getTime() > this.config.maxIdleTime) {
        // Don't remove if we're at minimum connections
        if (this.connections.size > this.config.minConnections) {
          connectionsToRemove.push(id);
        }
      }
    }

    // Remove idle connections
    for (const id of connectionsToRemove) {
      try {
        const client = this.connections.get(id);
        if (client) {
          await client.close();
        }
        this.connections.delete(id);
        this.connectionMetrics.delete(id);
      } catch (error) {
        console.error(`Failed to close connection ${id}:`, error);
      }
    }

    if (connectionsToRemove.length > 0) {
      console.log(`Database pool: Cleaned up ${connectionsToRemove.length} idle connections`);
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): PoolStats {
    const activeConnections = Array.from(this.connectionMetrics.values()).filter(m => !m.isIdle).length;
    const idleConnections = this.connections.size - activeConnections;
    
    const averageAcquisitionTime = this.acquisitionTimes.length > 0 
      ? this.acquisitionTimes.reduce((a, b) => a + b, 0) / this.acquisitionTimes.length
      : 0;

    return {
      totalConnections: this.connections.size,
      activeConnections,
      idleConnections,
      maxConnections: this.config.maxConnections,
      totalAcquisitions: this.totalAcquisitions,
      totalReleases: this.totalReleases,
      averageAcquisitionTime: Math.round(averageAcquisitionTime * 100) / 100,
      connectionMetrics: Array.from(this.connectionMetrics.values()),
    };
  }

  /**
   * Test connection health
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.execute(async (client) => {
        await client.execute({ sql: 'SELECT 1', args: [] });
        return true;
      });
      return result;
    } catch (error) {
      console.error('Database connection health check failed:', error);
      return false;
    }
  }

  /**
   * Warm up the pool by creating minimum connections
   */
  async warmUp(): Promise<void> {
    const connectionsToCreate = this.config.minConnections - this.connections.size;
    
    if (connectionsToCreate <= 0) return;

    console.log(`Database pool: Warming up with ${connectionsToCreate} connections`);

    const promises = Array.from({ length: connectionsToCreate }, async () => {
      try {
        const connectionId = this.generateConnectionId();
        const client = await this.createConnection();
        
        this.connections.set(connectionId, client);
        this.connectionMetrics.set(connectionId, {
          id: connectionId,
          createdAt: new Date(),
          lastUsed: new Date(),
          usageCount: 0,
          isIdle: true,
        });
      } catch (error) {
        console.error('Failed to create warm-up connection:', error);
      }
    });

    await Promise.allSettled(promises);
    console.log(`Database pool: Warmed up with ${this.connections.size} total connections`);
  }

  /**
   * Gracefully shutdown the pool
   */
  async shutdown(): Promise<void> {
    console.log('Database pool: Starting graceful shutdown...');
    this.isShuttingDown = true;

    // Stop health checks
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // Close all connections
    const closePromises = Array.from(this.connections.entries()).map(async ([id, client]) => {
      try {
        await client.close();
        console.log(`Database pool: Closed connection ${id}`);
      } catch (error) {
        console.error(`Database pool: Failed to close connection ${id}:`, error);
      }
    });

    await Promise.allSettled(closePromises);

    // Clear maps
    this.connections.clear();
    this.connectionMetrics.clear();

    console.log('Database pool: Shutdown complete');
  }

  /**
   * Force cleanup (for memory pressure scenarios)
   */
  async forceCleanup(): Promise<number> {
    let cleanedUp = 0;
    const toRemove: string[] = [];

    // Remove all idle connections
    for (const [id, metrics] of this.connectionMetrics.entries()) {
      if (metrics.isIdle) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      try {
        const client = this.connections.get(id);
        if (client) {
          await client.close();
        }
        this.connections.delete(id);
        this.connectionMetrics.delete(id);
        cleanedUp++;
      } catch (error) {
        console.error(`Failed to cleanup connection ${id}:`, error);
      }
    }

    return cleanedUp;
  }
}

// Global pool instance
let globalPool: DatabaseConnectionPool | null = null;

/**
 * Get or create the global database connection pool
 */
export function getGlobalPool(): DatabaseConnectionPool {
  if (!globalPool) {
    globalPool = new DatabaseConnectionPool();
  }
  return globalPool;
}

/**
 * Initialize and warm up the global pool
 */
export async function initializePool(): Promise<void> {
  const pool = getGlobalPool();
  await pool.warmUp();
}

/**
 * Shutdown the global pool
 */
export async function shutdownPool(): Promise<void> {
  if (globalPool) {
    await globalPool.shutdown();
    globalPool = null;
  }
}