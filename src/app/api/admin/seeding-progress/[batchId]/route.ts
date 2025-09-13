import { NextRequest, NextResponse } from 'next/server';
import { getSeedingBatch, deleteSeedingBatch } from '@/db/services/seedUserService';

// GET - Check seeding progress for a specific batch
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;
    
    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }
    
    // Get the seeding batch
    const batch = await getSeedingBatch(batchId);
    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Seeding batch not found' },
        { status: 404 }
      );
    }
    
    // Calculate progress percentage
    let progressPercentage = 0;
    let currentStep = 'Pending';
    let stepDetails = {};
    
    switch (batch.status) {
      case 'pending':
        progressPercentage = 0;
        currentStep = 'Waiting to start';
        break;
        
      case 'processing':
        progressPercentage = 50;
        currentStep = 'Processing content';
        stepDetails = {
          phase: 'AI Transformation',
          description: 'Transforming content with AI and generating discussions'
        };
        break;
        
      case 'completed':
        progressPercentage = 100;
        currentStep = 'Completed';
        stepDetails = {
          phase: 'Finished',
          description: 'All discussions and replies have been created successfully'
        };
        break;
        
      case 'failed':
        progressPercentage = 0;
        currentStep = 'Failed';
        stepDetails = {
          phase: 'Error',
          description: batch.errors && batch.errors.length > 0 ? batch.errors.join(', ') : 'An unknown error occurred'
        };
        break;
    }
    
    // Get additional statistics if completed
    let statistics = {};
    if (batch.status === 'completed') {
      statistics = {
        discussionsCreated: batch.discussionsCreated,
        repliesCreated: batch.repliesCreated,
        votesDistributed: batch.votesCreated,
        completedAt: batch.updatedAt,
        processingTime: batch.updatedAt && batch.createdAt 
          ? Math.round((new Date(batch.updatedAt).getTime() - new Date(batch.createdAt).getTime()) / 1000)
          : null
      };
    }
    
    return NextResponse.json({
      success: true,
      data: {
        batchId,
        status: batch.status,
        progress: {
          percentage: progressPercentage,
          currentStep,
          stepDetails
        },
        batch: {
          id: batch.id,
          sourceType: batch.sourceType,
          createdAt: batch.createdAt,
          updatedAt: batch.updatedAt
        },
        statistics,
        errors: batch.errors
      }
    });
  } catch (error) {
    console.error('Error checking seeding progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check seeding progress: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Cancel or remove a seeding batch
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;
    
    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }
    
    // Get the seeding batch
    const batch = await getSeedingBatch(batchId);
    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Seeding batch not found' },
        { status: 404 }
      );
    }
    
    // Only allow deletion of completed or failed batches
    if (batch.status === 'processing') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete a batch that is currently processing' },
        { status: 400 }
      );
    }
    
    // Delete the batch
    await deleteSeedingBatch(batchId);
    
    return NextResponse.json({
      success: true,
      message: 'Seeding batch deleted successfully',
      deletedBatchId: batchId
    });
  } catch (error) {
    console.error('Error deleting seeding batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete seeding batch: ' + (error as Error).message },
      { status: 500 }
    );
  }
}