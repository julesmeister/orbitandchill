/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryFormData } from '@/types/categories';
import { getFallbackCategories } from '@/db/services/categoryService';

// Hook state interface
interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fallback: boolean;
}

// Hook return interface
interface UseCategoriesReturn {
  // State
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fallback: boolean;
  
  // Actions
  loadCategories: () => Promise<void>;
  addCategory: (category: CategoryFormData) => Promise<boolean>;
  updateCategory: (id: string, updates: Partial<CategoryFormData>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Utilities
  getCategoryById: (id: string) => Category | undefined;
  getCategoryByName: (name: string) => Category | undefined;
  refreshCategories: () => Promise<void>;
}

/**
 * Custom hook for category management with database integration and fallback patterns
 * Following API_DATABASE_PROTOCOL.md hook integration patterns
 */
export const useCategories = (): UseCategoriesReturn => {
  const [state, setState] = useState<CategoriesState>({
    categories: [],
    isLoading: true,
    error: null,
    fallback: false
  });

  /**
   * Load categories from API with fallback to local data
   * Following API_DATABASE_PROTOCOL.md resilience patterns
   */
  const loadCategories = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/categories');
      const result = await response.json();

      if (result.success) {
        setState({
          categories: result.categories || [],
          isLoading: false,
          error: null,
          fallback: result.fallback || false
        });
      } else {
        // API failed, use fallback categories
        console.warn('Categories API failed:', result.error);
        setState({
          categories: getFallbackCategories(),
          isLoading: false,
          error: result.error || 'Failed to load categories',
          fallback: true
        });
      }
    } catch (error) {
      // Network error, use fallback categories
      console.error('Failed to fetch categories:', error);
      setState({
        categories: getFallbackCategories(),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Network error',
        fallback: true
      });
    }
  }, []);

  /**
   * Add new category with optimistic updates
   * Following API_DATABASE_PROTOCOL.md optimistic update patterns
   */
  const addCategory = useCallback(async (categoryData: CategoryFormData): Promise<boolean> => {
    try {
      // Optimistic update: add immediately to UI
      const optimisticCategory: Category = {
        id: `temp_${Date.now()}`,
        name: categoryData.name,
        description: categoryData.description,
        color: categoryData.color,
        sortOrder: categoryData.sortOrder || state.categories.length,
        isActive: categoryData.isActive ?? true,
        isDefault: false,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setState(prev => ({
        ...prev,
        categories: [...prev.categories, optimisticCategory]
      }));

      // Async API call
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      const result = await response.json();

      if (result.success) {
        // Replace optimistic category with real one
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === optimisticCategory.id ? result.category : cat
          ),
          fallback: false
        }));
        return true;
      } else {
        // Rollback optimistic update on failure
        setState(prev => ({
          ...prev,
          categories: prev.categories.filter(cat => cat.id !== optimisticCategory.id),
          error: result.error || 'Failed to create category'
        }));
        return false;
      }
    } catch (error) {
      // Rollback on network error but keep optimistic update (offline mode)
      console.warn('Failed to save category to server:', error);
      return true; // Keep optimistic update
    }
  }, [state.categories.length]);

  /**
   * Update existing category with optimistic updates
   * Following API_DATABASE_PROTOCOL.md update patterns
   */
  const updateCategory = useCallback(async (
    categoryId: string, 
    updates: Partial<CategoryFormData>
  ): Promise<boolean> => {
    const originalCategory = state.categories.find(cat => cat.id === categoryId);
    if (!originalCategory) return false;

    try {
      // Optimistic update
      const updatedCategory = { 
        ...originalCategory, 
        ...updates, 
        updatedAt: new Date() 
      };

      setState(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === categoryId ? updatedCategory : cat
        )
      }));

      // Async API call
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const result = await response.json();

      if (result.success) {
        // Update with server response
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === categoryId ? result.category : cat
          ),
          fallback: false
        }));
        return true;
      } else {
        // Rollback on failure
        setState(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === categoryId ? originalCategory : cat
          ),
          error: result.error || 'Failed to update category'
        }));
        return false;
      }
    } catch (error) {
      // Keep optimistic update on network error
      console.warn('Failed to update category on server:', error);
      return true;
    }
  }, [state.categories]);

  /**
   * Delete category with optimistic updates
   * Following API_DATABASE_PROTOCOL.md deletion patterns
   */
  const deleteCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    const categoryToDelete = state.categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return false;

    // Prevent deletion of default categories
    if (categoryToDelete.isDefault) {
      setState(prev => ({ ...prev, error: 'Cannot delete default category' }));
      return false;
    }

    try {
      // Optimistic update: remove immediately
      setState(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.id !== categoryId)
      }));

      // Async API call
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        // Deletion confirmed
        setState(prev => ({ ...prev, fallback: false }));
        return true;
      } else {
        // Rollback on failure
        setState(prev => ({
          ...prev,
          categories: [...prev.categories, categoryToDelete].sort(
            (a, b) => a.sortOrder - b.sortOrder
          ),
          error: result.error || 'Failed to delete category'
        }));
        return false;
      }
    } catch (error) {
      // Keep optimistic deletion on network error
      console.warn('Failed to delete category on server:', error);
      return true;
    }
  }, [state.categories]);

  /**
   * Utility: Get category by ID
   */
  const getCategoryById = useCallback((id: string): Category | undefined => {
    return state.categories.find(cat => cat.id === id);
  }, [state.categories]);

  /**
   * Utility: Get category by name
   */
  const getCategoryByName = useCallback((name: string): Category | undefined => {
    return state.categories.find(cat => cat.name === name);
  }, [state.categories]);

  /**
   * Refresh categories (alias for loadCategories)
   */
  const refreshCategories = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  /**
   * Load categories on component mount
   * Following API_DATABASE_PROTOCOL.md initialization patterns
   */
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    // State
    categories: state.categories,
    isLoading: state.isLoading,
    error: state.error,
    fallback: state.fallback,
    
    // Actions
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Utilities
    getCategoryById,
    getCategoryByName,
    refreshCategories
  };
};