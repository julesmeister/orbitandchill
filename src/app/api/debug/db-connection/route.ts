/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// DEBUG: Test direct database connection
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing direct database connection...');
    
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    console.log('🔍 Environment variables:', {
      hasDatabaseUrl: !!databaseUrl,
      hasAuthToken: !!authToken,
      databaseUrlLength: databaseUrl?.length,
      authTokenLength: authToken?.length
    });
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        debug: {
          hasDatabaseUrl: !!databaseUrl,
          hasAuthToken: !!authToken
        }
      }, { status: 500 });
    }
    
    // Try to create a direct connection
    console.log('🔍 Creating libsql client...');
    const { createClient } = await import('@libsql/client/http');
    
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });
    
    console.log('🔍 Testing connection with simple query...');
    const result = await client.execute('SELECT 1 as test');
    console.log('✅ Connection test successful:', result);
    
    // Try to list tables
    console.log('🔍 Listing tables...');
    const tablesResult = await client.execute(
      'SELECT name FROM sqlite_master WHERE type="table" ORDER BY name'
    );
    
    const tables = tablesResult.rows?.map(row => row.name) || [];
    console.log('📊 Found tables:', tables);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      debug: {
        connectionTest: 'PASSED',
        tablesFound: tables.length,
        tables: tables,
        hasHoraryTable: tables.includes('horary_questions')
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        databaseUrl: process.env.TURSO_DATABASE_URL ? 'PRESENT' : 'MISSING',
        authToken: process.env.TURSO_AUTH_TOKEN ? 'PRESENT' : 'MISSING'
      }
    }, { status: 500 });
  }
}