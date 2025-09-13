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

    // Security filter: ensure all charts belong to the requested user
    const validCharts = charts.filter(chart => chart.userId === userId);

    if (validCharts.length !== charts.length) {
      console.warn('Charts security filter removed', (charts.length - validCharts.length), 'invalid charts for user', userId);
    }

    return NextResponse.json({
      success: true,
      charts: validCharts,
    });

  } catch (error: any) {
    console.error('API /charts/user/[userId] error:', error?.message);

    return NextResponse.json(
      { error: 'Failed to fetch user charts' },
      { status: 500 }
    );
  }
}