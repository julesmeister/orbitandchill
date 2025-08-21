/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  const [showPasteNotification, setShowPasteNotification] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [isCheckingDatabase, setIsCheckingDatabase] = useState(false);

  // Check if the current API key matches the saved one
  useEffect(() => {
    checkDatabaseApiKey();
  }, []);

  // Recheck when API key changes
  useEffect(() => {
    if (apiKey) {
      // Debounce the check to avoid too many API calls while typing
      const timer = setTimeout(() => {
        checkDatabaseApiKey();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [apiKey]);

  const checkDatabaseApiKey = async () => {
    setIsCheckingDatabase(true);
    try {
      const response = await fetch('/api/admin/ai-config?type=public');
      const result = await response.json();
      
      if (result.success && result.config && result.config.apiKey) {
        setSavedApiKey(result.config.apiKey);
      } else {
        setSavedApiKey(null);
      }
    } catch (error) {
      console.error('Failed to check database API key:', error);
      setSavedApiKey(null);
    } finally {
      setIsCheckingDatabase(false);
    }
  };

  const handleSaveToDatabase = async () => {
    // First try to create the table if it doesn't exist
    try {
      const createTableResponse = await fetch('/api/admin/create-ai-config-table', {
        method: 'POST',
      });
      const createResult = await createTableResponse.json();
      // Table creation attempt
    } catch (error) {
      // Table might already exist - continue anyway
    }

    // Now save the configuration
    await onSaveToDatabase();
    
    // Recheck database after saving with a longer delay to ensure save is complete
    setTimeout(() => {
      checkDatabaseApiKey();
    }, 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onApiKeyChange(text);
        setShowPasteNotification(true);
        setTimeout(() => setShowPasteNotification(false), 2000);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    onApiKeyChange('');
  };

  const handleRestore = () => {
    if (savedApiKey) {
      onApiKeyChange(savedApiKey);
    }
  };

  return (
    <div>
      <label className="block text-sm font-space-grotesk font-semibold mb-2">API Key</label>
      <div className="relative">
        <input
          type={inputType}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="Enter your AI API key..."
          className="w-full p-2 pr-40 border border-black font-open-sans"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePaste}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label="Paste from clipboard"
            title="Paste from clipboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>

          {/* Restore Button - only show if savedApiKey exists and it's different from current */}
          {savedApiKey && savedApiKey !== apiKey && (
            <button
              type="button"
              onClick={handleRestore}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              aria-label="Restore saved API key"
              title="Restore saved API key from database"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          
          {/* Clear Button */}
          {apiKey && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label="Clear API key"
              title="Clear API key"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Eye Toggle Button */}
          <button
            type="button"
            onClick={toggleVisibility}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label={isVisible ? "Hide API key" : "Show API key"}
            title={isVisible ? "Hide API key" : "Show API key"}
          >
            {icon}
          </button>
        </div>
        
        {/* Paste Notification */}
        {showPasteNotification && (
          <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg animate-fade-in">
            API key pasted!
          </div>
        )}
      </div>
      {!apiKey ? (
        <p className="text-xs text-red-600 mt-1 font-open-sans">
          API key required for AI transformation
        </p>
      ) : isCheckingDatabase ? (
        <p className="text-xs text-gray-500 mt-1 font-open-sans">
          Checking database status...
        </p>
      ) : apiKey === savedApiKey ? (
        <p className="text-xs text-green-600 mt-1 font-open-sans">
          ✅ API key saved to database and ready to use
        </p>
      ) : (
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-orange-600 font-open-sans">
            ⚠️ API key entered but not saved to database
          </p>
          <button
            onClick={handleSaveToDatabase}
            className="px-3 py-1 text-xs bg-blue-600 text-white font-semibold hover:bg-blue-700 border-none transition-colors duration-200"
          >
            Save to Database
          </button>
        </div>
      )}
    </div>
  );
}