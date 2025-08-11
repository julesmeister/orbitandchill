/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomModelCreateRequest, CustomModelDeleteRequest } from '@/types/customModels';

export class CustomModelsValidation {
  static validateUserId(userId: unknown): string {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error('User ID is required and must be a non-empty string');
    }
    return userId.trim();
  }

  static validateProviderId(providerId: unknown): string {
    if (!providerId || typeof providerId !== 'string' || providerId.trim().length === 0) {
      throw new Error('Provider ID is required and must be a non-empty string');
    }
    return providerId.trim();
  }

  static validateModelName(modelName: unknown): string {
    if (!modelName || typeof modelName !== 'string' || modelName.trim().length === 0) {
      throw new Error('Model name is required and must be a non-empty string');
    }
    
    const trimmed = modelName.trim();
    
    // Basic model name validation
    if (trimmed.length > 100) {
      throw new Error('Model name must be 100 characters or less');
    }
    
    // Check for invalid characters (allow alphanumeric, hyphens, underscores, dots)
    if (!/^[a-zA-Z0-9._-]+$/.test(trimmed)) {
      throw new Error('Model name can only contain letters, numbers, dots, hyphens, and underscores');
    }
    
    return trimmed;
  }

  static validateDisplayName(displayName: unknown, fallback: string): string {
    if (!displayName || typeof displayName !== 'string') {
      return fallback;
    }
    
    const trimmed = displayName.trim();
    if (trimmed.length === 0) {
      return fallback;
    }
    
    if (trimmed.length > 200) {
      throw new Error('Display name must be 200 characters or less');
    }
    
    return trimmed;
  }

  static validateDescription(description: unknown): string | undefined {
    if (!description || typeof description !== 'string') {
      return undefined;
    }
    
    const trimmed = description.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    
    if (trimmed.length > 500) {
      throw new Error('Description must be 500 characters or less');
    }
    
    return trimmed;
  }

  static validateCreateRequest(body: any): CustomModelCreateRequest {
    try {
      const userId = this.validateUserId(body.userId);
      const providerId = this.validateProviderId(body.providerId);
      const modelName = this.validateModelName(body.modelName);
      const displayName = this.validateDisplayName(body.displayName, modelName);
      const description = this.validateDescription(body.description);

      return {
        userId,
        providerId,
        modelName,
        displayName,
        description
      };
    } catch (error) {
      throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validateDeleteRequest(body: any): CustomModelDeleteRequest {
    try {
      const userId = this.validateUserId(body.userId);
      const modelId = this.validateModelId(body.modelId);

      return { userId, modelId };
    } catch (error) {
      throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validateModelId(modelId: unknown): string {
    if (!modelId || typeof modelId !== 'string' || modelId.trim().length === 0) {
      throw new Error('Model ID is required and must be a non-empty string');
    }
    
    const trimmed = modelId.trim();
    
    // Check if it looks like a valid model ID
    if (!trimmed.startsWith('custom_')) {
      throw new Error('Invalid model ID format');
    }
    
    return trimmed;
  }

  static validateQueryParams(searchParams: URLSearchParams): { userId: string; providerId?: string } {
    const userId = this.validateUserId(searchParams.get('userId'));
    const providerId = searchParams.get('providerId');
    
    return {
      userId,
      providerId: providerId ? this.validateProviderId(providerId) : undefined
    };
  }
}