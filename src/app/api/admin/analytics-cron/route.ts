/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/db/services/analyticsService';
import { initializeDatabase } from '@/db/index';
import AnalyticsNotificationService from '@/lib/services/analyticsNotificationService';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('🔄 Starting daily analytics cron job...');

  try {
    await initializeDatabase();
    
    const { searchParams } = new URL(request.url);
    const daysBack = parseInt(searchParams.get('days') || '7'); // Process last 7 days by default
    const force = searchParams.get('force') === 'true'; // Force re-aggregation
    
    const results = [];
    const errors = [];
    let processedDates = 0;
    
    console.log(`📊 Processing analytics for last ${daysBack} days (force: ${force})`);
    
    // Process each day from yesterday backwards
    for (let i = 1; i <= daysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      try {
        console.log(`📅 Processing ${dateString}...`);
        
        // Check if data already exists
        if (!force) {
          const existingData = await AnalyticsService.getTrafficData(dateString, dateString);
          if (existingData.length > 0 && 'visitors' in existingData[0] && (existingData[0] as any).visitors > 0) {
            console.log(`✅ Data already exists for ${dateString}, skipping`);
            results.push({
              date: dateString,
              status: 'skipped',
              reason: 'Data already exists',
              data: existingData[0]
            });
            continue;
          }
        }
        
        // Aggregate data for this date
        const aggregatedData = await AnalyticsService.aggregateDailyTraffic(dateString);
        
        if (aggregatedData && aggregatedData.visitors > 0) {
          console.log(`✅ Successfully processed ${dateString}: ${aggregatedData.visitors} visitors`);
          results.push({
            date: dateString,
            status: 'success',
            data: aggregatedData
          });
          processedDates++;
        } else {
          console.log(`⚠️ No data found for ${dateString}`);
          results.push({
            date: dateString,
            status: 'no_data',
            reason: 'No traffic data found'
          });
        }
        
        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error processing ${dateString}:`, errorMessage);
        
        errors.push({
          date: dateString,
          error: errorMessage
        });
        
        results.push({
          date: dateString,
          status: 'error',
          error: errorMessage
        });
      }
    }
    
    const duration = Date.now() - startTime;
    const hasErrors = errors.length > 0;
    
    // Calculate summary statistics
    const successfulDates = results.filter(r => r.status === 'success');
    const totalVisitors = successfulDates.reduce((sum, r) => {
      const data = r.data;
      return sum + (data && 'visitors' in data ? (data as any).visitors : 0);
    }, 0);
    const totalPageViews = successfulDates.reduce((sum, r) => {
      const data = r.data;
      return sum + (data && 'pageViews' in data ? (data as any).pageViews : 0);
    }, 0);
    const totalCharts = successfulDates.reduce((sum, r) => {
      const data = r.data;
      return sum + (data && 'chartsGenerated' in data ? (data as any).chartsGenerated : 0);
    }, 0);
    
    const summary = {
      duration: `${duration}ms`,
      datesProcessed: processedDates,
      totalDates: daysBack,
      successCount: successfulDates.length,
      errorCount: errors.length,
      skippedCount: results.filter(r => r.status === 'skipped').length,
      noDataCount: results.filter(r => r.status === 'no_data').length,
      metrics: {
        totalVisitors,
        totalPageViews,
        totalCharts,
        averageVisitors: successfulDates.length > 0 ? Math.round(totalVisitors / successfulDates.length) : 0
      }
    };
    
    // Send notification to admin
    if (hasErrors) {
      await AnalyticsNotificationService.notifyCronJobStatus('failure', {
        summary,
        errors: errors.slice(0, 3), // First 3 errors
        datesProcessed: processedDates
      });
    } else {
      await AnalyticsNotificationService.notifyCronJobStatus('success', {
        summary,
        datesProcessed: processedDates
      });
    }
    
    console.log(`🎉 Analytics cron job completed in ${duration}ms`);
    console.log(`📊 Summary: ${processedDates}/${daysBack} dates processed, ${errors.length} errors`);
    
    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors 
        ? `Cron job completed with ${errors.length} errors`
        : 'Cron job completed successfully',
      summary,
      results,
      errors: hasErrors ? errors : undefined
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('❌ Analytics cron job failed:', errorMessage);
    
    // Send failure notification
    await AnalyticsNotificationService.notifyCronJobStatus('failure', {
      error: errorMessage,
      duration: `${duration}ms`,
      datesProcessed: 0
    });
    
    return NextResponse.json({
      success: false,
      error: 'Analytics cron job failed',
      details: errorMessage,
      duration: `${duration}ms`
    }, { status: 500 });
  }
}

// GET endpoint to check cron job status and schedule
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    // Get recent aggregation status
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    const recentData = await AnalyticsService.getTrafficData(yesterdayString, yesterdayString);
    const hasYesterdayData = recentData.length > 0 && 'visitors' in recentData[0] && (recentData[0] as any).visitors > 0;
    
    // Check data freshness for last 7 days
    const weekData = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayData = await AnalyticsService.getTrafficData(dateString, dateString);
      weekData.push({
        date: dateString,
        hasData: dayData.length > 0 && 'visitors' in dayData[0] && (dayData[0] as any).visitors > 0,
        visitors: dayData.length > 0 && 'visitors' in dayData[0] ? (dayData[0] as any).visitors : 0
      });
    }
    
    const daysWithData = weekData.filter(d => d.hasData).length;
    const completeness = Math.round((daysWithData / 7) * 100);
    
    return NextResponse.json({
      success: true,
      status: {
        lastRunDate: yesterdayString,
        hasYesterdayData,
        weeklyCompleteness: completeness,
        daysWithData,
        totalDays: 7,
        weekData,
        nextRunDue: !hasYesterdayData,
        recommendations: [
          !hasYesterdayData && "Run cron job to process yesterday's data",
          completeness < 100 && "Some days missing data - consider running with force=true",
          completeness === 100 && "All recent data is up to date"
        ].filter(Boolean)
      },
      cronJobUrl: '/api/admin/analytics-cron',
      usage: {
        POST: 'Run the cron job (optionally with ?days=N&force=true)',
        GET: 'Check cron job status and data completeness'
      }
    });
    
  } catch (error) {
    console.error('Error checking cron job status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check cron job status'
    }, { status: 500 });
  }
}