import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { DiscussionService } from '@/db/services/discussionService';

export async function GET() {
  try {
    await initializeDatabase();
    
    const discussions = await DiscussionService.getAllDiscussions({ limit: 5 });
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      discussionCount: discussions.length,
      sampleDiscussion: discussions[0] || null
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}