/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/db/services/notificationService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let success = false;

    switch (action) {
      case 'mark_read':
        success = await NotificationService.markAsRead(id, userId);
        break;
      case 'archive':
        success = await NotificationService.archiveNotification(id, userId);
        break;
      case 'unarchive':
        success = await NotificationService.unarchiveNotification(id, userId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "mark_read", "archive", or "unarchive"' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: `Failed to ${action} notification` },
        { status: 500 }
      );
    }

    const messages = {
      'mark_read': 'marked as read',
      'archive': 'archived',
      'unarchive': 'restored from archive'
    };

    return NextResponse.json({
      success: true,
      message: `Notification ${messages[action as keyof typeof messages] || action} successfully`
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const success = await NotificationService.deleteNotification(id, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification', details: error },
      { status: 500 }
    );
  }
}