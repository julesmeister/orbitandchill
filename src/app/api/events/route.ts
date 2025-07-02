/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/db/services/eventService';

export async function GET(request: NextRequest) {
  try {
    console.log('📥 Events API GET endpoint called');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('🔍 Request params:', {
      userId,
      allParams: Object.fromEntries(searchParams.entries())
    });
    const type = searchParams.get('type') as 'all' | 'benefic' | 'challenging' | 'neutral' | null;
    const tab = searchParams.get('tab') as 'all' | 'bookmarked' | 'manual' | null;
    const isGenerated = searchParams.get('isGenerated');
    const isBookmarked = searchParams.get('isBookmarked');
    const searchTerm = searchParams.get('searchTerm');
    const month = searchParams.get('month'); // 0-based month (0-11)
    const year = searchParams.get('year');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Build filters object
    const filters: any = {};
    
    // For personal events (manual and bookmarked), filter by userId
    // For generated events, show all users' generated events (they're universal astrological data)
    if (tab === 'bookmarked') {
      filters.userId = userId; // Only user's own bookmarked events
      filters.isBookmarked = true;
    } else if (tab === 'manual') {
      filters.userId = userId; // Only user's own manual events
      filters.isGenerated = false;
    } else {
      // For 'all' tab: show user's personal events + everyone's generated events
      filters.userId = userId; // Will be modified below for generated events
    }
    
    if (type && type !== 'all') {
      filters.type = type;
    }
    
    if (isGenerated !== null) {
      filters.isGenerated = isGenerated === 'true';
      // If specifically requesting generated events, don't filter by userId
      if (isGenerated === 'true') {
        delete filters.userId;
      }
    }
    
    if (isBookmarked !== null) {
      filters.isBookmarked = isBookmarked === 'true';
      // If specifically requesting bookmarked events, ensure userId filter
      if (isBookmarked === 'true') {
        filters.userId = userId;
      }
    }
    
    if (searchTerm) {
      filters.searchTerm = searchTerm;
    }
    
    // Add month/year filtering for optimized loading
    if (month !== null && year !== null) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      if (!isNaN(monthNum) && !isNaN(yearNum)) {
        // Create date range for the specific month
        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0); // Last day of month
        
        filters.dateFrom = startDate.toISOString().split('T')[0];
        filters.dateTo = endDate.toISOString().split('T')[0];
        
        console.log(`🗓️ Filtering events for month ${monthNum + 1}/${yearNum}: ${filters.dateFrom} to ${filters.dateTo}`);
      }
    }

    // Get events based on filters
    let events;
    if (tab === 'all' && !isGenerated && !isBookmarked) {
      // For 'all' tab, get both user's personal events AND all generated events
      // Handle database unavailability gracefully for all event types
      let userPersonalEvents: any[] = [];
      let userBookmarkedEvents: any[] = [];
      
      try {
        userPersonalEvents = await EventService.getEvents({
          ...filters,
          userId,
          isGenerated: false // User's manual events
        });
      } catch (error) {
        console.warn('⚠️ Could not load personal events (database may be unavailable):', error);
        userPersonalEvents = []; // Return empty array if database is unavailable
      }
      
      try {
        userBookmarkedEvents = await EventService.getEvents({
          ...filters,
          userId,
          isBookmarked: true // User's bookmarked events
        });
      } catch (error) {
        console.warn('⚠️ Could not load bookmarked events (database may be unavailable):', error);
        userBookmarkedEvents = []; // Return empty array if database is unavailable
      }
      
      // Handle database unavailability gracefully for generated events
      let allGeneratedEvents: any[] = [];
      try {
        allGeneratedEvents = await EventService.getEvents({
          ...filters,
          userId, // FIXED: Only get generated events for THIS user
          isGenerated: true // User's generated events only
        });
      } catch (error) {
        console.warn('⚠️ Could not load generated events (database may be unavailable):', error);
        allGeneratedEvents = []; // Return empty array if database is unavailable
      }
      
      // Combine and deduplicate events
      const combinedEvents = [...userPersonalEvents, ...userBookmarkedEvents, ...allGeneratedEvents];
      const uniqueEvents = combinedEvents.filter((event, index, array) => 
        array.findIndex(e => e.id === event.id) === index
      );
      events = uniqueEvents;
    } else {
      // For specific tabs or filters, use normal filtering
      try {
        events = await EventService.getEvents(filters);
      } catch (error) {
        console.warn('⚠️ Could not load events (database may be unavailable):', error);
        events = []; // Return empty array if database is unavailable
      }
    }

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
    });

  } catch (error) {
    console.error('❌ Error fetching events:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      searchParams: new URL(request.url).searchParams.toString()
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        details: error instanceof Error ? error.message : 'Unknown server error'
      },
      { status: 500 }
    );
  }
}

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

    // Validate required fields
    const { userId, title, date, type, description } = body;
    if (!userId || !title || !date || !type || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, title, date, type, description' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['benefic', 'challenging', 'neutral'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event type. Must be: benefic, challenging, or neutral' },
        { status: 400 }
      );
    }

    console.log('📝 Creating event via API with data:', {
      userId: body.userId,
      title: body.title,
      hasLocationData: !!(body.locationName || body.latitude || body.longitude),
      locationData: {
        locationName: body.locationName,
        latitude: body.latitude,
        longitude: body.longitude,
        timezone: body.timezone,
        latitudeType: typeof body.latitude,
        longitudeType: typeof body.longitude
      }
    });

    let event;
    try {
      event = await EventService.createEvent(body);
      
      console.log('💾 EventService.createEvent returned:', {
        hasEvent: !!event,
        eventId: event?.id,
        eventTitle: event?.title,
        eventLocationName: event?.locationName
      });
    } catch (serviceError) {
      console.error('❌ EventService.createEvent threw an error:', serviceError);
      return NextResponse.json({
        success: false,
        error: 'Failed to create event - service error',
        details: serviceError instanceof Error ? serviceError.message : 'Unknown service error'
      }, { status: 500 });
    }

    if (!event) {
      console.error('❌ EventService.createEvent returned null');
      return NextResponse.json({
        success: false,
        error: 'Failed to create event - service returned null',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      event,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updatedEvent = await EventService.updateEvent(id, updateData);

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      event: updatedEvent 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const clearGenerated = searchParams.get('clearGenerated');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Bulk delete generated events
    if (clearGenerated === 'true') {
      try {
        // Parse month and year if provided for month-specific clearing
        const targetMonth = month !== null ? parseInt(month) : undefined;
        const targetYear = year !== null ? parseInt(year) : undefined;
        
        const deletedCount = await EventService.clearGeneratedEvents(userId, targetMonth, targetYear);
        return NextResponse.json({ 
          success: true,
          message: `Cleared ${deletedCount} generated events`,
          deletedCount
        });
      } catch (error) {
        console.error('Error clearing generated events:', error);
        
        // Return a more helpful error message
        const errorMessage = error instanceof Error 
          ? `Failed to clear generated events: ${error.message}`
          : 'Failed to clear generated events due to database unavailability';
          
        return NextResponse.json(
          { 
            success: false, 
            error: errorMessage,
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    // Single event delete
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required for single event deletion' },
        { status: 400 }
      );
    }

    const success = await EventService.deleteEvent(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Event not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}