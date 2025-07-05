/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/db/services/eventService';

export async function POST(request: NextRequest) {
  try {
    // Validate content type and length
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse JSON safely
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate that we have an events array
    const { events } = body;
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Events array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Debug: Log received events
    console.log('Bulk API received events:', {
      count: events.length,
      firstEvent: events[0] ? {
        userId: events[0].userId,
        title: events[0].title,
        date: events[0].date,
        type: events[0].type,
        hasDescription: !!events[0].description,
        allKeys: Object.keys(events[0])
      } : null
    });

    // Validate each event has required fields with enhanced logging
    console.log(`🔍 Starting validation of ${events.length} events...`);
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      // Handle case where event might be null/undefined
      if (!event || typeof event !== 'object') {
        console.error(`Event ${i} is null, undefined, or not an object:`, event);
        return NextResponse.json(
          { success: false, error: `Event ${i} is invalid: not an object` },
          { status: 400 }
        );
      }
      
      const { userId, title, date, type, description } = event;
      
      console.log(`🔍 Validating event ${i + 1}/${events.length}:`, {
        eventIndex: i,
        userId: userId ? `${userId.substring(0, 10)}...` : 'MISSING',
        title: title ? `${title.substring(0, 30)}...` : 'MISSING',
        date: date || 'MISSING',
        type: type || 'MISSING',
        description: description ? `${description.substring(0, 30)}...` : 'MISSING',
        hasUserId: !!userId,
        hasTitle: !!title,
        hasDate: !!date,
        hasType: !!type,
        hasDescription: !!description,
        eventKeys: Object.keys(event),
        eventSize: JSON.stringify(event).length
      });
      
      // Check for missing required fields
      const missingFields = [];
      if (!userId) missingFields.push('userId');
      if (!title) missingFields.push('title');
      if (!date) missingFields.push('date');
      if (!type) missingFields.push('type');
      if (!description) missingFields.push('description');
      
      if (missingFields.length > 0) {
        const errorDetails = {
          eventIndex: i,
          missingFields,
          eventData: {
            userId: userId || null,
            title: title ? title.substring(0, 50) : null,
            date: date || null,
            type: type || null,
            description: description ? 'present' : null
          }
        };
        
        console.error(`❌ Event ${i} validation failed - missing required fields:`, errorDetails);
        return NextResponse.json(
          { 
            success: false, 
            error: `Event ${i} missing required fields: ${missingFields.join(', ')}`,
            details: errorDetails
          },
          { status: 400 }
        );
      }

      // Validate type
      if (!['benefic', 'challenging', 'neutral'].includes(type)) {
        console.error(`❌ Event ${i} has invalid type:`, { type, validTypes: ['benefic', 'challenging', 'neutral'] });
        return NextResponse.json(
          { 
            success: false, 
            error: `Event ${i} has invalid type '${type}'. Must be: benefic, challenging, or neutral`,
            details: { eventIndex: i, invalidType: type, validTypes: ['benefic', 'challenging', 'neutral'] }
          },
          { status: 400 }
        );
      }
      
      // Log progress every few events
      if ((i + 1) % 5 === 0 || i === events.length - 1) {
        console.log(`✅ Validated ${i + 1}/${events.length} events successfully`);
      }
    }
    
    console.log(`🎉 All ${events.length} events passed validation!`);

    // Create all events in bulk
    let createdEvents;
    let isDatabaseUnavailable = false;
    
    try {
      createdEvents = await EventService.createManyEvents(events);
      
      // Check if events were created as local-only (database unavailable)
      if (createdEvents.length > 0 && createdEvents[0].id.startsWith('local_')) {
        isDatabaseUnavailable = true;
        console.log('⚠️ Events created as local-only due to database unavailability');
      }
      
    } catch (dbError) {
      console.error('Database error during bulk event creation:', {
        error: dbError,
        errorMessage: dbError instanceof Error ? dbError.message : 'Unknown database error',
        errorStack: dbError instanceof Error ? dbError.stack : undefined,
        errorName: dbError instanceof Error ? dbError.name : typeof dbError,
        eventsCount: events.length,
        firstEventSample: events[0] ? {
          userId: events[0].userId,
          title: events[0].title,
          date: events[0].date,
          type: events[0].type
        } : null
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to save events to database',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    // Return success with appropriate warning if database was unavailable
    const response = {
      success: true,
      events: createdEvents,
      count: createdEvents.length,
      ...(isDatabaseUnavailable && {
        warning: 'Events created successfully but database is unavailable. Events are stored locally and may not persist between sessions.',
        localOnly: true
      })
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in bulk events API:', {
      error: error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.name : typeof error
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create events',
        details: error instanceof Error ? error.message : 'Unknown server error'
      },
      { status: 500 }
    );
  }
}