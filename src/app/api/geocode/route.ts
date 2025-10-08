/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API for Nominatim geocoding service
 * Avoids CORS issues by proxying requests through our backend
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '5';

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Rate limiting check (prevent abuse)
    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Make request to Nominatim API
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('q', query);
    nominatimUrl.searchParams.set('limit', limit);
    nominatimUrl.searchParams.set('addressdetails', '1');

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': 'OrbitAndChill/1.0 (https://orbitandchill.com)', // Required by Nominatim
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch location data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
