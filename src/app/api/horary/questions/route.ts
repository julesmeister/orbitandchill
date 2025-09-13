/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { HoraryQuestionsService } from '@/services/horaryQuestionsService';
import { HoraryQuestionsValidation } from '@/utils/horaryQuestionsValidation';

// POST - Create new horary question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request
    const validation = HoraryQuestionsValidation.validateCreateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Create the question using the service
    const result = await HoraryQuestionsService.createQuestion(validation.request!);
    
    const statusCode = result.success ? 201 : 500;
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('❌ Error creating horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's horary questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const validation = HoraryQuestionsValidation.validateGetQuestionsQuery(searchParams);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Get questions using the service
    const result = await HoraryQuestionsService.getQuestions(validation.query!);
    
    const statusCode = result.success ? 200 : 500;
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('❌ Error fetching horary questions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}