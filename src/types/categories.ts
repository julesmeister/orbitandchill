/* eslint-disable @typescript-eslint/no-unused-vars */

// Database entity interface (matches schema.ts)
export interface CategoryEntity {
  id: string;
  name: string;
  description: string | null;
  color: string;
  sortOrder: number;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend interface (for API responses and UI)
export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Form interface for creating/editing categories
export interface CategoryFormData {
  name: string;
  description?: string;
  color: string;
  sortOrder?: number;
  isActive?: boolean;
}

// API response interfaces
export interface CategoryListResponse {
  success: boolean;
  categories: Category[];
  fallback?: boolean;
  message?: string;
}

export interface CategoryResponse {
  success: boolean;
  category?: Category;
  error?: string;
  fallback?: boolean;
}

// Service response interfaces (following API_DATABASE_PROTOCOL.md patterns)
export interface CategoryServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fallback?: boolean;
}

// For bulk operations
export interface BulkCategoryOperation {
  action: 'create' | 'update' | 'delete' | 'reorder';
  categories: CategoryFormData[];
}

// For legacy compatibility with existing components
export interface LegacyCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}

// Default category data
export const DEFAULT_CATEGORY_DATA = {
  color: '#6bdbff',
  sortOrder: 0,
  isActive: true,
  isDefault: false,
  usageCount: 0
};

// Color constants for categories (Synapsas color mapping)
export const CATEGORY_COLORS = {
  'Natal Chart Analysis': '#6bdbff',
  'Transits & Predictions': '#f2e356',
  'Chart Reading Help': '#51bd94',
  'Synastry & Compatibility': '#ff91e9',
  'Mundane Astrology': '#19181a',
  'Learning Resources': '#6bdbff',
  'General Discussion': '#51bd94',
  'All Categories': '#6bdbff'
} as const;

// Validation rules
export const CATEGORY_VALIDATION = {
  name: {
    minLength: 1,
    maxLength: 100,
    required: true
  },
  description: {
    maxLength: 500,
    required: false
  },
  color: {
    pattern: /^#[0-9A-Fa-f]{6}$/,
    required: true
  }
} as const;