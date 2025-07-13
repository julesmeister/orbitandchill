/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';

// POST - Create seeding tables manually
export async function POST() {
  try {
    const db = await getDbAsync();
    if (!db || !db.client) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 500 });
    }

    // Check if tables already exist
    const seedConfigsResult = await db.client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="seed_user_configs"');
    const seedBatchesResult = await db.client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="seeding_batches"');

    let tablesCreated = [];
    
    if (seedConfigsResult.rows.length === 0) {
      await db.client.execute(`
        CREATE TABLE seed_user_configs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          writing_style TEXT NOT NULL,
          expertise_areas TEXT NOT NULL,
          response_pattern TEXT NOT NULL,
          reply_probability REAL NOT NULL,
          voting_behavior TEXT NOT NULL,
          ai_prompt_template TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      tablesCreated.push('seed_user_configs');
    }

    if (seedBatchesResult.rows.length === 0) {
      await db.client.execute(`
        CREATE TABLE seeding_batches (
          id TEXT PRIMARY KEY,
          source_type TEXT NOT NULL,
          source_content TEXT NOT NULL,
          processed_content TEXT,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
          discussions_created INTEGER NOT NULL DEFAULT 0,
          replies_created INTEGER NOT NULL DEFAULT 0,
          votes_created INTEGER NOT NULL DEFAULT 0,
          errors TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      tablesCreated.push('seeding_batches');
    }

    return NextResponse.json({
      success: true,
      message: tablesCreated.length > 0 ? 
        `Successfully created tables: ${tablesCreated.join(', ')}` :
        'All seeding tables already exist',
      tablesCreated,
      existingTables: {
        seedUserConfigs: seedConfigsResult.rows.length > 0,
        seedingBatches: seedBatchesResult.rows.length > 0
      }
    });
  } catch (error) {
    console.error('Error creating seeding tables:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create seeding tables: ' + (error as Error).message
    }, { status: 500 });
  }
}

// GET - Check if seeding tables exist
export async function GET() {
  try {
    const db = await getDbAsync();
    if (!db || !db.client) {
      return NextResponse.json({
        success: false,
        error: 'Database not available'
      }, { status: 500 });
    }

    const seedConfigsResult = await db.client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="seed_user_configs"');
    const seedBatchesResult = await db.client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="seeding_batches"');

    return NextResponse.json({
      success: true,
      tables: {
        seedUserConfigs: seedConfigsResult.rows.length > 0,
        seedingBatches: seedBatchesResult.rows.length > 0
      },
      allTablesExist: seedConfigsResult.rows.length > 0 && seedBatchesResult.rows.length > 0
    });
  } catch (error) {
    console.error('Error checking seeding tables:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check seeding tables: ' + (error as Error).message
    }, { status: 500 });
  }
}