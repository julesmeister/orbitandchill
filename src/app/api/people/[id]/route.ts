/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import { PersonService } from '@/services/PersonService';
import { PersonValidationService } from '@/services/personValidationService';
import { PersonDataTransformers } from '@/utils/personDataTransformers';
import { HttpResponseUtils } from '@/utils/httpResponseUtils';

/**
 * PUT /api/people/[id] - Update a specific person
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = id;
    const body = await request.json();
    
    // Add person ID to the request body
    const updateRequest = {
      ...body,
      personId
    };
    
    // Update person through service layer
    const result = await PersonService.updatePerson(updateRequest);
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500
      );
    }

    // Return the updated person data
    const response = PersonDataTransformers.createPersonResponse(
      result.data!,
      'Person updated successfully'
    );
    
    return HttpResponseUtils.success(response, {
      'Cache-Control': 'no-store'
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
 * DELETE /api/people/[id] - Delete a specific person
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = id;
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return HttpResponseUtils.error(
        'User ID is required',
        undefined,
        400
      );
    }
    
    // Delete person through service layer
    const result = await PersonService.deletePerson({ personId, userId });
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500
      );
    }

    return HttpResponseUtils.success({
      success: true,
      message: 'Person deleted successfully'
    }, {
      'Cache-Control': 'no-store'
    });

  } catch (error) {
    console.error('API - Failed to delete person:', error);
    return HttpResponseUtils.error(
      'Failed to delete person',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * GET /api/people/[id] - Get a specific person
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const personId = id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return HttpResponseUtils.error(
        'User ID is required',
        undefined,
        400
      );
    }
    
    // Get person through service layer
    const result = await PersonService.getPersonById({ personId, userId });
    
    if (!result.success) {
      return HttpResponseUtils.error(
        result.error!,
        undefined,
        result.statusCode || 500
      );
    }

    if (!result.data) {
      return HttpResponseUtils.error(
        'Person not found',
        undefined,
        404
      );
    }

    const response = PersonDataTransformers.createPersonResponse(result.data);
    return HttpResponseUtils.success(response, {
      'Cache-Control': 'private, max-age=300'
    });

  } catch (error) {
    console.error('API - Failed to get person:', error);
    return HttpResponseUtils.error(
      'Failed to get person',
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}