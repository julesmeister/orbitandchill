import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const shareToken = url.searchParams.get('shareToken');

    if (!shareToken) {
      return NextResponse.json(
        { error: 'Share token is required' },
        { status: 400 }
      );
    }

    const chart = await ChartService.getChartByShareToken(shareToken);

    if (!chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      chart,
    });

  } catch (error) {
    console.error('Shared chart retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared chart' },
      { status: 500 }
    );
  }
}