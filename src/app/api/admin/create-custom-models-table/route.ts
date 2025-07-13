/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// API endpoint to create the custom_ai_models table directly
export async function POST(request: NextRequest) {
  try {
    // Direct database connection (bypassing service layer issues)
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
    
    // Create the custom_ai_models table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS custom_ai_models (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        
        -- Model configuration
        provider_id TEXT NOT NULL, -- 'openrouter', 'openai', 'claude', etc.
        model_name TEXT NOT NULL, -- The model identifier/endpoint
        display_name TEXT NOT NULL, -- User-friendly name for the model
        description TEXT, -- Optional description
        
        -- Model settings
        is_active INTEGER NOT NULL DEFAULT 1, -- Boolean: 1 = active, 0 = inactive
        is_default INTEGER NOT NULL DEFAULT 0, -- Boolean: 1 = default, 0 = not default
        
        -- Usage tracking
        usage_count INTEGER NOT NULL DEFAULT 0,
        last_used INTEGER, -- Timestamp
        
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `;
    
    await client.execute(createTableSQL);
    
    // Create indexes for performance
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_custom_ai_models_user_id ON custom_ai_models(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_custom_ai_models_provider ON custom_ai_models(user_id, provider_id)',
      'CREATE INDEX IF NOT EXISTS idx_custom_ai_models_active ON custom_ai_models(user_id, provider_id, is_active) WHERE is_active = 1'
    ];
    
    for (const indexSQL of createIndexes) {
      await client.execute(indexSQL);
    }
    
    // Test the table by trying to select from it
    const testResult = await client.execute('SELECT COUNT(*) as count FROM custom_ai_models');
    const count = testResult.rows[0]?.count || 0;
    
    return NextResponse.json({
      success: true,
      message: 'Custom AI models table created successfully',
      tableExists: true,
      currentRecords: count
    });
    
  } catch (error) {
    console.error('Error creating custom_ai_models table:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create table: ' + (error instanceof Error ? error.message : String(error)) 
      },
      { status: 500 }
    );
  }
}