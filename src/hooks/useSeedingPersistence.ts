/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

interface SeedingPersistenceData {
  pastedContent: string;
  scrapedContent: any[];
  previewContent: any[];
  seedingResults: any;
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
}

export const useSeedingPersistence = () => {
  const [pastedContent, setPastedContent] = useState('');
  const [scrapedContent, setScrapedContent] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState<any[]>(() => {
    console.log('🔄 Initial preview content state set to empty array');
    return [];
  });
  const [seedingResults, setSeedingResults] = useState<any>(null);

  // AI Configuration State
  const [aiProvider, setAiProvider] = useState('deepseek');
  const [aiModel, setAiModel] = useState('deepseek-r1-distill-llama-70b');
  const [aiApiKey, setAiApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    // Load AI settings
    const savedApiKey = localStorage.getItem('seeding_ai_api_key');
    const savedProvider = localStorage.getItem('seeding_ai_provider');
    const savedTemperature = localStorage.getItem('seeding_ai_temperature');
    
    if (savedApiKey) {
      setAiApiKey(savedApiKey);
    }
    if (savedProvider) {
      setAiProvider(savedProvider);
    }
    if (savedTemperature) {
      setTemperature(parseFloat(savedTemperature));
    }
    
    // Load content and preview data
    const savedPastedContent = localStorage.getItem('seeding_pasted_content');
    const savedScrapedContent = localStorage.getItem('seeding_scraped_content');
    const savedPreviewContent = localStorage.getItem('seeding_preview_content');
    const savedSeedingResults = localStorage.getItem('seeding_results');
    
    // Debug log to see what's being loaded
    console.log('Loading from localStorage:', {
      pastedContent: savedPastedContent?.length || 0,
      scrapedContent: savedScrapedContent?.length || 0,
      previewContent: savedPreviewContent?.length || 0,
      hasResults: !!savedSeedingResults
    });
    
    if (savedPastedContent) {
      setPastedContent(savedPastedContent);
    }
    if (savedScrapedContent) {
      try {
        setScrapedContent(JSON.parse(savedScrapedContent));
      } catch (e) {
        console.error('Failed to parse saved scraped content:', e);
      }
    }
    if (savedPreviewContent) {
      try {
        const parsedContent = JSON.parse(savedPreviewContent);
        console.log('Parsed preview content from localStorage:', parsedContent);
        console.log('Number of discussions:', parsedContent.length);
        if (parsedContent.length > 0) {
          console.log('First discussion:', parsedContent[0]);
          console.log('Has replies?', parsedContent[0].replies?.length || 0);
        }
        console.log('🔄 Setting preview content from localStorage restore:', parsedContent.length, 'discussions');
        setPreviewContent(parsedContent);
        
        // Show a subtle notification that data was restored
        if (parsedContent.length > 0) {
          setSeedingResults((prev: any) => ({
            ...prev,
            restoredFromCache: true,
            restoredMessage: `Restored ${parsedContent.length} discussions with replies from previous session`
          }));
        }
      } catch (e) {
        console.error('Failed to parse saved preview content:', e);
        console.error('Raw content that failed to parse:', savedPreviewContent);
      }
    }
    if (savedSeedingResults) {
      try {
        setSeedingResults(JSON.parse(savedSeedingResults));
      } catch (e) {
        console.error('Failed to parse saved seeding results:', e);
      }
    }
  }, []);

  // Save pasted content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('seeding_pasted_content', pastedContent);
    console.log('Saved pasted content to localStorage:', pastedContent.length, 'chars');
  }, [pastedContent]);

  // Save scraped content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('seeding_scraped_content', JSON.stringify(scrapedContent));
  }, [scrapedContent]);

  // Save preview content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('seeding_preview_content', JSON.stringify(previewContent));
    console.log('🔄 Preview content changed - saved to localStorage:', previewContent.length, 'discussions');
    if (previewContent.length > 0) {
      console.log('🔄 First discussion title:', previewContent[0]?.title);
      console.log('🔄 First discussion replies:', previewContent[0]?.replies?.length || 0);
    }
  }, [previewContent]);

  // Save seeding results to localStorage whenever it changes
  useEffect(() => {
    if (seedingResults !== null) {
      localStorage.setItem('seeding_results', JSON.stringify(seedingResults));
    } else {
      localStorage.removeItem('seeding_results');
    }
  }, [seedingResults]);

  // Save AI settings to localStorage when they change
  const handleApiKeyChange = (newApiKey: string) => {
    setAiApiKey(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem('seeding_ai_api_key', newApiKey);
    } else {
      localStorage.removeItem('seeding_ai_api_key');
    }
  };

  const handleProviderChange = (newProvider: string) => {
    setAiProvider(newProvider);
    localStorage.setItem('seeding_ai_provider', newProvider);
  };

  const handleTemperatureChange = (newTemperature: number) => {
    setTemperature(newTemperature);
    localStorage.setItem('seeding_ai_temperature', newTemperature.toString());
  };

  const clearAllContent = () => {
    console.log('🔄 Clearing all content - setting preview content to empty array');
    // Clear state
    setPastedContent('');
    setScrapedContent([]);
    setPreviewContent([]);
    setSeedingResults(null);
    
    // Clear localStorage
    localStorage.removeItem('seeding_pasted_content');
    localStorage.removeItem('seeding_scraped_content');
    localStorage.removeItem('seeding_preview_content');
    localStorage.removeItem('seeding_results');
  };

  // Enhanced setPreviewContent with logging
  const setPreviewContentWithLogging = (newContent: any[] | ((prev: any[]) => any[])) => {
    if (typeof newContent === 'function') {
      setPreviewContent(prev => {
        const result = newContent(prev);
        console.log('🔄 setPreviewContent (function) called - prev:', prev.length, 'new:', result.length);
        return result;
      });
    } else {
      console.log('🔄 setPreviewContent (direct) called with:', newContent?.length || 0, 'discussions');
      if (newContent && newContent.length > 0) {
        console.log('🔄 Setting first discussion:', newContent[0]);
      }
      setPreviewContent(newContent);
    }
  };

  return {
    // State
    pastedContent,
    scrapedContent,
    previewContent,
    seedingResults,
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    
    // Setters
    setPastedContent,
    setScrapedContent,
    setPreviewContent: setPreviewContentWithLogging,
    setSeedingResults,
    setAiModel,
    
    // Handlers
    handleApiKeyChange,
    handleProviderChange,
    handleTemperatureChange,
    clearAllContent,
  };
};