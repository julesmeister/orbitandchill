import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { discussionReplies } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { db } = await initializeDatabase();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '1000');
    
    // Get all replies with author information
    const replies = await db
      .select({
        id: discussionReplies.id,
        discussionId: discussionReplies.discussionId,
        authorId: discussionReplies.authorId,
        authorName: discussionReplies.authorName,
        content: discussionReplies.content,
        createdAt: discussionReplies.createdAt,
        upvotes: discussionReplies.upvotes,
        downvotes: discussionReplies.downvotes
      })
      .from(discussionReplies)
      .orderBy(desc(discussionReplies.createdAt))
      .limit(limit);

    return NextResponse.json({
      success: true,
      replies: replies,
      count: replies.length
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch replies',
      replies: [],
      count: 0
    }, { status: 500 });
  }
}