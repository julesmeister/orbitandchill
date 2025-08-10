/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { useAIFormState } from '@/hooks/useAIFormState';
import StatusToast from '@/components/reusable/StatusToast';
import ConfirmationToast from '@/components/reusable/ConfirmationToast';
import ModelSelector from './ModelSelector';
import CustomModelInput from './CustomModelInput';
import ApiKeyInput from './ApiKeyInput';
import ProviderSelector from './ProviderSelector';
import TemperatureControl from './TemperatureControl';
import AICapabilitiesInfo from './AICapabilitiesInfo';
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
  
  // Use the custom hook for form state management
  const {
    toast,
    hideToast,
    confirmationState,
    hideConfirmation,
    customModelManager,
    handleSaveToDatabase
  } = useAIFormState({
    userId: user?.id,
    formState: {
      aiProvider,
      aiModel,
      aiApiKey,
      temperature,
      onProviderChange,
      onModelChange,
      onApiKeyChange,
      onTemperatureChange,
    }
  });

  const {
    showCustomModel,
    setShowCustomModel,
    customModel,
    setCustomModel,
    handleAddCustomModel,
    handleDeleteCustomModel
  } = customModelManager;

  const availableModels = getSelectedAiProvider(aiProvider)?.models || [];

  return (
    <div className="bg-white border border-black">
      <div className="p-4 border-b border-black bg-purple-200">
        <h2 className="font-space-grotesk font-semibold text-black">
          AI Configuration
        </h2>
      </div>
      <div className="p-4 space-y-4">
        <ProviderSelector
          aiProvider={aiProvider}
          onProviderChange={onProviderChange}
          onModelChange={onModelChange}
        />
        
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

        <TemperatureControl
          temperature={temperature}
          onTemperatureChange={onTemperatureChange}
        />

        <AICapabilitiesInfo aiProvider={aiProvider} />

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