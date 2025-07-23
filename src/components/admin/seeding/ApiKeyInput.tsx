/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { usePasswordToggle } from '@/hooks/usePasswordToggle';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
  onSaveToDatabase: () => void;
}

export default function ApiKeyInput({
  apiKey,
  onApiKeyChange,
  onSaveToDatabase
}: ApiKeyInputProps) {
  const { isVisible, toggleVisibility, inputType, icon } = usePasswordToggle();

  return (
    <div>
      <label className="block text-sm font-space-grotesk font-semibold mb-2">API Key</label>
      <div className="relative">
        <input
          type={inputType}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your AI API key..."
          className="w-full p-2 pr-10 border border-black font-open-sans"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={isVisible ? "Hide API key" : "Show API key"}
        >
          {icon}
        </button>
      </div>
      {!apiKey ? (
        <p className="text-xs text-red-600 mt-1 font-open-sans">
          API key required for AI transformation
        </p>
      ) : (
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-orange-600 font-open-sans">
            ⚠️ API key entered but not saved to database
          </p>
          <button
            onClick={onSaveToDatabase}
            className="px-3 py-1 text-xs bg-blue-600 text-white font-semibold hover:bg-blue-700 border-none transition-colors duration-200"
          >
            Save to Database
          </button>
        </div>
      )}
    </div>
  );
}