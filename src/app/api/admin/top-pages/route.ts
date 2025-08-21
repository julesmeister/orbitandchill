/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// This endpoint has been deprecated - using Google Analytics
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Top pages analytics now handled by Google Analytics',
    redirectTo: 'https://analytics.google.com',
    deprecatedAt: '2025-01-21',
    pages: []
  });
}
