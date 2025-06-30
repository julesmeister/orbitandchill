/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { 
  enableConnectionPool, 
  isUsingConnectionPool, 
  getPoolStats,
  executePooledQueryDirect
} from '@/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          usingConnectionPool: isUsingConnectionPool(),
          poolStats: getPoolStats(),
          message: isUsingConnectionPool() 
            ? 'Connection pool is active' 
            : 'Using direct client connection'
        });

      case 'enable':
        const enableResult = await enableConnectionPool();
        return NextResponse.json({
          success: enableResult,
          usingConnectionPool: isUsingConnectionPool(),
          poolStats: getPoolStats(),
          message: enableResult 
            ? 'Connection pool enabled successfully' 
            : 'Failed to enable connection pool'
        });

      case 'test':
        if (!isUsingConnectionPool()) {
          return NextResponse.json({
            success: false,
            error: 'Connection pool not enabled'
          });
        }

        try {
          const testResult = await executePooledQueryDirect('SELECT 1 as test, datetime("now") as timestamp');
          return NextResponse.json({
            success: true,
            testResult,
            poolStats: getPoolStats(),
            message: 'Connection pool test successful'
          });
        } catch (testError) {
          return NextResponse.json({
            success: false,
            error: testError instanceof Error ? testError.message : 'Test failed',
            poolStats: getPoolStats()
          });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use status, enable, or test'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Connection pool debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}