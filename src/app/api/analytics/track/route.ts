/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Analytics tracking endpoint
 * Handles client-side analytics events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties, userId, timestamp } = body;

    // Basic validation
    if (!event || typeof event !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      );
    }

    // Log analytics event (in production, this would go to your analytics service)
    // Disabled for cleaner console output

    // Here you would typically:
    // 1. Validate the event data
    // 2. Store it in your analytics database/service
    // 3. Forward to external analytics services (GA, etc.)
    
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}