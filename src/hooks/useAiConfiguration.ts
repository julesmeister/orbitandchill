/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';

// AI provider options with OpenRouter models
export const AI_PROVIDERS = [
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    models: [
      'deepseek/deepseek-r1-distill-llama-70b:free',
      'microsoft/wizardlm-2-8x22b:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'qwen/qwen-2.5-72b-instruct:free',
      'google/gemma-2-9b-it:free',
      'mistralai/mistral-7b-instruct:free'
    ] 
  },
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', models: ['claude-3-haiku', 'claude-3-sonnet'] },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-r1-distill-llama-70b'] }
];

// Custom model interface
export interface CustomAiModel {
  id: string;
  userId: string;
  providerId: string;
  modelName: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define mood options with emojis
export const MOOD_OPTIONS = [
  { emoji: '😊', name: 'supportive', description: 'Positive & encouraging' },
  { emoji: '🤔', name: 'questioning', description: 'Curious & analytical' },
  { emoji: '😍', name: 'excited', description: 'Enthusiastic & energetic' },
  { emoji: '😌', name: 'wise', description: 'Calm & insightful' },
  { emoji: '😕', name: 'concerned', description: 'Worried or cautious' },
  { emoji: '🤗', name: 'empathetic', description: 'Understanding & caring' }
];

export const useAIConfiguration = (userId?: string) => {
  const [customModels, setCustomModels] = useState<CustomAiModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load custom models for the user
  const loadCustomModels = useCallback(async () => {
    if (!userId) {
      console.log('No userId provided to loadCustomModels');
      return;
    }
    
    console.log('Loading custom models for userId:', userId);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/custom-ai-models?userId=${userId}`);
      const result = await response.json();
      
      console.log('Custom models response:', result);
      
      if (result.success) {
        setCustomModels(result.models);
        console.log('Loaded custom models:', result.models);
      } else {
        console.error('Failed to load custom models:', result.error);
      }
    } catch (error) {
      console.error('Failed to load custom models:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Add a new custom model
  const addCustomModel = useCallback(async (
    providerId: string,
    modelName: string,
    displayName: string,
    description?: string
  ) => {
    if (!userId) return { success: false, error: 'User ID required' };
    
    try {
      const response = await fetch('/api/admin/custom-ai-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          providerId,
          modelName,
          displayName,
          description
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCustomModels(prev => [...prev, result.model]);
        return { success: true, model: result.model };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to add custom model:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }, [userId]);

  // Remove a custom model
  const removeCustomModel = useCallback(async (modelId: string) => {
    if (!userId) return { success: false, error: 'User ID required' };
    
    try {
      const response = await fetch('/api/admin/custom-ai-models', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, modelId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCustomModels(prev => prev.filter(model => model.id !== modelId));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to remove custom model:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }, [userId]);

  // Get enhanced provider with custom models
  const getSelectedAiProvider = useCallback((aiProvider: string) => {
    const baseProvider = AI_PROVIDERS.find(p => p.id === aiProvider);
    if (!baseProvider) return null;

    // Get custom models for this provider
    const providerCustomModels = customModels
      .filter(model => model.providerId === aiProvider && model.isActive)
      .map(model => model.modelName);

    // Remove duplicates - don't add custom models that are already in the base provider
    const uniqueCustomModels = providerCustomModels.filter(
      customModel => !baseProvider.models.includes(customModel)
    );

    return {
      ...baseProvider,
      models: [...baseProvider.models, ...uniqueCustomModels]
    };
  }, [customModels]);

  const getAiConfig = (aiProvider: string, aiModel: string, apiKey: string, temperature: number) => ({
    provider: aiProvider,
    model: aiModel,
    apiKey,
    temperature
  });

  // Load custom models when userId changes
  useEffect(() => {
    if (userId) {
      loadCustomModels();
    }
  }, [userId, loadCustomModels]);

  return {
    AI_PROVIDERS,
    MOOD_OPTIONS,
    customModels,
    isLoading,
    getSelectedAiProvider,
    getAiConfig,
    addCustomModel,
    removeCustomModel,
    loadCustomModels,
  };
};