/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AI_PROVIDERS, useAIConfiguration } from '@/hooks/useAIConfiguration';
import { useAIConfigAdmin } from '@/hooks/usePublicAIConfig';
import { useToast } from '@/hooks/useToast';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { useCustomModelManager } from '@/hooks/useCustomModelManager';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import StatusToast from '@/components/reusable/StatusToast';
import ConfirmationToast from '@/components/reusable/ConfirmationToast';
import ModelSelector from './ModelSelector';
import CustomModelInput from './CustomModelInput';
import ApiKeyInput from './ApiKeyInput';
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
  const { getSelectedAiProvider, customModels, isLoading } = useAIConfiguration(user?.id);
  const { saveConfig } = useAIConfigAdmin();
  
  // Custom hooks
  const { toast, showToast, hideToast } = useToast();
  const { confirmationState, showConfirmation, hideConfirmation } = useConfirmationDialog();
  
  const {
    showCustomModel,
    setShowCustomModel,
    customModel,
    setCustomModel,
    handleAddCustomModel,
    handleDeleteCustomModel
  } = useCustomModelManager({
    userId: user?.id,
    aiProvider,
    onModelChange,
    showToast,
    showConfirmation
  });

  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
    
    // Set default model for the new provider
    const provider = AI_PROVIDERS.find(p => p.id === newProvider);
    if (provider) {
      onModelChange(provider.models[0]);
    }
  };


  const handleSaveToDatabase = async () => {
    if (!aiApiKey.trim()) {
      showToast('Save Failed', 'API key is required to save configuration', 'error');
      return;
    }

    showToast('Saving Configuration', 'Saving AI configuration to database...', 'loading');
    
    const result = await saveConfig({
      provider: aiProvider,
      model: aiModel,
      apiKey: aiApiKey,
      temperature,
      isDefault: true,
      isPublic: true,
      description: 'Admin configuration for public use'
    });

    if (result.success) {
      showToast('Configuration Saved', 'AI configuration saved to database successfully. Now available on all devices!', 'success');
    } else {
      showToast('Save Failed', `Failed to save configuration: ${result.error}`, 'error');
    }
  };


  const availableModels = getSelectedAiProvider(aiProvider)?.models || [];

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
        
        {!showCustomModel ? (
          <ModelSelector
            availableModels={availableModels}
            customModels={customModels}
            aiProvider={aiProvider}
            aiModel={aiModel}
            onModelChange={onModelChange}
            onDeleteCustomModel={handleDeleteCustomModel}
            onShowCustomModel={() => setShowCustomModel(true)}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-space-grotesk font-semibold">Add Custom Model</label>
            </div>
            <CustomModelInput
              customModel={customModel}
              setCustomModel={setCustomModel}
              onAddModel={handleAddCustomModel}
              onCancel={() => {
                setShowCustomModel(false);
                setCustomModel('');
              }}
            />
          </div>
        )}

        <ApiKeyInput
          apiKey={aiApiKey}
          onApiKeyChange={onApiKeyChange}
          onSaveToDatabase={handleSaveToDatabase}
        />

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
        title={confirmationState.title}
        message={confirmationState.message}
        isVisible={confirmationState.isVisible}
        onConfirm={confirmationState.onConfirm}
        onCancel={hideConfirmation}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="red"
      />
    </div>
  );
};

export default AIConfigurationForm;