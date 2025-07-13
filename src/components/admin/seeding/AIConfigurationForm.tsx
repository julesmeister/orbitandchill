/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { AI_PROVIDERS, useAIConfiguration } from '@/hooks/useAIConfiguration';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import StatusToast from '@/components/reusable/StatusToast';
import ConfirmationToast from '@/components/reusable/ConfirmationToast';
import { useUserStore } from '@/store/userStore';

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
  const { user } = useUserStore();
  const { getSelectedAiProvider, addCustomModel, removeCustomModel, customModels, isLoading } = useAIConfiguration(user?.id);
  const [showCustomModel, setShowCustomModel] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    status: 'loading' | 'success' | 'error';
    isVisible: boolean;
  }>({
    title: '',
    message: '',
    status: 'success',
    isVisible: false
  });

  const [confirmationToast, setConfirmationToast] = useState({
    title: '',
    message: '',
    isVisible: false,
    onConfirm: () => {},
    modelToDelete: null as string | null
  });

  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
    
    // Set default model for the new provider
    const provider = AI_PROVIDERS.find(p => p.id === newProvider);
    if (provider) {
      onModelChange(provider.models[0]);
    }
  };

  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error') => {
    setToast({ title, message, status, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleAddCustomModel = async () => {
    if (customModel.trim()) {
      showToast('Adding Model', 'Adding custom AI model...', 'loading');
      
      // Use the model name as display name (simplified)
      const displayName = customModel.trim().includes('/') 
        ? customModel.trim().split('/')[1].replace(':free', '') 
        : customModel.trim();
      
      const result = await addCustomModel(aiProvider, customModel.trim(), displayName);
      if (result.success) {
        onModelChange(customModel.trim());
        setCustomModel('');
        setShowCustomModel(false);
        showToast('Model Added', 'Custom AI model added successfully', 'success');
      } else {
        showToast('Add Failed', `Failed to add custom model: ${result.error}`, 'error');
      }
    }
  };

  const availableModels = getSelectedAiProvider(aiProvider)?.models || [];
  
  // Remove duplicates from availableModels as a safety measure
  const uniqueModels = Array.from(new Set(availableModels));
  
  const handleDeleteCustomModel = (modelId: string, modelName: string) => {
    setConfirmationToast({
      title: 'Delete Custom Model',
      message: `Are you sure you want to delete the custom model "${modelName}"? This action cannot be undone.`,
      isVisible: true,
      modelToDelete: modelId,
      onConfirm: async () => {
        showToast('Deleting Model', 'Removing custom AI model...', 'loading');
        const result = await removeCustomModel(modelId);
        if (result.success) {
          showToast('Model Deleted', 'Custom AI model deleted successfully', 'success');
          // If the deleted model was currently selected, switch to first available model
          if (aiModel === modelName) {
            const remainingModels = uniqueModels.filter(m => m !== modelName);
            if (remainingModels.length > 0) {
              onModelChange(remainingModels[0]);
            }
          }
        } else {
          showToast('Delete Failed', `Failed to delete custom model: ${result.error}`, 'error');
        }
      }
    });
  };

  const modelOptions = uniqueModels.map(model => {
    // Check if this is a custom model
    const customModel = customModels.find(cm => cm.modelName === model && cm.providerId === aiProvider);
    
    return {
      value: model,
      label: customModel 
        ? `${customModel.displayName} (custom)` 
        : (model.includes('/') ? model.split('/')[1].replace(':free', '') : model),
      isCustom: !!customModel,
      customModelId: customModel?.id
    };
  });

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
          <SynapsasDropdown
            options={AI_PROVIDERS.map(provider => ({
              value: provider.id,
              label: provider.name
            }))}
            value={aiProvider}
            onChange={handleProviderChange}
            placeholder="Select AI Provider"
            variant="thin"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-space-grotesk font-semibold">Model</label>
            <button
              onClick={() => setShowCustomModel(!showCustomModel)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              + Add Custom Model
            </button>
          </div>
          
          {!showCustomModel ? (
            <SynapsasDropdown
              options={modelOptions}
              value={aiModel}
              onChange={onModelChange}
              placeholder="Select Model"
              variant="thin"
              onDeleteCustomModel={handleDeleteCustomModel}
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="e.g., anthropic/claude-3-sonnet:beta"
                className="flex-1 p-2 border border-gray-300 font-open-sans text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomModel()}
              />
              <button
                onClick={handleAddCustomModel}
                disabled={!customModel.trim()}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCustomModel(false);
                  setCustomModel('');
                }}
                className="px-3 py-2 bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
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

      {/* Status Toast */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={hideToast}
        duration={toast.status === 'success' ? 3000 : toast.status === 'error' ? 5000 : 0}
      />

      <ConfirmationToast
        title={confirmationToast.title}
        message={confirmationToast.message}
        isVisible={confirmationToast.isVisible}
        onConfirm={confirmationToast.onConfirm}
        onCancel={() => setConfirmationToast(prev => ({ ...prev, isVisible: false }))}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="red"
      />
    </div>
  );
};

export default AIConfigurationForm;