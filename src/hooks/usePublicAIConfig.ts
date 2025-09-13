/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';

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
 * Hook for accessing public AI configuration from database only
 */
export const usePublicAIConfig = (): UsePublicAIConfigReturn => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Loading AI configuration from database
    
    try {
      // Fetch from database only
      const response = await fetch('/api/admin/ai-config?type=public');
      const result = await response.json();
      
      // Database response received
      
      if (result.success && result.config) {
        // Use database configuration if available and has API key
        if (result.config.apiKey && result.config.apiKey.trim()) {
          // Using database AI configuration
          setConfig(result.config);
          return;
        } else {
          // Database config found but no API key
        }
      } else {
        // No database config found
      }
      
      // Fallback to default configuration (no API key)
      // No valid AI configuration found, using default without API key
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
      console.error('❌ Failed to load AI configuration from database:', error);
      setError('Failed to load AI configuration from database');
      
      // Default config without API key
      // Database error, using default configuration without API key
      setConfig({
        provider: 'openrouter',
        model: 'deepseek/deepseek-r1-distill-llama-70b:free',
        apiKey: '',
        temperature: 0.7,
        isDefault: true,
        isPublic: true,
        description: 'Default configuration - API key needed'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

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