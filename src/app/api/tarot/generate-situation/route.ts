/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

interface GenerateSituationRequest {
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
    const { previousSituations = [], aiConfig } = body;

    console.log('Generate situation API called with:', {
      provider: aiConfig?.provider,
      model: aiConfig?.model,
      hasApiKey: !!aiConfig?.apiKey,
      previousSituationsCount: previousSituations.length
    });

    if (!aiConfig) {
      return NextResponse.json({
        success: false,
        error: 'Missing AI configuration'
      }, { status: 400 });
    }

    if (!aiConfig.apiKey) {
      return NextResponse.json({
        success: false,
        error: 'AI API key is missing. Please configure your AI provider in the admin panel.'
      }, { status: 400 });
    }

    if (!aiConfig.provider) {
      return NextResponse.json({
        success: false,
        error: 'AI provider is missing. Please configure your AI provider in the admin panel.'
      }, { status: 400 });
    }

    const avoidList = previousSituations.length > 0 
      ? `\n\nAvoid these previously used scenarios: ${previousSituations.join('; ')}`
      : '';

    const prompt = `You are a creative writer creating diverse, realistic life scenarios for learning purposes.

CRITICAL REQUIREMENTS:
1. Create a COMPLETELY UNIQUE scenario each time - never repeat names, professions, or situations
2. Use diverse character names from different cultures and backgrounds
3. Vary the contexts: career, relationships, family, health, personal growth, finances
4. DO NOT use common names like "Liam", "Sarah", "John" - be creative and diverse
5. Each scenario must be distinctly different from any previous ones
6. NO tarot, mystical, or fortune-telling references

Variety Guidelines:
- Mix ages: teens, young adults, middle-aged, seniors
- Diverse professions: artist, nurse, student, entrepreneur, retiree, etc.
- Various life stages: single, married, divorced, new parent, empty nester
- Different cultures and backgrounds represented in names and contexts

Format your response as:
SITUATION: [completely unique scenario with diverse character]
QUESTION: [specific question about the situation]
CONTEXT: [one word: career/relationships/family/health/growth/finances]
DIFFICULTY: [beginner/intermediate/advanced]${avoidList}

Example:
SITUATION: Keiko, a 34-year-old graphic designer, just received news that her freelance contract won't be renewed. She has two months to find new income while supporting her elderly mother who recently moved in with her.
QUESTION: Should she take a stable but lower-paying corporate job or risk pursuing bigger freelance clients?
CONTEXT: career
DIFFICULTY: intermediate`;

    let aiResponse = '';

    try {
      // Use different AI providers based on config
      if (aiConfig.provider === 'openrouter' && aiConfig.apiKey) {
        console.log('Making OpenRouter API call with model:', aiConfig.model);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
            temperature: Math.max(aiConfig.temperature || 0.7, 0.8),
            max_tokens: 400
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        console.log('OpenRouter response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices[0]?.message?.content || '';
          console.log('OpenRouter response received, content length:', aiResponse.length);
        } else {
          const errorData = await response.text();
          console.error('OpenRouter error:', response.status, errorData);
          throw new Error(`OpenRouter API error (${response.status}): ${errorData}`);
        }
      } else if (aiConfig.provider === 'openai' && aiConfig.apiKey) {
        console.log('Making OpenAI API call with model:', aiConfig.model || 'gpt-4o-mini');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
            temperature: Math.max(aiConfig.temperature || 0.7, 0.8),
            max_tokens: 400
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        console.log('OpenAI response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          aiResponse = data.choices[0]?.message?.content || '';
          console.log('OpenAI response received, content length:', aiResponse.length);
        } else {
          const errorData = await response.text();
          console.error('OpenAI error:', response.status, errorData);
          throw new Error(`OpenAI API error (${response.status}): ${errorData}`);
        }
      } else {
        throw new Error(`Unsupported AI provider: ${aiConfig.provider}`);
      }
    } catch (error: any) {
      console.error('AI API call failed:', error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        throw new Error('AI request timed out. Please check your internet connection and try again.');
      } else if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
        throw new Error('Could not connect to AI service. Please check your internet connection and try again.');
      } else if (error.message?.includes('fetch failed')) {
        throw new Error('Network error: Unable to reach AI service. Please try again later.');
      }
      
      // Re-throw the error so it gets handled by the main catch block
      throw error;
    }

    if (aiResponse) {
      console.log('AI Response received:', aiResponse.substring(0, 200) + '...');
      // Parse AI response
      const parsed = parseAIResponse(aiResponse);
      if (parsed) {
        console.log('Successfully parsed AI response:', parsed);
        return NextResponse.json({
          success: true,
          ...parsed
        });
      } else {
        console.error('Failed to parse AI response:', aiResponse);
        return NextResponse.json({
          success: false,
          error: 'Failed to parse AI response. The AI may have returned an invalid format.'
        }, { status: 500 });
      }
    }

    // No fallback - return error if AI fails
    console.error('No AI response received');
    return NextResponse.json({
      success: false,
      error: 'No response received from AI provider. Please check your API key and try again.'
    }, { status: 500 });

  } catch (error) {
    console.error('Situation generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({
      success: false,
      error: errorMessage
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

    console.log('Parsing AI response lines:', lines);

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('SITUATION:')) {
        situation = trimmedLine.replace('SITUATION:', '').trim();
      } else if (trimmedLine.startsWith('QUESTION:')) {
        question = trimmedLine.replace('QUESTION:', '').trim();
      } else if (trimmedLine.startsWith('CONTEXT:')) {
        context = trimmedLine.replace('CONTEXT:', '').trim();
      } else if (trimmedLine.startsWith('DIFFICULTY:')) {
        const diff = trimmedLine.replace('DIFFICULTY:', '').trim().toLowerCase();
        if (diff === 'intermediate' || diff === 'advanced') {
          difficulty = diff as 'intermediate' | 'advanced';
        }
      }
    }

    console.log('Parsed values:', { situation, question, context, difficulty });

    if (situation && question) {
      return { situation, question, context, difficulty };
    }
    
    console.error('Missing required fields:', { 
      hasSituation: !!situation, 
      hasQuestion: !!question 
    });
    return null;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}

