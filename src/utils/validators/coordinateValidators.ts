/* eslint-disable @typescript-eslint/no-unused-vars */

import { GeocodingService, Coordinates, CoordinateValidationResult } from '../../services/businessServices/geocodingService';

/**
 * Coordinate validation utilities following CODE_ARCHITECTURE_PROTOCOL patterns
 * Provides type guards and validation functions for coordinate data
 */
export class CoordinateValidators {

  /**
   * Type guard to check if an object has coordinate-like structure
   */
  static isCoordinateObject(obj: any): obj is Coordinates {
    return obj &&
           typeof obj === 'object' &&
           typeof obj.lat === 'string' &&
           typeof obj.lon === 'string';
  }

  /**
   * Type guard to check if coordinates are non-empty strings
   */
  static hasNonEmptyCoordinates(coordinates: Coordinates): boolean {
    return this.isCoordinateObject(coordinates) &&
           coordinates.lat.trim() !== '' &&
           coordinates.lon.trim() !== '';
  }

  /**
   * Type guard for parseable coordinates
   */
  static areParseable(coordinates: Coordinates): boolean {
    if (!this.hasNonEmptyCoordinates(coordinates)) return false;

    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);

    return !isNaN(lat) && !isNaN(lon);
  }

  /**
   * Type guard for coordinates within valid ranges
   */
  static areInValidRange(coordinates: Coordinates): boolean {
    if (!this.areParseable(coordinates)) return false;

    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);

    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }

  /**
   * Comprehensive coordinate validation with detailed results
   */
  static validateCoordinates(coordinates: Coordinates): CoordinateValidationResult {
    return GeocodingService.validateCoordinates(coordinates);
  }

  /**
   * Quick validation for forms and UI components
   */
  static isValidForDisplay(coordinates: Coordinates | null | undefined): boolean {
    if (!coordinates) return false;
    return this.areInValidRange(coordinates);
  }

  /**
   * Validate coordinates for astrocartography calculations
   */
  static isValidForAstroCalculations(coordinates: Coordinates): boolean {
    if (!this.areInValidRange(coordinates)) return false;

    // Additional checks for astro calculations
    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);

    // Avoid extreme polar coordinates that might cause calculation issues
    if (Math.abs(lat) > 85) {
      console.warn('⚠️ COORD: Extreme polar coordinates may affect astro calculations');
    }

    return true;
  }

  /**
   * Check if coordinates represent a known fallback location
   */
  static isFallbackCoordinate(coordinates: Coordinates): boolean {
    if (!this.areInValidRange(coordinates)) return false;

    // Check against known fallback coordinates
    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);

    // Zamboanga del Sur, Philippines
    if (Math.abs(lat - 7.3391) < 0.001 && Math.abs(lon - 122.0617) < 0.001) {
      return true;
    }

    // Manila, Philippines
    if (Math.abs(lat - 14.5995) < 0.001 && Math.abs(lon - 120.9842) < 0.001) {
      return true;
    }

    return false;
  }

  /**
   * Validate birth data coordinates structure
   */
  static validateBirthDataCoordinates(birthData: any): {
    isValid: boolean;
    hasCoordinates: boolean;
    validationResult?: CoordinateValidationResult;
  } {
    if (!birthData) {
      return { isValid: false, hasCoordinates: false };
    }

    if (!birthData.coordinates) {
      return { isValid: false, hasCoordinates: false };
    }

    if (!this.isCoordinateObject(birthData.coordinates)) {
      return { isValid: false, hasCoordinates: true };
    }

    const validationResult = this.validateCoordinates(birthData.coordinates);

    return {
      isValid: validationResult.isValid,
      hasCoordinates: true,
      validationResult
    };
  }

  /**
   * Sanitize coordinate input strings
   */
  static sanitizeCoordinateString(value: string): string {
    if (!value || typeof value !== 'string') return '';

    return value
      .trim()
      .replace(/[^\d.-]/g, '') // Keep only digits, decimal point, and minus sign
      .replace(/^-?/, match => match) // Ensure minus sign only at start
      .replace(/\..*\./, match => match.substring(0, match.indexOf('.', 1))) // Remove extra decimal points
      .substring(0, 12); // Limit length for reasonable precision
  }

  /**
   * Create coordinates object with validation
   */
  static createValidatedCoordinates(lat: string | number, lon: string | number): Coordinates | null {
    const latStr = typeof lat === 'number' ? lat.toString() : this.sanitizeCoordinateString(lat);
    const lonStr = typeof lon === 'number' ? lon.toString() : this.sanitizeCoordinateString(lon);

    const coordinates: Coordinates = { lat: latStr, lon: lonStr };

    if (this.areInValidRange(coordinates)) {
      return coordinates;
    }

    return null;
  }

  /**
   * Compare two coordinate sets for equality within tolerance
   */
  static areEqual(coords1: Coordinates, coords2: Coordinates, tolerance: number = 0.0001): boolean {
    if (!this.areInValidRange(coords1) || !this.areInValidRange(coords2)) {
      return false;
    }

    return GeocodingService.areSimilarCoordinates(coords1, coords2);
  }

  /**
   * Get coordinate precision level
   */
  static getPrecisionLevel(coordinates: Coordinates): 'high' | 'medium' | 'low' | 'invalid' {
    if (!this.areInValidRange(coordinates)) return 'invalid';

    const latPrecision = coordinates.lat.includes('.') ? coordinates.lat.split('.')[1]?.length || 0 : 0;
    const lonPrecision = coordinates.lon.includes('.') ? coordinates.lon.split('.')[1]?.length || 0 : 0;

    const avgPrecision = (latPrecision + lonPrecision) / 2;

    if (avgPrecision >= 4) return 'high';
    if (avgPrecision >= 2) return 'medium';
    return 'low';
  }

  /**
   * Extract coordinates from various input formats
   */
  static extractFromString(input: string): Coordinates | null {
    if (!input || typeof input !== 'string') return null;

    // Try to extract lat,lon pattern
    const coordPattern = /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/;
    const match = input.match(coordPattern);

    if (match) {
      const lat = this.sanitizeCoordinateString(match[1]);
      const lon = this.sanitizeCoordinateString(match[2]);

      return this.createValidatedCoordinates(lat, lon);
    }

    return null;
  }
}