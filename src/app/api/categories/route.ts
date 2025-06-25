import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Temporarily disable database imports to isolate issue
    console.log('Categories API called');
    
    // Use static data for now
    const categories = [
      { id: 'natal', name: 'Natal Chart Analysis', color: '#6bdbff', description: 'Birth chart interpretation', sortOrder: 1, isActive: true, discussionCount: 0 },
      { id: 'transits', name: 'Transits & Predictions', color: '#f2e356', description: 'Current planetary movements', sortOrder: 2, isActive: true, discussionCount: 0 },
      { id: 'help', name: 'Chart Reading Help', color: '#51bd94', description: 'Get help interpreting your chart', sortOrder: 3, isActive: true, discussionCount: 0 },
      { id: 'synastry', name: 'Synastry & Compatibility', color: '#ff91e9', description: 'Relationship astrology', sortOrder: 4, isActive: true, discussionCount: 0 },
      { id: 'mundane', name: 'Mundane Astrology', color: '#19181a', description: 'World events and astrology', sortOrder: 5, isActive: true, discussionCount: 0 },
      { id: 'learning', name: 'Learning Resources', color: '#6bdbff', description: 'Educational content', sortOrder: 6, isActive: true, discussionCount: 0 },
      { id: 'general', name: 'General Discussion', color: '#51bd94', description: 'Open discussions', sortOrder: 7, isActive: true, discussionCount: 0 }
    ];

    return NextResponse.json({
      success: true,
      categories
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        categories: []
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