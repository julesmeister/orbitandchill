/* eslint-disable @typescript-eslint/no-unused-vars */
import { TarotEvaluationDatabase } from './tarotEvaluationDatabase';
import { TarotAIEvaluationService } from './tarotAIEvaluationService';
import { TarotScoringUtils } from '@/utils/tarotScoringUtils';
import {
  EvaluateRequest,
  EvaluationResponse,
  EvaluationResult,
  ProgressUpdateData,
  LeaderboardUpdateData,
  AIEvaluationRequest
} from '@/types/tarotEvaluation';

export class TarotEvaluationService {
  /**
   * Process complete tarot evaluation request
   */
  static async processEvaluation(request: EvaluateRequest): Promise<EvaluationResponse> {
    try {
      console.log('Processing tarot evaluation:', {
        userId: request.userId,
        cardId: request.cardId,
        cardOrientation: request.cardOrientation,
        hasOverrideScore: typeof request.overrideScore === 'number',
        overrideScore: request.overrideScore,
        situation: request.situation.substring(0, 100) + '...',
        interpretation: request.interpretation.substring(0, 100) + '...',
        aiConfig: request.aiConfig ? {
          provider: request.aiConfig.provider,
          model: request.aiConfig.model,
          hasApiKey: !!request.aiConfig.apiKey
        } : undefined
      });

      // Generate evaluation
      const evaluation = await this.generateEvaluation(request);
      
      // Save to database (continue even if this fails)
      try {
        await this.saveEvaluationData(request, evaluation);
      } catch (dbError) {
        console.error('Database save failed (continuing):', dbError);
      }

      return {
        success: true,
        score: evaluation.score,
        feedback: evaluation.feedback,
        accuracyRating: evaluation.accuracyRating,
        keywordAccuracy: evaluation.keywordAccuracy,
        contextRelevance: evaluation.contextRelevance,
        traditionalAlignment: evaluation.traditionalAlignment,
        creativityBonus: evaluation.creativityBonus,
        strengthsIdentified: evaluation.strengthsIdentified,
        improvementAreas: evaluation.improvementAreas,
        recommendedStudy: evaluation.recommendedStudy
      };
    } catch (error) {
      console.error('Tarot evaluation service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Evaluation failed'
      };
    }
  }

  /**
   * Generate evaluation using AI or override score
   */
  private static async generateEvaluation(request: EvaluateRequest): Promise<EvaluationResult> {
    // Check if we have an override score (for matching exercises)
    if (typeof request.overrideScore === 'number') {
      console.log('Using override score:', request.overrideScore);
      return this.createOverrideEvaluation(request.overrideScore);
    }

    // Use AI evaluation
    console.log('Using AI evaluation');
    return await this.generateAIEvaluation(request);
  }

  /**
   * Create evaluation result from override score
   */
  private static createOverrideEvaluation(overrideScore: number): EvaluationResult {
    const feedback = TarotAIEvaluationService.createMatchingFeedback(overrideScore);
    
    return {
      score: overrideScore,
      feedback: feedback,
      accuracyRating: TarotScoringUtils.getAccuracyRating(overrideScore),
      keywordAccuracy: 0, // Not applicable for matching exercises
      contextRelevance: 0, // Not applicable for matching exercises
      traditionalAlignment: 0, // Not applicable for matching exercises
      creativityBonus: 0, // Not applicable for matching exercises
      strengthsIdentified: [],
      improvementAreas: [],
      recommendedStudy: []
    };
  }

  /**
   * Generate AI-based evaluation
   */
  private static async generateAIEvaluation(request: EvaluateRequest): Promise<EvaluationResult> {
    const aiRequest: AIEvaluationRequest = {
      userInterpretation: request.interpretation,
      cardMeaning: request.cardMeaning,
      cardKeywords: request.cardKeywords,
      situation: request.situation,
      aiConfig: request.aiConfig
    };

    const aiResult = await TarotAIEvaluationService.generateAIEvaluation(aiRequest);
    const formattedFeedback = TarotAIEvaluationService.formatEvaluationFeedback(
      aiResult,
      request.cardMeaning
    );

    console.log('AI evaluation result:', { 
      score: aiResult.score, 
      feedback: formattedFeedback.substring(0, 100) + '...' 
    });

    return {
      score: aiResult.score,
      feedback: formattedFeedback,
      accuracyRating: TarotScoringUtils.getAccuracyRating(aiResult.score),
      keywordAccuracy: 0, // Not calculated with AI evaluation
      contextRelevance: 0, // Not calculated with AI evaluation  
      traditionalAlignment: 0, // Not calculated with AI evaluation
      creativityBonus: 0, // Not calculated with AI evaluation
      strengthsIdentified: [],
      improvementAreas: [],
      recommendedStudy: []
    };
  }

