/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// DEBUG: Check environment variables (safely)
export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    return NextResponse.json({
      success: true,
      env: {
        hasDatabaseUrl: !!databaseUrl,
        hasAuthToken: !!authToken,
        databaseUrlLength: databaseUrl ? databaseUrl.length : 0,
        authTokenLength: authToken ? authToken.length : 0,
        databaseUrlPrefix: databaseUrl ? databaseUrl.substring(0, 20) + '...' : 'MISSING',
        authTokenPrefix: authToken ? authToken.substring(0, 10) + '...' : 'MISSING',
        nodeEnv: process.env.NODE_ENV,
        // Also check if the database URL format is correct
        isLibsqlUrl: databaseUrl ? databaseUrl.startsWith('libsql://') : false
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check environment variables',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
}