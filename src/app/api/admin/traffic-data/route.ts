/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    console.log('📈 API: Loading traffic data...');
    
    // Get the last 30 days of traffic data
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const trafficData = await AnalyticsService.getTrafficData(startDate, endDate);
    console.log(`📊 API: Retrieved ${trafficData.length} traffic records from analytics service`);
    
    // Transform to match expected interface
    const formattedData = trafficData.map((record: any) => ({
      date: record.date,
      visitors: record.visitors || 0,
      pageViews: record.pageViews || 0,
      chartsGenerated: record.chartsGenerated || 0,
    }));
    
    // DO NOT add fake data - only return real data from database
    console.log(`📊 API: Found ${formattedData.length} real traffic records (no fake data added)`);
    
    const sortedData = formattedData.sort((a: { date: string; }, b: { date: any; }) => a.date.localeCompare(b.date));
    console.log(`✅ API: Traffic data processed: ${sortedData.length} total records`);
    
    return NextResponse.json({
      success: true,
      trafficData: sortedData
    });
    
  } catch (error) {
    console.error('API Error loading traffic data:', error);
    
    // Return deterministic fallback data
    const fallbackData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayOfYear = Math.floor((Date.now() - i * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000)) % 365;
      
      fallbackData.push({
        date,
        visitors: 50 + (dayOfYear % 200),
        pageViews: 150 + (dayOfYear % 500),
        chartsGenerated: 5 + (dayOfYear % 50),
      });
    }
    
    return NextResponse.json({
      success: false,
      trafficData: fallbackData,
      error: 'Failed to fetch traffic data, using fallback'
    });
  }
}