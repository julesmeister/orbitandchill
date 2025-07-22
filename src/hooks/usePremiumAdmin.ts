/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { PremiumFeature } from '@/types/premium';

interface UsePremiumAdminReturn {
  features: PremiumFeature[];
  setFeatures: (features: PremiumFeature[]) => void;
  hasChanges: boolean;
  isLoading: boolean;
  loadFeatures: () => Promise<void>;
  saveChanges: () => Promise<boolean>;
  handleFeatureToggle: (featureId: string, field: 'isEnabled' | 'isPremium') => void;
  handleToggleAll: (field: 'isEnabled' | 'isPremium', value: boolean) => void;
  resetToDefaults: () => void;
}

export function usePremiumAdmin(
  showToast?: (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => void
): UsePremiumAdminReturn {
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalFeatures, setOriginalFeatures] = useState<PremiumFeature[]>([]);

  // Load features from API
  const loadFeatures = async () => {
    console.log('🎯 [usePremiumAdmin] Loading premium features...');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/premium-features');
      console.log('📡 [usePremiumAdmin] Response status:', response.status);
      const data = await response.json();
      console.log('📦 [usePremiumAdmin] Response data:', data);
      
      if (data.success) {
        console.log(`✅ [usePremiumAdmin] Loaded ${data.features?.length || 0} features`);
        const loadedFeatures = data.features || [];
        setFeatures(loadedFeatures);
        setOriginalFeatures(loadedFeatures);
        setHasChanges(false);
        
        if (data.message && showToast) {
          console.warn('⚠️ [usePremiumAdmin] Message from API:', data.message);
          showToast('Notice', data.message, 'info');
        }
      } else {
        console.error('❌ [usePremiumAdmin] Failed to load features:', data.error);
        if (showToast) {
          showToast('Error', 'Failed to load premium features', 'error');
        }
      }
    } catch (error) {
      console.error('❌ [usePremiumAdmin] Error loading features:', error);
      if (showToast) {
        showToast('Error', 'Failed to load premium features', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save changes to API
  const saveChanges = async (): Promise<boolean> => {
    try {
      if (showToast) {
        showToast('Saving', 'Saving premium features settings...', 'loading');
      }
      
      const response = await fetch('/api/admin/premium-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      const data = await response.json();

      if (data.success) {
        if (showToast) {
          showToast('Success', 'Premium features settings saved successfully!', 'success');
        }
        setHasChanges(false);
        setOriginalFeatures(features);
        
        // Also save to localStorage as backup
        localStorage.setItem('premium-features', JSON.stringify(features));
        return true;
      } else {
        console.error('Failed to save features:', data.error);
        if (showToast) {
          showToast('Error', `Failed to save: ${data.error}`, 'error');
        }
        return false;
      }
    } catch (error) {
      console.error('Error saving features:', error);
      if (showToast) {
        showToast('Error', 'Failed to save premium features settings', 'error');
      }
      return false;
    }
  };

  // Toggle individual feature
  const handleFeatureToggle = (featureId: string, field: 'isEnabled' | 'isPremium') => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, [field]: !feature[field] }
        : feature
    ));
    setHasChanges(true);
  };

  // Toggle all features
  const handleToggleAll = (field: 'isEnabled' | 'isPremium', value: boolean) => {
    setFeatures(prev => prev.map(feature => ({ ...feature, [field]: value })));
    setHasChanges(true);
    
    if (showToast) {
      showToast(
        value ? 'Enabled All' : 'Disabled All',
        `${value ? 'Enabled' : 'Disabled'} all ${field === 'isEnabled' ? 'features' : 'premium status'} for visible features`,
        'info'
      );
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (showToast) {
      showToast('Info', 'Reset to defaults functionality coming soon', 'info');
    }
  };

  // Load features on mount
  useEffect(() => {
    loadFeatures();
  }, []);

  return {
    features,
    setFeatures,
    hasChanges,
    isLoading,
    loadFeatures,
    saveChanges,
    handleFeatureToggle,
    handleToggleAll,
    resetToDefaults
  };
}