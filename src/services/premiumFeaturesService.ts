/* eslint-disable @typescript-eslint/no-unused-vars */
import { PremiumFeaturesDatabase } from './premiumFeaturesDatabase';
import { PremiumFeaturesTransform } from '@/utils/premiumFeaturesTransform';
import { 
  PremiumFeature, 
  PremiumFeaturesResponse,
  UpdateFeatureRequest 
} from '@/types/premiumFeatures';

export class PremiumFeaturesService {
  /**
   * Get all premium features
   */
  static async getAllFeatures(): Promise<PremiumFeaturesResponse> {
    try {
      // Check if table exists
      const tableExists = await PremiumFeaturesDatabase.checkTableExists();
      
      if (!tableExists) {
        console.warn('⚠️ Premium Features: Table not found');
        return {
          success: true,
          features: [],
          message: 'Premium features table not found. Run migrations to create it.'
        };
      }

      // Get features from database
      const dbRows = await PremiumFeaturesDatabase.getAllFeatures();
      
      // Transform to application format
      const features = PremiumFeaturesTransform.dbRowsToFeatures(dbRows);
      
      // Sort features
      const sortedFeatures = PremiumFeaturesTransform.sortFeatures(features);
      
      return {
        success: true,
        features: sortedFeatures
      };
    } catch (error) {
      console.error('❌ Premium Features Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get premium features'
      };
    }
  }

  /**
   * Update multiple features (bulk update)
   */
  static async bulkUpdateFeatures(features: PremiumFeature[]): Promise<PremiumFeaturesResponse> {
    try {
      // Ensure table exists
      const tableCreated = await PremiumFeaturesDatabase.ensureTableExists();
      if (!tableCreated) {
        return {
          success: false,
          error: 'Failed to create or access database table'
        };
      }

      // Delete all existing features
      await PremiumFeaturesDatabase.deleteAllFeatures();

      // Insert new features
      await PremiumFeaturesDatabase.bulkInsertFeatures(features);

      // Get updated features
      const dbRows = await PremiumFeaturesDatabase.getAllFeatures();
      const updatedFeatures = PremiumFeaturesTransform.dbRowsToFeatures(dbRows);
      const sortedFeatures = PremiumFeaturesTransform.sortFeatures(updatedFeatures);

      return {
        success: true,
        message: 'Premium features updated successfully',
        features: sortedFeatures
      };
    } catch (error) {
      console.error('Error in bulk update:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update premium features'
      };
    }
  }

  /**
   * Update a single feature
   */
  static async updateFeature(request: UpdateFeatureRequest): Promise<PremiumFeaturesResponse> {
    try {
      // Update the feature in database
      const rowsAffected = await PremiumFeaturesDatabase.updateFeature(
        request.featureId,
        request.updates
      );

      if (rowsAffected === 0) {
        return {
          success: false,
          error: 'Feature not found or no changes made'
        };
      }

      // Get the updated feature
      const dbRow = await PremiumFeaturesDatabase.getFeatureById(request.featureId);
      
      if (!dbRow) {
        return {
          success: false,
          error: 'Feature not found after update'
        };
      }

      // Transform to application format
      const updatedFeature = PremiumFeaturesTransform.dbRowToFeature(dbRow);

      return {
        success: true,
        message: 'Feature updated successfully',
        feature: updatedFeature
      };
    } catch (error) {
      console.error('Error updating feature:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update feature'
      };
    }
  }

  /**
   * Get features by category
   */
  static async getFeaturesByCategory(category: string): Promise<PremiumFeaturesResponse> {
    try {
      const result = await this.getAllFeatures();
      
      if (!result.success || !result.features) {
        return result;
      }

      const filteredFeatures = result.features.filter(feature => 
        feature.category === category
      );

      return {
        success: true,
        features: filteredFeatures
      };
    } catch (error) {
      console.error('Error getting features by category:', error);
      return {
        success: false,
        error: 'Failed to get features by category'
      };
    }
  }

  /**
   * Get only enabled features
   */
  static async getEnabledFeatures(): Promise<PremiumFeaturesResponse> {
    try {
      const result = await this.getAllFeatures();
      
      if (!result.success || !result.features) {
        return result;
      }

      const enabledFeatures = PremiumFeaturesTransform.filterEnabled(result.features);

      return {
        success: true,
        features: enabledFeatures
      };
    } catch (error) {
      console.error('Error getting enabled features:', error);
      return {
        success: false,
        error: 'Failed to get enabled features'
      };
    }
  }

  /**
   * Get only premium features
   */
  static async getPremiumFeatures(): Promise<PremiumFeaturesResponse> {
    try {
      const result = await this.getAllFeatures();
      
      if (!result.success || !result.features) {
        return result;
      }

      const premiumFeatures = PremiumFeaturesTransform.filterPremium(result.features);

      return {
        success: true,
        features: premiumFeatures
      };
    } catch (error) {
      console.error('Error getting premium features:', error);
      return {
        success: false,
        error: 'Failed to get premium features'
      };
    }
  }

  /**
   * Initialize default features if table is empty
   */
  static async initializeDefaultFeatures(): Promise<PremiumFeaturesResponse> {
    try {
      // Ensure table exists
      await PremiumFeaturesDatabase.ensureTableExists();

      // Check if features already exist
      const existing = await this.getAllFeatures();
      if (existing.success && existing.features && existing.features.length > 0) {
        return {
          success: true,
          message: 'Features already exist',
          features: existing.features
        };
      }

      // Create default features
      const defaultFeatures: PremiumFeature[] = [
        {
          id: 'basic-chart',
          name: 'Basic Natal Chart',
          description: 'Generate basic natal charts with planet positions',
          category: 'chart',
          isEnabled: true,
          isPremium: false,
          sortOrder: 1
        },
        {
          id: 'detailed-aspects',
          name: 'Detailed Aspects',
          description: 'Advanced aspect analysis with orbs and interpretations',
          category: 'interpretation',
          isEnabled: true,
          isPremium: true,
          sortOrder: 2
        },
        {
          id: 'share-charts',
          name: 'Share Charts',
          description: 'Share natal charts with friends and community',
          category: 'sharing',
          isEnabled: true,
          isPremium: false,
          sortOrder: 3
        }
      ];

      return await this.bulkUpdateFeatures(defaultFeatures);
    } catch (error) {
      console.error('Error initializing default features:', error);
      return {
        success: false,
        error: 'Failed to initialize default features'
      };
    }
  }
}