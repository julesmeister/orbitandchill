import { NextRequest, NextResponse } from 'next/server';
import { executePooledQuery } from '@/db/connectionPool';
import { createAdminRoute, type AdminAuthContext } from '@/middleware/adminAuth';

interface EventUpdateRequest {
  title?: string;
  date?: string;
  time?: string;
  type?: 'benefic' | 'challenging' | 'neutral';
  description?: string;
  timingMethod?: 'electional' | 'aspects' | 'houses';
  score?: number;
  isBookmarked?: boolean;
}

async function handleGetEvent(
  request: NextRequest,
  context: AdminAuthContext,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const query = `
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
      WHERE id = $1
    `;

    const result = await executePooledQuery(query, [eventId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    const event = {
      ...result.rows[0],
      planetsInvolved: result.rows[0].planetsInvolved ? JSON.parse(result.rows[0].planetsInvolved) : [],
      createdAt: new Date(result.rows[0].createdAt).toISOString()
    };

    return NextResponse.json({
      success: true,
      event
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch event'
    }, { status: 500 });
  }
}

async function handleUpdateEvent(
  request: NextRequest,
  context: AdminAuthContext,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const resolvedParams = await params;
    const eventId = resolvedParams.id;
    const body: EventUpdateRequest = await request.json();

    // Build dynamic update query
    const updateFields: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (body.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      queryParams.push(body.title);
      paramIndex++;
    }

    if (body.date !== undefined) {
      updateFields.push(`date = $${paramIndex}`);
      queryParams.push(body.date);
      paramIndex++;
    }

    if (body.time !== undefined) {
      updateFields.push(`time = $${paramIndex}`);
      queryParams.push(body.time);
      paramIndex++;
    }

    if (body.type !== undefined) {
      updateFields.push(`type = $${paramIndex}`);
      queryParams.push(body.type);
      paramIndex++;
    }

    if (body.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      queryParams.push(body.description);
      paramIndex++;
    }

    if (body.timingMethod !== undefined) {
      updateFields.push(`timing_method = $${paramIndex}`);
      queryParams.push(body.timingMethod);
      paramIndex++;
    }

    if (body.score !== undefined) {
      updateFields.push(`score = $${paramIndex}`);
      queryParams.push(body.score);
      paramIndex++;
    }

    if (body.isBookmarked !== undefined) {
      updateFields.push(`is_bookmarked = $${paramIndex}`);
      queryParams.push(body.isBookmarked);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No fields to update'
      }, { status: 400 });
    }

    // Add updated_at
    updateFields.push(`updated_at = $${paramIndex}`);
    queryParams.push(new Date().toISOString());
    paramIndex++;

    // Add event ID for WHERE clause
    queryParams.push(eventId);

    const query = `
      UPDATE astrological_events 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await executePooledQuery(query, queryParams);
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      event: result.rows[0],
      message: 'Event updated successfully'
    });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update event'
    }, { status: 500 });
  }
}

async function handleDeleteEvent(
  request: NextRequest,
  context: AdminAuthContext,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const query = `DELETE FROM astrological_events WHERE id = $1 RETURNING id`;
    const result = await executePooledQuery(query, [eventId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Event not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete event'
    }, { status: 500 });
  }
}

// Export protected routes
export const GET = createAdminRoute(handleGetEvent, 'admin.events.read');
export const PATCH = createAdminRoute(handleUpdateEvent, 'admin.events.update');
export const DELETE = createAdminRoute(handleDeleteEvent, 'admin.events.delete');