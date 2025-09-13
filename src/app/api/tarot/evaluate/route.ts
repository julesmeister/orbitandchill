/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { TarotEvaluationService } from '@/services/tarotEvaluationService';
import { TarotEvaluationValidation } from '@/utils/tarotEvaluationValidation';

// POST - Evaluate tarot interpretation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request
    const validation = TarotEvaluationValidation.validateEvaluateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Process the evaluation using the service
    const result = await TarotEvaluationService.processEvaluation(validation.request!);
    
    const statusCode = result.success ? 200 : 500;
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('Tarot evaluation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}