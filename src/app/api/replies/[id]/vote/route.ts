import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { initializeDatabase, db } from '@/db/index';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const replyId = resolvedParams.id;
    const { userId, voteType } = await request.json();

    if (!replyId || !userId || !voteType) {
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

    // Vote on the reply - pass the database instance
    const voteResult = await DiscussionService.voteOnReply(userId, replyId, voteType, db);

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

    // Get updated reply data - pass the database instance
    const updatedReply = await DiscussionService.getReplyById(replyId, db);

    if (!updatedReply) {
      // If database is available but reply not found, it's a real 404
      return NextResponse.json(
        { success: false, error: 'Reply not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json({
      success: true,
      upvotes: updatedReply.upvotes,
      downvotes: updatedReply.downvotes
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reply Vote API Error:', error);
    
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