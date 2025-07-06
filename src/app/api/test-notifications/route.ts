/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { 
  createDiscussionReplyNotification,
  createDiscussionLikeNotification,
  createDiscussionMentionNotification,
  createWelcomeNotification,
  createSystemAnnouncementNotification,
  createBatchedDiscussionLike,
  createBatchedChartLike,
  createBatchedDiscussionReply
} from '@/utils/notificationHelpers';

/**
 * Test API endpoint for notification system
 * POST /api/test-notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, ...params } = body;

    if (!type || !userId) {
      return NextResponse.json(
        { error: 'type and userId are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'discussion_reply':
        const { authorName, discussionTitle, discussionId } = params;
        result = await createDiscussionReplyNotification(
          userId,
          authorName || 'Test User',
          discussionTitle || 'Test Discussion',
          discussionId || 'test-id'
        );
        break;

      case 'discussion_like':
        const { likerName, discussionTitle: title, discussionId: id } = params;
        result = await createDiscussionLikeNotification(
          userId,
          likerName || 'Test Liker',
          title || 'Test Discussion',
          id || 'test-id'
        );
        break;

      case 'discussion_mention':
        const { mentionerName, discussionTitle: mentionTitle, discussionId: mentionId } = params;
        result = await createDiscussionMentionNotification(
          userId,
          mentionerName || 'Test Mentioner',
          mentionTitle || 'Test Discussion',
          mentionId || 'test-id'
        );
        break;

      case 'welcome':
        const { username } = params;
        result = await createWelcomeNotification(
          userId,
          username || 'Test User',
          true
        );
        break;

      case 'system_announcement':
        const { title: announcementTitle, message } = params;
        result = await createSystemAnnouncementNotification(
          userId,
          announcementTitle || 'Test Announcement',
          message || 'This is a test system announcement'
        );
        break;

      case 'batch_discussion_like':
        const { likerName: bLikerName, discussionTitle: bTitle, discussionId: bId } = params;
        result = await createBatchedDiscussionLike(
          userId,
          bLikerName || 'Batch Test Liker',
          bTitle || 'Test Discussion for Batching',
          bId || 'batch-test-id'
        );
        break;

      case 'batch_chart_like':
        const { likerName: cLikerName, chartTitle, chartId } = params;
        result = await createBatchedChartLike(
          userId,
          cLikerName || 'Chart Batch Liker',
          chartTitle || 'Test Chart for Batching',
          chartId || 'chart-batch-test-id'
        );
        break;

      case 'batch_discussion_reply':
        const { replierName, discussionTitle: rTitle, discussionId: rId } = params;
        result = await createBatchedDiscussionReply(
          userId,
          replierName || 'Batch Replier',
          rTitle || 'Test Discussion for Reply Batching',
          rId || 'reply-batch-test-id'
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: `${type} notification created successfully`,
        notificationId: result.id
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create notification' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create test notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get notification test instructions
 * GET /api/test-notifications
 */
export async function GET() {
  return NextResponse.json({
    message: 'Notification Test API',
    usage: {
      endpoint: 'POST /api/test-notifications',
      examples: [
        {
          type: 'discussion_reply',
          userId: 'user-id',
          authorName: 'John Doe',
          discussionTitle: 'Understanding Mars Retrograde',
          discussionId: 'discussion-123'
        },
        {
          type: 'discussion_like',
          userId: 'user-id',
          likerName: 'Jane Smith',
          discussionTitle: 'Moon Phases Explained',
          discussionId: 'discussion-456'
        },
        {
          type: 'discussion_mention',
          userId: 'user-id',
          mentionerName: 'Alex Johnson',
          discussionTitle: 'Saturn Return Experience',
          discussionId: 'discussion-789'
        },
        {
          type: 'welcome',
          userId: 'user-id',
          username: 'NewUser123'
        },
        {
          type: 'system_announcement',
          userId: 'user-id',
          title: 'New Feature Available',
          message: 'We have added new astrological insights to your dashboard'
        },
        {
          type: 'batch_discussion_like',
          userId: 'user-id',
          likerName: 'Batch Test User',
          discussionTitle: 'Understanding Mercury Retrograde',
          discussionId: 'batch-test-123'
        },
        {
          type: 'batch_chart_like',
          userId: 'user-id',
          likerName: 'Chart Enthusiast',
          chartTitle: 'My Natal Chart Analysis',
          chartId: 'chart-batch-456'
        },
        {
          type: 'batch_discussion_reply',
          userId: 'user-id',
          replierName: 'Active Commenter',
          discussionTitle: 'Saturn Return Experiences',
          discussionId: 'reply-batch-789'
        }
      ]
    },
    notificationTypes: [
      'discussion_reply',
      'discussion_like',
      'discussion_mention',
      'welcome',
      'system_announcement',
      'batch_discussion_like',
      'batch_chart_like',
      'batch_discussion_reply'
    ]
  });
}