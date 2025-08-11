/* eslint-disable @typescript-eslint/no-unused-vars */

export type FeatureCategory = 'chart' | 'interpretation' | 'sharing' | 'analysis';

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  isEnabled: boolean;
  isPremium: boolean;
  component?: string;
  section?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DatabaseRow {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: number | boolean;
  is_premium: number | boolean;
  component?: string;
  section?: string;
  sort_order?: number;
  created_at?: string | number;
  updated_at?: string | number;
}

export interface UpdateFeatureRequest {
  featureId: string;
  updates: Partial<{
    name: string;
    description: string;
    category: FeatureCategory;
    isEnabled: boolean;
    isPremium: boolean;
    component: string;
    section: string;
    sortOrder: number;
  }>;
}

export interface BulkUpdateFeaturesRequest {
  features: PremiumFeature[];
}

export interface PremiumFeaturesResponse {
  success: boolean;
  features?: PremiumFeature[];
  feature?: PremiumFeature;
  message?: string;
  error?: string;
}