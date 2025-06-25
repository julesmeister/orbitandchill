import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test route without database dependency
    const testDiscussions: any[] = [];

    return NextResponse.json({
      success: true,
      message: 'API route is working correctly',
      discussions: testDiscussions,
      count: testDiscussions.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test API failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test API failed',
        discussions: [],
        count: 0
      },
      { status: 500 }
    );
  }
}