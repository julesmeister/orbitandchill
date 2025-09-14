/* eslint-disable @typescript-eslint/no-unused-vars */

import { LocationOption } from '../../types';
import { GeocodingConfig } from '../../config/geocodingConfig';

/**
 * Coordinates interface for lat/lon pairs
 */
export interface Coordinates {
  lat: string;
  lon: string;
}

/**
 * Birth data with coordinates
 */
export interface BirthDataWithCoordinates {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: Coordinates;
}

/**
 * Geocoding validation result
 */
export interface CoordinateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Geocoding service for handling location and coordinate operations
 * Following CODE_ARCHITECTURE_PROTOCOL patterns for business services
 */
export class GeocodingService {

  /**
   * Validate coordinates format and ranges
   */
  static validateCoordinates(coordinates: Coordinates): CoordinateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let confidence: 'high' | 'medium' | 'low' = 'high';

    if (!coordinates) {
      errors.push('Coordinates object is required');
      return { isValid: false, errors, warnings, confidence: 'low' };
    }

    const { lat, lon } = coordinates;

    // Check for empty strings
    if (!lat || lat.trim() === '') {
      errors.push('Latitude is required and cannot be empty');
    }

    if (!lon || lon.trim() === '') {
      errors.push('Longitude is required and cannot be empty');
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings, confidence: 'low' };
    }

    // Parse coordinates
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat)) {
      errors.push(`Invalid latitude format: ${lat}`);
    }

    if (isNaN(parsedLon)) {
      errors.push(`Invalid longitude format: ${lon}`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors, warnings, confidence: 'low' };
    }

    // Validate coordinate ranges
    if (parsedLat < -90 || parsedLat > 90) {
      errors.push(`Latitude out of range (-90 to 90): ${parsedLat}`);
    }

    if (parsedLon < -180 || parsedLon > 180) {
      errors.push(`Longitude out of range (-180 to 180): ${parsedLon}`);
    }

    // Check for suspicious coordinates (exactly 0,0 might be an error)
    if (parsedLat === 0 && parsedLon === 0) {
      warnings.push('Coordinates at 0,0 might indicate geocoding error');
      confidence = 'medium';
    }

    // Check for low precision coordinates (might indicate approximation)
    if (lat.length < 5 || lon.length < 5) {
      warnings.push('Low precision coordinates detected');
      confidence = confidence === 'high' ? 'medium' : confidence;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      confidence
    };
  }

  /**
   * Find fallback coordinates for a location string
   */
  static findFallbackCoordinates(locationOfBirth: string): {
    coordinates: Coordinates;
    source: 'fallback';
    description: string;
    accuracy: string;
  } | null {
    const result = GeocodingConfig.findFallbackCoordinates(locationOfBirth);

    if (result) {
      console.log(`🌍 GEOCODING: Using fallback coordinates for ${result.config.description}`);
      return {
        coordinates: result.coordinates,
        source: 'fallback',
        description: result.config.description,
        accuracy: result.config.accuracy
      };
    }

    return null;
  }

  /**
   * Process birth data coordinates with fallback handling
   */
  static processCoordinates(birthData: BirthDataWithCoordinates): {
    coordinates: Coordinates;
    source: 'original' | 'fallback';
    validationResult: CoordinateValidationResult;
    description?: string;
    accuracy?: string;
  } {
    console.log('🌍 GEOCODING: Processing coordinates for:', {
      location: birthData.locationOfBirth,
      originalCoords: birthData.coordinates,
      hasCoordinates: !!birthData.coordinates,
      latLength: birthData.coordinates?.lat?.length || 0,
      lonLength: birthData.coordinates?.lon?.length || 0
    });

    // First, validate original coordinates
    const originalValidation = this.validateCoordinates(birthData.coordinates);

    if (originalValidation.isValid) {
      console.log('🌍 GEOCODING: Using original coordinates');
      return {
        coordinates: birthData.coordinates,
        source: 'original',
        validationResult: originalValidation
      };
    }

    // Try to find fallback coordinates
    const fallbackResult = this.findFallbackCoordinates(birthData.locationOfBirth);

    if (fallbackResult) {
      const fallbackValidation = this.validateCoordinates(fallbackResult.coordinates);
      console.log('🌍 GEOCODING: Using fallback coordinates');
      return {
        coordinates: fallbackResult.coordinates,
        source: 'fallback',
        validationResult: fallbackValidation,
        description: fallbackResult.description,
        accuracy: fallbackResult.accuracy
      };
    }

    // No valid coordinates available
    console.warn('🌍 GEOCODING: No valid coordinates available');
    throw new Error(`No valid coordinates available for location: ${birthData.locationOfBirth}`);
  }

  /**
   * Check if two coordinate sets are similar (within tolerance)
   */
  static areSimilarCoordinates(coords1: Coordinates, coords2: Coordinates): boolean {
    if (!coords1 || !coords2) return false;

    const lat1 = parseFloat(coords1.lat);
    const lon1 = parseFloat(coords1.lon);
    const lat2 = parseFloat(coords2.lat);
    const lon2 = parseFloat(coords2.lon);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      return false;
    }

    return Math.abs(lat1 - lat2) < GeocodingConfig.COORDINATE_TOLERANCE &&
           Math.abs(lon1 - lon2) < GeocodingConfig.COORDINATE_TOLERANCE;
  }

  /**
   * Convert coordinates to numeric format
   */
  static parseCoordinates(coordinates: Coordinates): { latitude: number; longitude: number } {
    const validation = this.validateCoordinates(coordinates);
    if (!validation.isValid) {
      throw new Error(`Invalid coordinates: ${validation.errors.join(', ')}`);
    }

    return {
      latitude: parseFloat(coordinates.lat),
      longitude: parseFloat(coordinates.lon)
    };
  }

  /**
   * Format coordinates for display
   */
  static formatCoordinatesForDisplay(coordinates: Coordinates): string {
    try {
      const { latitude, longitude } = this.parseCoordinates(coordinates);

      const latDir = latitude >= 0 ? 'N' : 'S';
      const lonDir = longitude >= 0 ? 'E' : 'W';

      return `${Math.abs(latitude).toFixed(4)}°${latDir}, ${Math.abs(longitude).toFixed(4)}°${lonDir}`;
    } catch (error) {
      return 'Invalid coordinates';
    }
  }

  /**
   * Create coordinates object from numeric values
   */
  static createCoordinates(latitude: number, longitude: number): Coordinates {
    return {
      lat: latitude.toString(),
      lon: longitude.toString()
    };
  }

  /**
   * Normalize location string for consistent processing
   */
  static normalizeLocationString(location: string): string {
    if (!location) return '';

    return location
      .trim()
      .toLowerCase()
      .replace(/[^\w\s,.-]/g, '') // Remove special characters except basic punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Extract country from location string (simple implementation)
   */
  static extractCountryFromLocation(location: string): string | null {
    if (!location) return null;

    const normalizedLocation = this.normalizeLocationString(location);

    // Simple pattern matching for common country indicators
    const countryPatterns = [
      'philippines',
      'united states',
      'usa',
      'canada',
      'united kingdom',
      'uk',
      'australia',
      'germany',
      'france',
      'japan',
      'china',
      'india',
      'brazil'
    ];

    for (const country of countryPatterns) {
      if (normalizedLocation.includes(country)) {
        return country === 'usa' ? 'united states' : country;
      }
    }

    // Try to extract from comma-separated location (last part often country)
    const parts = location.split(',').map(p => p.trim());
    if (parts.length > 1) {
      const lastPart = this.normalizeLocationString(parts[parts.length - 1]);
      if (lastPart && lastPart.length > 2) {
        return lastPart;
      }
    }

    return null;
  }
}