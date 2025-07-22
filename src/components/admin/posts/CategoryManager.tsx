/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';

interface ToastState {
  show: boolean;
  title: string;
  message: string;
  status: 'loading' | 'success' | 'error' | 'info';
}

interface CategoryManagerProps {
  isVisible: boolean;
  onToast: (toast: ToastState) => void;
}

export default function CategoryManager({ isVisible, onToast }: CategoryManagerProps) {
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    fallback: categoriesFallback,
    addCategory,
    updateCategory: updateCategoryDb,
    deleteCategory: deleteCategoryDb,
    refreshCategories
  } = useCategories();

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{id: string, value: string} | null>(null);

  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.some(cat => cat.name === newCategory.trim())) {
      const success = await addCategory({
        name: newCategory.trim(),
        color: '#6bdbff', // Default color
        description: `Discussion category: ${newCategory.trim()}`
      });
      
      if (success) {
        setNewCategory('');
        onToast({
          show: true,
          title: 'Category Added',
          message: 'Category has been created successfully.',
          status: 'success'
        });
      } else {
        onToast({
          show: true,
          title: 'Add Failed',
          message: 'Failed to create category. Please try again.',
          status: 'error'
        });
      }
    }
  };

  const handleEditCategory = async (categoryId: string, newValue: string) => {
    if (newValue.trim() && !categories.some(cat => cat.name === newValue.trim() && cat.id !== categoryId)) {
      const success = await updateCategoryDb(categoryId, { name: newValue.trim() });
      
      if (success) {
        setEditingCategory(null);
        onToast({
          show: true,
          title: 'Category Updated',
          message: 'Category has been updated successfully.',
          status: 'success'
        });
      } else {
        onToast({
          show: true,
          title: 'Update Failed',
          message: 'Failed to update category. Please try again.',
          status: 'error'
        });
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category || category.isDefault) {
      onToast({
        show: true,
        title: 'Delete Failed',
        message: 'Cannot delete default category.',
        status: 'error'
      });
      return;
    }

    const success = await deleteCategoryDb(categoryId);
    
    if (success) {
      onToast({
        show: true,
        title: 'Category Deleted',
        message: 'Category has been deleted successfully.',
        status: 'success'
      });
    } else {
      onToast({
        show: true,
        title: 'Delete Failed',
        message: 'Failed to delete category. Please try again.',
        status: 'error'
      });
    }
  };

  const handleResetCategories = async () => {
    await refreshCategories();
    onToast({
      show: true,
      title: 'Categories Reset',
      message: 'Categories have been reset to defaults.',
      status: 'success'
    });
  };

  const handleRecalculateUsage = async () => {
    onToast({
      show: true,
      title: 'Recalculating Usage',
      message: 'Updating category usage counts based on actual posts...',
      status: 'loading'
    });

    try {
      const response = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recalculate-usage' })
      });

      const result = await response.json();

      if (result.success) {
        await refreshCategories();
        
        onToast({
          show: true,
          title: 'Usage Counts Updated',
          message: `Successfully updated usage counts for ${result.meta?.categoriesUpdated || 0} categories.`,
          status: 'success'
        });
      } else {
        onToast({
          show: true,
          title: 'Update Failed',
          message: result.error || 'Failed to recalculate usage counts.',
          status: 'error'
        });
      }
    } catch (error) {
      onToast({
        show: true,
        title: 'Update Failed',
        message: 'Network error while recalculating usage counts.',
        status: 'error'
      });
    }
  };

  const handleCleanupCategoryNames = async () => {
    onToast({
      show: true,
      title: 'Cleaning Names',
      message: 'Removing trailing numbers from category names...',
      status: 'loading'
    });

    try {
      const response = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup-names' })
      });

      const result = await response.json();

      if (result.success) {
        await refreshCategories();
        
        const changesCount = Object.keys(result.data || {}).length;
        onToast({
          show: true,
          title: 'Names Cleaned',
          message: changesCount > 0 
            ? `Successfully cleaned ${changesCount} category names.`
            : 'All category names were already clean.',
          status: 'success'
        });
      } else {
        onToast({
          show: true,
          title: 'Cleanup Failed',
          message: result.error || 'Failed to cleanup category names.',
          status: 'error'
        });
      }
    } catch (error) {
      onToast({
        show: true,
        title: 'Cleanup Failed',
        message: 'Network error while cleaning category names.',
        status: 'error'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white border border-black p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black font-space-grotesk">Manage Categories</h3>
        <div className="flex gap-2">
          <button
            onClick={handleResetCategories}
            className="bg-gray-100 text-black px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200 font-open-sans border border-black"
            title="Reset to default categories"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleRecalculateUsage}
            className="bg-[#51bd94] text-black px-3 py-2 text-sm font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black"
            title="Recalculate usage counts based on actual posts"
          >
            Fix Usage Counts
          </button>
          <button
            onClick={handleCleanupCategoryNames}
            className="bg-[#f2e356] text-black px-3 py-2 text-sm font-medium hover:bg-[#e8d650] transition-colors duration-200 font-open-sans border border-black"
            title="Remove trailing numbers from category names"
          >
            Clean Names
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Add New Category */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category..."
            className="flex-1 px-3 py-2 border border-black bg-white text-black placeholder-gray-500 font-open-sans focus:outline-none focus:ring-2 focus:ring-black/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="bg-[#51bd94] text-black px-4 py-2 font-medium hover:bg-[#4aa384] transition-colors duration-200 font-open-sans border border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        
        {/* Categories List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-open-sans">
              Current categories ({categories.length})
              {categoriesFallback && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-300">
                  Fallback Mode
                </span>
              )}
              {categoriesLoading && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-300">
                  Loading...
                </span>
              )}
            </p>
            {categoriesError && (
              <button
                onClick={refreshCategories}
                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded border border-red-300 hover:bg-red-200 transition-colors"
                title="Retry loading categories"
              >
                Retry
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 bg-gray-50 border border-black p-2">
                {editingCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editingCategory.value}
                    onChange={(e) => setEditingCategory({id: category.id, value: e.target.value})}
                    className="flex-1 px-2 py-1 border border-black bg-white text-black font-open-sans text-sm focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleEditCategory(category.id, editingCategory.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingCategory(null);
                      }
                    }}
                    onBlur={() => setEditingCategory(null)}
                    autoFocus
                  />
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-black"
                      style={{ backgroundColor: category.color }}
                      title={`Color: ${category.color}`}
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-black font-open-sans">
                        {category.name}
                        {category.isDefault && (
                          <span className="ml-1 text-xs text-gray-500">(default)</span>
                        )}
                      </span>
                      {category.usageCount >= 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-gray-500 rounded-full">
                          {category.usageCount}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingCategory({id: category.id, value: category.name})}
                    className="p-1 text-gray-600 hover:text-black hover:bg-white border border-transparent hover:border-black transition-all duration-200"
                    title="Edit category"
                    disabled={categoriesLoading}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {!category.isDefault && (
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-white border border-transparent hover:border-red-600 transition-all duration-200"
                      title="Delete category"
                      disabled={categoriesLoading}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}