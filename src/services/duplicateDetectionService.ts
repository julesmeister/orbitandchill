/* eslint-disable @typescript-eslint/no-unused-vars */

import { Person } from '@/types/people';

/**
 * Service for detecting duplicate persons based on birth data
 */
export class DuplicateDetectionService {
  /**
   * Find potential duplicates based on birth data similarity
   */
  static findDuplicates(person: Person, existingPeople: Person[]): Person[] {
    return existingPeople.filter(existing => 
      existing.id !== person.id &&
      this.isSimilarBirthData(person.birthData, existing.birthData)
    );
  }

  /**
   * Check if two birth data objects are similar enough to be duplicates
   */
  static isSimilarBirthData(
    birthData1?: Person['birthData'], 
    birthData2?: Person['birthData']
  ): boolean {
    if (!birthData1 || !birthData2) return false;

    // Exact match on date, time, and coordinates
    return (
      birthData1.dateOfBirth === birthData2.dateOfBirth &&
      birthData1.timeOfBirth === birthData2.timeOfBirth &&
      this.areSimilarCoordinates(birthData1.coordinates, birthData2.coordinates)
    );
  }

  /**
   * Check if coordinates are similar (within tolerance)
   */
  static areSimilarCoordinates(
    coord1?: { lat: string; lon: string },
    coord2?: { lat: string; lon: string },
    tolerance: number = 0.001
  ): boolean {
    if (!coord1 || !coord2) return false;

    const lat1 = parseFloat(coord1.lat);
    const lon1 = parseFloat(coord1.lon);
    const lat2 = parseFloat(coord2.lat);
    const lon2 = parseFloat(coord2.lon);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      return false;
    }

    return (
      Math.abs(lat1 - lat2) <= tolerance &&
      Math.abs(lon1 - lon2) <= tolerance
    );
  }

  /**
   * Generate a duplicate warning message
   */
  static getDuplicateWarningMessage(duplicates: Person[]): string {
    if (duplicates.length === 0) return '';
    
    if (duplicates.length === 1) {
      return `Warning: Similar birth data to "${duplicates[0].name}". This might be a duplicate.`;
    }
    
    return `Warning: Similar birth data to ${duplicates.length} existing people. This might be a duplicate.`;
  }

  /**
   * Check if a person has complete birth data for duplicate detection
   */
  static hasCompleteBirthData(person: Person): boolean {
    return !!(person.birthData?.dateOfBirth && 
              person.birthData?.timeOfBirth && 
              person.birthData?.coordinates?.lat && 
              person.birthData?.coordinates?.lon);
  }
}