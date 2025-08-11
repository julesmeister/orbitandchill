/* eslint-disable @typescript-eslint/no-unused-vars */

import { CreatePersonRequest, UpdatePersonRequest, DeletePersonRequest, BirthData } from '@/types/person';
import { PersonDataTransformers } from '@/utils/personDataTransformers';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export interface ValidationRule<T = any> {
  field: string;
  validator: (value: T) => boolean;
  message: string;
  required?: boolean;
}

/**
 * Person Validation Service
 * Centralized validation logic for all Person operations
 */
export class PersonValidationService {
  private static readonly RELATIONSHIPS = [
    'self', 'parent', 'child', 'sibling', 'partner', 'spouse',
    'friend', 'colleague', 'relative', 'other'
  ];

  /**
   * Validate person creation request
   */
  static validateCreateRequest(data: any): ValidationResult {
    const errors: string[] = [];

    // Required field validation
    if (!data.userId || typeof data.userId !== 'string') {
      errors.push('User ID is required and must be a string');
    }

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.push('Name is required and must be a non-empty string');
    }

    if (!data.relationship || typeof data.relationship !== 'string') {
      errors.push('Relationship is required and must be a string');
    } else if (!this.RELATIONSHIPS.includes(data.relationship.toLowerCase())) {
      errors.push(`Relationship must be one of: ${this.RELATIONSHIPS.join(', ')}`);
    }

    if (!data.birthData) {
      errors.push('Birth data is required');
    } else {
      const birthDataValidation = this.validateBirthData(data.birthData);
      if (!birthDataValidation.isValid) {
        errors.push(...birthDataValidation.errors);
      }
    }

    // Optional field validation
    if (data.notes !== undefined && data.notes !== null && typeof data.notes !== 'string') {
      errors.push('Notes must be a string or null');
    }

    if (data.isDefault !== undefined && typeof data.isDefault !== 'boolean') {
      errors.push('isDefault must be a boolean');
    }

    // Sanitize data if validation passes
    let sanitizedData;
    if (errors.length === 0) {
      sanitizedData = PersonDataTransformers.sanitizePersonData(data);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Validate person update request
   */
  static validateUpdateRequest(data: any): ValidationResult {
    const errors: string[] = [];

    // Required fields for update
    if (!data.personId || typeof data.personId !== 'string') {
      errors.push('Person ID is required and must be a string');
    }

    if (!data.userId || typeof data.userId !== 'string') {
      errors.push('User ID is required and must be a string');
    }

    if (!data.updates || typeof data.updates !== 'object') {
      errors.push('Updates object is required');
    } else {
      const updateValidation = this.validateUpdateFields(data.updates);
      if (!updateValidation.isValid) {
        errors.push(...updateValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? PersonDataTransformers.sanitizePersonData(data.updates) : undefined
    };
  }

  /**
   * Validate person deletion request
   */
  static validateDeleteRequest(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.personId || typeof data.personId !== 'string') {
      errors.push('Person ID is required and must be a string');
    }

    if (!data.userId || typeof data.userId !== 'string') {
      errors.push('User ID is required and must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate query parameters for GET requests
   */
  static validateGetRequest(params: URLSearchParams): ValidationResult {
    const errors: string[] = [];
    const userId = params.get('userId');

    if (!userId) {
      errors.push('User ID query parameter is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: { userId }
    };
  }

  /**
   * Validate birth data structure
   */
  private static validateBirthData(birthData: any): ValidationResult {
    const errors: string[] = [];

    if (!birthData || typeof birthData !== 'object') {
      errors.push('Birth data must be an object');
      return { isValid: false, errors };
    }

    // Date of birth validation
    if (!birthData.dateOfBirth || typeof birthData.dateOfBirth !== 'string') {
      errors.push('Date of birth is required and must be a string');
    } else if (!this.isValidDate(birthData.dateOfBirth)) {
      errors.push('Date of birth must be a valid date in YYYY-MM-DD format');
    }

    // Time of birth validation
    if (!birthData.timeOfBirth || typeof birthData.timeOfBirth !== 'string') {
      errors.push('Time of birth is required and must be a string');
    } else if (!this.isValidTime(birthData.timeOfBirth)) {
      errors.push('Time of birth must be in HH:MM format');
    }

    // Location validation
    if (!birthData.locationOfBirth || typeof birthData.locationOfBirth !== 'string') {
      errors.push('Location of birth is required and must be a string');
    }

    // Coordinates validation (optional but must be valid if provided)
    if (birthData.coordinates !== null && birthData.coordinates !== undefined) {
      if (!PersonDataTransformers.validateCoordinates(birthData.coordinates)) {
        errors.push('Coordinates must have valid lat and lon string values');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate update fields
   */
  private static validateUpdateFields(updates: any): ValidationResult {
    const errors: string[] = [];

    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || !updates.name.trim()) {
        errors.push('Name must be a non-empty string');
      }
    }

    if (updates.relationship !== undefined) {
      if (typeof updates.relationship !== 'string' || 
          !this.RELATIONSHIPS.includes(updates.relationship.toLowerCase())) {
        errors.push(`Relationship must be one of: ${this.RELATIONSHIPS.join(', ')}`);
      }
    }

    if (updates.birthData !== undefined) {
      const birthDataValidation = this.validateBirthData(updates.birthData);
      if (!birthDataValidation.isValid) {
        errors.push(...birthDataValidation.errors);
      }
    }

    if (updates.notes !== undefined && updates.notes !== null && typeof updates.notes !== 'string') {
      errors.push('Notes must be a string or null');
    }

    if (updates.isDefault !== undefined && typeof updates.isDefault !== 'boolean') {
      errors.push('isDefault must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  private static isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && 
           date.toISOString().split('T')[0] === dateString;
  }

  /**
   * Validate time format (HH:MM)
   */
  private static isValidTime(timeString: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }

  /**
   * Create validation error response
   */
  static createValidationErrorResponse(errors: string[]): { response: any; status: number } {
    return {
      response: {
        success: false,
        error: 'Validation failed',
        validationErrors: errors
      },
      status: 400
    };
  }
}