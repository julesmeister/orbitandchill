import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedingBatches, deleteSeedingBatch } from '@/db/services/seedUserService';
import { db } from '@/db';

// DELETE - Clear all seeded content and batches
export async function DELETE() {
  try {
    // Get all seeding batches
    const batches = await getAllSeedingBatches();
    
    let deletedBatches = 0;
    const errors = [];
    
    // Delete all seeding batches
    for (const batch of batches) {
      try {
        await deleteSeedingBatch(batch.id);
        deletedBatches++;
        
      } catch (batchError) {
        errors.push(`Failed to delete batch ${batch.id}: ${(batchError as Error).message}`);
      }
    }
    
    const response = {
      success: true,
      message: 'Seeded content cleanup completed',
      results: {
        batchesDeleted: deletedBatches,
        totalBatchesProcessed: batches.length,
        errors: errors.length > 0 ? errors : undefined
      }
    };
    
    // If there were errors but some operations succeeded, still return success with warnings
    if (errors.length > 0 && deletedBatches > 0) {
      response.message = 'Cleanup completed with some warnings';
    } else if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cleanup failed', 
          details: errors 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error clearing seeded content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear seeded content: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// GET - Get summary of all seeded content
export async function GET() {
  try {
    // Get all seeding batches
    const batches = await getAllSeedingBatches();
    
    // Calculate summary statistics
    const summary = {
      totalBatches: batches.length,
      completedBatches: batches.filter((b: any) => b.status === 'completed').length,
      failedBatches: batches.filter((b: any) => b.status === 'failed').length,
      processingBatches: batches.filter((b: any) => b.status === 'processing').length,
      pendingBatches: batches.filter((b: any) => b.status === 'pending').length,
      totalDiscussions: batches.reduce((sum: any, b: any) => sum + (b.createdDiscussions || 0), 0),
      totalReplies: batches.reduce((sum: any, b: any) => sum + (b.createdReplies || 0), 0),
      totalVotes: batches.reduce((sum: any, b: any) => sum + (b.createdVotes || 0), 0)
    };
    
    // Get cache statistics
    let cacheStats = { total: 0, seededContent: 0 };
    try {
      const allCacheEntries = await db.cache.toArray();
      cacheStats.total = allCacheEntries.length;
      cacheStats.seededContent = allCacheEntries.filter((entry: any) => 
        entry.key.startsWith('seeded_discussion_') || 
        entry.key.startsWith('seeded_reply_')
      ).length;
    } catch (cacheError) {
      console.warn('Error getting cache statistics:', cacheError);
    }
    
    // Get recent batches for display
    const recentBatches = batches
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((batch: any) => ({
        id: batch.id,
        status: batch.status,
        createdAt: batch.createdAt,
        completedAt: batch.completedAt,
        createdDiscussions: batch.createdDiscussions,
        createdReplies: batch.createdReplies,
        aiConfig: batch.aiConfig ? {
          provider: batch.aiConfig.provider,
          model: batch.aiConfig.model
        } : null
      }));
    
    return NextResponse.json({
      success: true,
      summary,
      cacheStats,
      recentBatches,
      canClear: summary.totalBatches > 0
    });
  } catch (error) {
    console.error('Error getting seeded content summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get seeded content summary: ' + (error as Error).message },
      { status: 500 }
    );
  }
}