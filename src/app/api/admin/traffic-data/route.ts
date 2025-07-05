/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    // Get the last 30 days of traffic data
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const trafficData = await AnalyticsService.getTrafficData(startDate, endDate);
    
    // Transform to match expected interface
    const formattedData = trafficData.map((record: any) => ({
      date: record.date,
      visitors: record.visitors || 0,
      pageViews: record.pageViews || 0,
      chartsGenerated: record.chartsGenerated || 0,
    }));
    
    // DO NOT add fake data - only return real data from database
    
    const sortedData = formattedData.sort((a: { date: string; }, b: { date: any; }) => a.date.localeCompare(b.date));
    
    return NextResponse.json({
      success: true,
      trafficData: sortedData
    });
    
  } catch (error) {
    console.error('API Error loading traffic data:', error);
    
    // Return empty data instead of fallback
    return NextResponse.json({
      success: false,
      trafficData: [],
      error: 'Failed to fetch traffic data'
    });
  }
}