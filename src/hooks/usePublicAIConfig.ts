/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSeedingPersistence } from './useSeedingPersistence';

interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  isDefault?: boolean;
  isPublic?: boolean;
  description?: string;
}

interface UsePublicAIConfigReturn {
  config: AIConfig | null;
  isLoading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  hasValidConfig: boolean;
}

/**
 * Hook for accessing public AI configuration
 * 
 * Priority order:
 * 1. Database configuration (public, set by admin)
 * 2. Fallback to seeding persistence (localStorage)
 * 3. Fallback to default configuration
 */
export const usePublicAIConfig = (): UsePublicAIConfigReturn => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get seeding persistence as fallback
  const { aiProvider, aiModel, aiApiKey, temperature } = useSeedingPersistence();

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, try to fetch from database
      const response = await fetch('/api/admin/ai-config?type=public');
      const result = await response.json();
      
      if (result.success && result.config) {
        // Use database configuration if available and has API key
        if (result.config.apiKey && result.config.apiKey.trim()) {
          console.log('✅ Using database AI configuration');
          setConfig(result.config);
          return;
        } else {
          console.log('⚠️ Database config found but no API key, falling back to localStorage');
        }
      }
      
      // Fallback to seeding persistence (localStorage)
      if (aiApiKey && aiApiKey.trim()) {
        console.log('✅ Using localStorage AI configuration');
        setConfig({
          provider: aiProvider,
          model: aiModel,
          apiKey: aiApiKey,
          temperature,
          isDefault: false,
          isPublic: false,
          description: 'Local configuration from admin seeding'
        });
        return;
      }
      
      // Final fallback to default configuration (no API key)
      console.log('⚠️ No valid AI configuration found, using default without API key');
      setConfig({
        provider: 'openrouter',
        model: 'deepseek/deepseek-r1-distill-llama-70b:free',
        apiKey: '',
        temperature: 0.7,
        isDefault: true,
        isPublic: true,
        description: 'Default configuration - API key needed'
      });
      
    } catch (error) {
      console.error('Failed to load AI configuration:', error);
      setError('Failed to load AI configuration');
      
      // Even on error, try to use localStorage fallback
      if (aiApiKey && aiApiKey.trim()) {
        console.log('✅ Using localStorage AI configuration (after error)');
        setConfig({
          provider: aiProvider,
          model: aiModel,
          apiKey: aiApiKey,
          temperature,
          isDefault: false,
          isPublic: false,
          description: 'Local configuration from admin seeding'
        });
      } else {
        // Default config without API key
        setConfig({
          provider: 'openrouter',
          model: 'deepseek/deepseek-r1-distill-llama-70b:free',
          apiKey: '',
          temperature: 0.7,
          isDefault: true,
          isPublic: true,
          description: 'Default configuration - API key needed'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [aiProvider, aiModel, aiApiKey, temperature]);

  const refreshConfig = useCallback(async () => {
    await loadConfig();
  }, [loadConfig]);

  // Load configuration on mount and when localStorage values change
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Check if we have a valid configuration with API key
  const hasValidConfig = config !== null && config.apiKey.trim() !== '';

  return {
    config,
    isLoading,
    error,
    refreshConfig,
    hasValidConfig
  };
};

/**
 * Hook for managing AI configuration (admin use)
 */
export const useAIConfigAdmin = () => {
  const { refreshConfig } = usePublicAIConfig();
  
  const saveConfig = useCallback(async (config: {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
    isDefault?: boolean;
    isPublic?: boolean;
    description?: string;
  }) => {
    try {
      const response = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the public config after saving
        await refreshConfig();
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to save AI configuration:', error);
      return { success: false, error: 'Failed to save AI configuration' };
    }
  }, [refreshConfig]);

  return {
    saveConfig,
    refreshConfig
  };
};