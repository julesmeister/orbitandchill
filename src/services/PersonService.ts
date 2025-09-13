/* eslint-disable @typescript-eslint/no-unused-vars */

import { Person, CreatePersonRequest, UpdatePersonRequest, DeletePersonRequest } from '@/types/person';
import { PersonRepository } from '@/repositories/PersonRepository';
import { PersonDataTransformers } from '@/utils/dataTransformers/personDataTransformers';
import { PersonValidationService } from '@/services/personValidationService';
import { checkAndHandleMemoryPressure } from '@/utils/memoryPressure';

export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Person Service
 * Contains business logic for Person operations
 * Orchestrates validation, repository calls, and business rules
 */
export class PersonService {
  /**
   * Get all people for a user
   */
  static async getPeopleForUser(userId: string): Promise<ServiceResult<Person[]>> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required',
          statusCode: 400
        };
      }

      const people = await PersonRepository.findByUserId(userId);
      
      return {
        success: true,
        data: people
      };
    } catch (error) {
      console.error('PersonService.getPeopleForUser failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get people',
        statusCode: 500
      };
    }
  }


  /**
   * Create a new person with business logic
   */
  static async createPerson(request: CreatePersonRequest): Promise<ServiceResult<Person>> {
    let sanitizedData: any = null;
    
    try {
      // Check memory pressure before heavy operations
      await checkAndHandleMemoryPressure();
      
      // Validate request
      const validation = PersonValidationService.validateCreateRequest(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          statusCode: 400
        };
      }

      sanitizedData = validation.sanitizedData!;

      // Check for duplicate birth data
      console.log('PersonService.createPerson: Checking for duplicate person', {
        userId: sanitizedData.userId,
        relationship: sanitizedData.relationship,
        name: sanitizedData.name,
        dateOfBirth: sanitizedData.birthData.dateOfBirth,
        timeOfBirth: sanitizedData.birthData.timeOfBirth
      });
      
      const existingPerson = await PersonRepository.findDuplicate(
        sanitizedData.userId,
        sanitizedData.relationship,
        sanitizedData.birthData
      );

      if (existingPerson) {
        console.log('PersonService.createPerson: Duplicate person found, returning existing', {
          existingPersonId: existingPerson.id,
          existingPersonName: existingPerson.name
        });
        return {
          success: true,
          data: existingPerson // Return existing person instead of creating duplicate
        };
      }
      
      console.log('PersonService.createPerson: No duplicate found, proceeding to create new person');

      // Generate person ID
      const personId = PersonDataTransformers.generateId();
      const personToCreate: Omit<Person, 'createdAt' | 'updatedAt'> = {
        id: personId,
        userId: sanitizedData.userId,
        name: sanitizedData.name,
        relationship: sanitizedData.relationship,
        birthData: sanitizedData.birthData,
        notes: sanitizedData.notes || null,
        isDefault: sanitizedData.isDefault || false
      };

      // Use atomic operation for creating default person
      const createdPerson = sanitizedData.isDefault 
        ? await PersonRepository.createAsDefault(personToCreate)
        : await PersonRepository.create(personToCreate);

      return {
        success: true,
        data: createdPerson
      };
    } catch (error) {
      console.error('PersonService.createPerson failed:', error);
      
      // Handle unique constraint violation gracefully
      if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
        console.log('PersonService.createPerson: Unique constraint violation - trying to find existing person');
        
        // Try to find the existing person that caused the constraint violation
        try {
          const existingPerson = await PersonRepository.findDuplicate(
            sanitizedData.userId,
            sanitizedData.relationship,
            sanitizedData.birthData
          );
          
          if (existingPerson) {
            console.log('PersonService.createPerson: Found existing person after constraint violation', {
              existingPersonId: existingPerson.id,
              existingPersonName: existingPerson.name
            });
            return {
              success: true,
              data: existingPerson // Return the existing person
            };
          }
        } catch (findError) {
          console.error('PersonService.createPerson: Failed to find existing person after constraint violation:', findError);
        }
        
        return {
          success: false,
          error: 'Person with this birth data already exists',
          statusCode: 409 // Conflict
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create person',
        statusCode: 500
      };
    }
  }

  /**
   * Update a person with business logic
   */
  static async updatePerson(request: UpdatePersonRequest): Promise<ServiceResult<Person>> {
    try {
      // Validate request
      const validation = PersonValidationService.validateUpdateRequest(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          statusCode: 400
        };
      }

      // Check if person exists and belongs to user
      const existingPerson = await PersonRepository.findByIdAndUserId(
        request.personId,
        request.userId
      );

      if (!existingPerson) {
        return {
          success: false,
          error: 'Person not found or access denied',
          statusCode: 404
        };
      }

      // Handle default person logic
      if (request.updates.isDefault === true) {
        await PersonRepository.removeAllDefaults(request.userId);
      }

      // Perform update
      const updated = await PersonRepository.update(
        request.personId,
        request.userId,
        validation.sanitizedData!
      );

      if (!updated) {
        return {
          success: false,
          error: 'Failed to update person',
          statusCode: 500
        };
      }

      // Get the updated person data
      const updatedPerson = await PersonRepository.findByIdAndUserId(
        request.personId,
        request.userId
      );

      if (!updatedPerson) {
        return {
          success: false,
          error: 'Updated person not found',
          statusCode: 500
        };
      }

      return {
        success: true,
        data: updatedPerson
      };
    } catch (error) {
      console.error('PersonService.updatePerson failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update person',
        statusCode: 500
      };
    }
  }

  /**
   * Delete a person with business logic
   */
  static async deletePerson(request: DeletePersonRequest): Promise<ServiceResult<boolean>> {
    try {
      // Validate request
      const validation = PersonValidationService.validateDeleteRequest(request);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          statusCode: 400
        };
      }

      // Check if person exists and belongs to user
      const existingPerson = await PersonRepository.findByIdAndUserId(
        request.personId,
        request.userId
      );

      if (!existingPerson) {
        return {
          success: false,
          error: 'Person not found or access denied',
          statusCode: 404
        };
      }

      // Store whether this was the default person
      const wasDefault = existingPerson.isDefault;

      // Delete the person
      const deleted = await PersonRepository.delete(request.personId, request.userId);

      if (!deleted) {
        return {
          success: false,
          error: 'Failed to delete person',
          statusCode: 500
        };
      }

      // If we deleted the default person, set a new default
      if (wasDefault) {
        await this.assignNewDefaultPerson(request.userId);
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('PersonService.deletePerson failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete person',
        statusCode: 500
      };
    }
  }

  /**
   * Get a specific person by ID and user ID
   */
  static async getPersonById(request: { personId: string; userId: string }): Promise<ServiceResult<Person>> {
    try {
      if (!request.personId || !request.userId) {
        return {
          success: false,
          error: 'Person ID and User ID are required',
          statusCode: 400
        };
      }

      const person = await PersonRepository.findByIdAndUserId(request.personId, request.userId);
      
      if (!person) {
        return {
          success: false,
          error: 'Person not found or access denied',
          statusCode: 404
        };
      }

      return {
        success: true,
        data: person
      };
    } catch (error) {
      console.error('PersonService.getPersonById failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get person',
        statusCode: 500
      };
    }
  }

  /**
   * Get person by ID with ownership validation (legacy method)
   */
  static async getPersonByIdLegacy(personId: string, userId: string): Promise<ServiceResult<Person>> {
    try {
      if (!personId || !userId) {
        return {
          success: false,
          error: 'Person ID and User ID are required',
          statusCode: 400
        };
      }

      const person = await PersonRepository.findByIdAndUserId(personId, userId);

      if (!person) {
        return {
          success: false,
          error: 'Person not found or access denied',
          statusCode: 404
        };
      }

      return {
        success: true,
        data: person
      };
    } catch (error) {
      console.error('PersonService.getPersonById failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get person',
        statusCode: 500
      };
    }
  }

  /**
   * Get user's person statistics
   */
  static async getUserPersonStats(userId: string): Promise<ServiceResult<any>> {
    try {
      if (!userId) {
        return {
          success: false,
          error: 'User ID is required',
          statusCode: 400
        };
      }

      const stats = await PersonRepository.getStatsForUser(userId);

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('PersonService.getUserPersonStats failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get stats',
        statusCode: 500
      };
    }
  }

  /**
   * Set a person as default (with validation)
   */
  static async setPersonAsDefault(personId: string, userId: string): Promise<ServiceResult<boolean>> {
    try {
      // Check if person exists and belongs to user
      const person = await PersonRepository.findByIdAndUserId(personId, userId);

      if (!person) {
        return {
          success: false,
          error: 'Person not found or access denied',
          statusCode: 404
        };
      }

      // Set as default
      const success = await PersonRepository.setAsDefault(personId, userId);

      return {
        success,
        data: success
      };
    } catch (error) {
      console.error('PersonService.setPersonAsDefault failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set default person',
        statusCode: 500
      };
    }
  }

  /**
   * Private method to assign a new default person when the current default is deleted
   */
  private static async assignNewDefaultPerson(userId: string): Promise<void> {
    try {
      const oldestPerson = await PersonRepository.findOldestForUser(userId);
      
      if (oldestPerson) {
        await PersonRepository.setAsDefault(oldestPerson.id, userId);
        console.log(`Set person ${oldestPerson.id} as new default for user ${userId}`);
      }
    } catch (error) {
      console.error('Failed to assign new default person:', error);
      // Don't throw - this is a best-effort operation
    }
  }

  /**
   * Bulk operations for multiple people
   */
  static async bulkCreatePeople(requests: CreatePersonRequest[]): Promise<ServiceResult<Person[]>> {
    try {
      const results: Person[] = [];
      const errors: string[] = [];

      for (let i = 0; i < requests.length; i++) {
        const result = await this.createPerson(requests[i]);
        
        if (result.success && result.data) {
          results.push(result.data);
        } else {
          errors.push(`Person ${i + 1}: ${result.error}`);
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          error: `Some people failed to create: ${errors.join('; ')}`,
          data: results, // Return partial results
          statusCode: 207 // Multi-status
        };
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('PersonService.bulkCreatePeople failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bulk operation failed',
        statusCode: 500
      };
    }
  }
}