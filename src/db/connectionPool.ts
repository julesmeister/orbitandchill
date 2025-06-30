/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Database Connection Pool for Turso HTTP Client
 * Manages multiple database connections to improve performance and handle concurrent requests
 */

interface PooledConnection {
  id: string;
  client: any;
  isInUse: boolean;
  createdAt: number;
  lastUsed: number;
  queryCount: number;
}

interface PoolConfig {
  minConnections: number;
  maxConnections: number;
  acquireTimeoutMs: number;
  idleTimeoutMs: number;
  maxLifetimeMs: number;
  retryAttempts: number;
}

class TursoConnectionPool {
  private connections: Map<string, PooledConnection> = new Map();
  private waitingQueue: Array<{
    resolve: (connection: PooledConnection) => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  
  private config: PoolConfig;
  private isDestroyed = false;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private databaseUrl: string;
  private authToken: string;

  constructor(databaseUrl: string, authToken: string, config?: Partial<PoolConfig>) {
    this.databaseUrl = databaseUrl;
    this.authToken = authToken;
    this.config = {
      minConnections: 1,
      maxConnections: 4,      // Reduced from 10 to 4
      acquireTimeoutMs: 5000, // Reduced from 10s to 5s
      idleTimeoutMs: 60000,   // Reduced from 5m to 1m
      maxLifetimeMs: 600000,  // Reduced from 1h to 10m
      retryAttempts: 2,       // Reduced from 3 to 2
      ...config
    };

    // Only initialize if we're in a runtime environment (not during build)
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'development') {
      // Defer initialization to avoid build-time issues
      process.nextTick(() => {
        this.initialize().catch(error => {
          console.warn('Deferred connection pool initialization failed:', error);
        });
      });
    } else if (typeof window === 'undefined') {
      // In development, initialize immediately
      this.initialize().catch(error => {
        console.warn('Connection pool initialization failed:', error);
      });
    }
  }

  /**
   * Initialize the connection pool
   */
  private async initialize() {
    try {
      // Create minimum number of connections
      const connectionPromises = Array.from({ length: this.config.minConnections }, () => 
        this.createConnection()
      );
      
      await Promise.all(connectionPromises);
      
      // Start cleanup timer
      this.startCleanupTimer();
    } catch (error) {
      console.error('❌ Failed to initialize connection pool:', error);
      throw error;
    }
  }

