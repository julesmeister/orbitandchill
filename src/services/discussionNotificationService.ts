/* eslint-disable @typescript-eslint/no-unused-vars */

import { DiscussionService } from '@/db/services/discussionService';
import { createDiscussionReplyNotification, createDiscussionMentionNotification } from '@/utils/notificationHelpers';
import { processMentions } from '@/utils/mentionUtils';

export interface NotificationContext {
  discussionId: string;
  authorId: string;
  authorName: string;
  content: string;
  parentReplyId?: string;
}

/**
 * Discussion Notification Service
 * Handles all notification logic for discussion replies
 */
export class DiscussionNotificationService {
  /**
   * Process all notifications for a new reply
   * Handles discussion author, parent reply author, and mention notifications
   */
  static async processReplyNotifications(context: NotificationContext): Promise<void> {
    try {
      console.log(`🔔 Processing notifications for reply in discussion ${context.discussionId}`);
      
      // Fetch discussion data once and reuse
      const discussion = await DiscussionService.getDiscussionById(context.discussionId);
      if (!discussion) {
        console.warn(`Discussion ${context.discussionId} not found, skipping notifications`);
        return;
      }

      // Track users already notified to avoid duplicates
      const alreadyNotified = new Set<string>([context.authorId]);

      // 1. Notify discussion author (if not replying to own discussion)
      await this.notifyDiscussionAuthor(discussion, context, alreadyNotified);

      // 2. Notify parent reply author (if replying to someone else's reply)
      await this.notifyParentReplyAuthor(discussion, context, alreadyNotified);

      // 3. Process @mention notifications
      await this.processMentionNotifications(discussion, context, alreadyNotified);

      console.log(`✅ Notification processing completed for reply in discussion ${context.discussionId}`);
      
    } catch (error) {
      // Don't fail the request if notifications fail
      console.error('Failed to process reply notifications:', error);
    }
  }

  /**
   * Notify the discussion author about a new reply
   */
  private static async notifyDiscussionAuthor(
    discussion: any,
    context: NotificationContext,
    alreadyNotified: Set<string>
  ): Promise<void> {
    if (discussion.authorId && discussion.authorId !== context.authorId) {
      try {
        await createDiscussionReplyNotification(
          discussion.authorId,
          context.authorName,
          discussion.title,
          context.discussionId
        );
        
        alreadyNotified.add(discussion.authorId);
        console.log(`✅ Discussion author notification sent to ${discussion.authorId}`);
        
      } catch (error) {
        console.error('Failed to notify discussion author:', error);
      }
    }
  }

  /**
   * Notify the parent reply author about a response
   */
  private static async notifyParentReplyAuthor(
    discussion: any,
    context: NotificationContext,
    alreadyNotified: Set<string>
  ): Promise<void> {
    if (!context.parentReplyId) return;

    try {
      const parentReply = await DiscussionService.getReplyById(context.parentReplyId);
      
      if (parentReply && 
          parentReply.authorId && 
          !alreadyNotified.has(parentReply.authorId)) {
        
        await createDiscussionReplyNotification(
          parentReply.authorId,
          context.authorName,
          discussion.title,
          context.discussionId
        );
        
        alreadyNotified.add(parentReply.authorId);
        console.log(`✅ Parent reply author notification sent to ${parentReply.authorId}`);
      }
      
    } catch (error) {
      console.error('Failed to notify parent reply author:', error);
    }
  }

  /**
   * Process @mention notifications in reply content
   */
  private static async processMentionNotifications(
    discussion: any,
    context: NotificationContext,
    alreadyNotified: Set<string>
  ): Promise<void> {
    try {
      const mentionedUserIds = await processMentions(context.content);
      
      if (mentionedUserIds.length === 0) {
        return;
      }

      // Filter out users already notified
      const usersToNotify = mentionedUserIds.filter(userId => 
        userId && !alreadyNotified.has(userId)
      );

      if (usersToNotify.length === 0) {
        console.log('No new users to notify for mentions (all already notified)');
        return;
      }

      // Send mention notifications concurrently for better performance
      const mentionPromises = usersToNotify.map(async (userId) => {
        try {
          await createDiscussionMentionNotification(
            userId,
            context.authorName,
            discussion.title,
            context.discussionId
          );
          
          alreadyNotified.add(userId);
          console.log(`✅ Mention notification sent to user: ${userId}`);
          
        } catch (error) {
          console.error(`Failed to send mention notification to ${userId}:`, error);
        }
      });

      await Promise.allSettled(mentionPromises);
      console.log(`📧 Processed ${usersToNotify.length} mention notifications`);
      
    } catch (error) {
      console.error('Failed to process mention notifications:', error);
    }
  }

  /**
   * Create notification context from reply data
   */
  static createNotificationContext(
    discussionId: string,
    authorId: string,
    authorName: string,
    content: string,
    parentReplyId?: string
  ): NotificationContext {
    return {
      discussionId,
      authorId,
      authorName,
      content,
      parentReplyId
    };
  }

  /**
   * Batch notification processing for multiple replies
   * Useful for bulk reply operations
   */
  static async processBatchNotifications(contexts: NotificationContext[]): Promise<void> {
    if (contexts.length === 0) return;

    console.log(`🔔 Processing batch notifications for ${contexts.length} replies`);

    // Process notifications concurrently but with reasonable limits
    const batchSize = 5;
    for (let i = 0; i < contexts.length; i += batchSize) {
      const batch = contexts.slice(i, i + batchSize);
      
      const batchPromises = batch.map(context => 
        this.processReplyNotifications(context)
      );
      
      await Promise.allSettled(batchPromises);
    }

    console.log(`✅ Batch notification processing completed`);
  }
}