/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService as discussionService } from '@/db/services/discussionService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discussionId, comment } = body;

    if (!discussionId) {
      return NextResponse.json(
        { success: false, error: 'Discussion ID is required' },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, error: 'Comment text is required' },
        { status: 400 }
      );
    }

    // Create a single custom reply using discussionService
    const replyData = {
      discussionId: discussionId,
      authorId: null, // No foreign key constraint issue
      content: comment.trim(),
      parentReplyId: undefined,
    };

    // Use the discussionService to add the reply
    const createdReply = await discussionService.createReply(replyData);

    return NextResponse.json({
      success: true,
      message: 'Custom comment added successfully',
      reply: createdReply,
    });

  } catch (error) {
    console.error('Error adding custom comment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add custom comment',
      },
      { status: 500 }
    );
  }
}