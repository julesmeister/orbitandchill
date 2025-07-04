/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Utility functions for handling category URL slugs
 */

/**
 * Generate a URL-friendly slug from category name
 * Example: "Natal Chart Analysis" -> "natal-chart-analysis"
 */
export function generateCategorySlug(categoryName: string): string {
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Create category URL
 * @param categoryId - Database category ID
 * @param categoryName - Category name for slug generation
 */
export function createCategoryUrl(categoryId: string, categoryName: string): string {
  if (categoryId === 'all') {
    return '/blog';
  }
  
  // Use a combination of slug and ID for uniqueness
  const slug = generateCategorySlug(categoryName);
  return `/blog/category/${slug}-${categoryId}`;
}

/**
 * Extract category ID from URL slug
 * @param urlSlug - The slug from the URL (e.g., "natal-chart-analysis-category_123")
 */
export function extractCategoryIdFromSlug(urlSlug: string): string | null {
  // Look for pattern like "natal-chart-analysis-category_123"
  const match = urlSlug.match(/.*-(category_[a-zA-Z0-9_]+)$/);
  if (match) {
    return match[1];
  }
  
  // Fallback: if it looks like a direct category ID
  if (urlSlug.startsWith('category_')) {
    return urlSlug;
  }
  
  return null;
}

/**
 * Check if a URL slug is valid for a category
 * @param urlSlug - The slug to validate
 * @param categoryId - Expected category ID
 * @param categoryName - Expected category name
 */
export function isValidCategorySlug(urlSlug: string, categoryId: string, categoryName: string): boolean {
  const expectedSlug = generateCategorySlug(categoryName);
  const expectedUrl = `${expectedSlug}-${categoryId}`;
  return urlSlug === expectedUrl;
}

/**
 * Create SEO-friendly category meta information
 */
export function createCategoryMeta(categoryName: string, categoryDescription?: string) {
  return {
    title: `${categoryName} - Astrology Blog`,
    description: categoryDescription || `Browse articles about ${categoryName} - expert insights and cosmic wisdom`,
    canonical: createCategoryUrl('', categoryName).replace(/\/blog\/category\/.*-/, '/blog/category/'),
  };
}