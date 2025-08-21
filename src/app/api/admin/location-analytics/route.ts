/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

// This endpoint has been deprecated - using Google Analytics for location data
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Location analytics now handled by Google Analytics',
    redirectTo: 'https://analytics.google.com',
    deprecatedAt: '2025-01-21',
    countries: [],
    cities: [],
    summary: {
      totalCountries: 0,
      totalCities: 0,
      topCountry: null,
      topCity: null
    }
  });
}