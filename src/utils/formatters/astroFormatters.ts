/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Astrological data formatting utilities
 */

import { SIGNS } from '@/constants/astrological';

/**
 * Format degrees in astrological notation (e.g., "15.3° Aries")
 */
export function formatAstrologicalDegree(longitude: number | undefined): string {
  if (longitude === undefined || longitude === null || isNaN(longitude)) {
    return 'Unknown°';
  }

  // Normalize longitude to 0-360 range
  let normalizedLongitude = longitude % 360;
  if (normalizedLongitude < 0) {
    normalizedLongitude += 360;
  }

  const signIndex = Math.floor(normalizedLongitude / 30) % 12;
  const degreeInSign = normalizedLongitude % 30;
  const sign = SIGNS[signIndex];

  if (!sign) {
    return `${Math.abs(degreeInSign).toFixed(1)}° Aries`; // Default to Aries if sign not found
  }

  return `${degreeInSign.toFixed(1)}° ${sign.charAt(0).toUpperCase() + sign.slice(1)}`;
}
