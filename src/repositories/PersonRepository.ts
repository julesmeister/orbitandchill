/* eslint-disable @typescript-eslint/no-unused-vars */

import { Person, PersonRow, PersonFilters, CreatePersonRequest } from '@/types/person';
import { PersonDataTransformers } from '@/utils/personDataTransformers';
import { SQLQueryBuilder } from '@/utils/sqlQueryBuilder';
import { DatabaseConnectionService } from '@/services/databaseConnectionService';

/**
 * Person Repository
 * Handles all database operations for Person entities
 * Implements Repository pattern for clean separation of concerns
 */
export class PersonRepository {
  private static readonly TABLE_NAME = 'people';

  /**
   * Find all people for a user with optional filtering
   */
  static async findByUserId(userId: string, filters?: Partial<PersonFilters>): Promise<Person[]> {
    const whereConditions = [
      { field: 'userId', operator: '=' as const, value: userId }
    ];

    // Add optional filters
    if (filters?.relationship) {
      whereConditions.push({
        field: 'relationship',
        operator: '=' as const,
        value: filters.relationship
      });
    }

    if (filters?.isDefault !== undefined) {
      whereConditions.push({
        field: 'isDefault',
        operator: '=' as const,
        value: filters.isDefault ? '1' : '0'
      });
    }

    const query = SQLQueryBuilder.buildSelectQuery({
      table: this.TABLE_NAME,
      where: whereConditions,
      orderBy: [
        { field: 'is_default', direction: 'DESC' },
        { field: 'updated_at', direction: 'DESC' }
      ],
      limit: filters?.limit,
      offset: filters?.offset
    });

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    return PersonDataTransformers.rowsToPersons(result.rows as PersonRow[]);
  }

  /**
   * Find a specific person by ID and user ID
   */
  static async findByIdAndUserId(personId: string, userId: string): Promise<Person | null> {
    const query = SQLQueryBuilder.buildSelectQuery({
      table: this.TABLE_NAME,
      where: [
        { field: 'id', operator: '=', value: personId },
        { field: 'userId', operator: '=', value: userId }
      ]
    });

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    
    if (result.rows.length === 0) {
      return null;
    }

    return PersonDataTransformers.rowToPerson(result.rows[0] as PersonRow);
  }

  /**
   * Check for duplicate birth data
   */
  static async findDuplicate(
    userId: string,
    relationship: string,
    birthData: any
  ): Promise<Person | null> {
    const query = SQLQueryBuilder.PersonQueries.findDuplicate(userId, relationship, birthData);
    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);

    if (result.rows.length === 0) {
      return null;
    }

