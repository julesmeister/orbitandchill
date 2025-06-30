/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to reasonable URL size
    .substring(0, 100);
}

/**
 * Generate a unique slug by checking against existing slugs
 */
export function generateUniqueSlug(title: string, existingSlugs: string[] = []): string {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  // If slug already exists, append number
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Validate if a string is a valid slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Extract title words for better slug generation
 */
export function extractKeywords(title: string, maxWords: number = 8): string {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'your', 'my', 'is', 'are', 'was', 'were'];
  
  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, maxWords);
    
  return words.join(' ');
}

/**
 * Generate SEO-optimized slug with keyword extraction
 */
export function generateSEOSlug(title: string, existingSlugs: string[] = []): string {
  const keywords = extractKeywords(title);
  const optimizedTitle = keywords || title; // Fall back to full title if no keywords
  return generateUniqueSlug(optimizedTitle, existingSlugs);
}