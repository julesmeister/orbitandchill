/* eslint-disable @typescript-eslint/no-unused-vars */
import { useToast } from '@/hooks/useToast';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { useCustomModelManager } from '@/hooks/useCustomModelManager';
import { useAIConfigAdmin } from '@/hooks/usePublicAIConfig';

interface AIFormState {
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  onTemperatureChange: (temperature: number) => void;
}

interface UseAIFormStateProps {
  userId?: string;
  formState: AIFormState;
}

export const useAIFormState = ({ userId, formState }: UseAIFormStateProps) => {
  const { saveConfig } = useAIConfigAdmin();
  const { toast, showToast, hideToast } = useToast();
  const { confirmationState, showConfirmation, hideConfirmation } = useConfirmationDialog();
  
  const customModelManager = useCustomModelManager({
    userId,
    aiProvider: formState.aiProvider,
    onModelChange: formState.onModelChange,
    showToast,
    showConfirmation
  });

  const handleSaveToDatabase = async () => {
    if (!formState.aiApiKey.trim()) {
      showToast('Save Failed', 'API key is required to save configuration', 'error');
      return;
    }

    showToast('Saving Configuration', 'Saving AI configuration to database...', 'loading');
    
    const result = await saveConfig({
      provider: formState.aiProvider,
      model: formState.aiModel,
      apiKey: formState.aiApiKey,
      temperature: formState.temperature,
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

  return {
    // Toast management
    toast,
    showToast,
    hideToast,
    
    // Confirmation dialog
    confirmationState,
    showConfirmation,
    hideConfirmation,
    
    // Custom model management
    customModelManager,
    
    // Save functionality
    handleSaveToDatabase,
  };
};