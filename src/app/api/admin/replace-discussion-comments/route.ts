/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { discussionReplies } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discussionId, newReplies } = body;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400 }
      );
    }

    if (!newReplies || !Array.isArray(newReplies)) {
      return NextResponse.json(
        { success: false, error: 'New replies array is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Start a transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Delete existing replies for this discussion
      await tx.delete(discussionReplies).where(eq(discussionReplies.discussionId, discussionId));

      // Insert new replies
      if (newReplies.length > 0) {
        const repliesToInsert = newReplies.map((reply: any) => ({
          id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          discussionId: discussionId,
          content: reply.content,
          authorId: reply.authorId,
          authorName: reply.authorName,
          parentReplyId: reply.parentReplyId || null,
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000),
          upvotes: reply.upvotes || 0,
          downvotes: reply.downvotes || 0,
        }));

        await tx.insert(discussionReplies).values(repliesToInsert);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully replaced ${newReplies.length} comments for discussion`,
      repliesCount: newReplies.length,
    });

  } catch (error) {
    console.error('Error replacing discussion comments:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to replace discussion comments',
      },
      { status: 500 }
    );
  }
}