  /**
   * Create a new database connection
   */
  private async createConnection(): Promise<PooledConnection> {
    try {
      const { createClient } = await import('@libsql/client/http');
      
      const client = createClient({
        url: this.databaseUrl,
        authToken: this.authToken,
      });

      // Test the connection
      await client.execute('SELECT 1 as test');

      const connection: PooledConnection = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        client,
        isInUse: false,
        createdAt: Date.now(),
        lastUsed: Date.now(),
        queryCount: 0
      };

      this.connections.set(connection.id, connection);
      
      return connection;
    } catch (error) {
      console.error('❌ Failed to create database connection:', error);
      throw error;
    }
  }

  /**
   * Acquire a connection from the pool
   */
  async acquireConnection(): Promise<PooledConnection> {
    if (this.isDestroyed) {
      throw new Error('Connection pool has been destroyed');
    }

    // Try to find an available connection
    const availableConnection = this.findAvailableConnection();
    if (availableConnection) {
      availableConnection.isInUse = true;
      availableConnection.lastUsed = Date.now();
      return availableConnection;
    }

    // Try to create a new connection if under max limit
    if (this.connections.size < this.config.maxConnections) {
      try {
        const newConnection = await this.createConnection();
        newConnection.isInUse = true;
        return newConnection;
      } catch (error) {
        console.error('❌ Failed to create new connection:', error);
      }
    }

    // Wait for a connection to become available
    return this.waitForConnection();
  }

  /**
   * Find an available connection
   */
  private findAvailableConnection(): PooledConnection | null {
    for (const connection of this.connections.values()) {
      if (!connection.isInUse && this.isConnectionValid(connection)) {
        return connection;
      }
    }
    return null;
  }

  /**
   * Check if connection is still valid
   */
  private isConnectionValid(connection: PooledConnection): boolean {
    const now = Date.now();
    const age = now - connection.createdAt;
    const idleTime = now - connection.lastUsed;

    return age < this.config.maxLifetimeMs && idleTime < this.config.idleTimeoutMs;
  }

  /**
   * Wait for a connection to become available
   */
  private async waitForConnection(): Promise<PooledConnection> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        // Remove from queue
        const index = this.waitingQueue.findIndex(item => item.resolve === resolve);
        if (index !== -1) {
          this.waitingQueue.splice(index, 1);
        }
        reject(new Error('Connection acquisition timeout'));
      }, this.config.acquireTimeoutMs);

      this.waitingQueue.push({
        resolve: (connection) => {
          clearTimeout(timeout);
          resolve(connection);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        timestamp: Date.now()
      });
    });
  }

  /**
   * Release a connection back to the pool
   */
  releaseConnection(connection: PooledConnection) {
    if (!this.connections.has(connection.id)) {
      console.warn(`Attempted to release unknown connection: ${connection.id}`);
      return;
    }

    connection.isInUse = false;
    connection.lastUsed = Date.now();

    // If there are waiting requests, fulfill the next one
    if (this.waitingQueue.length > 0) {
      const waiter = this.waitingQueue.shift();
      if (waiter) {
        connection.isInUse = true;
        waiter.resolve(connection);
      }
    }
  }

  /**
   * Execute a query using a pooled connection
   */
  async execute(sql: string, args?: any[]): Promise<any> {
    let connection: PooledConnection | null = null;

    try {
      connection = await this.acquireConnection();
      connection.queryCount++;

      const result = args && args.length > 0 
        ? await connection.client.execute({ sql, args })
        : await connection.client.execute(sql);

      return result;
    } catch (error) {
      console.error('❌ Query execution failed:', error);
      throw error;
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  /**
   * Execute a transaction using a pooled connection
   */
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    let connection: PooledConnection | null = null;

    try {
      connection = await this.acquireConnection();
      connection.queryCount++;

      // Note: Turso HTTP client doesn't support traditional transactions
      // This is a single-connection execution to maintain consistency
      const result = await callback(connection.client);
      return result;
    } catch (error) {
      console.error('❌ Transaction failed:', error);
      throw error;
    } finally {
      if (connection) {
        this.releaseConnection(connection);
      }
    }
  }

  /**
   * Start cleanup timer for idle connections
   */
  private startCleanupTimer() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  /**
   * Clean up idle and expired connections
   */
  private cleanup() {
    const now = Date.now();
    const connectionsToRemove: string[] = [];

    for (const [id, connection] of this.connections.entries()) {
      if (!connection.isInUse && !this.isConnectionValid(connection)) {
        connectionsToRemove.push(id);
      }
    }

    // Remove invalid connections
    connectionsToRemove.forEach(id => {
      const connection = this.connections.get(id);
      if (connection) {
        try {
          // Close the connection if possible
          if (connection.client && typeof connection.client.close === 'function') {
            connection.client.close();
          }
        } catch (error) {
          console.warn(`Error closing connection ${id}:`, error);
        }
        this.connections.delete(id);
      }
    });

    // Ensure minimum connections
    const activeConnections = this.connections.size;
    if (activeConnections < this.config.minConnections) {
      const connectionsToCreate = this.config.minConnections - activeConnections;
      for (let i = 0; i < connectionsToCreate; i++) {
        this.createConnection().catch(error => {
          console.error('❌ Failed to create connection during cleanup:', error);
        });
      }
    }
  }

  /**
   * Get pool statistics
   */
  getStats() {
    const connections = Array.from(this.connections.values());
    const inUse = connections.filter(conn => conn.isInUse).length;
    const available = connections.filter(conn => !conn.isInUse).length;
    const totalQueries = connections.reduce((sum, conn) => sum + conn.queryCount, 0);

    return {
      totalConnections: this.connections.size,
      inUse,
      available,
      waiting: this.waitingQueue.length,
      totalQueries,
      avgQueriesPerConnection: this.connections.size > 0 ? totalQueries / this.connections.size : 0,
      config: this.config
    };
  }

  /**
   * Destroy the connection pool
   */
  async destroy() {
    this.isDestroyed = true;

    // Clear cleanup timer
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Reject all waiting requests
    this.waitingQueue.forEach(waiter => {
      waiter.reject(new Error('Connection pool destroyed'));
    });
    this.waitingQueue.length = 0;

    // Close all connections
    const closePromises = Array.from(this.connections.values()).map(async (connection) => {
      try {
        if (connection.client && typeof connection.client.close === 'function') {
          await connection.client.close();
        }
      } catch (error) {
        console.warn(`Error closing connection ${connection.id}:`, error);
      }
    });

    await Promise.allSettled(closePromises);
    this.connections.clear();
  }
}

