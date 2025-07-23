/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { ToastStatus } from './useToast';

interface UseCustomModelManagerProps {
  userId: string | undefined;
  aiProvider: string;
  onModelChange: (model: string) => void;
  showToast: (title: string, message: string, status: ToastStatus) => void;
  showConfirmation: (title: string, message: string, onConfirm: () => void, metadata?: any) => void;
}

interface UseCustomModelManagerReturn {
  showCustomModel: boolean;
  setShowCustomModel: (show: boolean) => void;
  customModel: string;
  setCustomModel: (model: string) => void;
  handleAddCustomModel: () => Promise<void>;
  handleDeleteCustomModel: (modelId: string, modelName: string) => void;
}

export function useCustomModelManager({
  userId,
  aiProvider,
  onModelChange,
  showToast,
  showConfirmation
}: UseCustomModelManagerProps): UseCustomModelManagerReturn {
  const { addCustomModel, removeCustomModel } = useAIConfiguration(userId);
  const [showCustomModel, setShowCustomModel] = useState(false);
  const [customModel, setCustomModel] = useState('');

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

  const handleDeleteCustomModel = (modelId: string, modelName: string) => {
    showConfirmation(
      'Delete Custom Model',
      `Are you sure you want to delete the custom model "${modelName}"? This action cannot be undone.`,
      async () => {
        showToast('Deleting Model', 'Removing custom AI model...', 'loading');
        const result = await removeCustomModel(modelId);
        if (result.success) {
          showToast('Model Deleted', 'Custom AI model deleted successfully', 'success');
        } else {
          showToast('Delete Failed', `Failed to delete custom model: ${result.error}`, 'error');
        }
      },
      { modelId, modelName }
    );
  };

  return {
    showCustomModel,
    setShowCustomModel,
    customModel,
    setCustomModel,
    handleAddCustomModel,
    handleDeleteCustomModel
  };
}