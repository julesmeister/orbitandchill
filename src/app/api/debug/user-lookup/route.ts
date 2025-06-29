/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';
import { db } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing userId parameter'
      }, { status: 400 });
    }

    // Debug info collection
    const debugInfo: any = {
      searchedUserId: userId,
      userIdLength: userId.length,
      userIdType: typeof userId,
      startsWithGoogle: userId.startsWith('google_'),
      isNumericOnly: /^\d+$/.test(userId)
    };

    // Try to find user with direct database connection (bypassing UserService)
    let user = null;
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (databaseUrl && authToken) {
        const { createClient } = await import('@libsql/client/http');
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });
        
        const result = await client.execute({
          sql: 'SELECT * FROM users WHERE id = ?',
          args: [userId]
        });
        
        if (result.rows && result.rows.length > 0) {
          const userData = result.rows[0] as any;
          user = {
            id: userData.id,
            username: userData.username,
            authProvider: userData.auth_provider,
            email: userData.email,
            createdAt: userData.created_at,
            hasCurrentLocation: !!(userData.current_location_name)
          };
        }
      }
      
      debugInfo.directDatabaseResult = user ? 'Found' : 'Not found';
      debugInfo.foundUser = user ? {
        id: user.id,
        username: user.username,
        authProvider: user.authProvider,
        email: user.email ? user.email.substring(0, 5) + '...' : null,
        createdAt: user.createdAt,
        hasCurrentLocation: user.hasCurrentLocation
      } : null;
    } catch (error) {
      debugInfo.directDatabaseError = error instanceof Error ? error.message : String(error);
    }

    // Try raw database query
    try {
      const dbObj = db as any;
      const client = dbObj.client;
      
      const rawResult = await client.execute({
        sql: 'SELECT id, username, auth_provider, email, created_at, current_location_name FROM users WHERE id = ?',
        args: [userId]
      });
      
      debugInfo.rawQueryResult = {
        rowCount: rawResult.rows.length,
        rows: rawResult.rows.map((row: any) => ({
          id: row.id,
          username: row.username,
          authProvider: row.auth_provider,
          email: row.email ? row.email.substring(0, 5) + '...' : null,
          createdAt: row.created_at,
          hasCurrentLocation: !!row.current_location_name
        }))
      };
    } catch (error) {
      debugInfo.rawQueryError = error instanceof Error ? error.message : String(error);
    }

    // Try searching for similar IDs (in case of slight differences)
    try {
      const dbObj = db as any;
      const client = dbObj.client;
      
      const similarResult = await client.execute({
        sql: 'SELECT id, username, auth_provider FROM users WHERE id LIKE ? LIMIT 5',
        args: [`%${userId.substring(-10)}%`]
      });
      
      debugInfo.similarUsers = similarResult.rows.map((row: any) => ({
        id: row.id,
        username: row.username,
        authProvider: row.auth_provider,
        matches: row.id === userId
      }));
    } catch (error) {
      debugInfo.similarUsersError = error instanceof Error ? error.message : String(error);
    }

    // Check if there are any Google users at all
    try {
      const dbObj = db as any;
      const client = dbObj.client;
      
      const googleUsersResult = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM users WHERE auth_provider = ?',
        args: ['google']
      });
      
      debugInfo.totalGoogleUsers = googleUsersResult.rows[0].count;
    } catch (error) {
      debugInfo.googleUsersCountError = error instanceof Error ? error.message : String(error);
    }

    return NextResponse.json({
      success: true,
      debugInfo
    });

  } catch (error) {
    console.error('User lookup debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// POST method removed - we don't need user creation for debugging