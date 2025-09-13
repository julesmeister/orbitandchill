/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { PersonService } from '@/services/PersonService';
import { PersonValidationService } from '@/services/personValidationService';
import { HttpResponseUtils } from '@/utils/httpResponseUtils';
import { PersonDataTransformers } from '@/utils/dataTransformers/personDataTransformers';

/**
 * GET /api/people - Get all people for a user
 * Now uses clean architecture with proper separation of concerns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const validation = PersonValidationService.validateGetRequest(searchParams);
    if (!validation.isValid) {
      const { response, status } = PersonValidationService.createValidationErrorResponse(validation.errors);
      return NextResponse.json(response, { status });
    }

    const { userId } = validation.sanitizedData!;
    
    // Get people through service layer
    const result = await PersonService.getPeopleForUser(userId);
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500,
        { people: [] } // Graceful degradation
      );
    }

    // Return successful response
    return HttpResponseUtils.success({ people: result.data! }, {
      'Cache-Control': 'private, max-age=300' // Cache for 5 minutes
    });

  } catch (error) {
    console.error('API - Failed to get people:', error);
    return HttpResponseUtils.error(
      'Failed to get people',
      error instanceof Error ? error.message : 'Unknown error',
      500,
      { people: [] }
    );
  }
}

/**
 * POST /api/people - Create a new person
 * Now uses service layer with comprehensive validation and business logic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enhanced logging for debugging
    console.log('POST /api/people - Request received:', {
      userId: body.userId ? `${body.userId.substring(0, 8)}...` : 'MISSING',
      name: body.name || 'MISSING',
      relationship: body.relationship || 'MISSING',
      hasBirthData: !!body.birthData
    });
    
    // Create and process person through service layer
    const result = await PersonService.createPerson(body);
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500
      );
    }

    // Return successful response with created person
    const response = PersonDataTransformers.createPersonResponse(
      result.data!,
      'Person created successfully'
    );
    
    return HttpResponseUtils.success(response, {
      'Cache-Control': 'no-store' // Don't cache creation responses
    }, 201);

  } catch (error) {
    console.error('API - Failed to create person:', error);
    return HttpResponseUtils.error(
      'Failed to create person',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * PATCH /api/people - Update a person
 * Now uses service layer with dynamic query building and validation
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update person through service layer
    const result = await PersonService.updatePerson(body);
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500
      );
    }

    // Return successful response
    return HttpResponseUtils.success({
      success: true,
      message: 'Person updated successfully'
    }, {
      'Cache-Control': 'no-store' // Don't cache update responses
    });

  } catch (error) {
    console.error('API - Failed to update person:', error);
    return HttpResponseUtils.error(
      'Failed to update person',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * DELETE /api/people - Delete a person
 * Now uses service layer with automatic default person reassignment
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');
    const userId = searchParams.get('userId');
    
    // Delete person through service layer
    const result = await PersonService.deletePerson({ personId: personId!, userId: userId! });
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500
      );
    }

    // Return successful response
    return HttpResponseUtils.success({
      success: true,
      message: 'Person deleted successfully'
    }, {
      'Cache-Control': 'no-store' // Don't cache deletion responses
    });

  } catch (error) {
    console.error('API - Failed to delete person:', error);
    return HttpResponseUtils.error(
      'Failed to delete person',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}