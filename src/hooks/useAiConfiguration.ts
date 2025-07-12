/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// AI provider options
export const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', models: ['claude-3-haiku', 'claude-3-sonnet'] },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-r1-distill-llama-70b'] }
];

// Define mood options with emojis
export const MOOD_OPTIONS = [
  { emoji: '😊', name: 'supportive', description: 'Positive & encouraging' },
  { emoji: '🤔', name: 'questioning', description: 'Curious & analytical' },
  { emoji: '😍', name: 'excited', description: 'Enthusiastic & energetic' },
  { emoji: '😌', name: 'wise', description: 'Calm & insightful' },
  { emoji: '😕', name: 'concerned', description: 'Worried or cautious' },
  { emoji: '🤗', name: 'empathetic', description: 'Understanding & caring' }
];

export const useAIConfiguration = () => {
  const getSelectedAiProvider = (aiProvider: string) => AI_PROVIDERS.find(p => p.id === aiProvider);

  const getAiConfig = (aiProvider: string, aiModel: string, apiKey: string, temperature: number) => ({
    provider: aiProvider,
    model: aiModel,
    apiKey,
    temperature
  });

  return {
    AI_PROVIDERS,
    MOOD_OPTIONS,
    getSelectedAiProvider,
    getAiConfig,
  };
};