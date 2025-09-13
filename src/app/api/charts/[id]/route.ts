/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const shareToken = url.searchParams.get('shareToken');

    if (!id) {
      return NextResponse.json(
        { error: 'Chart ID is required' },
        { status: 400 }
      );
    }

    let chart;

    // If shareToken is provided, get chart by share token
    if (shareToken) {
      chart = await ChartService.getChartByShareToken(shareToken);
    } else {
      // Otherwise, get chart by ID (with optional user restriction)
      chart = await ChartService.getChartById(id, userId || undefined);
    }

    if (!chart) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    // If accessing via share token, ensure chart is public
    if (shareToken && !chart.isPublic) {
      return NextResponse.json(
        { error: 'Chart not found' },
        { status: 404 }
      );
    }

    // If accessing without share token and without userId, ensure chart is public
    if (!shareToken && !userId && !chart.isPublic) {
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
    console.error('Chart retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chart' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Chart ID and userId are required' },
        { status: 400 }
      );
    }

    const updatedChart = await ChartService.updateChart(id, userId, updates);

    if (!updatedChart) {
      return NextResponse.json(
        { error: 'Chart not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      chart: updatedChart,
    });

  } catch (error) {
    console.error('Chart update error:', error);
    return NextResponse.json(
      { error: 'Failed to update chart' },
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
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Chart ID and userId are required' },
        { status: 400 }
      );
    }

    const success = await ChartService.deleteChart(id, userId);

    if (!success) {
      return NextResponse.json(
        { error: 'Chart not found or deletion failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chart deleted successfully',
    });

  } catch (error) {
    console.error('Chart deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete chart' },
      { status: 500 }
    );
  }
}