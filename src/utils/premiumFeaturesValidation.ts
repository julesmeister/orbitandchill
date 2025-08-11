/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  PremiumFeature, 
  FeatureCategory, 
  UpdateFeatureRequest,
  BulkUpdateFeaturesRequest 
} from '@/types/premiumFeatures';

export class PremiumFeaturesValidation {
  private static readonly VALID_CATEGORIES: FeatureCategory[] = [
    'chart', 
    'interpretation', 
    'sharing', 
    'analysis'
  ];

  static validateRequestHeaders(request: Request): { 
    isValid: boolean; 
    error?: string 
  } {
    // Check content length
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return { isValid: false, error: 'Request body is required' };
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return { isValid: false, error: 'Content-Type must be application/json' };
    }

    return { isValid: true };
  }

  static async parseRequestBody(request: Request): Promise<{ 
    data?: any; 
    error?: string 
  }> {
    try {
      const body = await request.json();
      return { data: body };
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return { error: 'Invalid JSON format' };
    }
  }

  static validateFeature(feature: any): string | null {
    if (!feature.id || typeof feature.id !== 'string') {
      return 'Feature must have a valid id';
    }

    if (!feature.name || typeof feature.name !== 'string') {
      return 'Feature must have a valid name';
    }

    if (!feature.description || typeof feature.description !== 'string') {
      return 'Feature must have a valid description';
    }

    if (!feature.category || !this.VALID_CATEGORIES.includes(feature.category)) {
      return `Feature category must be one of: ${this.VALID_CATEGORIES.join(', ')}`;
    }

    if (typeof feature.isEnabled !== 'boolean') {
      return 'Feature isEnabled must be a boolean';
    }

    if (typeof feature.isPremium !== 'boolean') {
      return 'Feature isPremium must be a boolean';
    }

    if (feature.component && typeof feature.component !== 'string') {
      return 'Feature component must be a string if provided';
    }

    if (feature.section && typeof feature.section !== 'string') {
      return 'Feature section must be a string if provided';
    }

    if (feature.sortOrder !== undefined && typeof feature.sortOrder !== 'number') {
      return 'Feature sortOrder must be a number if provided';
    }

    return null;
  }

  static validateBulkUpdateRequest(body: any): { 
    valid: boolean; 
    features?: PremiumFeature[]; 
    error?: string 
  } {
    if (!body.features) {
      return { valid: false, error: 'Features array is required' };
    }

    if (!Array.isArray(body.features)) {
      return { valid: false, error: 'Features must be an array' };
    }

    if (body.features.length === 0) {
      return { valid: false, error: 'Features array cannot be empty' };
    }

    // Validate each feature
    for (let i = 0; i < body.features.length; i++) {
      const error = this.validateFeature(body.features[i]);
      if (error) {
        return { valid: false, error: `Feature at index ${i}: ${error}` };
      }
    }

    return { valid: true, features: body.features };
  }

  static validateUpdateRequest(body: any): { 
    valid: boolean; 
    request?: UpdateFeatureRequest; 
    error?: string 
  } {
    if (!body.featureId || typeof body.featureId !== 'string') {
      return { valid: false, error: 'Feature ID is required and must be a string' };
    }

    if (!body.updates || typeof body.updates !== 'object') {
      return { valid: false, error: 'Updates object is required' };
    }

    // Check if updates object has at least one valid field
    const validUpdateFields = [
      'name', 'description', 'category', 'isEnabled', 
      'isPremium', 'component', 'section', 'sortOrder'
    ];
    
    const hasValidField = Object.keys(body.updates).some(key => 
      validUpdateFields.includes(key)
    );

    if (!hasValidField) {
      return { 
        valid: false, 
        error: `Updates must contain at least one of: ${validUpdateFields.join(', ')}` 
      };
    }

    // Validate category if provided
    if (body.updates.category && !this.VALID_CATEGORIES.includes(body.updates.category)) {
      return { 
        valid: false, 
        error: `Category must be one of: ${this.VALID_CATEGORIES.join(', ')}` 
      };
    }

    // Validate boolean fields
    if (body.updates.isEnabled !== undefined && typeof body.updates.isEnabled !== 'boolean') {
      return { valid: false, error: 'isEnabled must be a boolean' };
    }

    if (body.updates.isPremium !== undefined && typeof body.updates.isPremium !== 'boolean') {
      return { valid: false, error: 'isPremium must be a boolean' };
    }

    // Validate number fields
    if (body.updates.sortOrder !== undefined && typeof body.updates.sortOrder !== 'number') {
      return { valid: false, error: 'sortOrder must be a number' };
    }

    return { 
      valid: true, 
      request: {
        featureId: body.featureId,
        updates: body.updates
      }
    };
  }

  static sanitizeFeature(feature: any): PremiumFeature {
    return {
      id: String(feature.id).trim(),
      name: String(feature.name).trim(),
      description: String(feature.description).trim(),
      category: feature.category as FeatureCategory,
      isEnabled: Boolean(feature.isEnabled),
      isPremium: Boolean(feature.isPremium),
      component: feature.component ? String(feature.component).trim() : undefined,
      section: feature.section ? String(feature.section).trim() : undefined,
      sortOrder: typeof feature.sortOrder === 'number' ? feature.sortOrder : 0,
      createdAt: feature.createdAt instanceof Date ? feature.createdAt : undefined,
      updatedAt: feature.updatedAt instanceof Date ? feature.updatedAt : undefined
    };
  }
}