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
  const handleProviderChange = (newProvider: string) => {
    onProviderChange(newProvider);
    
    // Set default model for the new provider
    const provider = AI_PROVIDERS.find(p => p.id === newProvider);
    if (provider) {
      onModelChange(provider.models[0]);
    }
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