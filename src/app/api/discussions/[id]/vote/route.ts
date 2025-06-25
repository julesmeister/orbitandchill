import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { initializeDatabase, db } from '@/db/index';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;
    const { userId, voteType } = await request.json();

    if (!discussionId || !userId || !voteType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vote type' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await initializeDatabase();

    // Vote on the discussion - pass the database instance
    const voteResult = await DiscussionService.voteOnDiscussion(userId, discussionId, voteType, db);

    // Check if we got a mock response (database unavailable)
    if (voteResult && typeof voteResult === 'object' && 'success' in voteResult) {
      // Database unavailable - return mock vote counts
      return NextResponse.json({
        success: true,
        upvotes: voteResult.upvotes,
        downvotes: voteResult.downvotes
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get updated discussion data - pass the database instance
    const updatedDiscussion = await DiscussionService.getDiscussionById(discussionId, db);

    if (!updatedDiscussion) {
      // If database is available but discussion not found, it's a real 404
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json({
      success: true,
      upvotes: updatedDiscussion.upvotes,
      downvotes: updatedDiscussion.downvotes
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Vote API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}