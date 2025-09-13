/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

interface GenerateSentencesRequest {
  userId: string;
  cardName: string;
  isReversed: boolean;
  count: number;
  existingSentences?: string[];
  aiConfig: {
    provider: string;
    model: string;
    apiKey?: string;
    temperature?: number;
  };
}

interface GenerateSentencesResponse {
  success: boolean;
  generatedSentences?: string[];
  cardInfo?: {
    cardName: string;
    isReversed: boolean;
    meaning: string;
    keywords: string[];
  };
  error?: string;
  code?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateSentencesResponse>> {
  try {
    const body: GenerateSentencesRequest = await request.json();
    const { userId, cardName, isReversed, count = 3, existingSentences = [], aiConfig } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!cardName) {
      return NextResponse.json(
        { success: false, error: 'Card name required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    if (!aiConfig || !aiConfig.provider) {
      return NextResponse.json(
        { success: false, error: 'AI configuration required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Validate count
    if (count < 1 || count > 10) {
      return NextResponse.json(
        { success: false, error: 'Count must be between 1 and 10', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Get card information (this would ideally come from a card data service)
    const cardInfo = getCardInfo(cardName, isReversed);

    // Create the AI prompt for sentence generation
    const existingText = existingSentences.length > 0 
      ? `\n\nExisting sentences to avoid duplicating:\n${existingSentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : '';

    const prompt = `You are a creative tarot teacher who explains card meanings in modern, relatable ways. Generate ${count} short, witty sentences that describe the ${cardName}${isReversed ? ' (reversed)' : ''} card in everyday, humorous language.

**Card Information:**
- Traditional Meaning: ${cardInfo.meaning}
- Keywords: ${cardInfo.keywords.join(', ')}
- Orientation: ${isReversed ? 'Reversed' : 'Upright'}

**Style Guidelines:**
- Keep each sentence under 80 characters
- Use modern, colloquial language
- Make them memorable and slightly humorous
- Focus on personality types or situations people can relate to
- Avoid overly mystical or traditional tarot language${existingText}

Please provide exactly ${count} sentences, each on a new line, without numbers or bullet points.`;

    let generatedSentences: string[] = [];

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
            temperature: aiConfig.temperature || 0.8,
            max_tokens: 200
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0]?.message?.content || '';
          generatedSentences = parseAISentences(aiResponse);
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
            temperature: aiConfig.temperature || 0.8,
            max_tokens: 200
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0]?.message?.content || '';
          generatedSentences = parseAISentences(aiResponse);
        }
      }
    } catch (error) {
      console.error('AI API call failed:', error);
    }

    // Fallback to template sentences if AI fails
    if (generatedSentences.length === 0) {
      generatedSentences = generateFallbackSentences(cardName, isReversed, count, existingSentences);
    }

    // Ensure we have the right number of sentences
    if (generatedSentences.length > count) {
      generatedSentences = generatedSentences.slice(0, count);
    } else if (generatedSentences.length < count) {
      // Fill with fallback sentences if needed
      const additionalNeeded = count - generatedSentences.length;
      const fallbackSentences = generateFallbackSentences(cardName, isReversed, additionalNeeded, [...existingSentences, ...generatedSentences]);
      generatedSentences = [...generatedSentences, ...fallbackSentences];
    }

    return NextResponse.json({
      success: true,
      generatedSentences,
      cardInfo: {
        cardName,
        isReversed,
        ...cardInfo
      }
    });

  } catch (error) {
    console.error('Tarot sentences generate API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Parse AI response into individual sentences
function parseAISentences(aiResponse: string): string[] {
  return aiResponse
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^\d+\./) && !line.startsWith('-') && !line.startsWith('*'))
    .map(line => line.replace(/^["']|["']$/g, '')) // Remove surrounding quotes
    .filter(line => line.length > 10 && line.length < 200); // Reasonable sentence length
}

// Get card information (mock implementation - would be replaced with actual card data)
function getCardInfo(cardName: string, isReversed: boolean): { meaning: string; keywords: string[] } {
  // This is a basic implementation - in real app would use the tarot card data
  const basicMeanings: Record<string, { upright: { meaning: string; keywords: string[] }, reversed: { meaning: string; keywords: string[] } }> = {
    'The Fool': {
      upright: {
        meaning: 'New beginnings, innocence, spontaneity, a free spirit',
        keywords: ['new beginnings', 'innocence', 'spontaneity', 'adventure', 'leap of faith']
      },
      reversed: {
        meaning: 'Holds back, recklessness, risk-taking',
        keywords: ['recklessness', 'poor judgment', 'folly', 'lack of direction', 'carelessness']
      }
    }
  };

  const cardData = basicMeanings[cardName];
  if (cardData) {
    return isReversed ? cardData.reversed : cardData.upright;
  }

  // Fallback for unknown cards
  return {
    meaning: `The essence and energy of ${cardName}`,
    keywords: ['transformation', 'insight', 'guidance', 'wisdom', 'growth']
  };
}

// Generate fallback sentences when AI is unavailable
function generateFallbackSentences(cardName: string, isReversed: boolean, count: number, existingSentences: string[]): string[] {
  const templates = isReversed ? [
    `That friend who needs to think before they act`,
    `Someone whose enthusiasm needs a reality check`,
    `The person who jumps without looking first`,
    `That coworker who creates chaos wherever they go`,
    `Someone who mistakes recklessness for courage`
  ] : [
    `Someone ready to embrace new adventures`,
    `That friend who says yes to everything`,
    `The person who believes anything is possible`,
    `Someone with beginner's mind and fresh perspective`,
    `That optimist who sees opportunity everywhere`
  ];

  // Filter out any that match existing sentences
  const available = templates.filter(template => 
    !existingSentences.some(existing => 
      existing.toLowerCase().includes(template.toLowerCase().substring(0, 20))
    )
  );

  return available.slice(0, count);
}