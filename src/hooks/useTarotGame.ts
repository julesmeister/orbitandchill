/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getRandomCard, getCardPrioritizingUnused, TarotCard } from '@/data/tarotCards';
import { useSituationGeneration } from '@/hooks/useSituationGeneration';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';

interface GameState {
  isPlaying: boolean;
  currentCard: TarotCard | null;
  cardOrientation: 'upright' | 'reversed';
  situation: string;
  userInterpretation: string;
  feedback: string | null;
  score: number;
  cardsCompleted: number;
  isLoading: boolean;
}

interface UserProgress {
  totalScore: number;
  totalCards: number;
  accuracy: number;
  level: string;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  cardsCompleted: number;
  accuracy: number;
  lastPlayed: string;
}

export const useTarotGame = (userId?: string, onUsageIncrement?: () => void) => {
  // Get persisted AI configuration and situation generation hook
  const { aiProvider, aiModel, aiApiKey, temperature } = useSeedingPersistence();
  const { generateSituation } = useSituationGeneration();
  
  // AI config with fallback
  const aiConfig = {
    provider: aiProvider as 'openrouter' | 'openai' | 'claude' | 'gemini',
    model: aiModel || 'deepseek/deepseek-r1-distill-llama-70b:free',
    apiKey: aiApiKey || '',
    temperature: temperature || 0.7
  };
  
  // Debug AI configuration
  console.log('useTarotGame: AI Configuration loaded:', {
    provider: aiProvider,
    model: aiModel,
    hasApiKey: !!aiApiKey,
    apiKeyLength: aiApiKey?.length || 0,
    temperature
  });
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentCard: null,
    cardOrientation: 'upright',
    situation: '',
    userInterpretation: '',
    feedback: null,
    score: 0,
    cardsCompleted: 0,
    isLoading: false
  });

  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalScore: 0,
    totalCards: 0,
    accuracy: 0,
    level: 'Novice'
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
  
  // Debug logging for loading state changes
  useEffect(() => {
    console.log('isLeaderboardLoading changed:', isLeaderboardLoading);
  }, [isLeaderboardLoading]);

  const loadUserProgress = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/tarot/progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
      }
    } catch (error) {
      console.warn('Failed to load user progress:', error);
    }
  }, [userId]);

  const loadLeaderboard = useCallback(async () => {
    console.log('Loading leaderboard - setting loading to true');
    setIsLeaderboardLoading(true);
    try {
      const response = await fetch('/api/tarot/leaderboard');
      if (response.ok) {
        const data = await response.json();
        // console.log('Leaderboard API response:', data);
        const leaderboardData = data.leaderboard || [];
        setLeaderboard(leaderboardData);
        setIsLeaderboardLoading(false);
      } else {
        console.warn('Failed to load leaderboard: HTTP', response.status);
        setLeaderboard([]);
        setIsLeaderboardLoading(false);
      }
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
      setLeaderboard([]);
      setIsLeaderboardLoading(false);
    }
  }, []);

  // Load user progress and leaderboard
  useEffect(() => {
    if (userId) {
      loadUserProgress();
    }
    loadLeaderboard();
  }, [userId, loadUserProgress, loadLeaderboard]);

  const startGame = async () => {
    const prioritizedCard = await getCardPrioritizingUnused(userId);
    const initialOrientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';
    
    setGameState({
      ...gameState,
      isPlaying: true,
      currentCard: prioritizedCard,
      cardOrientation: initialOrientation,
      situation: '',
      userInterpretation: '',
      feedback: null,
      isLoading: true
    });

    // Generate AI situation for the starting card
    try {
      const generated = await generateSituation({
        card: prioritizedCard,
        aiConfig,
        previousSituations: []
      });
      
      const fullSituation = `${generated.situation}\n\n${generated.question}`;
      
      setGameState(prev => ({
        ...prev,
        situation: fullSituation,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to generate starting situation:', error);
      
      // Set error state and stop the game
      setGameState(prev => ({
        ...prev,
        situation: 'Failed to generate situation. Please check your AI configuration and try again.',
        isLoading: false,
        isPlaying: false
      }));
    }
  };

  const submitInterpretation = async (): Promise<void> => {
    if (!gameState.currentCard || !gameState.userInterpretation.trim()) return;

    setGameState(prev => ({ ...prev, isLoading: true }));
    
    // Increment daily usage counter for freemium system
    onUsageIncrement?.();

    try {
      const response = await fetch('/api/tarot/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          cardId: gameState.currentCard.id,
          cardOrientation: gameState.cardOrientation,
          situation: gameState.situation,
          interpretation: gameState.userInterpretation,
          cardMeaning: gameState.cardOrientation === 'upright' 
            ? gameState.currentCard.uprightMeaning 
            : gameState.currentCard.reversedMeaning,
          cardKeywords: gameState.cardOrientation === 'upright'
            ? gameState.currentCard.keywords.upright
            : gameState.currentCard.keywords.reversed,
          aiConfig: aiConfig
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameState(prev => ({
          ...prev,
          feedback: result.feedback,
          score: prev.score + result.score,
          cardsCompleted: prev.cardsCompleted + 1,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Failed to submit interpretation:', error);
      setGameState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const nextCard = async () => {
    const prioritizedCard = await getCardPrioritizingUnused(userId);
    const nextOrientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';
    
    setGameState(prev => ({
      ...prev,
      currentCard: prioritizedCard,
      cardOrientation: nextOrientation,
      userInterpretation: '',
      feedback: null,
      isLoading: true
    }));

    // Generate AI situation for the new card
    try {
      const generated = await generateSituation({
        card: prioritizedCard,
        aiConfig,
        previousSituations: [] // Could track previous situations here too
      });
      
      const fullSituation = `${generated.situation}\n\n${generated.question}`;
      
      setGameState(prev => ({
        ...prev,
        situation: fullSituation,
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to generate situation for next card:', error);
      
      // Set error state
      setGameState(prev => ({
        ...prev,
        situation: 'Failed to generate new situation. Please check your AI configuration and try again.',
        isLoading: false
      }));
    }
  };

  const endGame = () => {
    setGameState({
      isPlaying: false,
      currentCard: null,
      cardOrientation: 'upright',
      situation: '',
      userInterpretation: '',
      feedback: null,
      score: 0,
      cardsCompleted: 0,
      isLoading: false
    });
  };

  const getUserLevel = (totalScore: number) => {
    if (totalScore >= 25000) return 'Grandmaster';
    if (totalScore >= 10000) return 'Master';
    if (totalScore >= 5000) return 'Adept';
    if (totalScore >= 1000) return 'Apprentice';
    return 'Novice';
  };
  
  const getUserLevelFromProgress = (userProgress: UserProgress) => {
    return getUserLevel(userProgress.totalScore);
  };

  // Function that matches TarotLeaderboard's expected signature
  const getUserLevelFromAccuracy = (accuracy: number) => {
    return getUserLevel(accuracy);
  };

  return {
    // State
    gameState,
    setGameState,
    userProgress,
    leaderboard,
    isLeaderboardLoading,
    
    // Actions
    startGame,
    submitInterpretation,
    nextCard,
    endGame,
    loadUserProgress,
    loadLeaderboard,
    
    // Utilities
    getUserLevel,
    getUserLevelFromProgress,
    getUserLevelFromAccuracy,
    aiConfig
  };
};