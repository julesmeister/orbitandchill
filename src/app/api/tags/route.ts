import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable database imports to isolate issue
    console.log('Tags API called');
    
    const searchParams = request.nextUrl.searchParams;
    const popularOnly = searchParams.get('popular') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Use static data for now
    const allTags = [
      { id: 'natal-chart', name: 'natal-chart', description: 'Birth chart analysis', usageCount: 50, isPopular: true },
      { id: 'mercury-retrograde', name: 'mercury-retrograde', description: 'Mercury retrograde periods', usageCount: 45, isPopular: true },
      { id: 'relationships', name: 'relationships', description: 'Love and partnership astrology', usageCount: 40, isPopular: true },
      { id: 'mars', name: 'mars', description: 'Mars placements and energy', usageCount: 35, isPopular: true },
      { id: 'synastry', name: 'synastry', description: 'Relationship compatibility', usageCount: 30, isPopular: true },
      { id: 'transits', name: 'transits', description: 'Current planetary movements', usageCount: 28, isPopular: true },
      { id: 'planets', name: 'planets', description: 'Planetary placements', usageCount: 25, isPopular: true },
      { id: 'houses', name: 'houses', description: 'Astrological houses', usageCount: 22, isPopular: true },
      { id: 'aspects', name: 'aspects', description: 'Planetary aspects', usageCount: 20, isPopular: true },
      { id: 'compatibility', name: 'compatibility', description: 'Relationship compatibility', usageCount: 18, isPopular: true },
      { id: 'venus', name: 'venus', description: 'Venus placements', usageCount: 15, isPopular: true },
      { id: 'moon', name: 'moon', description: 'Moon phases and astrology', usageCount: 12, isPopular: true }
    ];

    const tags = popularOnly 
      ? allTags.filter(tag => tag.isPopular).slice(0, limit)
      : allTags.slice(0, limit);

    return NextResponse.json({
      success: true,
      tags
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tags',
        tags: []
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}