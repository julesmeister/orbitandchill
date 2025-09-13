/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

interface AIEvaluateRequest {
  userInterpretation: string;
  cardMeaning: string;
  cardKeywords: string[];
  situation: string;
  aiConfig: {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
  };
}

interface AIEvaluateResponse {
  score: number;
  feedback: string;
  sampleInterpretation: string;
  success: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIEvaluateRequest = await request.json();
    const { userInterpretation, cardMeaning, cardKeywords, situation, aiConfig } = body;

    if (!userInterpretation || !cardMeaning || !aiConfig) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Create the evaluation prompt
    const prompt = `You are an expert tarot reader and teacher. Please evaluate this student's tarot card interpretation.

**Card Information:**
- Traditional Meaning: ${cardMeaning}
- Keywords: ${cardKeywords.join(', ')}

**Situation:** ${situation}

**Student's Interpretation:** "${userInterpretation}"

Please provide:
1. A score from 0-100 based on accuracy, insight, and connection to the situation
2. Brief constructive feedback (1-2 sentences max)
3. Your own concise interpretation (2-3 sentences max)

Format your response as:
SCORE: [number]
FEEDBACK: [brief feedback]
SAMPLE: [concise interpretation]

Keep your total response under 150 words.`;

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
            max_tokens: 150
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
            max_tokens: 150
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
      const scoreMatch = aiResponse.match(/SCORE:\s*(\d+)/);
      const feedbackMatch = aiResponse.match(/FEEDBACK:\s*([^]*?)(?=SAMPLE:|$)/);
      const sampleMatch = aiResponse.match(/SAMPLE:\s*([^]*?)$/);
      
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Good effort! Keep practicing.';
      const sampleInterpretation = sampleMatch ? sampleMatch[1].trim() : generateFallbackSample(cardMeaning, cardKeywords, situation);
      
      return NextResponse.json({
        success: true,
        score,
        feedback,
        sampleInterpretation
      });
    } else {
      // Fallback if AI fails
      const fallback = generateFallbackEvaluation(userInterpretation, cardMeaning, cardKeywords, situation);
      return NextResponse.json({
        success: true,
        ...fallback
      });
    }

  } catch (error) {
    console.error('AI evaluation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Fallback evaluation when AI is unavailable
function generateFallbackEvaluation(
  interpretation: string,
  cardMeaning: string,
  cardKeywords: string[],
  situation: string
): { score: number; feedback: string; sampleInterpretation: string } {
  
  // Simple scoring based on keyword presence and length
  const interpretationLower = interpretation.toLowerCase();
  const keywordMatches = cardKeywords.filter(keyword => 
    interpretationLower.includes(keyword.toLowerCase())
  ).length;
  
  const baseScore = Math.min((keywordMatches / cardKeywords.length) * 60 + 20, 80);
  const lengthBonus = Math.min(interpretation.length / 200 * 20, 20);
  const score = Math.round(baseScore + lengthBonus);

  let feedback = `You scored ${score} points. `;
  if (score >= 70) {
    feedback += 'Good work! Your interpretation shows understanding of the card.';
  } else if (score >= 50) {
    feedback += 'Fair interpretation. Try incorporating more traditional keywords.';
  } else {
    feedback += 'Keep practicing! Focus on the traditional meanings and keywords.';
  }

  const sampleInterpretation = generateFallbackSample(cardMeaning, cardKeywords, situation);

  return {
    score,
    feedback,
    sampleInterpretation
  };
}

// Generate a contextual sample interpretation
function generateFallbackSample(cardMeaning: string, cardKeywords: string[], situation: string): string {
  const keywords = cardKeywords.slice(0, 3);
  const context = extractSituationContext(situation);
  
  return `In ${context}, this card suggests ${cardMeaning.toLowerCase()}. The energy of ${keywords[0]} indicates a time for ${keywords[1]} and ${keywords[2]}. Consider embracing these themes as guidance for moving forward with wisdom and clarity.`;
}

function extractSituationContext(situation: string): string {
  if (situation.toLowerCase().includes('career') || situation.toLowerCase().includes('job') || situation.toLowerCase().includes('work')) {
    return 'this career situation';
  } else if (situation.toLowerCase().includes('relationship') || situation.toLowerCase().includes('partner') || situation.toLowerCase().includes('love')) {
    return 'this relationship matter';
  } else if (situation.toLowerCase().includes('family') || situation.toLowerCase().includes('parent') || situation.toLowerCase().includes('sibling')) {
    return 'this family dynamic';
  } else if (situation.toLowerCase().includes('financial') || situation.toLowerCase().includes('money') || situation.toLowerCase().includes('investment')) {
    return 'this financial decision';
  } else {
    return 'this life situation';
  }
}