import { NextRequest, NextResponse } from 'next/server';
import { getDbAsync } from '@/db/index-turso-http';

// POST - Emergency database connection pool recovery
export async function POST() {
  try {
    console.log('🚨 Emergency DB recovery triggered via API');
    
    const db = await getDbAsync();
    if (!db || !db.pool) {
      return NextResponse.json({
        success: false,
        error: 'No database pool available'
      }, { status: 500 });
    }
    
    // Get pool status before recovery
    const beforeStats = {
      connections: db.pool.connections?.size || 0,
      queueLength: db.pool.waitingQueue?.length || 0
    };
    
    // Trigger emergency recovery
    await db.pool.emergencyRecovery();
    
    // Get pool status after recovery
    const afterStats = {
      connections: db.pool.connections?.size || 0,
      queueLength: db.pool.waitingQueue?.length || 0
    };
    
    // Test connectivity
    const testResult = await db.client.execute('SELECT 1 as test');
    
    return NextResponse.json({
      success: true,
      message: 'Emergency recovery completed successfully',
      before: beforeStats,
      after: afterStats,
      connectivity: testResult.rows[0] ? 'OK' : 'Failed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Emergency recovery failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Emergency recovery failed: ' + (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET - Check current pool status
export async function GET() {
  try {
    const db = await getDbAsync();
    if (!db || !db.pool) {
      return NextResponse.json({
        success: false,
        error: 'No database pool available'
      });
    }
    
    const stats = {
      connections: db.pool.connections?.size || 0,
      activeConnections: Array.from(db.pool.connections?.values() || []).filter((c: any) => c.isInUse).length,
      queueLength: db.pool.waitingQueue?.length || 0,
      maxConnections: db.pool.config?.maxConnections || 0,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      status: stats,
      healthy: stats.queueLength < 10 && stats.activeConnections < stats.maxConnections
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}