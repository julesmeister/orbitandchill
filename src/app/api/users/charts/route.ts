/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const charts = await ChartService.getUserCharts(userId);

    return NextResponse.json({
      success: true,
      charts,
      count: charts.length,
    });

  } catch (error) {
    console.error('User charts retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user charts' },
      { status: 500 }
    );
  }
}