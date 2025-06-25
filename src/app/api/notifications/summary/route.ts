/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/db/services/notificationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const summary = await NotificationService.getNotificationSummary(userId);
    
    return NextResponse.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error fetching notification summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification summary', details: error },
      { status: 500 }
    );
  }
}