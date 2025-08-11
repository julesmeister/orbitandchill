/* eslint-disable @typescript-eslint/no-unused-vars */

export type CardOrientation = 'upright' | 'reversed';
export type AccuracyRating = 'excellent' | 'good' | 'fair' | 'needs_improvement';
export type FamiliarityLevel = 'novice' | 'apprentice' | 'adept' | 'master' | 'grandmaster';
export type SessionType = 'practice' | 'test' | 'matching';

// API Request/Response Types
export interface EvaluateRequest {
  userId: string;
  cardId: string;
  cardOrientation: CardOrientation;
  situation: string;
  interpretation: string;
  cardMeaning: string;
  cardKeywords: string[];
  aiConfig?: AIConfig;
  overrideScore?: number;
}

export interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  accuracyRating: AccuracyRating;
  keywordAccuracy: number;
  contextRelevance: number;
  traditionalAlignment: number;
  creativityBonus: number;
  strengthsIdentified: string[];
  improvementAreas: string[];
  recommendedStudy: string[];
}

export interface EvaluationResponse {
  success: boolean;
  error?: string;
  score?: number;
  feedback?: string;
  accuracyRating?: AccuracyRating;
  keywordAccuracy?: number;
  contextRelevance?: number;
  traditionalAlignment?: number;
  creativityBonus?: number;
  strengthsIdentified?: string[];
  improvementAreas?: string[];
  recommendedStudy?: string[];
}

// AI Evaluation Types
export interface AIEvaluationRequest {
  userInterpretation: string;
  cardMeaning: string;
  cardKeywords: string[];
  situation: string;
  aiConfig?: AIConfig;
}

export interface AIEvaluationResult {
  score: number;
  feedback: string;
  sampleInterpretation: string;
}

export interface BasicEvaluationParams {
  interpretation: string;
  cardMeaning: string;
  cardKeywords: string[];
  situation: string;
}

// Database Types
export interface DatabaseTarotSession {
  id: string;
  user_id: string;
  card_id: string;
  situation: string;
  user_interpretation: string;
  ai_evaluation: string;
  score: number;
  accuracy_rating: AccuracyRating;
  keyword_accuracy: number;
  context_relevance: number;
  traditional_alignment: number;
  creativity_bonus: number;
  strengths_identified: string; // JSON string
  improvement_areas: string; // JSON string
  recommended_study: string; // JSON string
  session_type: SessionType;
  created_at: string;
}

export interface DatabaseTarotProgress {
  id: string;
  user_id: string;
  card_id: string;
  total_attempts: number;
  total_score: number;
  average_score: number;
  best_score: number;
  mastery_percentage: number;
  upright_attempts: number;
  upright_score: number;
  upright_average: number;
  reversed_attempts: number;
  reversed_score: number;
  reversed_average: number;
  familiarity_level: FamiliarityLevel;
  last_attempt_date: string;
  last_played: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTarotLeaderboard {
  id: string;
  user_id: string;
  username: string;
  total_score: number;
  cards_completed: number;
  games_played: number;
  average_score: number;
  overall_accuracy: number;
  perfect_interpretations: number;
  last_played: string;
  created_at: string;
  updated_at: string;
}

// Application Types (after transformation)
export interface TarotSession {
  id: string;
  userId: string;
  cardId: string;
  situation: string;
  userInterpretation: string;
  aiEvaluation: string;
  score: number;
  accuracyRating: AccuracyRating;
  keywordAccuracy: number;
  contextRelevance: number;
  traditionalAlignment: number;
  creativityBonus: number;
  strengthsIdentified: string[];
  improvementAreas: string[];
  recommendedStudy: string[];
  sessionType: SessionType;
  createdAt: Date;
}

export interface TarotProgress {
  id: string;
  userId: string;
  cardId: string;
  totalAttempts: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  masteryPercentage: number;
  uprightAttempts: number;
  uprightScore: number;
  uprightAverage: number;
  reversedAttempts: number;
  reversedScore: number;
  reversedAverage: number;
  familiarityLevel: FamiliarityLevel;
  lastAttemptDate: Date;
  lastPlayed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TarotLeaderboard {
  id: string;
  userId: string;
  username: string;
  totalScore: number;
  cardsCompleted: number;
  gamesPlayed: number;
  averageScore: number;
  overallAccuracy: number;
  perfectInterpretations: number;
  lastPlayed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Progress Update Types
export interface ProgressUpdateData {
  userId: string;
  cardId: string;
  cardOrientation: CardOrientation;
  score: number;
  isCorrect: boolean;
}

export interface LeaderboardUpdateData {
  userId: string;
  score: number;
  isPerfect: boolean;
}

// Utility Types
export interface ScoringMetrics {
  keywordAccuracy: number;
  traditionalAlignment: number;
  contextRelevance: number;
  creativityBonus: number;
  finalScore: number;
}

export interface FeedbackComponents {
  strengths: string[];
  improvements: string[];
  study: string[];
  feedback: string;
}