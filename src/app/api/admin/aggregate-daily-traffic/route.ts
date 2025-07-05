/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';
import AnalyticsNotificationService from '@/lib/services/analyticsNotificationService';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    console.log('📊 API: Starting daily traffic aggregation...');
    
    // Get date parameter or use yesterday by default
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    let targetDate: string;
    if (dateParam) {
      targetDate = dateParam;
    } else {
      // Default to yesterday since today's data might be incomplete
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      targetDate = yesterday.toISOString().split('T')[0];
    }
    
    console.log(`📅 Aggregating traffic data for date: ${targetDate}`);
    
    // Aggregate traffic data for the target date
    const aggregatedData = await AnalyticsService.aggregateDailyTraffic(targetDate);
    
    if (aggregatedData) {
      console.log(`✅ Successfully aggregated traffic data for ${targetDate}:`, aggregatedData);
      
      // Send success notification to admin
      await AnalyticsNotificationService.notifyDailyAggregationSuccess(targetDate, aggregatedData);
      
      return NextResponse.json({
        success: true,
        date: targetDate,
        data: aggregatedData,
        message: `Traffic data aggregated successfully for ${targetDate}`
      });
    } else {
      console.warn(`⚠️ No data to aggregate for ${targetDate}`);
      
      // Send failure notification to admin
      await AnalyticsNotificationService.notifyDailyAggregationFailure(targetDate, 'No traffic data found for date');
      
      return NextResponse.json({
        success: false,
        date: targetDate,
        message: `No traffic data found for ${targetDate}`
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('❌ Error aggregating daily traffic:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Send error notification to admin
    const { searchParams: searchParamsForError } = new URL(request.url);
    await AnalyticsNotificationService.notifyDailyAggregationFailure(
      searchParamsForError.get('date') || 'unknown', 
      errorMessage
    );
    
    return NextResponse.json({
      success: false,
      error: 'Failed to aggregate daily traffic data',
      details: errorMessage
    }, { status: 500 });
  }
}

// GET endpoint to check aggregation status
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    // Check if data exists for the date
    const trafficData = await AnalyticsService.getTrafficData(date, date);
    
    return NextResponse.json({
      success: true,
      date,
      hasData: trafficData.length > 0,
      dataCount: trafficData.length,
      data: trafficData.length > 0 ? trafficData[0] : null
    });
    
  } catch (error) {
    console.error('Error checking aggregation status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check aggregation status'
    }, { status: 500 });
  }
}