/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Database environment variables not configured' },
        { status: 500 }
      );
    }
    
    const { createClient } = await import('@libsql/client/http');
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Create the ai_configurations table if it doesn't exist
    await client.execute({
      sql: `CREATE TABLE IF NOT EXISTS ai_configurations (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        api_key TEXT NOT NULL,
        temperature REAL DEFAULT 0.7,
        is_default INTEGER DEFAULT 0,
        is_public INTEGER DEFAULT 0,
        description TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
      args: []
    });

    // Create index for faster lookups
    await client.execute({
      sql: `CREATE INDEX IF NOT EXISTS idx_ai_config_default 
            ON ai_configurations(is_default, is_public)`,
      args: []
    });

    return NextResponse.json({
      success: true,
      message: 'AI configurations table created successfully'
    });

  } catch (error) {
    console.error('Error creating AI configurations table:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create AI configurations table' },
      { status: 500 }
    );
  }
}