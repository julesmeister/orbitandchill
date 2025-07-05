/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Direct database connection
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { createClient } = await import('@libsql/client/http');
    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });

    // Get ALL events for this user to debug
    const result = await client.execute({
      sql: `SELECT id, title, date, is_generated, is_bookmarked, created_at 
            FROM astrological_events 
            WHERE user_id = ? 
            ORDER BY created_at DESC`,
      args: [userId]
    });

    const events = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      date: row.date,
      is_generated: row.is_generated,
      is_bookmarked: row.is_bookmarked,
      created_at: row.created_at
    }));

    // Also check events created today
    const today = new Date().toISOString().split('T')[0];
    const todayResult = await client.execute({
      sql: `SELECT id, title, date, is_generated, is_bookmarked 
            FROM astrological_events 
            WHERE user_id = ? AND date = ?`,
      args: [userId, today]
    });

    return NextResponse.json({
      success: true,
      totalEvents: events.length,
      events: events,
      todayEvents: todayResult.rows,
      debug: {
        userId,
        today,
        query: 'SELECT * FROM astrological_events WHERE user_id = ?'
      }
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}