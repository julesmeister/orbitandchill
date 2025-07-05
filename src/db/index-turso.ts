/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/http';
import * as schema from './schema';
import path from 'path';

// Create Turso client
let client: ReturnType<typeof createClient> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

// Initialize Turso connection
try {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!databaseUrl || !authToken) {
    throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
  }
  
  client = createClient({
    url: databaseUrl,
    authToken: authToken,
  });
  
  db = drizzle(client, { schema });
} catch (error) {
  console.error('❌ Failed to connect to Turso database:', error);
  // Don't throw - let the app continue with fallback mode
}

// Export the database instance (may be null if connection failed)
export { db };

// Auto-migrate on startup (for development)
let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized || !db) {
    return;
  }
  
  try {
    // Just test the connection for now, skip migrations
    const result = await db.select().from(schema.users).limit(1);
    isInitialized = true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    // Don't throw - let the app continue with fallback mode
  }
}

// Export schema for use in other files
export * from './schema';

// Helper function to close database connection
export function closeDatabase() {
  if (client) {
    client.close();
    client = null;
    db = null;
    isInitialized = false;
  }
}