/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  EvaluationResult, 
  AccuracyRating, 
  ScoringMetrics,
  FeedbackComponents 
} from '@/types/tarotEvaluation';

export class TarotScoringUtils {
  /**
   * Evaluate interpretation using traditional scoring algorithm
   */
  static evaluateInterpretation(
    interpretation: string,
    cardMeaning: string,
    cardKeywords: string[],
    situation: string
  ): EvaluationResult {
    const interpretationLower = interpretation.toLowerCase();
    const cardMeaningLower = cardMeaning.toLowerCase();
    
    // Calculate scoring metrics
    const metrics = this.calculateScoringMetrics(
      interpretationLower,
      cardMeaningLower,
      cardKeywords,
      situation
    );

    // Generate feedback components
    const feedbackComponents = this.generateFeedbackComponents(
      metrics,
      interpretation,
      cardMeaning,
      cardKeywords,
      situation
    );

    return {
      score: metrics.finalScore,
      feedback: feedbackComponents.feedback,
      accuracyRating: this.getAccuracyRating(metrics.finalScore),
      keywordAccuracy: metrics.keywordAccuracy,
      contextRelevance: metrics.contextRelevance,
      traditionalAlignment: metrics.traditionalAlignment,
      creativityBonus: metrics.creativityBonus,
      strengthsIdentified: feedbackComponents.strengths,
      improvementAreas: feedbackComponents.improvements,
      recommendedStudy: feedbackComponents.study
    };
  }

  /**
   * Calculate all scoring metrics
   */
  private static calculateScoringMetrics(
    interpretationLower: string,
    cardMeaningLower: string,
    cardKeywords: string[],
    situation: string
  ): ScoringMetrics {
    // Keyword accuracy - how many card keywords are mentioned
    const keywordMatches = cardKeywords.filter(keyword => 
      interpretationLower.includes(keyword.toLowerCase())
    ).length;
    const keywordAccuracy = Math.min(keywordMatches / Math.max(cardKeywords.length * 0.5, 1), 1);
    
    // Traditional alignment - how well interpretation matches traditional meaning
    const meaningWords = cardMeaningLower.split(' ');
    const interpretationWords = interpretationLower.split(' ');
    const meaningMatches = meaningWords.filter(word => 
      word.length > 3 && interpretationWords.some(iWord => 
        iWord.includes(word) || word.includes(iWord)
      )
    ).length;
    const traditionalAlignment = Math.min(meaningMatches / Math.max(meaningWords.length * 0.3, 1), 1);
    
    // Context relevance - mentions situation-relevant concepts
    const situationWords = situation.toLowerCase().split(' ');
    const contextMatches = situationWords.filter(word => 
      word.length > 4 && interpretationLower.includes(word)
    ).length;
    const contextRelevance = Math.min(contextMatches / Math.max(situationWords.length * 0.2, 1), 1);
    
    // Creativity bonus - longer, more detailed interpretations
    const creativityBonus = Math.min(interpretationLower.length / 200, 0.3);
    
    // Calculate overall score (0-100)
    const baseScore = (keywordAccuracy * 0.3 + traditionalAlignment * 0.4 + contextRelevance * 0.3) * 100;
    const finalScore = Math.min(Math.round(baseScore + (creativityBonus * 20)), 100);

    return {
      keywordAccuracy,
      traditionalAlignment,
      contextRelevance,
      creativityBonus,
      finalScore
    };
  }

