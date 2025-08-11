/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { HoraryQuestionsService } from '@/services/horaryQuestionsService';
import { HoraryQuestionsValidation } from '@/utils/horaryQuestionsValidation';

// GET - Retrieve specific horary question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const questionId = resolvedParams.id;

    // Get question using the service
    const result = await HoraryQuestionsService.getQuestionById(questionId);
    
    let statusCode = 500;
    if (result.success) {
      statusCode = 200;
    } else if (result.error?.includes('not found')) {
      statusCode = 404;
    }
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('❌ Error fetching horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update horary question with analysis results
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const questionId = resolvedParams.id;
    const body = await request.json();

    // Validate the update request
    const validation = HoraryQuestionsValidation.validateUpdateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Update the question using the service
    const result = await HoraryQuestionsService.updateQuestion(questionId, validation.request!);
    
    let statusCode = 500;
    if (result.success) {
      statusCode = 200;
    } else if (result.error?.includes('not found')) {
      statusCode = 404;
    }
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('❌ Error updating horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove horary question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const questionId = resolvedParams.id;
  
  try {
    
    // Get userId from request body or query params for authentication
    let deleteRequest = {};
    try {
      const body = await request.json();
      const validation = HoraryQuestionsValidation.validateDeleteRequest(body);
      if (validation.valid) {
        deleteRequest = validation.request!;
      }
    } catch (error) {
      // If no body, try query params
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      if (userId) {
        deleteRequest = { userId };
      }
    }

    console.log('🗑️ DELETE request:', { questionId, userId: (deleteRequest as any).userId });

    // Delete the question using the service
    const result = await HoraryQuestionsService.deleteQuestion(questionId, deleteRequest);
    
    let statusCode = 500;
    if (result.success) {
      statusCode = 200;
    } else if (result.error?.includes('not found')) {
      statusCode = 404;
    } else if (result.error?.includes('Access denied')) {
      statusCode = 403;
    }
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('❌ Error deleting horary question:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      questionId,
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}