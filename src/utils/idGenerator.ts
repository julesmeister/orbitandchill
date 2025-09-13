/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Generate a unique ID for database records
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Generate a random token for sharing or authentication
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a short, URL-safe ID
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9);
}