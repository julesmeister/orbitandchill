/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getMemoryStats, takeMemorySnapshot } from '@/utils/memoryMonitor';

export async function GET(request: NextRequest) {
  try {
    // Take a fresh snapshot
    takeMemorySnapshot();
    
    // Get current memory statistics
    const stats = getMemoryStats();
    
    if (!stats) {
      return NextResponse.json({
        success: false,
        message: 'Memory monitoring not available',
        data: null
      });
    }

    // Current process memory usage (if available)
    const processMemory = typeof process !== 'undefined' && process.memoryUsage ? 
      process.memoryUsage() : null;

    return NextResponse.json({
      success: true,
      data: {
        current: {
          heapUsed: stats.current.heapUsed,
          heapTotal: stats.current.heapTotal,
          external: stats.current.external,
          rss: stats.current.rss,
          timestamp: new Date(stats.current.timestamp).toISOString()
        },
        peak: {
          heapUsed: stats.peak.heapUsed,
          heapTotal: stats.peak.heapTotal,
          timestamp: new Date(stats.peak.timestamp).toISOString()
        },
        averages: stats.average,
        trend: stats.trend,
        snapshotCount: stats.snapshots.length,
        processMemory,
        formatted: {
          currentHeapUsed: formatBytes(stats.current.heapUsed),
          currentHeapTotal: formatBytes(stats.current.heapTotal),
          currentRSS: formatBytes(stats.current.rss),
          peakHeapUsed: formatBytes(stats.peak.heapUsed),
          averageHeapUsed: formatBytes(stats.average.heapUsed)
        }
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error getting memory stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get memory statistics'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'snapshot':
        takeMemorySnapshot();
        return NextResponse.json({
          success: true,
          message: 'Memory snapshot taken'
        });

      case 'gc':
        // Force garbage collection if available
        if (typeof global !== 'undefined' && global.gc) {
          global.gc();
          takeMemorySnapshot(); // Take snapshot after GC
          return NextResponse.json({
            success: true,
            message: 'Garbage collection forced and snapshot taken'
          });
        } else {
          return NextResponse.json({
            success: false,
            message: 'Garbage collection not available (run with --expose-gc flag)'
          });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use "snapshot" or "gc"'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing memory action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process memory action'
    }, { status: 500 });
  }
}

// Utility function to format bytes
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}