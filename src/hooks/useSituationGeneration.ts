/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from 'react';
import { TarotCard } from '@/data/tarotCards';

interface SituationGenerationConfig {
  provider: 'openrouter' | 'openai' | 'claude' | 'gemini';
  model: string;
  apiKey: string;
  temperature?: number;
}

interface GenerateSituationRequest {
  card: TarotCard;
  aiConfig: SituationGenerationConfig;
  previousSituations?: string[];
}

interface GeneratedSituation {
  situation: string;
  question: string;
  context: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}


const createAIPrompt = (previousSituations: string[] = []) => {
  const avoidList = previousSituations.length > 0 
    ? `\n\nAvoid these previously used scenarios: ${previousSituations.join('; ')}`
    : '';

  return `You are creating realistic life scenarios for tarot learning. Your job is to create generic, challenging life situations that require critical thinking to interpret using tarot cards.

DO NOT reference any specific card, tarot meanings, or tarot concepts in your response.

Requirements:
1. Create a realistic, relatable life situation (2-3 sentences)
2. Include specific details that make it feel authentic  
3. End with an open-ended question about the situation that could be answered from multiple perspectives
4. DO NOT mention tarot, cards, or any specific guidance - keep it completely generic
5. Make it emotionally engaging but not overly dramatic
6. The situation should be complex enough to allow various interpretations

Format your response as:
SITUATION: [detailed scenario with NO tarot references]
QUESTION: [open-ended question about the situation with NO mention of cards or guidance]
CONTEXT: [one word: career/relationships/family/health/growth/finances]
DIFFICULTY: [beginner/intermediate/advanced]${avoidList}

Example:
SITUATION: Maya, a 28-year-old teacher, discovered her best friend has been secretly dating her ex-boyfriend for months. She feels betrayed and confused about whether to confront them or distance herself from the friendship.
QUESTION: How should Maya approach this situation - should she confront them directly or take time to process her feelings first?
CONTEXT: relationships
DIFFICULTY: intermediate`;
};

const parseAIResponse = (response: string): GeneratedSituation | null => {
  try {
    const lines = response.trim().split('\n');
    let situation = '';
    let question = '';
    let context = '';
    let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';

    for (const line of lines) {
      if (line.startsWith('SITUATION:')) {
        situation = line.replace('SITUATION:', '').trim();
      } else if (line.startsWith('QUESTION:')) {
        question = line.replace('QUESTION:', '').trim();
      } else if (line.startsWith('CONTEXT:')) {
        context = line.replace('CONTEXT:', '').trim();
      } else if (line.startsWith('DIFFICULTY:')) {
        const diff = line.replace('DIFFICULTY:', '').trim().toLowerCase();
        if (diff === 'intermediate' || diff === 'advanced') {
          difficulty = diff as 'intermediate' | 'advanced';
        }
      }
    }

    if (situation && question) {
      return { situation, question, context, difficulty };
    }
    return null;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
};

const callAIProvider = async (config: SituationGenerationConfig, previousSituations: string[] = []): Promise<GeneratedSituation | null> => {
  const requestBody = {
    previousSituations,
    aiConfig: {
      provider: config.provider,
      model: config.model,
      apiKey: config.apiKey,
      temperature: config.temperature || 0.7
    }
  };
  
  console.log('Frontend: Sending request to situation API:', {
    provider: config.provider,
    model: config.model,
    hasApiKey: !!config.apiKey,
    apiKeyLength: config.apiKey?.length || 0,
    temperature: config.temperature
  });
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tarot/generate-situation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errorMessage = `AI provider request failed (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If we can't parse the error response, use the default message
    }
    console.error('AI provider request failed:', {
      status: response.status,
      message: errorMessage,
      url: response.url
    });
    throw new Error(errorMessage);
  }

  const result = await response.json();
  if (!result.success) {
    console.error('AI processing failed:', {
      error: result.error,
      result
    });
    throw new Error(result.error || 'AI processing failed');
  }

  return {
    situation: result.situation,
    question: result.question,
    context: result.context,
    difficulty: result.difficulty
  };
};

export const useSituationGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSituation = useCallback(async ({ 
    card, 
    aiConfig, 
    previousSituations = [] 
  }: GenerateSituationRequest): Promise<GeneratedSituation> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Try AI generation - no fallbacks
      if (!aiConfig.apiKey || !aiConfig.provider) {
        throw new Error('AI configuration is missing. Please set up your AI provider in the admin panel.');
      }

      const aiResult = await callAIProvider(aiConfig, previousSituations);
      
      if (!aiResult) {
        throw new Error('AI failed to generate a situation. Please try again.');
      }

      setIsGenerating(false);
      return aiResult;

    } catch (error) {
      console.error('Situation generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate situation. Please try again.';
      setError(errorMessage);
      setIsGenerating(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    generateSituation,
    isGenerating,
    error
  };
};