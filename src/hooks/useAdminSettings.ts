/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  AdminSetting, 
  Category, 
  NotificationData, 
  SettingsState, 
  SettingsActions 
} from '@/types/adminSettings';
import { deserializeSettingValue } from '@/utils/adminSettings';

export function useAdminSettings(selectedCategory: string, searchQuery: string) {
  const [state, setState] = useState<SettingsState>({
    settings: [],
    categories: [],
    editedSettings: {},
    expandedCategories: new Set(['seo', 'general', 'analytics', 'email', 'security', 'newsletter', 'premium']),
    isLoading: true,
    isSaving: false,
    isResetting: false,
    notification: null,
  });

  const loadSettings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      if (searchQuery) {
        params.set('search', searchQuery);
      }

      const response = await fetch(`/api/admin/settings?${params}`);
      const data = await response.json();

      if (data.success) {
        // Create a Set with all category names to expand all categories by default
        const allCategories = new Set((data.categories || []).map((cat: any) => cat.category));
        
        setState(prev => ({
          ...prev,
          settings: data.settings || [],
          categories: data.categories || [],
          editedSettings: {},
          expandedCategories: allCategories, // Expand all categories
          isLoading: false,
        }));
      } else {
        showNotification('error', data.error || 'Failed to load settings');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showNotification('error', 'Failed to load settings');
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [selectedCategory, searchQuery]);

  const saveSettings = useCallback(async () => {
    if (Object.keys(state.editedSettings).length === 0) {
      showNotification('error', 'No changes to save');
      return;
    }

    try {
      setState(prev => ({ ...prev, isSaving: true }));
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          settings: state.editedSettings,
          adminUsername: 'System Admin',
          adminUserId: 'debug_admin_1751205318562' // Use the working admin user ID
        })
      });

      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          settings: data.settings || [],
          editedSettings: {},
          isSaving: false,
        }));
        showNotification('success', 'Settings saved successfully');
        
        // Dispatch custom event to notify other components of settings update
        console.log('🔔 Dispatching adminSettingsUpdated event...');
        window.dispatchEvent(new CustomEvent('adminSettingsUpdated'));
      } else {
        showNotification('error', data.error || 'Failed to save settings');
        setState(prev => ({ ...prev, isSaving: false }));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('error', 'Failed to save settings');
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.editedSettings]);

  const resetSettings = useCallback(async (category?: string) => {
    const categoryName = category === 'all' ? '' : category;
    if (!confirm(`Reset all ${categoryName ? categoryName + ' ' : ''}settings to defaults?`)) {
      return;
    }

    try {
      setState(prev => ({ ...prev, isResetting: true }));
      
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          category: category === 'all' ? undefined : category,
          adminUsername: 'System Admin',
          adminUserId: 'debug_admin_1751205318562' // Use the working admin user ID
        })
      });

      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          settings: data.settings || [],
          editedSettings: {},
          isResetting: false,
        }));
        showNotification('success', 'Settings reset to defaults');
        
        // Dispatch custom event to notify other components of settings update
        window.dispatchEvent(new CustomEvent('adminSettingsUpdated'));
      } else {
        showNotification('error', data.error || 'Failed to reset settings');
        setState(prev => ({ ...prev, isResetting: false }));
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showNotification('error', 'Failed to reset settings');
      setState(prev => ({ ...prev, isResetting: false }));
    }
  }, []);

  const updateSetting = useCallback((key: string, value: any, type: string) => {
    setState(prev => ({
      ...prev,
      editedSettings: {
        ...prev.editedSettings,
        [key]: value
      }
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedCategories);
      if (newExpanded.has(category)) {
        newExpanded.delete(category);
      } else {
        newExpanded.add(category);
      }
      return {
        ...prev,
        expandedCategories: newExpanded
      };
    });
  }, []);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setState(prev => ({
      ...prev,
      notification: { type, message }
    }));
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        notification: null
      }));
    }, 5000);
  }, []);

  const clearNotification = useCallback(() => {
    setState(prev => ({
      ...prev,
      notification: null
    }));
  }, []);

  const getSettingValue = useCallback((setting: AdminSetting) => {
    if (state.editedSettings.hasOwnProperty(setting.key)) {
      return state.editedSettings[setting.key];
    }
    return deserializeSettingValue(setting);
  }, [state.editedSettings]);

  // Load settings when dependencies change
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const actions: SettingsActions = {
    loadSettings,
    saveSettings,
    resetSettings,
    updateSetting,
    toggleCategory,
    showNotification,
    clearNotification,
    getSettingValue,
  };

  const computed = {
    hasUnsavedChanges: Object.keys(state.editedSettings).length > 0,
    editedSettingsCount: Object.keys(state.editedSettings).length,
  };

  return {
    ...state,
    ...actions,
    ...computed,
  };
}