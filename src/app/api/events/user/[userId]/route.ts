/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import type { AstrologicalEvent } from '../../../../../types/events';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const params = await context.params;
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔄 API: Loading all events for user ${userId}`);

    // Use direct database connection (following API_DATABASE_PROTOCOL.md)
    // This bypasses Drizzle ORM WHERE clause parsing issues with Turso HTTP client
    let userEvents = [];
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;

      if (databaseUrl && authToken) {
        const { createClient } = await import('@libsql/client/http');
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });

        // Direct SQL query to avoid Drizzle ORM WHERE clause issues
        const result = await client.execute({
          sql: 'SELECT * FROM astrological_events WHERE user_id = ?',
          args: [userId]
        });

        // Transform database records (snake_case → camelCase)
        userEvents = result.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description || '',
          date: row.date,
          time: row.time || '',
          type: (row.type as 'benefic' | 'challenging' | 'neutral') || 'neutral',
          score: row.score || 0,
          userId: row.user_id, // snake_case → camelCase
          isBookmarked: row.is_bookmarked || false, // snake_case → camelCase
          isGenerated: row.is_generated || false, // snake_case → camelCase
          createdAt: row.created_at, // snake_case → camelCase
          updatedAt: row.updated_at || row.created_at, // snake_case → camelCase
          // Additional fields that might exist
          aspects: row.aspects ? JSON.parse(row.aspects) : [],
          planets: row.planets ? JSON.parse(row.planets) : [],
          houses: row.houses ? JSON.parse(row.houses) : [],
          location: row.location || '',
          coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
          timezone: row.timezone || '',
          notes: row.notes || ''
        }));

        console.log(`✅ API: Loaded ${userEvents.length} events for user ${userId} via direct connection`);
      } else {
        console.warn('⚠️ API: Database environment variables not configured');
        return NextResponse.json(
          { success: false, error: 'Database configuration error' },
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('❌ API: Direct database query failed:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      events: userEvents,
      total: userEvents.length
    });

  } catch (error) {
    console.error('❌ API: Error loading user events:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load user events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}