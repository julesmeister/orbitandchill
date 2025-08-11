/* eslint-disable @typescript-eslint/no-unused-vars */

export interface CustomAIModel {
  id: string;
  userId: string;
  providerId: string;
  modelName: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomModelCreateRequest {
  userId: string;
  providerId: string;
  modelName: string;
  displayName: string;
  description?: string;
}

export interface CustomModelDeleteRequest {
  userId: string;
  modelId: string;
}

export interface CustomModelResponse {
  success: boolean;
  models?: CustomAIModel[];
  model?: CustomAIModel;
  message?: string;
  error?: string;
  fallback?: boolean;
}

export interface DatabaseRow {
  id: string;
  user_id: string;
  provider_id: string;
  model_name: string;
  display_name: string;
  description: string | null;
  is_active: number;
  is_default: number;
  usage_count: number;
  last_used: number | null;
  created_at: number;
  updated_at: number;
}