/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { TarotCard } from '@/data/tarotCards';
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

export const useTarotGameInterface = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  userId?: string
) => {
  const [userRanking, setUserRanking] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [showHints, setShowHints] = useState(false);
  const [isFirstTimeCard, setIsFirstTimeCard] = useState(false);
  const [previousSituations, setPreviousSituations] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalScore: 0,
    totalCards: 0,
    accuracy: 0,
    level: 'Novice'
  });
  const [situationLoadingToast, setSituationLoadingToast] = useState(false);
  const [errorToast, setErrorToast] = useState({ visible: false, message: '' });
  const [evaluationLoadingToast, setEvaluationLoadingToast] = useState(false);

  // Get persisted AI configuration from SeedingTab
  const { aiProvider, aiModel, aiApiKey, temperature } = useSeedingPersistence();

  // Create AI config object with fallback
  const aiConfig = {
    provider: aiProvider as 'openrouter' | 'openai' | 'claude' | 'gemini',
    model: aiModel || 'deepseek/deepseek-r1-distill-llama-70b:free',
    apiKey: aiApiKey || '',
    temperature: temperature || 0.7
  };

  const { generateSituation, isGenerating } = useSituationGeneration();

  useEffect(() => {
    if (userId) {
      loadUserRanking();
      loadUserProgress();
      checkFirstTimeCard();
    }
  }, [userId, gameState.currentCard]);

  // Refresh progress when feedback is received (after evaluation)
  useEffect(() => {
    if (userId && gameState.feedback) {
      console.log('Feedback received, refreshing user progress...');
      loadUserProgress();
      loadUserRanking();
    }
  }, [userId, gameState.feedback]);

  // Hide situation loading toast when loading completes
  useEffect(() => {
    if (!gameState.isLoading && situationLoadingToast) {
      // Add a small delay to ensure the toast is visible for at least a moment
      const timer = setTimeout(() => {
        setSituationLoadingToast(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isLoading, situationLoadingToast]);

  // Debug: Log when userProgress state changes
  useEffect(() => {
    console.log('UserProgress state updated:', {
      totalScore: userProgress.totalScore,
      totalCards: userProgress.totalCards,
      accuracy: userProgress.accuracy,
      level: userProgress.level
    });
  }, [userProgress]);

  const loadUserRanking = async () => {
    try {
      const response = await fetch('/api/tarot/leaderboard');
      if (response.ok) {
        const data = await response.json();
        const userIndex = data.leaderboard.findIndex((entry: any) => entry.id === userId);
        setUserRanking(userIndex !== -1 ? userIndex + 1 : null);
        setTotalPlayers(data.leaderboard.length);
      }
    } catch (error) {
      console.warn('Failed to load ranking:', error);
    }
  };

  const loadUserProgress = async () => {
    if (!userId) return;
    
    try {
      console.log('Loading user progress for:', userId);
      const response = await fetch(`/api/tarot/progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('User progress loaded:', data.progress);
        console.log('Setting userProgress state to:', {
          totalScore: data.progress.totalScore,
          totalCards: data.progress.totalCards,
          accuracy: data.progress.accuracy,
          level: data.progress.level
        });
        setUserProgress(data.progress);
      } else {
        console.log('Progress response not ok:', response.status);
      }
    } catch (error) {
      console.warn('Failed to load user progress:', error);
    }
  };

  const checkFirstTimeCard = async () => {
    if (!userId || !gameState.currentCard) return;

    try {
      const response = await fetch(`/api/tarot/card-progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const cardProgress = data.progress[gameState.currentCard.id];
        setIsFirstTimeCard(!cardProgress || cardProgress.totalAttempts === 0);
      }
    } catch (error) {
      console.warn('Failed to check card progress:', error);
    }
  };

  const generateNewSituation = async () => {
    if (!gameState.currentCard) return;

    try {
      setGameState(prev => ({ ...prev, isLoading: true }));
      setSituationLoadingToast(true);
      console.log('StatusToast set to visible: true');

      // Generate new situation using AI or fallback
      const generated = await generateSituation({
        card: gameState.currentCard,
        aiConfig,
        previousSituations
      });

      // Combine situation and question
      const fullSituation = `${generated.situation}\n\n${generated.question}`;

      // Add to previous situations to avoid repetition
      setPreviousSituations(prev => [...prev.slice(-4), generated.situation]); // Keep last 5

      // Randomly assign new orientation for new situation
      const newOrientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';

      setGameState(prev => ({
        ...prev,
        situation: fullSituation,
        cardOrientation: newOrientation,
        userInterpretation: '', // Clear previous interpretation
        feedback: null, // Clear previous feedback
        isLoading: false
      }));

      // Delay hiding the toast to ensure it's visible
      setTimeout(() => {
        setSituationLoadingToast(false);
        console.log('StatusToast set to visible: false');
      }, 1000);

    } catch (error) {
      console.error('Failed to generate new situation:', error);

      // Show error toast
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate situation. Please try again.';
      setErrorToast({ visible: true, message: errorMessage });

      // Reset game state to loading false
      setGameState(prev => ({
        ...prev,
        isLoading: false
      }));

      // Hide loading toast
      setSituationLoadingToast(false);
    }
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const updateUserInterpretation = (interpretation: string) => {
    setGameState(prev => ({ ...prev, userInterpretation: interpretation }));
  };

  return {
    // State
    userRanking,
    totalPlayers,
    showHints,
    isFirstTimeCard,
    userProgress,
    situationLoadingToast,
    errorToast,
    evaluationLoadingToast,
    isGenerating,
    
    // Actions
    loadUserRanking,
    loadUserProgress,
    checkFirstTimeCard,
    generateNewSituation,
    toggleHints,
    updateUserInterpretation,
    setSituationLoadingToast,
    setErrorToast,
    setEvaluationLoadingToast,
    
    // AI Config
    aiConfig
  };
};