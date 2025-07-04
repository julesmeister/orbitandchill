/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/db/index-turso-http';

/**
 * GET /api/admin/pool-health
 * Get database connection pool health status
 */
export async function GET(request: NextRequest) {
  try {
    const pool = getPool();
    const stats = pool.getStats();
    
    // Determine health status
    const utilizationPercent = (stats.inUse / stats.config.maxConnections) * 100;
    const health = {
      status: utilizationPercent > 90 ? 'critical' : 
              utilizationPercent > 70 ? 'warning' : 'healthy',
      utilizationPercent: utilizationPercent.toFixed(1),
      recommendations: []
    };
    
    // Add recommendations
    const recommendations: string[] = [];
    if (stats.stuckConnections > 0) {
      recommendations.push(`${stats.stuckConnections} stuck connections detected`);
    }
    if (stats.waiting > 5) {
      recommendations.push(`High queue length: ${stats.waiting} waiting requests`);
    }
    if (utilizationPercent > 85) {
      recommendations.push('Consider increasing max connections');
    }
    health.recommendations = recommendations;
    
    return NextResponse.json({
      success: true,
      health,
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Pool health check failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get pool health',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/pool-health
 * Emergency pool recovery
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;
    
    if (action === 'emergency-recovery') {
      const pool = getPool();
      const recoveredCount = pool.emergencyRecovery();
      
      return NextResponse.json({
        success: true,
        message: `Emergency recovery completed`,
        recoveredConnections: recoveredCount,
        stats: pool.getStats(),
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Pool recovery failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Recovery operation failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}