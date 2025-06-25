/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';

export async function POST(request: NextRequest) {
  try {
    // Generate mock analytics data for the last 30 days
    await AnalyticsService.generateMockData(30);
    
    return NextResponse.json({
      success: true,
      message: 'Analytics data seeded successfully'
    });
  } catch (error) {
    console.error('Failed to seed analytics data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}