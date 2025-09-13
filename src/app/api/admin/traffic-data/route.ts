/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// This endpoint has been deprecated - using Google Analytics for traffic data
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Traffic data now handled by Google Analytics',
    redirectTo: 'https://analytics.google.com',
    deprecatedAt: '2025-01-21',
    trafficData: [] // Return empty array for backward compatibility
  });
}