// Global connection pool instance
let globalPool: TursoConnectionPool | null = null;

/**
 * Initialize the global connection pool (singleton with health check)
 */
export async function initializeConnectionPool(databaseUrl: string, authToken: string, config?: Partial<PoolConfig>) {
  // Only proceed if we have valid credentials and are in a server environment
  if (!databaseUrl || !authToken || typeof window !== 'undefined') {
    throw new Error('Connection pool requires valid credentials and server environment');
  }

  // Check if existing pool is healthy and not destroyed
  if (globalPool && !globalPool['isDestroyed']) {
    try {
      // Verify pool health with a simple stats check
      const stats = globalPool.getStats();
      if (stats && stats.totalConnections >= 0) {
        return globalPool;
      }
    } catch (error) {
      console.warn('Pool health check failed, recreating:', error);
    }
  }
  
  // Destroy unhealthy or existing pool
  if (globalPool) {
    try {
      await globalPool.destroy();
    } catch (error) {
      console.warn('Error destroying old connection pool:', error);
    }
    globalPool = null;
  }

  try {
    globalPool = new TursoConnectionPool(databaseUrl, authToken, config);
    return globalPool;
  } catch (error) {
    console.error('❌ Failed to initialize connection pool:', error);
    throw error;
  }
}

/**
 * Get the global connection pool
 */
export function getConnectionPool(): TursoConnectionPool | null {
  return globalPool;
}

/**
 * Execute a query using the global connection pool
 */
export async function executePooledQuery(sql: string, args?: any[]): Promise<any> {
  if (!globalPool) {
    throw new Error('Connection pool not initialized');
  }
  return globalPool.execute(sql, args);
}

/**
 * Execute a transaction using the global connection pool
 */
export async function executePooledTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  if (!globalPool) {
    throw new Error('Connection pool not initialized');
  }
  return globalPool.transaction(callback);
}

/**
 * Get connection pool statistics
 */
export function getPoolStats() {
  return globalPool?.getStats() || null;
}

/**
 * Destroy the global connection pool
 */
export async function destroyConnectionPool() {
  if (globalPool) {
    await globalPool.destroy();
    globalPool = null;
  }
}

/**
 * Force cleanup of the global connection pool (for app restart/memory pressure)
 */
export async function forcePoolCleanup() {
  if (globalPool) {
    try {
      // Force cleanup of idle connections
      globalPool['cleanup']();
      
      // If pool is unhealthy, destroy and recreate will happen on next use
      const stats = globalPool.getStats();
      if (stats.totalConnections > stats.config.maxConnections * 2) {
        console.warn('Pool has excessive connections, destroying for cleanup');
        await destroyConnectionPool();
      }
    } catch (error) {
      console.warn('Error during force pool cleanup:', error);
      await destroyConnectionPool();
    }
  }
}

export default TursoConnectionPool;