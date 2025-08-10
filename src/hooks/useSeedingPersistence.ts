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
    // Try to load from localStorage immediately during initialization
    if (typeof window !== 'undefined') {
      try {
        const savedPreviewContent = localStorage.getItem('seeding_preview_content');
        if (savedPreviewContent) {
          const parsedContent = JSON.parse(savedPreviewContent);
          
          if (parsedContent.length > 0) {
            // Apply field migration immediately during initialization
            const migratedContent = parsedContent.map((item: any) => {
              if (!item.assignedAuthor && item.assignedAuthorUsername) {
                return {
                  ...item,
                  assignedAuthor: item.assignedAuthorUsername
                };
              }
              return item;
            });
            
            // console.log('🔄 Preview content loaded from localStorage:', migratedContent.length, 'discussions');
            return migratedContent;
          }
        }
        
        // If previewContent is empty, try to restore from seedingResults.data
        const savedSeedingResults = localStorage.getItem('seeding_results');
        if (savedSeedingResults) {
          try {
            const parsedResults = JSON.parse(savedSeedingResults);
            if (parsedResults.success && parsedResults.data && Array.isArray(parsedResults.data) && parsedResults.data.length > 0) {
              // console.log('🔄 Restoring preview content from seedingResults:', parsedResults.data.length, 'discussions');
              
              // Apply field migration to restored data
              const migratedContent = parsedResults.data.map((item: any) => {
                if (!item.assignedAuthor && item.assignedAuthorUsername) {
                  return {
                    ...item,
                    assignedAuthor: item.assignedAuthorUsername
                  };
                }
                return item;
              });
              
              return migratedContent;
            }
          } catch (e) {
            console.error('Failed to parse seedingResults for preview restoration:', e);
          }
        }
      } catch (e) {
        console.error('Failed to parse preview content during initialization:', e);
      }
    }
    return [];
  });
  const [seedingResults, setSeedingResults] = useState<any>(null);

  // AI Configuration State
  const [aiProvider, setAiProvider] = useState('openrouter');
  const [aiModel, setAiModel] = useState('deepseek/deepseek-r1-distill-llama-70b:free');
  const [aiApiKey, setAiApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  
  // Active Personas State (default to all active)
  const [activePersonas, setActivePersonas] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seeding_active_personas');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved active personas:', e);
        }
      }
    }
    // Default to all personas active
    return [];
  });

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    // Load AI settings
    const savedApiKey = localStorage.getItem('seeding_ai_api_key');
    const savedProvider = localStorage.getItem('seeding_ai_provider');
    const savedModel = localStorage.getItem('seeding_ai_model');
    const savedTemperature = localStorage.getItem('seeding_ai_temperature');
    
    if (savedApiKey) {
      setAiApiKey(savedApiKey);
    }
    if (savedProvider) {
      setAiProvider(savedProvider);
    }
    if (savedModel) {
      // console.log('🔍 DEBUG: Loading saved AI model from localStorage:', savedModel);
      // Check if it's the problematic old model
      if (savedModel === 'meta-llama/llama-3.1-70b-instruct:free') {
        console.log('🚨 Found old meta-llama model in localStorage, updating to working model');
        const newModel = 'deepseek/deepseek-r1-distill-llama-70b:free';
        setAiModel(newModel);
        localStorage.setItem('seeding_ai_model', newModel);
      } else {
        setAiModel(savedModel);
      }
    } else {
      // console.log('🔍 DEBUG: No saved AI model found, using default:', aiModel);
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
    // console.log('Loading from localStorage:', {
    //   pastedContent: savedPastedContent?.length || 0,
    //   scrapedContent: savedScrapedContent?.length || 0,
    //   previewContent: savedPreviewContent?.length || 0,
    //   hasResults: !!savedSeedingResults
    // });
    
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
    // Note: previewContent is now loaded during useState initialization
    // This useEffect only handles other localStorage items that couldn't be loaded during init
    // console.log('🔄 useEffect: Preview content was loaded during useState initialization, skipping duplicate load');
    if (savedSeedingResults) {
      try {
        setSeedingResults(JSON.parse(savedSeedingResults));
      } catch (e) {
        console.error('Failed to parse saved seeding results:', e);
      }
    }
  }, []);

  // Handle restoration notification after component mounts (migration already done in initializer)
  useEffect(() => {
    if (previewContent.length > 0) {
      // console.log('🔄 Preview content detected after mount:', previewContent.length, 'discussions');
      
      // Show restoration notification
      setSeedingResults((prev: any) => ({
        ...prev,
        restoredFromCache: true,
        restoredMessage: `Restored ${previewContent.length} discussions with replies from previous session`
      }));
    }
  }, []); // Empty dependency - only run once after mount

  // Save pasted content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('seeding_pasted_content', pastedContent);
  }, [pastedContent]);

  // Save scraped content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('seeding_scraped_content', JSON.stringify(scrapedContent));
  }, [scrapedContent]);

  // Save preview content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('seeding_preview_content', JSON.stringify(previewContent));
    if (previewContent.length > 0) {
      // console.log('🔄 Preview content saved:', previewContent.length, 'discussions');
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

  const handleModelChange = (newModel: string) => {
    setAiModel(newModel);
    localStorage.setItem('seeding_ai_model', newModel);
  };

  // Save active personas to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('seeding_active_personas', JSON.stringify(activePersonas));
  }, [activePersonas]);

  const togglePersonaActive = (personaId: string) => {
    setActivePersonas(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else {
        return [...prev, personaId];
      }
    });
  };

  const setAllPersonasActive = (personas: string[], active: boolean) => {
    if (active) {
      setActivePersonas(personas);
    } else {
      setActivePersonas([]);
    }
  };

  const clearAllContent = () => {
    // console.log('🔄 Clearing all seeding content');
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

  const clearAIConfiguration = () => {
    // console.log('🔄 Clearing AI configuration');
    // Reset state to defaults
    setAiProvider('openrouter');
    setAiModel('deepseek/deepseek-r1-distill-llama-70b:free');
    setAiApiKey('');
    setTemperature(0.7);
    
    // Clear localStorage
    localStorage.removeItem('seeding_ai_provider');
    localStorage.removeItem('seeding_ai_model');
    localStorage.removeItem('seeding_ai_api_key');
    localStorage.removeItem('seeding_ai_temperature');
  };

  // Enhanced setPreviewContent with logging
  const setPreviewContentWithLogging = (newContent: any[] | ((prev: any[]) => any[])) => {
    if (typeof newContent === 'function') {
      setPreviewContent(prev => {
        const result = newContent(prev);
        console.log('🔄 setPreviewContent updated:', prev.length, '→', result.length, 'discussions');
        
        // Debug: Log reply counts for each discussion
        if (result.length > 0) {
          console.log('🔄 Reply counts per discussion:');
          result.forEach((item, index) => {
            console.log(`  ${index}: "${item.transformedTitle}" - ${item.replies?.length || 0} replies`);
          });
        }
        
        return result;
      });
    } else {
      console.log('🔄 setPreviewContent set to:', newContent?.length || 0, 'discussions');
      
      // Debug: Log reply counts for each discussion
      if (newContent && newContent.length > 0) {
        console.log('🔄 Reply counts per discussion:');
        newContent.forEach((item, index) => {
          console.log(`  ${index}: "${item.transformedTitle}" - ${item.replies?.length || 0} replies`);
        });
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
    activePersonas,
    
    // Setters
    setPastedContent,
    setScrapedContent,
    setPreviewContent: setPreviewContentWithLogging,
    setSeedingResults,
    setAiModel,
    setActivePersonas,
    
    // Handlers
    handleApiKeyChange,
    handleProviderChange,
    handleModelChange,
    handleTemperatureChange,
    togglePersonaActive,
    setAllPersonasActive,
    clearAllContent,
    clearAIConfiguration,
  };
};