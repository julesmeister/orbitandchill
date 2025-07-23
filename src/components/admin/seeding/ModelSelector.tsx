/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';

interface ModelOption {
  value: string;
  label: string;
  isCustom: boolean;
  customModelId?: string;
}

interface ModelSelectorProps {
  availableModels: string[];
  customModels: Array<{
    id: string;
    modelName: string;
    displayName: string;
    providerId: string;
  }>;
  aiProvider: string;
  aiModel: string;
  onModelChange: (model: string) => void;
  onDeleteCustomModel: (modelId: string, modelName: string) => void;
  onShowCustomModel: () => void;
}

export default function ModelSelector({
  availableModels,
  customModels,
  aiProvider,
  aiModel,
  onModelChange,
  onDeleteCustomModel,
  onShowCustomModel
}: ModelSelectorProps) {
  // Remove duplicates from availableModels as a safety measure
  const uniqueModels = Array.from(new Set(availableModels));

  const modelOptions: ModelOption[] = uniqueModels.map(model => {
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
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-space-grotesk font-semibold">Model</label>
        <button
          onClick={onShowCustomModel}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
        >
          + Add Custom Model
        </button>
      </div>
      
      <SynapsasDropdown
        options={modelOptions}
        value={aiModel}
        onChange={onModelChange}
        placeholder="Select Model"
        variant="thin"
        onDeleteCustomModel={onDeleteCustomModel}
      />
    </div>
  );
}