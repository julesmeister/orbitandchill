/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { CustomModelsService } from '@/services/customModelsService';
import { CustomModelsValidation } from '@/utils/customModelsValidation';

// GET - Fetch custom AI models for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { userId, providerId } = CustomModelsValidation.validateQueryParams(searchParams);

    const response = await CustomModelsService.getModels(userId, providerId);
    
    return NextResponse.json(response, { 
      status: response.success ? 200 : 500 
    });
  } catch (error) {
    console.error('Error fetching custom AI models:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch custom AI models' 
      },
      { status: error instanceof Error && error.message.includes('required') ? 400 : 500 }
    );
  }
}


// POST - Add a new custom AI model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, providerId, modelName, displayName, description } = 
      CustomModelsValidation.validateCreateRequest(body);

    const response = await CustomModelsService.createModel(
      userId,
      providerId,
      modelName,
      displayName,
      description
    );

    return NextResponse.json(response, { 
      status: response.success ? 201 : (response.error?.includes('already exists') ? 400 : 500)
    });
  } catch (error) {
    console.error('Error creating custom AI model:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create custom AI model' 
      },
      { status: error instanceof Error && error.message.includes('Validation failed') ? 400 : 500 }
    );
  }
}

// DELETE - Remove a custom AI model
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, modelId } = CustomModelsValidation.validateDeleteRequest(body);

    const response = await CustomModelsService.deleteModel(userId, modelId);

    return NextResponse.json(response, { 
      status: response.success ? 200 : (response.error?.includes('not found') ? 404 : 500)
    });
  } catch (error) {
    console.error('Error deleting custom AI model:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete custom AI model' 
      },
      { status: error instanceof Error && error.message.includes('Validation failed') ? 400 : 500 }
    );
  }
}