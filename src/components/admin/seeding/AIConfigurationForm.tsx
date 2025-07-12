/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AI_PROVIDERS, useAIConfiguration } from '@/hooks/useAIConfiguration';

interface AIConfigurationFormProps {
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  onTemperatureChange: (temperature: number) => void;
}

const AIConfigurationForm: React.FC<AIConfigurationFormProps> = ({
  aiProvider,
  aiModel,
  aiApiKey,
  temperature,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onTemperatureChange,
}) => {
  const { getSelectedAiProvider } = useAIConfiguration();

  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
    
    // Set default model for the new provider
    const provider = AI_PROVIDERS.find(p => p.id === newProvider);
    if (provider) {
      onModelChange(provider.models[0]);
    }
  };

  return (
    <div className="bg-white border border-black">
      <div className="p-4 border-b border-black bg-purple-200">
        <h2 className="font-space-grotesk font-semibold text-black">
          AI Configuration
        </h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-space-grotesk font-semibold mb-2">AI Provider</label>
          <select
            value={aiProvider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full p-2 border border-black font-open-sans"
          >
            {AI_PROVIDERS.map(provider => (
              <option key={provider.id} value={provider.id}>{provider.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-space-grotesk font-semibold mb-2">Model</label>
          <select
            value={aiModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full p-2 border border-black font-open-sans"
          >
            {getSelectedAiProvider(aiProvider)?.models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-space-grotesk font-semibold mb-2">API Key</label>
          <input
            type="password"
            value={aiApiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your AI API key..."
            className="w-full p-2 border border-black font-open-sans"
          />
          {!aiApiKey ? (
            <p className="text-xs text-red-600 mt-1 font-open-sans">
              API key required for AI transformation
            </p>
          ) : (
            <p className="text-xs text-green-600 mt-1 font-open-sans">
              ✓ API key saved (will persist across sessions)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-space-grotesk font-semibold mb-2">
            Creativity Level: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Conservative</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 border border-gray-300">
          <h4 className="text-sm font-space-grotesk font-semibold mb-2">AI Will:</h4>
          <ul className="text-xs text-gray-600 font-open-sans space-y-1">
            <li>• Rephrase content to make it unique</li>
            <li>• Reorganize thoughts for better flow</li>
            <li>• Assign content to user personas</li>
            <li>• Generate relevant categories and tags</li>
            <li>• Create natural discussion threading</li>
          </ul>
          {aiProvider === 'deepseek' && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-800 font-open-sans">
                <strong>DeepSeek R1 Distill Llama 70B:</strong> Free tier available via OpenRouter. 
                Get your API key at <span className="font-mono">openrouter.ai</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIConfigurationForm;