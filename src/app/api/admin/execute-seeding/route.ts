import { NextRequest, NextResponse } from 'next/server';
import { executeDatabaseSeeding } from '@/db/services/seedingExecutionService';
import { 
  validateAndPrepareBatch,
  setBatchProcessing,
  updateBatchWithResults,
  setBatchFailed
} from '@/db/services/seedingBatchService';

// POST - Execute seeding by creating discussions and replies in the database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, transformedContent, generationSettings } = body;
    
    console.log(`🔍 API received payload with ${transformedContent?.length || 0} items`);
    logFirstItemStructure(transformedContent);
    
    // Validate required parameters
    const validationResult = validateRequestParameters(batchId, transformedContent);
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: validationResult.status }
      );
    }
    
    // Validate and prepare batch
    const batchResult = await validateAndPrepareBatch(batchId, transformedContent);
    if (!batchResult.success) {
      return NextResponse.json(
        { success: false, error: batchResult.error },
        { status: batchResult.status }
      );
    }
    
    const { batch, seedConfigs } = batchResult;
    
    // Update batch status to processing seeding
    await setBatchProcessing(batchId);
    
    try {
      // Create discussions and replies in the actual database
      const results = await executeDatabaseSeeding(
        transformedContent, 
        seedConfigs!, 
        generationSettings,
        batchId
      );
      
      // Update batch with final statistics
      await updateBatchWithResults(batchId, {
        discussionsCreated: results.discussionsCreated,
        repliesCreated: results.repliesCreated,
        votesCreated: results.votesCreated
      });
      
      return NextResponse.json({
        success: true,
        batchId,
        results,
        discussionSlugs: results.discussionSlugs || [],
        message: `Successfully seeded ${results.discussionsCreated} discussions with ${results.repliesCreated} replies`
      });
    } catch (seedingError) {
      // Update batch status to failed
      await setBatchFailed(batchId, batch?.errors || [], (seedingError as Error).message);
      throw seedingError;
    }
  } catch (error) {
    console.error('Error executing seeding:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute seeding: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Validate request parameters
 */
function validateRequestParameters(batchId: string, transformedContent: any[]) {
  if (!batchId) {
    return {
      valid: false,
      error: 'Batch ID is required',
      status: 400
    };
  }
  
  if (!transformedContent || !Array.isArray(transformedContent)) {
    return {
      valid: false,
      error: 'Transformed content array is required',
      status: 400
    };
  }
  
  return { valid: true };
}

/**
 * Log first item structure for debugging
 */
function logFirstItemStructure(transformedContent: any[]) {
  if (transformedContent && transformedContent.length > 0) {
    console.log(`🔍 First item structure check:`, {
      title: transformedContent[0].transformedTitle,
      hasReplies: !!transformedContent[0].replies,
      repliesCount: transformedContent[0].replies?.length || 0,
      itemKeys: Object.keys(transformedContent[0])
    });
  }
}