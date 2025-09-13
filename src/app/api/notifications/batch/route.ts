/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { BatchNotificationManager } from '@/utils/batchNotifications';
import { processPendingBatches, getBatchStats } from '@/utils/notificationHelpers';

/**
 * Batch Notification Management API
 * GET /api/notifications/batch - Get batch statistics and status
 * POST /api/notifications/batch - Process pending batches or add to batch
 * DELETE /api/notifications/batch - Clear all pending batches
 */

export async function GET(request: NextRequest) {
  try {
    const stats = getBatchStats();
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting batch stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get batch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'process_all':
        // Force process all pending batches
        await processPendingBatches();
        return NextResponse.json({
          success: true,
          message: 'All pending batches processed'
        });

      case 'add_to_batch':
        // Add a notification to batch
        const { userId, type, entityType, entityId, actorName, contextTitle } = data;
        
        if (!userId || !type || !entityType || !entityId || !actorName || !contextTitle) {
          return NextResponse.json(
            { error: 'Missing required fields for batch notification' },
            { status: 400 }
          );
        }

        await BatchNotificationManager.addToBatch({
          userId,
          type,
          entityType,
          entityId,
          actorName,
          contextTitle,
          timestamp: new Date()
        });

        return NextResponse.json({
          success: true,
          message: 'Notification added to batch'
        });

      case 'process_batch':
        // Process a specific batch
        const { batchKey } = data;
        if (!batchKey) {
          return NextResponse.json(
            { error: 'batchKey is required for process_batch action' },
            { status: 400 }
          );
        }

        // This would require exposing the processBatch method in BatchNotificationManager
        return NextResponse.json(
          { error: 'Specific batch processing not implemented yet' },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "process_all", "add_to_batch", or "process_batch"' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing batch action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process batch action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Clear all pending batches by processing them
    await processPendingBatches();
    
    return NextResponse.json({
      success: true,
      message: 'All pending batches cleared by processing'
    });

  } catch (error) {
    console.error('Error clearing batches:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear batches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}