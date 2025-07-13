/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

interface GenerateSituationRequest {
  cardName: string;
  cardType: string;
  cardSuit?: string;
  uprightMeaning: string;
  keywords: string[];
  previousSituations?: string[];
  aiConfig: {
    provider: string;
    model: string;
    apiKey: string;
    temperature?: number;
  };
}

interface GeneratedSituation {
  situation: string;
  question: string;
  context: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateSituationRequest = await request.json();
    const { cardName, cardType, cardSuit, uprightMeaning, keywords, previousSituations = [], aiConfig } = body;

    if (!cardName || !aiConfig) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const avoidList = previousSituations.length > 0 
      ? `\n\nAvoid these previously used scenarios: ${previousSituations.join('; ')}`
      : '';

    const prompt = `You are a creative writer creating realistic life scenarios for tarot learning. 

IMPORTANT: Do NOT reference any specific tarot card or tarot meanings. Create a completely random, realistic life situation that could happen to anyone.

Requirements:
1. Create a realistic, relatable life situation (1-2 sentences)
2. Include specific details that make it feel authentic  
3. End with a thoughtful question about the situation
4. Keep the total scenario under 100 words
5. DO NOT mention tarot, cards, or any mystical references

Format your response as:
SITUATION: [detailed scenario]
QUESTION: [specific question about the situation]
CONTEXT: [one word: career/relationships/family/health/growth/finances]
DIFFICULTY: [beginner/intermediate/advanced]${avoidList}

Example:
SITUATION: Maya, a 28-year-old teacher, discovered her best friend has been secretly dating her ex-boyfriend for months. She feels betrayed and confused about whether to confront them or distance herself from the friendship.
QUESTION: Should she confront them directly about the betrayal, or step back and protect her emotional well-being?
CONTEXT: relationships
DIFFICULTY: intermediate`;

    let aiResponse = '';

    try {
      // Use different AI providers based on config
      if (aiConfig.provider === 'openrouter' && aiConfig.apiKey) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'Orbit & Chill Tarot Learning'
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: aiConfig.temperature || 0.7,
            max_tokens: 120
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices[0]?.message?.content || '';
        }
      } else if (aiConfig.provider === 'openai' && aiConfig.apiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.apiKey}`
          },
          body: JSON.stringify({
            model: aiConfig.model || 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: aiConfig.temperature || 0.7,
            max_tokens: 120
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices[0]?.message?.content || '';
        }
      }
    } catch (error) {
      console.error('AI API call failed:', error);
    }

    if (aiResponse) {
      // Parse AI response
      const parsed = parseAIResponse(aiResponse);
      if (parsed) {
        return NextResponse.json({
          success: true,
          ...parsed
        });
      }
    }

    // Fallback if AI fails
    const fallback = generateFallbackSituation(cardName);
    return NextResponse.json({
      success: true,
      ...fallback
    });

  } catch (error) {
    console.error('Situation generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

function parseAIResponse(response: string): GeneratedSituation | null {
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
}

function generateFallbackSituation(cardName: string): GeneratedSituation {
  const fallbackSituations = [
    {
      situation: "A young professional is considering leaving their stable corporate job to pursue their passion for sustainable farming. They have savings for 6 months but worry about disappointing their family's expectations.",
      question: "Should they take the leap into an uncertain but fulfilling path, or maintain financial security?",
      context: "career",
      difficulty: "intermediate" as const
    },
    {
      situation: "Someone is in a relationship that feels emotionally distant. Their partner works long hours and seems disconnected, but they still care deeply for each other.",
      question: "How can they rebuild intimacy while respecting their partner's work demands?",
      context: "relationships",
      difficulty: "beginner" as const
    },
    {
      situation: "A person inherited a significant sum of money and is torn between investing in real estate, starting a business, or using it to travel the world while they're young.",
      question: "Which choice would best balance their future security with present fulfillment?",
      context: "finances",
      difficulty: "advanced" as const
    },
    {
      situation: "Adult siblings are in conflict over their mother's care as she develops dementia. One wants professional care, the other insists on family-only care, creating tension and stress.",
      question: "How can they find a solution that honors both their mother's needs and family unity?",
      context: "family",
      difficulty: "advanced" as const
    },
    {
      situation: "A creative person has been struggling with self-doubt and creative blocks. They question whether their art has value and if they should continue pursuing their creative dreams.",
      question: "How can they overcome these doubts and reconnect with their creative passion?",
      context: "growth",
      difficulty: "intermediate" as const
    },
    {
      situation: "A college student is feeling overwhelmed by academic pressure and social expectations. They're considering changing majors but worry about disappointing their parents who have strong opinions about their future.",
      question: "Should they prioritize their own interests or their family's expectations?",
      context: "growth",
      difficulty: "beginner" as const
    },
    {
      situation: "A person's elderly neighbor has been showing signs of neglect and possible elder abuse from their caregiver. The person is unsure whether to intervene or mind their own business.",
      question: "What's the right balance between helping and respecting boundaries?",
      context: "family",
      difficulty: "advanced" as const
    },
    {
      situation: "Someone received a job offer in another city that would advance their career significantly, but it means leaving behind their close-knit friend group and familiar environment.",
      question: "Is career advancement worth leaving their support system behind?",
      context: "career",
      difficulty: "intermediate" as const
    }
  ];

  const selected = fallbackSituations[Math.floor(Math.random() * fallbackSituations.length)];
  return selected;
}