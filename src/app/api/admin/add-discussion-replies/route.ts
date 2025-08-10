/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService as discussionService } from '@/db/services/discussionService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discussionId, replies } = body;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400 }
      );
    }

    if (!replies || !Array.isArray(replies)) {
      return NextResponse.json(
        { success: false, error: 'Replies array is required' },
        { status: 400 }
      );
    }

    const createdReplies = [];

    // Create each reply using the working discussionService.createReply method
    for (const reply of replies) {
      const replyData = {
        discussionId: discussionId,
        authorId: reply.authorId || null, // Handle seed user IDs or null for anonymous
        content: reply.content,
        parentReplyId: reply.parentReplyId || undefined,
      };

      const createdReply = await discussionService.createReply(replyData);
      if (createdReply) {
        createdReplies.push(createdReply);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${createdReplies.length} replies to discussion`,
      replies: createdReplies,
    });

  } catch (error) {
    console.error('Error adding discussion replies:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add discussion replies',
      },
      { status: 500 }
    );
  }
}