/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserService } from '@/db/services/userService';

/**
 * Utility functions for handling @mentions in text content
 */

/**
 * Regular expression to match @username mentions
 * Matches @username where username can contain letters, numbers, underscores, and hyphens
 */
export const MENTION_REGEX = /@([a-zA-Z0-9_-]+)/g;

/**
 * Extract all mentioned usernames from text
 * @param text - The text content to scan for mentions
 * @returns Array of unique usernames (without @ symbol)
 */
export function extractMentions(text: string): string[] {
  const mentions: string[] = [];
  const matches = text.matchAll(MENTION_REGEX);
  
  for (const match of matches) {
    const username = match[1];
    if (username && !mentions.includes(username)) {
      mentions.push(username);
    }
  }
  
  return mentions;
}

/**
 * Check if text contains any @mentions
 * @param text - The text content to check
 * @returns True if text contains at least one mention
 */
export function hasMentions(text: string): boolean {
  return MENTION_REGEX.test(text);
}

/**
 * Convert mentioned usernames to user IDs
 * @param usernames - Array of usernames to lookup
 * @returns Array of user IDs for existing users
 */
export async function getUserIdsFromMentions(usernames: string[]): Promise<string[]> {
  const userIds: string[] = [];
  
  for (const username of usernames) {
    try {
      const user = await UserService.getUserByUsername(username);
      if (user && user.id) {
        userIds.push(user.id);
      }
    } catch (error) {
      console.warn(`Could not find user with username: ${username}`, error);
    }
  }
  
  return userIds;
}

/**
 * Process text content and return mentioned user IDs
 * @param text - The text content to process
 * @returns Array of user IDs for mentioned users
 */
export async function processMentions(text: string): Promise<string[]> {
  const mentionedUsernames = extractMentions(text);
  if (mentionedUsernames.length === 0) {
    return [];
  }
  
  return await getUserIdsFromMentions(mentionedUsernames);
}

/**
 * Replace @mentions in text with clickable links
 * @param text - The text content with mentions
 * @param baseUrl - Base URL for user profiles (default: /users)
 * @returns HTML string with clickable mention links
 */
export function renderMentionsAsLinks(text: string, baseUrl: string = '/users'): string {
  return text.replace(MENTION_REGEX, (match, username) => {
    return `<a href="${baseUrl}/${username}" class="mention-link text-blue-600 hover:text-blue-800 font-medium">@${username}</a>`;
  });
}

/**
 * Highlight @mentions in text with CSS classes
 * @param text - The text content with mentions
 * @param className - CSS class to apply to mentions
 * @returns HTML string with highlighted mentions
 */
export function highlightMentions(text: string, className: string = 'mention-highlight'): string {
  return text.replace(MENTION_REGEX, (match, username) => {
    return `<span class="${className}">@${username}</span>`;
  });
}

/**
 * Validate username format for mentions
 * @param username - Username to validate
 * @returns True if username is valid for mentions
 */
export function isValidMentionUsername(username: string): boolean {
  // Username should be 3-20 characters, alphanumeric with underscores and hyphens
  const validationRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return validationRegex.test(username);
}

/**
 * Get mention suggestions based on partial username
 * @param partial - Partial username to match
 * @param limit - Maximum number of suggestions
 * @returns Array of suggested usernames
 */
export async function getMentionSuggestions(partial: string, limit: number = 5): Promise<string[]> {
  try {
    // This would need to be implemented in UserService
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error getting mention suggestions:', error);
    return [];
  }
}

/**
 * Statistics for mentions in text
 * @param text - The text content to analyze
 * @returns Object with mention statistics
 */
export function getMentionStats(text: string): {
  totalMentions: number;
  uniqueUsernames: string[];
  mentionPositions: Array<{ username: string; start: number; end: number }>;
} {
  const uniqueUsernames = extractMentions(text);
  const mentionPositions: Array<{ username: string; start: number; end: number }> = [];
  
  const matches = text.matchAll(MENTION_REGEX);
  for (const match of matches) {
    if (match.index !== undefined) {
      mentionPositions.push({
        username: match[1],
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }
  
  return {
    totalMentions: mentionPositions.length,
    uniqueUsernames,
    mentionPositions
  };
}