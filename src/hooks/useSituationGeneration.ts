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

// Fallback situations with questions
const fallbackSituations = [
  {
    situation: "A young professional is considering leaving their stable corporate job to pursue their passion for sustainable farming. They have savings for 6 months but worry about disappointing their family's expectations.",
    question: "What guidance does this card offer about following one's true calling versus maintaining security?",
    context: "career_transition",
    difficulty: "intermediate" as const
  },
  {
    situation: "Someone is in a relationship that feels emotionally distant. Their partner works long hours and seems disconnected, but they still care deeply for each other.",
    question: "How does this card illuminate the path to rekindling emotional intimacy and connection?",
    context: "relationships",
    difficulty: "beginner" as const
  },
  {
    situation: "A person inherited a significant sum of money and is torn between investing in real estate, starting a business, or using it to travel the world while they're young.",
    question: "What wisdom does this card provide about making choices that honor both practical needs and personal growth?",
    context: "major_decisions",
    difficulty: "advanced" as const
  },
  {
    situation: "Adult siblings are in conflict over their mother's care as she develops dementia. One wants professional care, the other insists on family-only care, creating tension and stress.",
    question: "What insight does this card offer about balancing love, responsibility, and practical limitations?",
    context: "family_challenges",
    difficulty: "advanced" as const
  },
  {
    situation: "A creative person has been struggling with self-doubt and creative blocks. They question whether their art has value and if they should continue pursuing their creative dreams.",
    question: "How does this card guide them toward reconnecting with their creative spirit and inner confidence?",
    context: "self_expression",
    difficulty: "intermediate" as const
  }
];

const createAIPrompt = (card: TarotCard, previousSituations: string[] = []) => {
  const avoidList = previousSituations.length > 0 
    ? `\n\nAvoid these previously used scenarios: ${previousSituations.join('; ')}`
    : '';

  return `You are an expert tarot reader creating realistic scenarios for learning card interpretation. 

Create a detailed, engaging situation for the card "${card.name}" (${card.type}${card.suit ? ` - ${card.suit}` : ''}).

Card traditional meanings:
- Upright: ${card.uprightMeaning}
- Keywords: ${card.keywords.upright.join(', ')}

Requirements:
1. Create a realistic, relatable life situation (2-3 sentences)
2. Include specific details that make it feel authentic
3. End with a thoughtful question that can be answered using this card's energy
4. The scenario should allow for interpretation of the card's themes
5. Make it emotionally engaging but not overly dramatic

Format your response as:
SITUATION: [detailed scenario]
QUESTION: [specific question about the situation]
CONTEXT: [one word: career/relationships/family/health/growth/finances]
DIFFICULTY: [beginner/intermediate/advanced]${avoidList}

Example:
SITUATION: Maya, a 28-year-old teacher, discovered her best friend has been secretly dating her ex-boyfriend for months. She feels betrayed and confused about whether to confront them or distance herself from the friendship.
QUESTION: What guidance does The Fool offer about approaching this situation with an open heart versus protecting herself from further hurt?
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

const callAIProvider = async (card: TarotCard, config: SituationGenerationConfig, previousSituations: string[] = []): Promise<GeneratedSituation | null> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tarot/generate-situation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cardName: card.name,
      cardType: card.type,
      cardSuit: card.suit,
      uprightMeaning: card.uprightMeaning,
      keywords: card.keywords.upright,
      previousSituations,
      aiConfig: {
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
        temperature: config.temperature || 0.7
      }
    })
  });

  if (!response.ok) {
    throw new Error('AI provider request failed');
  }

  const result = await response.json();
  if (!result.success) {
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
      // Try AI generation first
      if (aiConfig.apiKey && aiConfig.provider) {
        try {
          const aiResult = await callAIProvider(card, aiConfig, previousSituations);
          
          if (aiResult) {
            setIsGenerating(false);
            return aiResult;
          }
        } catch (aiError) {
          console.warn('AI generation failed, falling back to templates:', aiError);
        }
      }

      // Fallback to template-based generation
      const availableSituations = fallbackSituations.filter(
        situation => !previousSituations.some(prev => 
          prev.includes(situation.situation.substring(0, 50))
        )
      );

      const selectedSituation = availableSituations.length > 0 
        ? availableSituations[Math.floor(Math.random() * availableSituations.length)]
        : fallbackSituations[Math.floor(Math.random() * fallbackSituations.length)];

      // Replace card reference in question
      const adaptedQuestion = selectedSituation.question.replace(
        /this card|The \w+/g, 
        card.name
      );

      setIsGenerating(false);
      return {
        situation: selectedSituation.situation,
        question: adaptedQuestion,
        context: selectedSituation.context,
        difficulty: selectedSituation.difficulty
      };

    } catch (error) {
      console.error('Situation generation failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      // Emergency fallback
      const emergency = fallbackSituations[0];
      setIsGenerating(false);
      return {
        situation: emergency.situation,
        question: emergency.question.replace(/this card|The \w+/g, card.name),
        context: emergency.context,
        difficulty: emergency.difficulty
      };
    }
  }, []);

  const generateFallbackSituation = useCallback((card: TarotCard): GeneratedSituation => {
    const situation = fallbackSituations[Math.floor(Math.random() * fallbackSituations.length)];
    return {
      situation: situation.situation,
      question: situation.question.replace(/this card|The \w+/g, card.name),
      context: situation.context,
      difficulty: situation.difficulty
    };
  }, []);

  return {
    generateSituation,
    generateFallbackSituation,
    isGenerating,
    error
  };
};