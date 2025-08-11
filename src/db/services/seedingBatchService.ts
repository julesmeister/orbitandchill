/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { 
  getSeedingBatch, 
  updateSeedingBatch,
  saveSeedingBatch,
  getAllSeedUserConfigs 
} from '@/db/services/seedUserService';

export interface BatchValidationResult {
  success: boolean;
  batch?: any;
  seedConfigs?: any[];
  error?: string;
  status?: number;
}

/**
 * Validate and prepare batch for seeding execution
 * Handles both existing batches and manual batch creation
 */
export async function validateAndPrepareBatch(
  batchId: string,
  transformedContent: any[]
): Promise<BatchValidationResult> {
  
  // Verify the seeding batch exists (or create one for manual/comment-processed content)
  let batch = await getSeedingBatch(batchId);
  
  // If no batch exists and this is a manual batch (from comment processing, etc.)
  if (!batch && batchId.startsWith('manual_batch_')) {
    console.log('🔄 Creating manual batch for content processing...');
    
    const createResult = await createManualBatch(batchId, transformedContent);
    if (!createResult.success) {
      return createResult;
    }
    batch = createResult.batch;
  }
  
  if (!batch) {
    return {
      success: false,
      error: 'Seeding batch not found and could not be created',
      status: 404
    };
  }
  
  if (batch.status !== 'completed') {
    return {
      success: false,
      error: 'Batch must be completed before executing seeding',
      status: 400
    };
  }
  
  // Get seed user configurations for reply generation
  const seedConfigs = await getAllSeedUserConfigs();
  if (seedConfigs.length === 0) {
    return {
      success: false,
      error: 'No seed user configurations found',
      status: 400
    };
  }
  
  return {
    success: true,
    batch,
    seedConfigs
  };
}

/**
 * Create a manual batch for content that doesn't have an existing batch
 */
async function createManualBatch(
  batchId: string, 
  transformedContent: any[]
): Promise<BatchValidationResult> {
  
  // Create a minimal batch record for manual content
  const newBatch = {
    id: batchId,
    sourceType: 'manual_content',
    sourceContent: 'Manually processed content or comments',
    processedContent: JSON.stringify(transformedContent),
    status: 'completed' as const, // Mark as completed since content is already processed
    discussionsCreated: 0,
    repliesCreated: 0,
    votesCreated: 0,
    errors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const saved = await saveSeedingBatch(newBatch);
  if (!saved) {
    return {
      success: false,
      error: 'Failed to create manual batch',
      status: 500
    };
  }
  
  console.log('✅ Manual batch created:', newBatch.id);
  return {
    success: true,
    batch: newBatch
  };
}

/**
 * Update batch status to processing
 */
export async function setBatchProcessing(batchId: string): Promise<void> {
  await updateSeedingBatch(batchId, { status: 'processing' });
}

/**
 * Update batch with final results
 */
export async function updateBatchWithResults(
  batchId: string,
  results: {
    discussionsCreated: number;
    repliesCreated: number;
    votesCreated: number;
  }
): Promise<void> {
  await updateSeedingBatch(batchId, {
    status: 'completed',
    discussionsCreated: results.discussionsCreated,
    repliesCreated: results.repliesCreated,
    votesCreated: results.votesCreated
  });
}

/**
 * Update batch status to failed with error information
 */
export async function setBatchFailed(
  batchId: string,
  existingErrors: string[] = [],
  newError: string
): Promise<void> {
  await updateSeedingBatch(batchId, {
    status: 'failed',
    errors: [...existingErrors, newError]
  });
}