    // Get full person data for the duplicate
    return this.findByIdAndUserId(result.rows[0].id as string, userId);
  }

  /**
   * Create a new person
   */
  static async create(personData: Omit<Person, 'createdAt' | 'updatedAt'>): Promise<Person> {
    const timestamp = new Date().toISOString();
    
    const query = SQLQueryBuilder.buildInsertQuery(
      this.TABLE_NAME,
      {
        id: personData.id,
        userId: personData.userId,
        name: personData.name,
        relationship: personData.relationship,
        dateOfBirth: personData.birthData.dateOfBirth,
        timeOfBirth: personData.birthData.timeOfBirth,
        locationOfBirth: personData.birthData.locationOfBirth,
        coordinates: personData.birthData.coordinates,
        notes: personData.notes,
        isDefault: personData.isDefault,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    );

    await DatabaseConnectionService.executeQuery(query.sql, query.args);

    return {
      ...personData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
  }

  /**
   * Create a new person as default atomically (removes existing defaults first)
   */
  static async createAsDefault(personData: Omit<Person, 'createdAt' | 'updatedAt'>): Promise<Person> {
    const timestamp = new Date().toISOString();
    
    // Force isDefault to true
    const defaultPersonData = { ...personData, isDefault: true };
    
    const removeDefaultsQuery = SQLQueryBuilder.PersonQueries.removeAllDefaults(personData.userId);
    const createQuery = SQLQueryBuilder.buildInsertQuery(
      this.TABLE_NAME,
      {
        id: defaultPersonData.id,
        userId: defaultPersonData.userId,
        name: defaultPersonData.name,
        relationship: defaultPersonData.relationship,
        dateOfBirth: defaultPersonData.birthData.dateOfBirth,
        timeOfBirth: defaultPersonData.birthData.timeOfBirth,
        locationOfBirth: defaultPersonData.birthData.locationOfBirth,
        coordinates: defaultPersonData.birthData.coordinates,
        notes: defaultPersonData.notes,
        isDefault: true,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    );

    // Execute both operations atomically in a transaction
    await DatabaseConnectionService.executeTransaction([
      { sql: removeDefaultsQuery.sql, args: removeDefaultsQuery.args },
      { sql: createQuery.sql, args: createQuery.args }
    ]);

    return {
      ...defaultPersonData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
  }

  /**
   * Update a person
   */
  static async update(
    personId: string,
    userId: string,
    updates: Partial<Person>
  ): Promise<boolean> {
    // Handle birthData updates by flattening the object
    const flattenedUpdates: Record<string, any> = {};
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'birthData' && value && typeof value === 'object') {
        flattenedUpdates.dateOfBirth = value.dateOfBirth;
        flattenedUpdates.timeOfBirth = value.timeOfBirth;
        flattenedUpdates.locationOfBirth = value.locationOfBirth;
        flattenedUpdates.coordinates = value.coordinates;
      } else {
        flattenedUpdates[key] = value;
      }
    });

    const query = SQLQueryBuilder.buildUpdateQuery(
      this.TABLE_NAME,
      flattenedUpdates,
      [
        { field: 'id', operator: '=', value: personId },
        { field: 'userId', operator: '=', value: userId }
      ]
    );

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    return result.rowsAffected > 0;
  }

  /**
   * Delete a person
   */
  static async delete(personId: string, userId: string): Promise<boolean> {
    const query = SQLQueryBuilder.buildDeleteQuery(
      this.TABLE_NAME,
      [
        { field: 'id', operator: '=', value: personId },
        { field: 'userId', operator: '=', value: userId }
      ]
    );

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    return result.rowsAffected > 0;
  }

  /**
   * Remove default flag from all user's people
   */
  static async removeAllDefaults(userId: string): Promise<void> {
    const query = SQLQueryBuilder.PersonQueries.removeAllDefaults(userId);
    await DatabaseConnectionService.executeQuery(query.sql, query.args);
  }

  /**
   * Set a person as the default for a user
   */
  static async setAsDefault(personId: string, userId: string): Promise<boolean> {
    // Use transaction to ensure atomicity
    const removeDefaultsQuery = SQLQueryBuilder.PersonQueries.removeAllDefaults(userId);
    const setDefaultQuery = SQLQueryBuilder.PersonQueries.setAsDefault(personId, userId);

    try {
      const results = await DatabaseConnectionService.executeTransaction([
        { sql: removeDefaultsQuery.sql, args: removeDefaultsQuery.args },
        { sql: setDefaultQuery.sql, args: setDefaultQuery.args }
      ]);

      return results[1].rowsAffected > 0;
    } catch (error) {
      console.error('Failed to set person as default:', error);
      return false;
    }
  }

  /**
   * Find the oldest person for a user (to set as new default when current default is deleted)
   */
  static async findOldestForUser(userId: string): Promise<Person | null> {
    const query = SQLQueryBuilder.buildSelectQuery({
      table: this.TABLE_NAME,
      where: [
        { field: 'userId', operator: '=', value: userId }
      ],
      orderBy: [
        { field: 'created_at', direction: 'ASC' }
      ],
      limit: 1
    });

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    
    if (result.rows.length === 0) {
      return null;
    }

    return PersonDataTransformers.rowToPerson(result.rows[0] as PersonRow);
  }

  /**
   * Count total people for a user
   */
  static async countByUserId(userId: string): Promise<number> {
    const query = SQLQueryBuilder.buildSelectQuery({
      table: this.TABLE_NAME,
      columns: ['COUNT(*) as count'],
      where: [
        { field: 'userId', operator: '=', value: userId }
      ]
    });

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    return result.rows[0]?.count || 0;
  }

  /**
   * Check if a person exists
   */
  static async exists(personId: string, userId: string): Promise<boolean> {
    const query = SQLQueryBuilder.buildSelectQuery({
      table: this.TABLE_NAME,
      columns: ['1'],
      where: [
        { field: 'id', operator: '=', value: personId },
        { field: 'userId', operator: '=', value: userId }
      ],
      limit: 1
    });

    const result = await DatabaseConnectionService.executeQuery(query.sql, query.args);
    return result.rows.length > 0;
  }

  /**
   * Get person statistics for a user
   */
  static async getStatsForUser(userId: string): Promise<{
    total: number;
    byRelationship: Record<string, number>;
    hasDefault: boolean;
  }> {
    const people = await this.findByUserId(userId);
    
    const stats = {
      total: people.length,
      byRelationship: {} as Record<string, number>,
      hasDefault: people.some(p => p.isDefault)
    };

    people.forEach(person => {
      stats.byRelationship[person.relationship] = 
        (stats.byRelationship[person.relationship] || 0) + 1;
    });

    return stats;
  }
}