  /**
   * Generate feedback components based on scoring metrics
   */
  private static generateFeedbackComponents(
    metrics: ScoringMetrics,
    interpretation: string,
    cardMeaning: string,
    cardKeywords: string[],
    situation: string
  ): FeedbackComponents {
    const strengths: string[] = [];
    const improvements: string[] = [];
    const study: string[] = [];
    
    // Analyze keyword usage
    if (metrics.keywordAccuracy > 0.6) {
      strengths.push('Good use of traditional tarot keywords');
    } else {
      improvements.push('Try incorporating more traditional tarot keywords');
      study.push('Review the key meanings and symbols of this card');
    }
    
    // Analyze traditional alignment
    if (metrics.traditionalAlignment > 0.7) {
      strengths.push('Strong alignment with traditional card meanings');
    } else {
      improvements.push('Focus more on the traditional meanings of the card');
      study.push('Study classic tarot interpretations for this card');
    }
    
    // Analyze context relevance
    if (metrics.contextRelevance > 0.6) {
      strengths.push('Good application of card meaning to the specific situation');
    } else {
      improvements.push('Try to connect the card more directly to the given situation');
      study.push('Practice relating card meanings to real-life scenarios');
    }
    
    // Analyze interpretation length
    if (interpretation.length > 150) {
      strengths.push('Detailed and thoughtful interpretation');
    } else {
      improvements.push('Consider providing more detailed explanations');
      study.push('Practice writing comprehensive card interpretations');
    }

    // Generate main feedback text
    const feedback = this.createFeedbackText(
      metrics.finalScore,
      strengths,
      improvements,
      cardMeaning,
      cardKeywords,
      situation
    );

    return {
      strengths,
      improvements,
      study,
      feedback
    };
  }

  /**
   * Create comprehensive feedback text
   */
  private static createFeedbackText(
    finalScore: number,
    strengths: string[],
    improvements: string[],
    cardMeaning: string,
    cardKeywords: string[],
    situation: string
  ): string {
    let feedback = `You scored ${finalScore} points. `;
    
    // Add performance assessment
    if (finalScore >= 85) {
      feedback += 'Excellent work! Your interpretation shows deep understanding.\n\n';
    } else if (finalScore >= 70) {
      feedback += 'Good interpretation with solid grasp of the card\'s meaning.\n\n';
    } else if (finalScore >= 55) {
      feedback += 'Fair interpretation - you\'re on the right track.\n\n';
    } else {
      feedback += 'This is a learning opportunity - here\'s how to approach it:\n\n';
    }
    
    // Add sample interpretation
    const sampleInterpretation = this.generateSampleInterpretation(cardMeaning, cardKeywords, situation);
    feedback += `SAMPLE INTERPRETATION:\n${sampleInterpretation}\n\n`;
    
    // Add traditional meaning
    feedback += `TRADITIONAL MEANING: ${cardMeaning}\n\n`;
    
    // Add strengths if any
    if (strengths.length > 0) {
      feedback += `STRENGTHS: ${strengths.join(', ')}\n\n`;
    }
    
    // Add improvement areas
    if (improvements.length > 0) {
      feedback += `AREAS TO DEVELOP: ${improvements.join(', ')}`;
    }
    
    return feedback;
  }

  /**
   * Generate sample interpretation for feedback
   */
  private static generateSampleInterpretation(
    cardMeaning: string,
    cardKeywords: string[],
    situation: string
  ): string {
    const keywords = cardKeywords.slice(0, 3);
    const context = this.extractSituationContext(situation);
    
    return `In ${context}, this card suggests ${cardMeaning.toLowerCase()}. The energy of ${keywords[0]} indicates a time for ${keywords[1]} and ${keywords[2]}. Consider embracing these themes as guidance for moving forward with wisdom and clarity.`;
  }

  /**
   * Extract situation context for sample interpretation
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
   * Get accuracy rating based on score
   */
  static getAccuracyRating(score: number): AccuracyRating {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'fair';
    return 'needs_improvement';
  }

  /**
   * Calculate percentage from score
   */
  static scoreToPercentage(score: number): number {
    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Check if score represents mastery
   */
  static isMasteryScore(score: number): boolean {
    return score >= 70;
  }

  /**
   * Check if score is perfect
   */
  static isPerfectScore(score: number): boolean {
    return score === 100;
  }

  /**
   * Get score category for analytics
   */
  static getScoreCategory(score: number): 'low' | 'medium' | 'high' | 'perfect' {
    if (score === 100) return 'perfect';
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  /**
   * Calculate improvement from previous score
   */
  static calculateImprovement(currentScore: number, previousScore: number): {
    improvement: number;
    direction: 'improved' | 'declined' | 'maintained';
    percentage: number;
  } {
    const improvement = currentScore - previousScore;
    const percentage = previousScore > 0 ? (improvement / previousScore) * 100 : 0;
    
    let direction: 'improved' | 'declined' | 'maintained';
    if (improvement > 0) direction = 'improved';
    else if (improvement < 0) direction = 'declined';
    else direction = 'maintained';

    return {
      improvement,
      direction,
      percentage
    };
  }
}