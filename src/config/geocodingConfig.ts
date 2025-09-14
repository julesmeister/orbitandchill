/* eslint-disable @typescript-eslint/no-unused-vars */

import { Coordinates } from '../services/businessServices/geocodingService';

/**
 * Fallback coordinate configuration entry
 */
export interface FallbackLocationConfig {
  /** Keywords to match in location string (case-insensitive) */
  keywords: string[];
  /** Latitude as string */
  lat: string;
  /** Longitude as string */
  lon: string;
  /** Human-readable description */
  description: string;
  /** Priority level (higher numbers take precedence) */
  priority: number;
  /** Accuracy level of the coordinates */
  accuracy: 'city' | 'region' | 'country';
}

/**
 * Geocoding service configuration
 * Centralized configuration for fallback coordinates and validation settings
 */
export class GeocodingConfig {

  /**
   * Coordinate validation tolerance for similarity checks
   */
  static readonly COORDINATE_TOLERANCE = 0.0001;

  /**
   * Maximum precision digits for coordinates
   */
  static readonly MAX_PRECISION_DIGITS = 8;

  /**
   * Minimum search query length for location search
   */
  static readonly MIN_LOCATION_SEARCH_LENGTH = 3;

  /**
   * Timeout for geocoding API requests (milliseconds)
   */
  static readonly GEOCODING_TIMEOUT_MS = 5000;

  /**
   * Fallback coordinates for known locations when geocoding fails
   * Ordered by priority (higher priority first)
   */
  static readonly FALLBACK_LOCATIONS: FallbackLocationConfig[] = [
    // Philippines - Specific Regions (High Priority)
    {
      keywords: ['zamboanga del sur', 'philippines'],
      lat: '7.3391',
      lon: '122.0617',
      description: 'Zamboanga del Sur, Philippines',
      priority: 100,
      accuracy: 'region'
    },
    {
      keywords: ['zamboanga', 'philippines'],
      lat: '7.3391',
      lon: '122.0617',
      description: 'Zamboanga Region, Philippines',
      priority: 90,
      accuracy: 'region'
    },
    {
      keywords: ['cebu', 'philippines'],
      lat: '10.3157',
      lon: '123.8854',
      description: 'Cebu, Philippines',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['davao', 'philippines'],
      lat: '7.1907',
      lon: '125.4553',
      description: 'Davao, Philippines',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['quezon city', 'philippines'],
      lat: '14.6760',
      lon: '121.0437',
      description: 'Quezon City, Philippines',
      priority: 85,
      accuracy: 'city'
    },

    // Philippines - General (Medium Priority)
    {
      keywords: ['manila', 'philippines'],
      lat: '14.5995',
      lon: '120.9842',
      description: 'Manila, Philippines',
      priority: 80,
      accuracy: 'city'
    },
    {
      keywords: ['philippines'],
      lat: '14.5995',
      lon: '120.9842',
      description: 'Philippines (Manila as default)',
      priority: 70,
      accuracy: 'country'
    },

    // United States - Major Cities
    {
      keywords: ['new york', 'ny', 'united states'],
      lat: '40.7128',
      lon: '-74.0060',
      description: 'New York, NY, USA',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['los angeles', 'la', 'california', 'united states'],
      lat: '34.0522',
      lon: '-118.2437',
      description: 'Los Angeles, CA, USA',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['chicago', 'illinois', 'united states'],
      lat: '41.8781',
      lon: '-87.6298',
      description: 'Chicago, IL, USA',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['san francisco', 'california', 'united states'],
      lat: '37.7749',
      lon: '-122.4194',
      description: 'San Francisco, CA, USA',
      priority: 85,
      accuracy: 'city'
    },

    // United States - General
    {
      keywords: ['united states', 'usa'],
      lat: '39.8283',
      lon: '-98.5795',
      description: 'United States (geographic center)',
      priority: 70,
      accuracy: 'country'
    },

    // Other Countries
    {
      keywords: ['london', 'united kingdom', 'uk'],
      lat: '51.5074',
      lon: '-0.1278',
      description: 'London, United Kingdom',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['united kingdom', 'uk'],
      lat: '55.3781',
      lon: '-3.4360',
      description: 'United Kingdom (center)',
      priority: 70,
      accuracy: 'country'
    },
    {
      keywords: ['toronto', 'canada'],
      lat: '43.6532',
      lon: '-79.3832',
      description: 'Toronto, Canada',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['canada'],
      lat: '56.1304',
      lon: '-106.3468',
      description: 'Canada (geographic center)',
      priority: 70,
      accuracy: 'country'
    },
    {
      keywords: ['sydney', 'australia'],
      lat: '-33.8688',
      lon: '151.2093',
      description: 'Sydney, Australia',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['australia'],
      lat: '-25.2744',
      lon: '133.7751',
      description: 'Australia (center)',
      priority: 70,
      accuracy: 'country'
    },
    {
      keywords: ['tokyo', 'japan'],
      lat: '35.6762',
      lon: '139.6503',
      description: 'Tokyo, Japan',
      priority: 85,
      accuracy: 'city'
    },
    {
      keywords: ['japan'],
      lat: '36.2048',
      lon: '138.2529',
      description: 'Japan (center)',
      priority: 70,
      accuracy: 'country'
    }
  ];

