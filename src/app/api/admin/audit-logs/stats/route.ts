/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AdminAuditService } from '@/db/services/adminAuditService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the number of days for statistics (default: 30)
    const days = parseInt(searchParams.get('days') || '30');
    const validDays = Math.min(Math.max(days, 1), 365); // Between 1 and 365 days

    const statistics = await AdminAuditService.getStatistics(validDays);
    
    return NextResponse.json({
      success: true,
      statistics: {
        ...statistics,
        period: {
          days: validDays,
          startDate: new Date(Date.now() - validDays * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
        }
      },
    });
    
  } catch (error) {
    console.error('❌ Error fetching audit log statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audit log statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}