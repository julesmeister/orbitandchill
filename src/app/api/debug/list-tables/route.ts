/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

// DEBUG: List all tables in the database
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Listing database tables');
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

    // List all tables
    console.log('🔍 Querying sqlite_master for tables...');
    const tablesResult = await db.client.execute(
      'SELECT name, type, sql FROM sqlite_master WHERE type="table" ORDER BY name'
    );
    
    const tables = tablesResult.rows || [];
    console.log('📊 Found tables:', tables.map((t: any) => t.name));

    // Check specifically for horary_questions
    const horaryTableExists = tables.some((t: any) => t.name === 'horary_questions');
    console.log('🔍 horary_questions table exists:', horaryTableExists);

    return NextResponse.json({
      success: true,
      tables: tables.map((table: any) => ({
        name: table.name,
        type: table.type,
        sql: table.sql
      })),
      debug: {
        totalTables: tables.length,
        horaryTableExists,
        dbAvailable: !!db,
        clientAvailable: !!db?.client
      }
    });

  } catch (error) {
    console.error('❌ Table listing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to list tables',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        dbAvailable: !!db,
        clientAvailable: !!db?.client
      }
    }, { status: 500 });
  }
}