/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting user_activity table migration...');
    
    const db = await initializeDatabase();
    if (!db) {
      throw new Error('Failed to initialize database');
    }

    // Get the raw database client for executing migration SQL
    const dbObj = db as any;
    const client = dbObj.client;
    
    if (!client) {
      throw new Error('Database client not available');
    }

    // Migration: Make user_id nullable in user_activity table
    // SQLite doesn't support modifying columns directly, so we need to:
    // 1. Create new table with nullable user_id
    // 2. Copy data from old table
    // 3. Drop old table
    // 4. Rename new table

    console.log('🔧 Step 1: Creating new user_activity table with nullable user_id...');
    
    await client.execute(`
      CREATE TABLE user_activity_new (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id) ON DELETE CASCADE, -- Now nullable
        activity_type TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        description TEXT NOT NULL,
        metadata TEXT,
        ip_address TEXT,
        user_agent TEXT,
        session_id TEXT,
        page_url TEXT,
        referrer TEXT,
        created_at INTEGER NOT NULL
      )
    `);

    console.log('🔧 Step 2: Copying existing data...');
    
    await client.execute(`
      INSERT INTO user_activity_new 
      SELECT * FROM user_activity
    `);

    console.log('🔧 Step 3: Dropping old table...');
    
    await client.execute(`DROP TABLE user_activity`);

    console.log('🔧 Step 4: Renaming new table...');
    
    await client.execute(`ALTER TABLE user_activity_new RENAME TO user_activity`);

    console.log('✅ user_activity table migration completed successfully');

    return NextResponse.json({
      success: true,
      message: 'user_activity table migrated successfully - user_id is now nullable for anonymous users'
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    return NextResponse.json({
      success: false,
      error: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}