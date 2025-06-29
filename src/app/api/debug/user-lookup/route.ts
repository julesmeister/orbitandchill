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

    // Try to find user with UserService
    let user = null;
    try {
      user = await UserService.getUserById(userId);
      debugInfo.userServiceResult = user ? 'Found' : 'Not found';
      debugInfo.foundUser = user ? {
        id: user.id,
        username: user.username,
        authProvider: user.authProvider,
        email: user.email ? user.email.substring(0, 5) + '...' : null,
        createdAt: user.createdAt,
        hasCurrentLocation: !!(user.currentLocationName)
      } : null;
    } catch (error) {
      debugInfo.userServiceError = error.message;
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
      debugInfo.rawQueryError = error.message;
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
      debugInfo.similarUsersError = error.message;
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
      debugInfo.googleUsersCountError = error.message;
    }

    return NextResponse.json({
      success: true,
      debugInfo
    });

  } catch (error) {
    console.error('User lookup debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

// POST method removed - we don't need user creation for debugging