  /**
   * Get all fallback locations sorted by priority
   */
  static getFallbackLocations(): FallbackLocationConfig[] {
    return [...this.FALLBACK_LOCATIONS].sort((a, b) => b.priority - a.priority);
  }

  /**
   * Find fallback coordinates for a location string
   */
  static findFallbackCoordinates(locationOfBirth: string): {
    coordinates: Coordinates;
    config: FallbackLocationConfig;
  } | null {
    if (!locationOfBirth || typeof locationOfBirth !== 'string') {
      return null;
    }

    const normalizedLocation = locationOfBirth.toLowerCase().trim();
    const locations = this.getFallbackLocations();

    for (const config of locations) {
      const hasAllKeywords = config.keywords.every(keyword =>
        normalizedLocation.includes(keyword.toLowerCase())
      );

      if (hasAllKeywords) {
        return {
          coordinates: {
            lat: config.lat,
            lon: config.lon
          },
          config
        };
      }
    }

    return null;
  }

  /**
   * Get fallback locations by country/region
   */
  static getFallbackLocationsByKeyword(keyword: string): FallbackLocationConfig[] {
    const normalizedKeyword = keyword.toLowerCase().trim();

    return this.getFallbackLocations().filter(config =>
      config.keywords.some(k => k.toLowerCase().includes(normalizedKeyword))
    );
  }

  /**
   * Get all supported regions/countries
   */
  static getSupportedRegions(): string[] {
    const regions = new Set<string>();

    this.FALLBACK_LOCATIONS.forEach(config => {
      config.keywords.forEach(keyword => {
        // Add country/region keywords (skip city-specific ones)
        if (keyword.length > 3 && !keyword.includes(' city')) {
          regions.add(keyword);
        }
      });
    });

    return Array.from(regions).sort();
  }

  /**
   * Validate configuration on startup
   */
  static validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for duplicate coordinates
    const coordMap = new Map<string, FallbackLocationConfig[]>();

    this.FALLBACK_LOCATIONS.forEach(config => {
      const coordKey = `${config.lat},${config.lon}`;
      if (!coordMap.has(coordKey)) {
        coordMap.set(coordKey, []);
      }
      coordMap.get(coordKey)!.push(config);
    });

    coordMap.forEach((configs, coord) => {
      if (configs.length > 1) {
        const descriptions = configs.map(c => c.description).join(', ');
        errors.push(`Duplicate coordinates ${coord} found in: ${descriptions}`);
      }
    });

    // Check for invalid coordinates
    this.FALLBACK_LOCATIONS.forEach(config => {
      const lat = parseFloat(config.lat);
      const lon = parseFloat(config.lon);

      if (isNaN(lat) || isNaN(lon)) {
        errors.push(`Invalid coordinates in ${config.description}: ${config.lat}, ${config.lon}`);
      }

      if (lat < -90 || lat > 90) {
        errors.push(`Latitude out of range in ${config.description}: ${lat}`);
      }

      if (lon < -180 || lon > 180) {
        errors.push(`Longitude out of range in ${config.description}: ${lon}`);
      }
    });

    // Check for missing required fields
    this.FALLBACK_LOCATIONS.forEach((config, index) => {
      if (!config.keywords || config.keywords.length === 0) {
        errors.push(`Missing keywords in fallback location at index ${index}`);
      }

      if (!config.description || config.description.trim() === '') {
        errors.push(`Missing description in fallback location at index ${index}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get configuration statistics
   */
  static getConfigurationStats(): {
    totalLocations: number;
    citiesCount: number;
    regionsCount: number;
    countriesCount: number;
    averagePriority: number;
  } {
    const total = this.FALLBACK_LOCATIONS.length;
    const cities = this.FALLBACK_LOCATIONS.filter(c => c.accuracy === 'city').length;
    const regions = this.FALLBACK_LOCATIONS.filter(c => c.accuracy === 'region').length;
    const countries = this.FALLBACK_LOCATIONS.filter(c => c.accuracy === 'country').length;

    const avgPriority = this.FALLBACK_LOCATIONS.reduce((sum, c) => sum + c.priority, 0) / total;

    return {
      totalLocations: total,
      citiesCount: cities,
      regionsCount: regions,
      countriesCount: countries,
      averagePriority: Math.round(avgPriority)
    };
  }
}