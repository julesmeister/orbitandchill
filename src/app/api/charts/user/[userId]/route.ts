import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const charts = await ChartService.getUserCharts(userId);

    return NextResponse.json({
      success: true,
      charts,
    });

  } catch (error) {
    console.error('Error fetching user charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user charts' },
      { status: 500 }
    );
  }
}