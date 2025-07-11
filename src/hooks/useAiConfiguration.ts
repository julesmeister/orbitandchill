/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';

// AI provider options
const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', models: ['claude-3-haiku', 'claude-3-sonnet'] },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-r1-distill-llama-70b'] }
];

interface UseAiConfigurationReturn {
  // State
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
  
  // Computed
  selectedProvider: typeof AI_PROVIDERS[0] | undefined;
  
  // Actions
  setAiProvider: (provider: string) => void;
  setAiModel: (model: string) => void;
  setAiApiKey: (apiKey: string) => void;
  setTemperature: (temp: number) => void;
  
  // Utils
  getAiConfig: () => {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
  };
}

export const useAiConfiguration = (): UseAiConfigurationReturn => {
  const [aiProvider, setAiProviderState] = useState('deepseek');
  const [aiModel, setAiModelState] = useState('deepseek-r1-distill-llama-70b');
  const [aiApiKey, setAiApiKeyState] = useState('');
  const [temperature, setTemperatureState] = useState(0.7);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('seeding_ai_api_key');
    const savedProvider = localStorage.getItem('seeding_ai_provider');
    const savedTemperature = localStorage.getItem('seeding_ai_temperature');
    
    if (savedApiKey) {
      setAiApiKeyState(savedApiKey);
    }
    if (savedProvider && AI_PROVIDERS.find(p => p.id === savedProvider)) {
      setAiProviderState(savedProvider);
      // Set default model for the saved provider
      const provider = AI_PROVIDERS.find(p => p.id === savedProvider);
      if (provider) {
        setAiModelState(provider.models[0]);
      }
    }
    if (savedTemperature) {
      setTemperatureState(parseFloat(savedTemperature));
    }
  }, []);

  // Handler for API key changes with localStorage persistence
  const setAiApiKey = useCallback((newApiKey: string) => {
    setAiApiKeyState(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem('seeding_ai_api_key', newApiKey);
    } else {
      localStorage.removeItem('seeding_ai_api_key');
    }
  }, []);

  // Handler for provider changes with localStorage persistence
  const setAiProvider = useCallback((newProvider: string) => {
    setAiProviderState(newProvider);
    localStorage.setItem('seeding_ai_provider', newProvider);
    
    // Set default model for the new provider
    const provider = AI_PROVIDERS.find(p => p.id === newProvider);
    if (provider) {
      setAiModelState(provider.models[0]);
    }
  }, []);

  // Handler for temperature changes with localStorage persistence
  const setTemperature = useCallback((newTemperature: number) => {
    setTemperatureState(newTemperature);
    localStorage.setItem('seeding_ai_temperature', newTemperature.toString());
  }, []);

  // Simple model setter (no localStorage needed as it's derived from provider)
  const setAiModel = useCallback((model: string) => {
    setAiModelState(model);
  }, []);

  // Get the currently selected provider object
  const selectedProvider = AI_PROVIDERS.find(p => p.id === aiProvider);

  // Get complete AI configuration object
  const getAiConfig = useCallback(() => ({
    provider: aiProvider,
    model: aiModel,
    apiKey: aiApiKey,
    temperature
  }), [aiProvider, aiModel, aiApiKey, temperature]);

  return {
    // State
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    
    // Computed
    selectedProvider,
    
    // Actions
    setAiProvider,
    setAiModel,
    setAiApiKey,
    setTemperature,
    
    // Utils
    getAiConfig
  };
};

// Export AI_PROVIDERS for use in components
export { AI_PROVIDERS };