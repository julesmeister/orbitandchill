/**
 * Text utility functions for counting characters, words, and other text operations
 */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
}

/**
 * Count characters in a string
 */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Count characters excluding spaces
 */
export function countCharactersNoSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

/**
 * Count words in a string
 * Handles multiple spaces, line breaks, and various punctuation
 */
export function countWords(text: string): number {
  if (!text.trim()) return 0;
  
  // Remove extra whitespace and split by whitespace
  const words = text.trim().replace(/\s+/g, ' ').split(' ');
  
  // Filter out empty strings and count actual words
  return words.filter(word => word.length > 0).length;
}

/**
 * Count sentences in a string
 * Looks for sentence-ending punctuation: . ! ?
 */
export function countSentences(text: string): number {
  if (!text.trim()) return 0;
  
  // Match sentence endings (., !, ?) followed by space or end of string
  const sentences = text.match(/[.!?]+(?:\s|$)/g);
  return sentences ? sentences.length : 0;
}

/**
 * Count paragraphs in a string
 * Paragraphs are separated by double line breaks
 */
export function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  
  // Split by double line breaks and filter out empty paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  return paragraphs.length;
}

/**
 * Estimate reading time in minutes
 * Based on average reading speed of 200 words per minute
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(text);
  const minutes = wordCount / wordsPerMinute;
  return Math.ceil(minutes);
}

/**
 * Get comprehensive text statistics
 */
export function getTextStats(text: string): TextStats {
  return {
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
    words: countWords(text),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    readingTime: estimateReadingTime(text)
  };
}

/**
 * Format text stats for display
 */
export function formatTextStats(stats: TextStats): string {
  const parts = [];
  
  if (stats.words > 0) parts.push(`${stats.words} words`);
  if (stats.characters > 0) parts.push(`${stats.characters} characters`);
  if (stats.readingTime > 0) parts.push(`${stats.readingTime} min read`);
  
  return parts.join(' • ');
}

/**
 * Truncate text to a specific word count
 */
export function truncateToWords(text: string, maxWords: number, suffix: string = '...'): string {
  const words = text.trim().split(/\s+/);
  
  if (words.length <= maxWords) {
    return text;
  }
  
  return words.slice(0, maxWords).join(' ') + suffix;
}

/**
 * Truncate text to a specific character count
 */
export function truncateToCharacters(text: string, maxCharacters: number, suffix: string = '...'): string {
  if (text.length <= maxCharacters) {
    return text;
  }
  
  // Try to break at word boundary if possible
  const truncated = text.substring(0, maxCharacters - suffix.length);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxCharacters * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + suffix;
  }
  
  return truncated + suffix;
}

/**
 * Strip HTML tags and decode HTML entities from text
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags (including malformed/partial tags)
  const textOnly = html
    .replace(/<[^>]*>/g, '')  // Remove complete tags
    .replace(/<[^>]*$/g, '')  // Remove incomplete tags at end
    .replace(/^[^<]*>/g, '')  // Remove incomplete tags at beginning
    .replace(/<(?![^>]*>)/g, ''); // Remove lone < characters
  
  // Decode common HTML entities
  const decoded = textOnly
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([a-fA-F0-9]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  // Clean up extra whitespace
  return decoded.replace(/\s+/g, ' ').trim();
}

/**
 * Create a clean excerpt with length limit and smart truncation
 */
export function createCleanExcerpt(content: string, maxLength: number = 150): string {
  // First strip HTML tags completely
  const cleanText = stripHtmlTags(content);
  
  // Remove any remaining HTML fragments (like partial tags)
  const fullyClean = cleanText.replace(/<[^>]*$/g, '').replace(/^[^<]*>/g, '');
  
  // Normalize whitespace
  const normalized = fullyClean.replace(/\s+/g, ' ').trim();
  
  if (normalized.length <= maxLength) return normalized;
  
  // Find the last space before the max length to avoid cutting words
  const truncated = normalized.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.7) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

/**
 * Extract a clean excerpt from content
 * Removes HTML tags and creates a clean summary
 */
export function extractExcerpt(content: string, maxWords: number = 30): string {
  // Use the improved HTML stripping function
  const cleanText = stripHtmlTags(content);
  
  // Remove extra whitespace
  const normalizedText = cleanText.replace(/\s+/g, ' ').trim();
  
  // Truncate to word count
  return truncateToWords(normalizedText, maxWords);
}

/**
 * Check if text meets minimum requirements
 */
export function validateTextLength(text: string, minWords: number = 10, minCharacters: number = 50): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const stats = getTextStats(text);
  
  if (stats.words < minWords) {
    errors.push(`Minimum ${minWords} words required (current: ${stats.words})`);
  }
  
  if (stats.characters < minCharacters) {
    errors.push(`Minimum ${minCharacters} characters required (current: ${stats.characters})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}