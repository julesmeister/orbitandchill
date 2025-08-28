import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    console.log('API /charts/user/[userId]: Getting charts for userId:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const charts = await ChartService.getUserCharts(userId);
    console.log('API /charts/user/[userId]: ChartService returned charts:', charts.map(c => ({ 
      id: c.id, 
      userId: c.userId, 
      subjectName: c.subjectName,
      dateOfBirth: c.dateOfBirth 
    })));

    // CRITICAL FIX: Double-check that all returned charts belong to the requested user
    const validCharts = charts.filter(chart => chart.userId === userId);
    console.log('API /charts/user/[userId]: After filtering, valid charts:', validCharts.length);
    
    if (validCharts.length !== charts.length) {
      console.error('API /charts/user/[userId]: WARNING - Some charts did not belong to the requested user!');
      console.error('API /charts/user/[userId]: Requested userId:', userId);
      console.error('API /charts/user/[userId]: Invalid charts:', charts.filter(chart => chart.userId !== userId).map(c => ({ id: c.id, userId: c.userId, subjectName: c.subjectName })));
    }

    return NextResponse.json({
      success: true,
      charts: validCharts,
    });

  } catch (error) {
    console.error('Error fetching user charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user charts' },
      { status: 500 }
    );
  }
}