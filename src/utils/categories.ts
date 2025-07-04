/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * LEGACY FILE - DEPRECATED
 * 
 * This file is maintained for backward compatibility only.
 * New implementations should use:
 * - @/hooks/useCategories for frontend hooks
 * - @/db/services/categoryService for backend operations
 * - @/types/categories for TypeScript interfaces
 * - @/app/api/categories for API endpoints
 */

import { getFallbackCategories as getServiceFallbackCategories } from '@/db/services/categoryService';
import { CATEGORY_COLORS } from '@/types/categories';

// Default categories for discussions/forums (legacy)
export const DEFAULT_CATEGORIES = [
  'All Categories',
  'Natal Chart Analysis',
  'Transits & Predictions',
  'Chart Reading Help',
  'Synastry & Compatibility',
  'Mundane Astrology',
  'Learning Resources',
  'General Discussion'
];

/**
 * @deprecated Use useCategories() hook instead
 * Get the current categories from localStorage, falling back to defaults
 */
export function getDiscussionCategories(): string[] {
  console.warn('getDiscussionCategories() is deprecated. Use useCategories() hook instead.');
  
  if (typeof window === 'undefined') {
    // Server-side rendering - return defaults
    return DEFAULT_CATEGORIES;
  }

  try {
    const savedCategories = localStorage.getItem('discussion-categories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading saved categories:', error);
  }

  return DEFAULT_CATEGORIES;
}

/**
 * @deprecated Use useCategories() hook instead
 * Save categories to localStorage
 */
export function saveDiscussionCategories(categories: string[]): void {
  console.warn('saveDiscussionCategories() is deprecated. Use useCategories() hook instead.');
  
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('discussion-categories', JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
}

/**
 * Get category color for UI display (Synapsas color mapping)
 * Still used for backward compatibility
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6bdbff';
}

/**
 * @deprecated Use getFallbackCategories from categoryService instead
 * Fallback categories function for API compatibility
 */
export function getFallbackCategories() {
  console.warn('getFallbackCategories() is deprecated. Use categoryService.getFallbackCategories() instead.');
  
  return DEFAULT_CATEGORIES.map((name, index) => ({
    id: `category_${index + 1}`,
    name,
    description: `Discussion category: ${name}`,
    color: getCategoryColor(name)
  }));
}