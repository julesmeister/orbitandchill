/* eslint-disable @typescript-eslint/no-unused-vars */

import { Person, PersonRow, BirthData, Coordinates } from '@/types/person';

/**
 * Person Data Transformation Utilities
 * Handles conversion between database rows and application models
 */
export class PersonDataTransformers {
  /**
   * Transform database row to Person model
   * Handles snake_case to camelCase conversion and type casting
   */
  static rowToPerson(row: PersonRow): Person {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      relationship: row.relationship,
      birthData: {
        dateOfBirth: row.date_of_birth,
        timeOfBirth: row.time_of_birth,
        locationOfBirth: row.location_of_birth,
        coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
      },
      notes: row.notes,
      isDefault: row.is_default === 1, // SQLite boolean conversion
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Transform multiple database rows to Person array
   * Optimized for bulk processing
   */
  static rowsToPersons(rows: PersonRow[]): Person[] {
    return rows.map(this.rowToPerson);
  }

  /**
   * Transform Person to database insert values
   * Handles camelCase to snake_case and type conversion
   */
  static personToInsertValues(person: Omit<Person, 'createdAt' | 'updatedAt'>, timestamp: string): any[] {
    return [
      person.id,
      person.userId,
      person.name,
      person.relationship,
      person.birthData.dateOfBirth,
      person.birthData.timeOfBirth,
      person.birthData.locationOfBirth,
      JSON.stringify(person.birthData.coordinates),
      person.notes || null,
      person.isDefault ? 1 : 0,
      timestamp,
      timestamp
    ];
  }

  /**
   * Generate unique person ID
   * Uses timestamp and random string for uniqueness
   */
  static generatePersonId(): string {
    const randomPart = Math.random().toString(36).substring(2, 11);
    const timestampPart = Date.now().toString(36);
    return `person_${randomPart}${timestampPart}`;
  }

  /**
   * Validate coordinates format
   */
  static validateCoordinates(coordinates: any): coordinates is Coordinates {
    return coordinates &&
           typeof coordinates.lat === 'string' &&
           typeof coordinates.lon === 'string' &&
           !isNaN(parseFloat(coordinates.lat)) &&
           !isNaN(parseFloat(coordinates.lon));
  }

  /**
   * Validate birth data completeness
   */
  static validateBirthData(birthData: any): birthData is BirthData {
    return birthData &&
           typeof birthData.dateOfBirth === 'string' &&
           typeof birthData.timeOfBirth === 'string' &&
           typeof birthData.locationOfBirth === 'string' &&
           (birthData.coordinates === null || this.validateCoordinates(birthData.coordinates));
  }

  /**
   * Sanitize person data for safe database insertion
   */
  static sanitizePersonData(data: any): Partial<Person> {
    const sanitized: any = {};

    if (typeof data.name === 'string' && data.name.trim()) {
      sanitized.name = data.name.trim();
    }

    if (typeof data.relationship === 'string' && data.relationship.trim()) {
      sanitized.relationship = data.relationship.trim();
    }

    if (data.birthData && this.validateBirthData(data.birthData)) {
      sanitized.birthData = {
        dateOfBirth: data.birthData.dateOfBirth.trim(),
        timeOfBirth: data.birthData.timeOfBirth.trim(),
        locationOfBirth: data.birthData.locationOfBirth.trim(),
        coordinates: data.birthData.coordinates
      };
    }

    if (data.notes !== undefined) {
      sanitized.notes = typeof data.notes === 'string' ? data.notes.trim() : null;
    }

    if (typeof data.isDefault === 'boolean') {
      sanitized.isDefault = data.isDefault;
    }

    return sanitized;
  }

  /**
   * Check if two people have duplicate birth data
   * Used for preventing duplicate entries
   */
  static hasDuplicateBirthData(person1: BirthData, person2: BirthData): boolean {
    return person1.dateOfBirth === person2.dateOfBirth &&
           person1.timeOfBirth === person2.timeOfBirth &&
           JSON.stringify(person1.coordinates) === JSON.stringify(person2.coordinates);
  }

  /**
   * Create API response format
   */
  static createPersonResponse(person: Person, message?: string): any {
    return {
      success: true,
      person,
      ...(message && { message })
    };
  }

  /**
   * Create people list response format
   */
  static createPeopleResponse(people: Person[]): any {
    return {
      success: true,
      people,
      count: people.length
    };
  }

  /**
   * Create error response format
   */
  static createErrorResponse(error: string, status?: number): { response: any; status: number } {
    return {
      response: {
        success: false,
        error
      },
      status: status || 500
    };
  }
}