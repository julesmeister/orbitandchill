import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { initializeDatabase } from '@/db/index';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;
    const { actualCount } = await request.json();

    if (!discussionId || typeof actualCount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await initializeDatabase();

    // Get current discussion to check existing count
    const discussion = await DiscussionService.getDiscussionById(discussionId);
    
    if (!discussion) {
      return NextResponse.json(
        { success: false, error: 'Discussion not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔍 Syncing reply count:', {
      discussionId,
      currentCount: discussion.replies,
      actualCount
    });

    // Only update if counts don't match
    if (discussion.replies !== actualCount) {
      await DiscussionService.syncReplyCount(discussionId, actualCount);
      
      console.log('✅ Reply count synchronized:', {
        discussionId,
        oldCount: discussion.replies,
        newCount: actualCount
      });
    }

    return NextResponse.json({
      success: true,
      previousCount: discussion.replies,
      newCount: actualCount
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Sync replies API Error:', error);
    
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