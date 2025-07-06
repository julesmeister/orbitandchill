/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { 
  createDiscussionReplyNotification,
  createDiscussionLikeNotification,
  createWelcomeNotification,
  createSystemAnnouncementNotification
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
          type: 'welcome',
          userId: 'user-id',
          username: 'NewUser123'
        },
        {
          type: 'system_announcement',
          userId: 'user-id',
          title: 'New Feature Available',
          message: 'We have added new astrological insights to your dashboard'
        }
      ]
    },
    notificationTypes: [
      'discussion_reply',
      'discussion_like', 
      'welcome',
      'system_announcement'
    ]
  });
}