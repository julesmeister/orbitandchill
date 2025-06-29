/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

// DEBUG: Manually create horary_questions table
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Manual horary_questions table creation started');
    console.log('🔍 Database instance available:', !!db);
    
    if (!db) {
      return NextResponse.json({
        success: false,
        error: 'Database not available',
        debug: {
          dbInstance: !!db,
          client: !!db?.client
        }
      }, { status: 500 });
    }

    // Check if table already exists
    console.log('🔍 Checking if horary_questions table exists...');
    const existsResult = await db.client.execute(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="horary_questions"'
    );
    
    const tableExists = existsResult.rows && existsResult.rows.length > 0;
    console.log('📊 Table existence check:', { tableExists, rowsFound: existsResult.rows?.length });

    if (tableExists) {
      return NextResponse.json({
        success: true,
        message: 'Table already exists',
        debug: {
          tableExists: true,
          rowsFound: existsResult.rows?.length
        }
      });
    }

    // Create the table
    console.log('🔧 Creating horary_questions table...');
    await db.client.execute(`
      CREATE TABLE IF NOT EXISTS horary_questions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        question TEXT NOT NULL,
        date INTEGER NOT NULL,
        location TEXT,
        latitude REAL,
        longitude REAL,
        timezone TEXT,
        answer TEXT,
        timing TEXT,
        interpretation TEXT,
        chart_data TEXT,
        chart_svg TEXT,
        ascendant_degree REAL,
        moon_sign TEXT,
        moon_void_of_course INTEGER,
        planetary_hour TEXT,
        is_radical INTEGER,
        chart_warnings TEXT,
        category TEXT,
        tags TEXT,
        is_shared INTEGER DEFAULT 0,
        share_token TEXT,
        aspect_count INTEGER,
        retrograde_count INTEGER,
        significator_planet TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ horary_questions table created successfully');

    // Verify the table was created
    const verifyResult = await db.client.execute(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="horary_questions"'
    );
    
    const createdSuccessfully = verifyResult.rows && verifyResult.rows.length > 0;
    console.log('✅ Table creation verified:', { createdSuccessfully });

    return NextResponse.json({
      success: true,
      message: 'horary_questions table created successfully',
      debug: {
        tableExists: createdSuccessfully,
        verificationRows: verifyResult.rows?.length
      }
    });

  } catch (error) {
    console.error('❌ Manual table creation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create horary_questions table',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        dbAvailable: !!db,
        clientAvailable: !!db?.client
      }
    }, { status: 500 });
  }
}