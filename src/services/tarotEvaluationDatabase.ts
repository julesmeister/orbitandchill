/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from '@libsql/client/http';
import { 
  DatabaseTarotSession, 
  DatabaseTarotProgress, 
  DatabaseTarotLeaderboard,
  ProgressUpdateData,
  LeaderboardUpdateData,
  FamiliarityLevel,
  SessionType,
  AccuracyRating
} from '@/types/tarotEvaluation';

export class TarotEvaluationDatabase {
  private static createClient() {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    if (!databaseUrl || !authToken) {
      throw new Error('Database configuration missing');
    }
    
    return createClient({
      url: databaseUrl,
      authToken: authToken,
    });
  }

  /**
   * Save tarot session to database
   */
  static async saveSession(sessionData: {
    userId: string;
    cardId: string;
    cardOrientation: string;
    situation: string;
    interpretation: string;
    evaluation: any;
  }): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    try {
      const client = this.createClient();
      
      const sessionId = `tarot_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();

      await client.execute({
        sql: `INSERT INTO tarot_sessions (
          id, user_id, card_id, situation, user_interpretation, ai_evaluation,
          score, accuracy_rating, keyword_accuracy, context_relevance, 
          traditional_alignment, creativity_bonus, strengths_identified,
          improvement_areas, recommended_study, session_type, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          sessionId,
          sessionData.userId,
          `${sessionData.cardId}_${sessionData.cardOrientation}`,
          sessionData.situation,
          sessionData.interpretation,
          sessionData.evaluation.feedback,
          sessionData.evaluation.score,
          sessionData.evaluation.accuracyRating,
          sessionData.evaluation.keywordAccuracy,
          sessionData.evaluation.contextRelevance,
          sessionData.evaluation.traditionalAlignment,
          sessionData.evaluation.creativityBonus,
          JSON.stringify(sessionData.evaluation.strengthsIdentified),
          JSON.stringify(sessionData.evaluation.improvementAreas),
          JSON.stringify(sessionData.evaluation.recommendedStudy),
          'practice',
          now.toISOString()
        ]
      });

      return { success: true, sessionId };
    } catch (error) {
      console.error('Error saving tarot session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save session' 
      };
    }
  }

  /**
   * Get existing progress for user and card
   */
  static async getProgress(userId: string, cardId: string): Promise<DatabaseTarotProgress | null> {
    try {
      const client = this.createClient();
      
      const result = await client.execute({
        sql: 'SELECT * FROM tarot_progress WHERE user_id = ? AND card_id = ?',
        args: [userId, cardId]
      });

      if (result.rows.length > 0) {
        return result.rows[0] as unknown as DatabaseTarotProgress;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting tarot progress:', error);
      return null;
    }
  }

  /**
   * Update existing progress record
   */
  static async updateProgress(
    userId: string, 
    cardId: string, 
    updateData: ProgressUpdateData,
    currentProgress: DatabaseTarotProgress
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.createClient();
      const now = new Date();
      
      // Calculate new values
      const newTotalAttempts = (currentProgress.total_attempts || 0) + 1;
      const newTotalScore = (currentProgress.total_score || 0) + updateData.score;
      const newAverageScore = newTotalScore / newTotalAttempts;
      const newBestScore = Math.max(currentProgress.best_score || 0, updateData.score);

      // Update orientation-specific stats with weighted average
      let newUprightAttempts = currentProgress.upright_attempts || 0;
      let newUprightAverage = currentProgress.upright_average || 0;
      let newReversedAttempts = currentProgress.reversed_attempts || 0;
      let newReversedAverage = currentProgress.reversed_average || 0;

      if (updateData.cardOrientation === 'upright') {
        newUprightAttempts += 1;
        if (newUprightAttempts === 1) {
          newUprightAverage = updateData.score;
        } else {
          newUprightAverage = (newUprightAverage * 0.3) + (updateData.score * 0.7);
        }
      } else {
        newReversedAttempts += 1;
        if (newReversedAttempts === 1) {
          newReversedAverage = updateData.score;
        } else {
          newReversedAverage = (newReversedAverage * 0.3) + (updateData.score * 0.7);
        }
      }

      // Calculate derived values
      const newUprightScore = newUprightAverage * newUprightAttempts;
      const newReversedScore = newReversedAverage * newReversedAttempts;
      const masteryPercentage = Math.min((newAverageScore / 100) * 100, 100);
      
      // Determine familiarity level
      const familiarityLevel = this.calculateFamiliarityLevel(newTotalScore);

      await client.execute({
        sql: `UPDATE tarot_progress SET 
          total_attempts = ?, total_score = ?,
          average_score = ?, best_score = ?, mastery_percentage = ?,
          upright_attempts = ?, upright_score = ?, upright_average = ?,
          reversed_attempts = ?, reversed_score = ?, reversed_average = ?,
          familiarity_level = ?, last_attempt_date = ?, last_played = ?, updated_at = ?
          WHERE user_id = ? AND card_id = ?`,
        args: [
          newTotalAttempts, newTotalScore,
          newAverageScore, newBestScore, masteryPercentage,
          newUprightAttempts, newUprightScore, newUprightAverage,
          newReversedAttempts, newReversedScore, newReversedAverage,
          familiarityLevel, now.toISOString(), now.toISOString(), now.toISOString(),
          userId, cardId
        ]
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating tarot progress:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update progress' 
      };
    }
  }

  /**
   * Create new progress record
   */
  static async createProgress(updateData: ProgressUpdateData): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.createClient();
      const now = new Date();
      
      const progressId = `tarot_progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const masteryPercentage = Math.min((updateData.score / 100) * 100, 100);
      
      // Initialize orientation-specific stats
      const uprightAttempts = updateData.cardOrientation === 'upright' ? 1 : 0;
      const uprightAverage = updateData.cardOrientation === 'upright' ? updateData.score : 0;
      const uprightScore = uprightAverage * uprightAttempts;
      const reversedAttempts = updateData.cardOrientation === 'reversed' ? 1 : 0;
      const reversedAverage = updateData.cardOrientation === 'reversed' ? updateData.score : 0;
      const reversedScore = reversedAverage * reversedAttempts;
      
      const familiarityLevel = this.calculateFamiliarityLevel(updateData.score);

      await client.execute({
        sql: `INSERT OR REPLACE INTO tarot_progress (
          id, user_id, card_id, total_attempts,
          total_score, average_score, best_score, mastery_percentage,
          upright_attempts, upright_score, upright_average,
          reversed_attempts, reversed_score, reversed_average,
          familiarity_level, last_attempt_date, last_played, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          progressId, updateData.userId, updateData.cardId, 1,
          updateData.score, updateData.score, updateData.score, masteryPercentage,
          uprightAttempts, uprightScore, uprightAverage,
          reversedAttempts, reversedScore, reversedAverage,
          familiarityLevel, now.toISOString(), now.toISOString(),
          now.toISOString(), now.toISOString()
        ]
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating tarot progress:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create progress' 
      };
    }
  }

  /**
   * Get leaderboard entry for user
   */
  static async getLeaderboardEntry(userId: string): Promise<DatabaseTarotLeaderboard | null> {
    try {
      const client = this.createClient();
      
      const result = await client.execute({
        sql: 'SELECT * FROM tarot_leaderboard WHERE user_id = ?',
        args: [userId]
      });

      if (result.rows.length > 0) {
        return result.rows[0] as unknown as DatabaseTarotLeaderboard;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting leaderboard entry:', error);
      return null;
    }
  }

  /**
   * Update existing leaderboard entry
   */
  static async updateLeaderboard(
    userId: string, 
    updateData: LeaderboardUpdateData,
    currentEntry: DatabaseTarotLeaderboard
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.createClient();
      const now = new Date();
      
      const newTotalScore = (currentEntry.total_score || 0) + updateData.score;
      const newGamesPlayed = (currentEntry.games_played || 0) + 1;
      const newCardsCompleted = (currentEntry.cards_completed || 0) + 1;
      const newPerfectInterpretations = (currentEntry.perfect_interpretations || 0) + 
        (updateData.isPerfect ? 1 : 0);
      const newAverageScore = newTotalScore / newGamesPlayed;

      await client.execute({
        sql: `UPDATE tarot_leaderboard SET 
          total_score = ?, games_played = ?, cards_completed = ?,
          average_score = ?, overall_accuracy = ?, perfect_interpretations = ?,
          last_played = ?, updated_at = ?
          WHERE user_id = ?`,
        args: [
          newTotalScore, newGamesPlayed, newCardsCompleted,
          newAverageScore, (newAverageScore / 100) * 100, newPerfectInterpretations,
          now.toISOString(), now.toISOString(), userId
        ]
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update leaderboard' 
      };
    }
  }

  /**
   * Create new leaderboard entry
   */
  static async createLeaderboard(
    userId: string, 
    username: string,
    updateData: LeaderboardUpdateData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.createClient();
      const now = new Date();
      
      const leaderboardId = `tarot_leaderboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await client.execute({
        sql: `INSERT INTO tarot_leaderboard (
          id, user_id, username, total_score, cards_completed, games_played,
          average_score, overall_accuracy, perfect_interpretations,
          last_played, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          leaderboardId, userId, username, updateData.score, 1, 1,
          updateData.score, (updateData.score / 100) * 100, updateData.isPerfect ? 1 : 0,
          now.toISOString(), now.toISOString(), now.toISOString()
        ]
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating leaderboard entry:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create leaderboard entry' 
      };
    }
  }

  /**
   * Get username for user (try multiple tables)
   */
  static async getUsername(userId: string): Promise<string> {
    try {
      const client = this.createClient();
      
      // Try users table first
      const userResult = await client.execute({
        sql: 'SELECT * FROM users WHERE id = ? LIMIT 1',
        args: [userId]
      });
      
      if (userResult.rows.length > 0) {
        const userRow = userResult.rows[0] as any;
        return userRow.username || userRow.name || userRow.email || 'Anonymous';
      }

      // Try seed_users table
      const seedUserResult = await client.execute({
        sql: 'SELECT * FROM seed_users WHERE id = ? LIMIT 1',
        args: [userId]
      });
      
      if (seedUserResult.rows.length > 0) {
        const seedUserRow = seedUserResult.rows[0] as any;
        return seedUserRow.username || seedUserRow.name || 'Anonymous';
      }

      // Fallback to user ID fragment
      return `User ${userId.slice(-6)}`;
    } catch (error) {
      console.warn('Username lookup failed:', error);
      return `User ${userId.slice(-6)}`;
    }
  }

  /**
   * Check table schema (debugging utility)
   */
  static async getTableSchema(tableName: string): Promise<any[]> {
    try {
      const client = this.createClient();
      
      const result = await client.execute({
        sql: `PRAGMA table_info(${tableName})`,
        args: []
      });

      return result.rows;
    } catch (error) {
      console.warn(`Could not get ${tableName} schema:`, error);
      return [];
    }
  }

  /**
   * Private helper methods
   */
  private static calculateFamiliarityLevel(totalScore: number): FamiliarityLevel {
    if (totalScore >= 25000) return 'grandmaster';
    if (totalScore >= 10000) return 'master';
    if (totalScore >= 5000) return 'adept';
    if (totalScore >= 1000) return 'apprentice';
    return 'novice';
  }
}