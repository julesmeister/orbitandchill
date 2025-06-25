/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { UserActivityService, ActivityType, EntityType } from '@/db/services/userActivityService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const activityTypesParam = searchParams.get('activityTypes');
    const entityTypesParam = searchParams.get('entityTypes');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const sessionId = searchParams.get('sessionId');
    const summary = searchParams.get('summary') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Parse activity types filter
    let activityTypes: ActivityType[] | undefined;
    if (activityTypesParam) {
      try {
        activityTypes = activityTypesParam.split(',') as ActivityType[];
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid activity types format' },
          { status: 400 }
        );
      }
    }

    // Parse entity types filter
    let entityTypes: EntityType[] | undefined;
    if (entityTypesParam) {
      try {
        entityTypes = entityTypesParam.split(',') as EntityType[];
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid entity types format' },
          { status: 400 }
        );
      }
    }

    // Parse date filters
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid start date format' },
          { status: 400 }
        );
      }
    }

    if (endDateParam) {
      endDate = new Date(endDateParam);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { success: false, error: 'Invalid end date format' },
          { status: 400 }
        );
      }
    }

    // Return summary if requested
    if (summary) {
      const summaryData = await UserActivityService.getUserActivitySummary(userId, 30);
      return NextResponse.json({
        success: true,
        data: summaryData
      });
    }

    // Get activity timeline
    const activities = await UserActivityService.getUserActivityTimeline({
      userId,
      limit,
      offset,
      activityTypes,
      entityTypes,
      startDate,
      endDate,
      sessionId: sessionId ?? undefined
    });

    return NextResponse.json({
      success: true,
      data: {
        activities,
        pagination: {
          limit,
          offset,
          hasMore: activities.length === limit // Simple check if there might be more
        }
      }
    });

  } catch (error) {
    console.error('Error getting user activity:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      activityType, 
      entityType, 
      entityId, 
      description, 
      metadata,
      sessionId,
      pageUrl,
      referrer
    } = body;

    if (!userId || !activityType || !description) {
      return NextResponse.json(
        { success: false, error: 'userId, activityType, and description are required' },
        { status: 400 }
      );
    }

    // Get client information from headers
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const activity = await UserActivityService.recordActivity({
      userId,
      activityType,
      entityType,
      entityId,
      description,
      metadata,
      ipAddress,
      userAgent,
      sessionId,
      pageUrl,
      referrer
    });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Failed to record activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activity
    });

  } catch (error) {
    console.error('Error recording user activity:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}