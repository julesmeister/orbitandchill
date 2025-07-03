import { NextRequest, NextResponse } from 'next/server';
import { executePooledQuery } from '@/db/connectionPool';
import { createAdminRoute, type AdminAuthContext } from '@/middleware/adminAuth';

interface EventRequest {
  title: string;
  date: string;
  time: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  timingMethod: 'electional' | 'aspects' | 'houses';
  userId?: string;
  score?: number;
  isGenerated?: boolean;
  isBookmarked?: boolean;
}

async function handleGetEvents(request: NextRequest, context: AdminAuthContext) {
  try {

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type');
    const source = searchParams.get('source'); // 'generated' or 'manual'

    let query = `
      SELECT 
        id,
        user_id as userId,
        title,
        date,
        time,
        type,
        description,
        score,
        is_generated as isGenerated,
        is_bookmarked as isBookmarked,
        created_at as createdAt,
        timing_method as timingMethod,
        planets_involved as planetsInvolved
      FROM astrological_events 
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (type && type !== 'all') {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (source === 'generated') {
      query += ` AND is_generated = true`;
    } else if (source === 'manual') {
      query += ` AND is_generated = false`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await executePooledQuery(query, queryParams);
    
    // Parse JSON fields and format data
    const events = result.rows.map((row: any) => ({
      ...row,
      planetsInvolved: row.planetsInvolved ? JSON.parse(row.planetsInvolved) : [],
      createdAt: new Date(row.createdAt).toISOString()
    }));

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        limit,
        offset,
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch events'
    }, { status: 500 });
  }
}

async function handleCreateEvent(request: NextRequest, context: AdminAuthContext) {
  try {

    const body: EventRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.date || !body.type || !body.description) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, date, type, description'
      }, { status: 400 });
    }

    const eventId = `admin_event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const query = `
      INSERT INTO astrological_events (
        id, user_id, title, date, time, type, description, 
        score, is_generated, is_bookmarked, created_at, timing_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const insertParams = [
      eventId,
      body.userId || 'admin',
      body.title,
      body.date,
      body.time || '12:00',
      body.type,
      body.description,
      body.score || (body.type === 'benefic' ? 8 : body.type === 'challenging' ? 3 : 5),
      body.isGenerated || false,
      body.isBookmarked || false,
      new Date().toISOString(),
      body.timingMethod || 'electional'
    ];

    const result = await executePooledQuery(query, insertParams);
    
    return NextResponse.json({
      success: true,
      event: result.rows[0],
      message: 'Event created successfully'
    });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create event'
    }, { status: 500 });
  }
}

// Export protected routes
export const GET = createAdminRoute(handleGetEvents, 'admin.events.read');
export const POST = createAdminRoute(handleCreateEvent, 'admin.events.create');