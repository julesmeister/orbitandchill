/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface GenerationSettings {
  discussionsToGenerate: number;
  repliesPerDiscussion: { min: number; max: number };
  maxNestingDepth: number;
  contentVariation: number;
}

interface UseGenerationSettingsReturn extends GenerationSettings {
  // Actions
  setDiscussionsToGenerate: (count: number) => void;
  setRepliesPerDiscussion: (range: { min: number; max: number }) => void;
  setMaxNestingDepth: (depth: number) => void;
  setContentVariation: (variation: number) => void;
  
  // Utils
  getGenerationSettings: () => GenerationSettings;
}

export const useGenerationSettings = (): UseGenerationSettingsReturn => {
  const [discussionsToGenerate, setDiscussionsToGenerate] = useState(10);
  const [repliesPerDiscussion, setRepliesPerDiscussion] = useState({ min: 5, max: 25 });
  const [maxNestingDepth, setMaxNestingDepth] = useState(4);
  const [contentVariation, setContentVariation] = useState(70);

  const getGenerationSettings = useCallback((): GenerationSettings => ({
    discussionsToGenerate,
    repliesPerDiscussion,
    maxNestingDepth,
    contentVariation
  }), [discussionsToGenerate, repliesPerDiscussion, maxNestingDepth, contentVariation]);

  return {
    // State
    discussionsToGenerate,
    repliesPerDiscussion,
    maxNestingDepth,
    contentVariation,
    
    // Actions
    setDiscussionsToGenerate,
    setRepliesPerDiscussion,
    setMaxNestingDepth,
    setContentVariation,
    
    // Utils
    getGenerationSettings
  };
};