import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const startTime = Date.now();
  console.log('🔍 API /charts/user/[userId]: Request received at', new Date().toISOString());
  
  try {
    console.log('🔍 API /charts/user/[userId]: Parsing params...');
    const { userId } = await params;
    console.log('🔍 API /charts/user/[userId]: Parsed userId:', userId, 'after', Date.now() - startTime, 'ms');

    if (!userId) {
      console.log('🔍 API /charts/user/[userId]: No userId provided, returning 400');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('🔍 API /charts/user/[userId]: Calling ChartService.getUserCharts for userId:', userId);
    const serviceStartTime = Date.now();
    
    // ChartService.getUserCharts now has timeout protection and will return [] if database hangs
    const charts = await ChartService.getUserCharts(userId);
    
    const serviceDuration = Date.now() - serviceStartTime;
    console.log('🔍 API /charts/user/[userId]: ChartService.getUserCharts completed in', serviceDuration, 'ms');
    console.log('🔍 API /charts/user/[userId]: ChartService returned', charts.length, 'charts:', charts.map(c => ({ 
      id: c.id, 
      userId: c.userId, 
      subjectName: c.subjectName,
      dateOfBirth: c.dateOfBirth 
    })));

    console.log('🔍 API /charts/user/[userId]: Filtering charts for security...');
    // CRITICAL FIX: Double-check that all returned charts belong to the requested user
    const validCharts = charts.filter(chart => chart.userId === userId);
    console.log('🔍 API /charts/user/[userId]: After filtering, valid charts:', validCharts.length);
    
    if (validCharts.length !== charts.length) {
      console.error('🔍 API /charts/user/[userId]: WARNING - Some charts did not belong to the requested user!');
      console.error('🔍 API /charts/user/[userId]: Requested userId:', userId);
      console.error('🔍 API /charts/user/[userId]: Invalid charts:', charts.filter(chart => chart.userId !== userId).map(c => ({ id: c.id, userId: c.userId, subjectName: c.subjectName })));
    }

    console.log('🔍 API /charts/user/[userId]: Preparing response...');
    const response = NextResponse.json({
      success: true,
      charts: validCharts,
    });
    
    const totalDuration = Date.now() - startTime;
    console.log('🔍 API /charts/user/[userId]: Response ready in', totalDuration, 'ms, returning', validCharts.length, 'charts');
    return response;

  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    console.error('🔍 API /charts/user/[userId]: Error after', totalDuration, 'ms:', error);
    console.error('🔍 API /charts/user/[userId]: Error stack:', error?.stack);
    
    return NextResponse.json(
      { error: 'Failed to fetch user charts' },
      { status: 500 }
    );
  }
}