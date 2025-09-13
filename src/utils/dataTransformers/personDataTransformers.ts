/* eslint-disable @typescript-eslint/no-unused-vars */

import { Person } from '@/types/people';

/**
 * Simple data transformers for Person entities
 * Simplified version - no IndexedDB dependencies
 */
export class PersonDataTransformers {
  /**
   * Transform database person record to Person interface
   */
  static fromDatabase(dbRecord: any): Person {
    return {
      id: dbRecord.id,
      userId: dbRecord.user_id,
      name: dbRecord.name,
      relationship: dbRecord.relationship || 'other',
      birthData: {
        dateOfBirth: dbRecord.date_of_birth,
        timeOfBirth: dbRecord.time_of_birth,
        locationOfBirth: dbRecord.location_of_birth,
        coordinates: {
          lat: dbRecord.latitude?.toString() || '',
          lon: dbRecord.longitude?.toString() || '',
        },
      },
      notes: dbRecord.notes || undefined,
      isDefault: dbRecord.is_default || false,
      createdAt: new Date(dbRecord.created_at),
      updatedAt: new Date(dbRecord.updated_at),
    };
  }

  /**
   * Transform array of database rows to Person array
   */
  static rowsToPersons(rows: any[]): Person[] {
    return rows.map(row => this.fromDatabase(row));
  }

  /**
   * Transform single database row to Person object
   * Alias for fromDatabase for compatibility
   */
  static rowToPerson(row: any): Person {
    return this.fromDatabase(row);
  }

  /**
   * Transform Person to database format
   */
  static toDatabase(person: Partial<Person>, userId: string): any {
    return {
      user_id: userId,
      name: person.name,
      relationship: person.relationship || 'other',
      date_of_birth: person.birthData?.dateOfBirth,
      time_of_birth: person.birthData?.timeOfBirth,
      location_of_birth: person.birthData?.locationOfBirth,
      latitude: person.birthData?.coordinates?.lat ? parseFloat(person.birthData.coordinates.lat) : null,
      longitude: person.birthData?.coordinates?.lon ? parseFloat(person.birthData.coordinates.lon) : null,
      notes: person.notes || null,
      is_default: person.isDefault || false,
    };
  }

  /**
   * Validate person data structure
   */
  static validate(person: Partial<Person>): boolean {
    if (!person.name?.trim()) return false;
    if (!person.birthData?.dateOfBirth) return false;
    if (!person.birthData?.timeOfBirth) return false;
    if (!person.birthData?.locationOfBirth) return false;
    if (!person.birthData?.coordinates?.lat) return false;
    if (!person.birthData?.coordinates?.lon) return false;
    return true;
  }

  /**
   * Validate coordinates structure
   */
  static validateCoordinates(coordinates: any): boolean {
    if (!coordinates) return false;
    if (typeof coordinates !== 'object') return false;
    if (!coordinates.lat || !coordinates.lon) return false;

    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);

    // Validate latitude range (-90 to 90)
    if (isNaN(lat) || lat < -90 || lat > 90) return false;

    // Validate longitude range (-180 to 180)
    if (isNaN(lon) || lon < -180 || lon > 180) return false;

    return true;
  }

  /**
   * Generate unique person ID
   */
  static generateId(): string {
    return 'person_' + Date.now() + '_' + Math.random().toString(36).substring(2);
  }

  /**
   * Clean person data for API responses
   */
  static sanitize(person: Person): Person {
    return {
      ...person,
      notes: person.notes || undefined,
    };
  }

  /**
   * Sanitize person data for API operations
   * Handles both creation and update data structures
   */
  static sanitizePersonData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Create sanitized copy
    const sanitized: any = {
      ...data,
    };

    // Sanitize string fields by trimming whitespace
    if (typeof sanitized.name === 'string') {
      sanitized.name = sanitized.name.trim();
    }

    if (typeof sanitized.relationship === 'string') {
      sanitized.relationship = sanitized.relationship.toLowerCase().trim();
    }

    if (typeof sanitized.notes === 'string') {
      sanitized.notes = sanitized.notes.trim() || undefined;
    } else if (sanitized.notes === null || sanitized.notes === '') {
      sanitized.notes = undefined;
    }

    // Sanitize birth data if present
    if (sanitized.birthData && typeof sanitized.birthData === 'object') {
      const birthData = { ...sanitized.birthData };

      if (typeof birthData.dateOfBirth === 'string') {
        birthData.dateOfBirth = birthData.dateOfBirth.trim();
      }

      if (typeof birthData.timeOfBirth === 'string') {
        birthData.timeOfBirth = birthData.timeOfBirth.trim();
      }

      if (typeof birthData.locationOfBirth === 'string') {
        birthData.locationOfBirth = birthData.locationOfBirth.trim();
      }

      // Sanitize coordinates
      if (birthData.coordinates && typeof birthData.coordinates === 'object') {
        const coords = { ...birthData.coordinates };

        if (typeof coords.lat === 'string') {
          coords.lat = coords.lat.trim();
        }

        if (typeof coords.lon === 'string') {
          coords.lon = coords.lon.trim();
        }

        birthData.coordinates = coords;
      }

      sanitized.birthData = birthData;
    }

    // Ensure boolean fields are proper booleans
    if (sanitized.isDefault !== undefined) {
      sanitized.isDefault = Boolean(sanitized.isDefault);
    }

    return sanitized;
  }

  /**
   * Create standardized API response for person data
   */
  static createPersonResponse(person: Person, message: string = 'Success') {
    return {
      success: true,
      message,
      data: this.sanitize(person),
    };
  }
}