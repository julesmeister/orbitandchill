/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';
import { UserService } from '@/db/services/userService';
import { initializeDatabase } from '@/db/index';
import { ReplyTransformationService } from '@/services/replyTransformationService';
import { DiscussionNotificationService } from '@/services/discussionNotificationService';
import { HttpResponseUtils } from '@/utils/httpResponseUtils';
import { generateAvatarFromName } from '@/utils/timestampFormatting';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;

    // Validate discussion ID
    const validationError = HttpResponseUtils.validateRequiredParams({ discussionId });
    if (validationError) {
      return HttpResponseUtils.validationError(validationError);
    }

    // Parse and validate pagination parameters
    const { limit, offset } = HttpResponseUtils.parsePaginationParams(new URL(request.url));

    await initializeDatabase();
    
    // Fetch replies with optimized database query
    const rawReplies = await DiscussionService.getRepliesWithAuthors(discussionId, limit, offset);
    
    // Early return for empty results with optimized caching
    if (!rawReplies || rawReplies.length === 0) {
      return HttpResponseUtils.emptyRepliesResponse(discussionId, limit, offset);
    }
    
    // Transform and organize replies using optimized service
    const organizedReplies = ReplyTransformationService.transformRawReplies(rawReplies);
    
    // Generate pagination metadata
    const pagination = ReplyTransformationService.getPaginationMetadata(
      organizedReplies,
      limit,
      offset,
      rawReplies.length
    );

    return HttpResponseUtils.repliesFetchResponse(
      organizedReplies,
      rawReplies.length,
      pagination,
      discussionId
    );

  } catch (error) {
    console.error('Error fetching replies:', error);
    return HttpResponseUtils.error(
      'Failed to fetch replies',
      error instanceof Error ? error.message : 'Unknown error',
      500,
      { replies: [], total: 0 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discussionId = resolvedParams.id;
    const body = await request.json();
    const { content, authorId, parentReplyId } = body;

    // Validate required parameters
    const validationError = HttpResponseUtils.validateRequiredParams({ 
      discussionId, 
      content, 
      authorId 
    });
    if (validationError) {
      return HttpResponseUtils.validationError(validationError);
    }

    await initializeDatabase();
    
    // Create reply in database
    const reply = await DiscussionService.createReply({
      discussionId,
      authorId,
      content,
      parentReplyId
    });
    
    if (!reply) {
      return HttpResponseUtils.error('Failed to create reply', 'Database operation failed');
    }
    
    // Get author information for response
    let authorName = 'Anonymous User';
    
    try {
      const author = await UserService.getUserById(authorId);
      if (author) {
        authorName = author.username || 'Anonymous User';
      }
    } catch (error) {
      console.warn(`Could not fetch author for new reply:`, error);
    }
    
    // Transform reply for response
    const enhancedReply = ReplyTransformationService.transformSingleReply(reply, authorName);
    
    // Process notifications asynchronously (don't block response)
    const notificationContext = DiscussionNotificationService.createNotificationContext(
      discussionId,
      authorId,
      authorName,
      content,
      parentReplyId
    );
    
    // Fire and forget notification processing
    DiscussionNotificationService.processReplyNotifications(notificationContext)
      .catch(error => {
        console.error('Background notification processing failed:', error);
      });

    return HttpResponseUtils.replyCreatedResponse(enhancedReply);

  } catch (error) {
    console.error('Error creating reply:', error);
    return HttpResponseUtils.error(
      'Failed to create reply',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}