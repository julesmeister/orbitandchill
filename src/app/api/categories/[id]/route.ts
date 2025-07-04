/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} from '@/db/services/categoryService';
import { CategoryFormData } from '@/types/categories';
import { z } from 'zod';

// Validation schema for category updates
const CategoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  sortOrder: z.number().min(0).optional(),
  isActive: z.boolean().optional()
});

/**
 * GET /api/categories/[id]
 * Get specific category by ID
 * Following API_DATABASE_PROTOCOL.md single record patterns
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const result = await getCategoryById(id);
    
    if (!result.success) {
      const statusCode = result.error === 'Category not found' ? 404 : 500;
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch category',
          fallback: result.fallback
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      category: result.data,
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error in GET /api/categories/[id]:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories/[id]
 * Update specific category
 * Following API_DATABASE_PROTOCOL.md update patterns
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    let validatedData: Partial<CategoryFormData>;
    try {
      validatedData = CategoryUpdateSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid input data', 
            details: validationError.errors 
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Update category via service layer
    const result = await updateCategory(id, validatedData);
    
    if (!result.success) {
      let statusCode = 500;
      if (result.error === 'Category not found or no changes made') {
        statusCode = 404;
      } else if (result.fallback) {
        statusCode = 503;
      }

      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to update category',
          fallback: result.fallback
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      category: result.data,
      message: 'Category updated successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error in PATCH /api/categories/[id]:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete specific category (soft delete)
 * Following API_DATABASE_PROTOCOL.md deletion patterns
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteCategory(id);
    
    if (!result.success) {
      let statusCode = 500;
      if (result.error === 'Category not found') {
        statusCode = 404;
      } else if (result.error === 'Cannot delete default category') {
        statusCode = 403;
      } else if (result.fallback) {
        statusCode = 503;
      }

      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to delete category',
          fallback: result.fallback
        },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error in DELETE /api/categories/[id]:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}