/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomModelsDatabase } from './customModelsDatabase';
import { CustomAIModel, CustomModelResponse } from '@/types/customModels';

export class CustomModelsService {
  static async getModels(userId: string, providerId?: string): Promise<CustomModelResponse> {
    try {
      const models = await CustomModelsDatabase.getModelsByUser(userId, providerId);
      
      return {
        success: true,
        models
      };
    } catch (error) {
      console.warn('Database table not available, returning empty models list:', error);
      
      // Graceful fallback - return empty list if table doesn't exist
      return {
        success: true,
        models: [],
        fallback: true,
        message: 'Custom models table not yet created'
      };
    }
  }

  static async createModel(
    userId: string,
    providerId: string,
    modelName: string,
    displayName: string,
    description?: string
  ): Promise<CustomModelResponse> {
    try {
      const model = await CustomModelsDatabase.createModel(
        userId,
        providerId,
        modelName,
        displayName,
        description
      );

      return {
        success: true,
        model,
        message: 'Custom AI model added successfully'
      };
    } catch (error) {
      // Check if it's a duplicate error
      if (error instanceof Error && error.message.includes('already exists')) {
        return {
          success: false,
          error: error.message
        };
      }

      console.warn('Database error, attempting to create table:', error);
      
      // Try to create the table and retry
      const tableCreated = await CustomModelsDatabase.ensureTableExists();
      if (!tableCreated) {
        return {
          success: false,
          error: 'Failed to create database table'
        };
      }

      // Retry the operation
      try {
        const model = await CustomModelsDatabase.createModel(
          userId,
          providerId,
          modelName,
          displayName,
          description
        );

        return {
          success: true,
          model,
          message: 'Custom AI model added successfully (table created)'
        };
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return {
          success: false,
          error: 'Failed to create custom AI model after table creation'
        };
      }
    }
  }

  static async deleteModel(userId: string, modelId: string): Promise<CustomModelResponse> {
    try {
      const deleted = await CustomModelsDatabase.deleteModel(userId, modelId);
      
      if (!deleted) {
        return {
          success: false,
          error: 'Custom model not found or not owned by user'
        };
      }

      return {
        success: true,
        message: 'Custom AI model deleted successfully'
      };
    } catch (error) {
      console.warn('Database table not available for deletion:', error);
      return {
        success: false,
        error: 'Custom models table not available'
      };
    }
  }
}