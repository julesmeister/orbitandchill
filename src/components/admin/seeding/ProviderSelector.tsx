/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { AI_PROVIDERS } from '@/hooks/useAIConfiguration';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';

interface ProviderSelectorProps {
  aiProvider: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  aiProvider,
  onProviderChange,
  onModelChange,
}) => {
  // Note: The provider change logic is now handled in the parent component
  // to allow proper preservation of saved models during configuration loading
  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
  };

  return (
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
  );
};

export default ProviderSelector;