/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCategories, 
  createCategory, 
  initializeDefaultCategories,
  recalculateCategoryUsage,
  cleanupCategoryNames
} from '@/db/services/categoryService';
import { CategoryFormData } from '@/types/categories';
import { z } from 'zod';

// Validation schema for category creation
const CategoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  sortOrder: z.number().min(0).optional(),
  isActive: z.boolean().optional()
});

/**
 * GET /api/categories
 * Get all active categories
 * Following API_DATABASE_PROTOCOL.md endpoint patterns
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize default categories if none exist
    await initializeDefaultCategories();
    
    // Get all categories
    const result = await getAllCategories();
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to fetch categories' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      categories: result.data,
      fallback: result.fallback || false,
      meta: {
        timestamp: new Date().toISOString(),
        count: result.data?.length || 0
      }
    });

  } catch (error) {
    console.error('API Error in GET /api/categories:', error);
    
    // Return fallback response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        fallback: true
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Create new category
 * Following API_DATABASE_PROTOCOL.md creation patterns
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate input data
    let validatedData: CategoryFormData;
    try {
      validatedData = CategoryCreateSchema.parse(body);
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

    // Create category via service layer
    const result = await createCategory(validatedData);
    
    if (!result.success) {
      const statusCode = result.fallback ? 503 : 400;
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to create category',
          fallback: result.fallback
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        category: result.data,
        message: 'Category created successfully',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('API Error in POST /api/categories:', error);
    
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
 * PATCH /api/categories
 * Handle category management actions like recalculating usage counts
 * Following API_DATABASE_PROTOCOL.md action patterns
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'recalculate-usage') {
      // Recalculate usage counts for all categories
      const result = await recalculateCategoryUsage();
      
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error || 'Failed to recalculate category usage',
            fallback: result.fallback
          },
          { status: result.fallback ? 503 : 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Category usage counts recalculated successfully',
        data: result.data,
        meta: {
          timestamp: new Date().toISOString(),
          categoriesUpdated: Object.keys(result.data || {}).length
        }
      });
    }

    if (action === 'cleanup-names') {
      // Clean up category names by removing trailing numbers
      const result = await cleanupCategoryNames();
      
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error || 'Failed to cleanup category names',
            fallback: result.fallback
          },
          { status: result.fallback ? 503 : 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Category names cleaned up successfully',
        data: result.data,
        meta: {
          timestamp: new Date().toISOString(),
          categoriesUpdated: Object.keys(result.data || {}).length
        }
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid action specified' 
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('API Error in PATCH /api/categories:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}