  /**
   * Save evaluation data to database
   */
  private static async saveEvaluationData(
    request: EvaluateRequest,
    evaluation: EvaluationResult
  ): Promise<void> {
    // Save session
    const sessionResult = await TarotEvaluationDatabase.saveSession({
      userId: request.userId,
      cardId: request.cardId,
      cardOrientation: request.cardOrientation,
      situation: request.situation,
      interpretation: request.interpretation,
      evaluation: evaluation
    });

    if (!sessionResult.success) {
      console.warn('Session save failed:', sessionResult.error);
    }

    // Update progress
    await this.updateUserProgress({
      userId: request.userId,
      cardId: request.cardId,
      cardOrientation: request.cardOrientation,
      score: evaluation.score,
      isCorrect: TarotScoringUtils.isMasteryScore(evaluation.score)
    });

    // Update leaderboard
    await this.updateUserLeaderboard({
      userId: request.userId,
      score: evaluation.score,
      isPerfect: TarotScoringUtils.isPerfectScore(evaluation.score)
    });
  }

  /**
   * Update user progress tracking
   */
  private static async updateUserProgress(updateData: ProgressUpdateData): Promise<void> {
    try {
      // Get existing progress
      const existingProgress = await TarotEvaluationDatabase.getProgress(
        updateData.userId, 
        updateData.cardId
      );

      if (existingProgress) {
        // Update existing progress
        const updateResult = await TarotEvaluationDatabase.updateProgress(
          updateData.userId,
          updateData.cardId,
          updateData,
          existingProgress
        );

        if (!updateResult.success) {
          console.warn('Progress update failed:', updateResult.error);
        } else {
          console.log('Progress updated successfully');
        }
      } else {
        // Create new progress record
        const createResult = await TarotEvaluationDatabase.createProgress(updateData);

        if (!createResult.success) {
          console.warn('Progress creation failed:', createResult.error);
        } else {
          console.log('New progress record created successfully');
        }
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  /**
   * Update user leaderboard entry
   */
  private static async updateUserLeaderboard(updateData: LeaderboardUpdateData): Promise<void> {
    try {
      // Get existing leaderboard entry
      const existingEntry = await TarotEvaluationDatabase.getLeaderboardEntry(updateData.userId);

      if (existingEntry) {
        // Update existing entry
        const updateResult = await TarotEvaluationDatabase.updateLeaderboard(
          updateData.userId,
          updateData,
          existingEntry
        );

        if (!updateResult.success) {
          console.warn('Leaderboard update failed:', updateResult.error);
        } else {
          console.log('Leaderboard updated successfully');
        }
      } else {
        // Create new leaderboard entry
        const username = await TarotEvaluationDatabase.getUsername(updateData.userId);
        const createResult = await TarotEvaluationDatabase.createLeaderboard(
          updateData.userId,
          username,
          updateData
        );

        if (!createResult.success) {
          console.warn('Leaderboard creation failed:', createResult.error);
        } else {
          console.log('New leaderboard entry created successfully');
        }
      }
    } catch (error) {
      console.error('Error updating user leaderboard:', error);
    }
  }

  /**
   * Get evaluation statistics for user
   */
  static async getUserStats(userId: string): Promise<{
    totalSessions: number;
    averageScore: number;
    totalScore: number;
    perfectScores: number;
  }> {
    // This would require additional database queries
    // For now, return placeholder data
    return {
      totalSessions: 0,
      averageScore: 0,
      totalScore: 0,
      perfectScores: 0
    };
  }

  /**
   * Get user progress for specific card
   */
  static async getCardProgress(userId: string, cardId: string): Promise<any> {
    try {
      const progress = await TarotEvaluationDatabase.getProgress(userId, cardId);
      return progress;
    } catch (error) {
      console.error('Error getting card progress:', error);
      return null;
    }
  }

  /**
   * Check if database is available
   */
  static isDatabaseAvailable(): boolean {
    return !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
  }

  /**
   * Validate evaluation request before processing
   */
  static validateRequest(request: EvaluateRequest): { valid: boolean; error?: string } {
    if (!request.userId || !request.cardId || !request.interpretation) {
      return { valid: false, error: 'Missing required fields' };
    }

    if (request.overrideScore !== undefined && 
        (typeof request.overrideScore !== 'number' || 
         request.overrideScore < 0 || 
         request.overrideScore > 100)) {
      return { valid: false, error: 'Invalid override score' };
    }

    return { valid: true };
  }
}