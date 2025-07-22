/* eslint-disable @typescript-eslint/no-unused-vars */

import { db } from '@/db/index-turso-http';
import { categories } from '@/db/schema';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { 
  Category, 
  CategoryEntity, 
  CategoryFormData, 
  CategoryServiceResponse,
  DEFAULT_CATEGORY_DATA,
  CATEGORY_COLORS
} from '@/types/categories';

/**
 * Convert database entity to frontend Category interface
 * Following API_DATABASE_PROTOCOL.md data conversion patterns
 */
const dbToFrontend = (dbRecord: CategoryEntity): Category => ({
  id: dbRecord.id,
  name: dbRecord.name,
  description: dbRecord.description || undefined,
  color: dbRecord.color,
  sortOrder: dbRecord.sortOrder,
  isActive: dbRecord.isActive,
  isDefault: dbRecord.isDefault,
  usageCount: dbRecord.usageCount,
  createdAt: dbRecord.createdAt,
  updatedAt: dbRecord.updatedAt
});

/**
 * Convert frontend data to database format
 * Following API_DATABASE_PROTOCOL.md camelCase ↔ snake_case patterns
 */
const frontendToDb = (frontendData: CategoryFormData & { id?: string }): Partial<CategoryEntity> => {
  const now = new Date();
  return {
    id: frontendData.id || generateCategoryId(),
    name: frontendData.name,
    description: frontendData.description || null,
    color: frontendData.color,
    sortOrder: frontendData.sortOrder ?? DEFAULT_CATEGORY_DATA.sortOrder,
    isActive: frontendData.isActive ?? DEFAULT_CATEGORY_DATA.isActive,
    isDefault: DEFAULT_CATEGORY_DATA.isDefault,
    usageCount: DEFAULT_CATEGORY_DATA.usageCount,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Generate unique category ID
 */
const generateCategoryId = (): string => {
  return `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Fallback categories for when database is unavailable
 * Following API_DATABASE_PROTOCOL.md fallback patterns
 */
export const getFallbackCategories = (): Category[] => {
  const fallbackData = [
    'All Categories',
    'Natal Chart Analysis',
    'Transits & Predictions',
    'Chart Reading Help',
    'Synastry & Compatibility',
    'Mundane Astrology',
    'Learning Resources',
    'General Discussion'
  ];

  return fallbackData.map((name, index) => ({
    id: `fallback_${index + 1}`,
    name,
    description: `Discussion category: ${name}`,
    color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || '#6bdbff',
    sortOrder: index,
    isActive: true,
    isDefault: index === 0, // "All Categories" is default
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
};

/**
 * Get all active categories
 * Following API_DATABASE_PROTOCOL.md service layer patterns
 */
export const getAllCategories = async (): Promise<CategoryServiceResponse<Category[]>> => {
  try {
    // Validate database connection
    if (!db || !db.client) {
      console.warn('Database connection unavailable, using fallback categories');
      return {
        success: true,
        data: getFallbackCategories(),
        fallback: true
      };
    }

    // Query database with proper error handling
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    // Convert database records to frontend format
    const categoriesData = result.map(dbToFrontend);

    return {
      success: true,
      data: categoriesData
    };

  } catch (error) {
    console.error('Database operation failed in getAllCategories:', error);
    
    // Return fallback data with error indication
    return {
      success: true,
      data: getFallbackCategories(),
      fallback: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get category by ID
 * Following API_DATABASE_PROTOCOL.md single record patterns
 */
export const getCategoryById = async (categoryId: string): Promise<CategoryServiceResponse<Category>> => {
  try {
    if (!db || !db.client) {
      const fallbackCategory = getFallbackCategories().find(c => c.id === categoryId);
      return {
        success: !!fallbackCategory,
        data: fallbackCategory,
        fallback: true
      };
    }

    const result = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.isActive, true)))
      .limit(1);

    if (result.length === 0) {
      return {
        success: false,
        error: 'Category not found'
      };
    }

    return {
      success: true,
      data: dbToFrontend(result[0])
    };

  } catch (error) {
    console.error('Database operation failed in getCategoryById:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};

/**
 * Create new category
 * Following API_DATABASE_PROTOCOL.md creation patterns with explicit timestamps
 */
export const createCategory = async (categoryData: CategoryFormData): Promise<CategoryServiceResponse<Category>> => {
  try {
    // Validate input data
    if (!categoryData.name?.trim()) {
      return {
        success: false,
        error: 'Category name is required'
      };
    }

    if (!db || !db.client) {
      return {
        success: false,
        error: 'Database connection unavailable',
        fallback: true
      };
    }

    // Convert to database format with explicit timestamps (required for Turso HTTP client)
    const dbData = frontendToDb(categoryData);
    const now = new Date();
    
    const result = await db
      .insert(categories)
      .values({
        ...dbData,
        createdAt: now, // Explicit timestamp for Turso HTTP client compatibility
        updatedAt: now
      })
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        error: 'Failed to create category'
      };
    }

    return {
      success: true,
      data: dbToFrontend(result[0])
    };

  } catch (error) {
    console.error('Database operation failed in createCategory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};

/**
 * Update existing category
 * Following API_DATABASE_PROTOCOL.md update patterns
 */
export const updateCategory = async (
  categoryId: string, 
  updates: Partial<CategoryFormData>
): Promise<CategoryServiceResponse<Category>> => {
  try {
    if (!db || !db.client) {
      return {
        success: false,
        error: 'Database connection unavailable',
        fallback: true
      };
    }

    // Prepare update data with explicit timestamp
    const updateData: Partial<CategoryEntity> = {
      ...updates,
      updatedAt: new Date() // Explicit timestamp for Turso HTTP client
    };

    const result = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning();

    if (result.length === 0) {
      return {
        success: false,
        error: 'Category not found or no changes made'
      };
    }

    return {
      success: true,
      data: dbToFrontend(result[0])
    };

  } catch (error) {
    console.error('Database operation failed in updateCategory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};

/**
 * Delete category (soft delete by setting isActive = false)
 * Following API_DATABASE_PROTOCOL.md soft delete patterns
 */
export const deleteCategory = async (categoryId: string): Promise<CategoryServiceResponse<boolean>> => {
  try {
    if (!db || !db.client) {
      return {
        success: false,
        error: 'Database connection unavailable',
        fallback: true
      };
    }

    // Check if category is default (cannot be deleted)
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (existing.length === 0) {
      return {
        success: false,
        error: 'Category not found'
      };
    }

    if (existing[0].isDefault) {
      return {
        success: false,
        error: 'Cannot delete default category'
      };
    }

    // Soft delete by setting isActive = false
    const result = await db
      .update(categories)
      .set({ 
        isActive: false, 
        updatedAt: new Date() 
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return {
      success: result.length > 0,
      data: result.length > 0
    };

  } catch (error) {
    console.error('Database operation failed in deleteCategory:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};

/**
 * Increment usage count for a category
 * Following API_DATABASE_PROTOCOL.md analytics patterns
 */
export const incrementCategoryUsage = async (categoryName: string): Promise<CategoryServiceResponse<boolean>> => {
  try {
    if (!db || !db.client) {
      // Silently fail for usage tracking - not critical
      return { success: true, data: true, fallback: true };
    }

    // Get current category first
    const currentCategory = await db
      .select({ usageCount: categories.usageCount })
      .from(categories)
      .where(and(eq(categories.name, categoryName), eq(categories.isActive, true)))
      .limit(1);

    if (currentCategory.length > 0) {
      await db
        .update(categories)
        .set({ 
          usageCount: (currentCategory[0].usageCount || 0) + 1,
          updatedAt: new Date()
        })
        .where(and(eq(categories.name, categoryName), eq(categories.isActive, true)));
    }

    return { success: true, data: true };

  } catch (error) {
    // Non-critical operation - log but don't fail
    console.warn('Failed to increment category usage:', error);
    return { success: true, data: true, fallback: true };
  }
};

/**
 * Recalculate usage counts for all categories based on actual thread data
 * Following API_DATABASE_PROTOCOL.md analytics patterns
 */
export const recalculateCategoryUsage = async (): Promise<CategoryServiceResponse<Record<string, number>>> => {
  try {
    if (!db || !db.client) {
      return {
        success: false,
        error: 'Database connection unavailable',
        fallback: true
      };
    }

    // Get all discussions and count by category
    const { discussions } = await import('@/db/schema');
    const discussionCounts = await db
      .select({
        category: discussions.category,
        count: sql<number>`count(*)`
      })
      .from(discussions)
      .where(eq(discussions.isActive, true))
      .groupBy(discussions.category);

    // Convert to map for easy lookup
    const usageCounts: Record<string, number> = {};
    discussionCounts.forEach((row: { category: string; count: number }) => {
      usageCounts[row.category] = row.count;
    });

    // Update all categories with their actual usage counts
    for (const [categoryName, count] of Object.entries(usageCounts)) {
      await db
        .update(categories)
        .set({ 
          usageCount: count,
          updatedAt: new Date()
        })
        .where(eq(categories.name, categoryName));
    }

    // Also reset unused categories to 0
    const unusedCategories = await db
      .select({ name: categories.name })
      .from(categories)
      .where(eq(categories.isActive, true));

    for (const category of unusedCategories) {
      if (!usageCounts[category.name]) {
        await db
          .update(categories)
          .set({ 
            usageCount: 0,
            updatedAt: new Date()
          })
          .where(eq(categories.name, category.name));
      }
    }

    return {
      success: true,
      data: usageCounts
    };

  } catch (error) {
    console.error('Database operation failed in recalculateCategoryUsage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};

/**
 * Clean up category names by removing trailing numbers/counts
 * Following API_DATABASE_PROTOCOL.md data cleanup patterns
 */
export const cleanupCategoryNames = async (): Promise<CategoryServiceResponse<Record<string, string>>> => {
  try {
    if (!db || !db.client) {
      return {
        success: false,
        error: 'Database connection unavailable',
        fallback: true
      };
    }

    // Get all categories
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true));

    const cleanupResults: Record<string, string> = {};

    for (const category of allCategories) {
      // Remove trailing numbers/counts from category names
      const cleanedName = category.name.replace(/\d+$/, '').trim();
      
      if (cleanedName !== category.name && cleanedName.length > 0) {
        // Update the category name
        await db
          .update(categories)
          .set({ 
            name: cleanedName,
            updatedAt: new Date()
          })
          .where(eq(categories.id, category.id));
        
        cleanupResults[category.id] = `"${category.name}" → "${cleanedName}"`;
      }
    }

    return {
      success: true,
      data: cleanupResults
    };

  } catch (error) {
    console.error('Database operation failed in cleanupCategoryNames:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};

/**
 * Initialize default categories if none exist
 * Following API_DATABASE_PROTOCOL.md initialization patterns
 */
export const initializeDefaultCategories = async (): Promise<CategoryServiceResponse<boolean>> => {
  try {
    if (!db || !db.client) {
      return {
        success: false,
        error: 'Database connection unavailable',
        fallback: true
      };
    }

    // Check if categories already exist
    const existingCount = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true));

    if (existingCount.length > 0) {
      return { success: true, data: true }; // Already initialized
    }

    // Create default categories
    const defaultCategories = getFallbackCategories().map((cat, index) => 
      frontendToDb({
        name: cat.name,
        description: cat.description,
        color: cat.color,
        sortOrder: index,
        isActive: true
      })
    );

    // Set first category as default
    if (defaultCategories.length > 0) {
      defaultCategories[0].isDefault = true;
    }

    const now = new Date();
    const result = await db
      .insert(categories)
      .values(defaultCategories.map(cat => ({
        ...cat,
        createdAt: now,
        updatedAt: now
      })))
      .returning();

    return {
      success: result.length > 0,
      data: result.length > 0
    };

  } catch (error) {
    console.error('Database operation failed in initializeDefaultCategories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    };
  }
};