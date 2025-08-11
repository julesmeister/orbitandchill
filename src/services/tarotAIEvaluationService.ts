/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  AIEvaluationRequest, 
  AIEvaluationResult, 
  BasicEvaluationParams,
  AIConfig 
} from '@/types/tarotEvaluation';

export class TarotAIEvaluationService {
  /**
   * Generate AI evaluation for tarot interpretation
   */
  static async generateAIEvaluation(params: AIEvaluationRequest): Promise<AIEvaluationResult> {
    const { userInterpretation, cardMeaning, cardKeywords, situation, aiConfig } = params;

    if (!aiConfig || !aiConfig.apiKey) {
      console.log('No AI config provided, using fallback evaluation');
      return this.generateBasicEvaluation({
        interpretation: userInterpretation,
        cardMeaning,
        cardKeywords,
        situation
      });
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tarot/ai-evaluate`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInterpretation,
            cardMeaning,
            cardKeywords,
            situation,
            aiConfig
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return {
            score: result.score,
            feedback: result.feedback,
            sampleInterpretation: result.sampleInterpretation
          };
        }
      }
    } catch (error) {
      console.error('AI evaluation API failed:', error);
    }
    
    // Fallback to basic evaluation
    console.log('AI evaluation failed, using fallback evaluation');
    return this.generateBasicEvaluation({
      interpretation: userInterpretation,
      cardMeaning,
      cardKeywords,
      situation
    });
  }

  /**
   * Fallback evaluation when AI is unavailable
   */
  static generateBasicEvaluation(params: BasicEvaluationParams): AIEvaluationResult {
    const { interpretation, cardMeaning, cardKeywords, situation } = params;
    
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

    const sampleInterpretation = this.generateFallbackSample(cardMeaning, cardKeywords, situation);

    return {
      score,
      feedback,
      sampleInterpretation
    };
  }

  /**
   * Generate simple fallback sample interpretation
   */
  private static generateFallbackSample(
    cardMeaning: string, 
    cardKeywords: string[], 
    situation: string
  ): string {
    const keywords = cardKeywords.slice(0, 3);
    const context = this.extractSituationContext(situation);
    
    return `In ${context}, this card suggests ${cardMeaning.toLowerCase()}. The energy of ${keywords[0]} indicates a time for ${keywords[1]} and ${keywords[2]}. Consider embracing these themes as guidance for moving forward with wisdom and clarity.`;
  }

  /**
   * Extract context type from situation description
   */
  private static extractSituationContext(situation: string): string {
    const situationLower = situation.toLowerCase();
    
    if (situationLower.includes('career') || situationLower.includes('job') || situationLower.includes('work')) {
      return 'this career situation';
    } else if (situationLower.includes('relationship') || situationLower.includes('partner') || situationLower.includes('love')) {
      return 'this relationship matter';
    } else if (situationLower.includes('family') || situationLower.includes('parent') || situationLower.includes('sibling')) {
      return 'this family dynamic';
    } else if (situationLower.includes('financial') || situationLower.includes('money') || situationLower.includes('investment')) {
      return 'this financial decision';
    } else {
      return 'this life situation';
    }
  }

  /**
   * Check if AI configuration is valid
   */
  static isValidAIConfig(aiConfig: any): aiConfig is AIConfig {
    return !!(
      aiConfig &&
      typeof aiConfig === 'object' &&
      aiConfig.provider &&
      aiConfig.model &&
      aiConfig.apiKey &&
      typeof aiConfig.temperature === 'number'
    );
  }

  /**
   * Create AI evaluation request from parameters
   */
  static createAIRequest(
    userInterpretation: string,
    cardMeaning: string,
    cardKeywords: string[],
    situation: string,
    aiConfig?: AIConfig
  ): AIEvaluationRequest {
    return {
      userInterpretation,
      cardMeaning,
      cardKeywords,
      situation,
      aiConfig
    };
  }

  /**
   * Validate AI evaluation result
   */
  static validateAIResult(result: any): result is AIEvaluationResult {
    return !!(
      result &&
      typeof result.score === 'number' &&
      result.score >= 0 &&
      result.score <= 100 &&
      typeof result.feedback === 'string' &&
      typeof result.sampleInterpretation === 'string'
    );
  }

  /**
   * Format evaluation feedback
   */
  static formatEvaluationFeedback(
    aiResult: AIEvaluationResult,
    cardMeaning: string
  ): string {
    return `${aiResult.feedback}\n\nEXPERT EXAMPLE:\n${aiResult.sampleInterpretation}\n\nTRADITIONAL MEANING:\n${cardMeaning}`;
  }

  /**
   * Create matching exercise feedback
   */
  static createMatchingFeedback(score: number): string {
    return `Matching exercise result: ${score}% accuracy`;
  }
}