/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// DEBUG: Check environment variables from server-side
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Server-side environment check...');
    
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    // Get all environment variables that might be relevant
    const allEnvKeys = Object.keys(process.env);
    const tursoKeys = allEnvKeys.filter(key => key.includes('TURSO') || key.includes('turso'));
    const nodeEnv = process.env.NODE_ENV;
    
    console.log('🔍 Environment variables found:', {
      hasDatabaseUrl: !!databaseUrl,
      hasAuthToken: !!authToken,
      databaseUrlLength: databaseUrl ? databaseUrl.length : 0,
      authTokenLength: authToken ? authToken.length : 0,
      nodeEnv,
      tursoKeys,
      totalEnvVars: allEnvKeys.length
    });
    
    return NextResponse.json({
      success: true,
      env: {
        hasDatabaseUrl: !!databaseUrl,
        hasAuthToken: !!authToken,
        databaseUrlLength: databaseUrl ? databaseUrl.length : 0,
        authTokenLength: authToken ? authToken.length : 0,
        databaseUrlPrefix: databaseUrl ? databaseUrl.substring(0, 20) + '...' : 'MISSING',
        authTokenPrefix: authToken ? authToken.substring(0, 10) + '...' : 'MISSING',
        nodeEnv,
        tursoKeys,
        totalEnvVars: allEnvKeys.length,
        // Check if .env.local is being loaded
        hasLocalEnvIndicator: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check server environment variables',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
}