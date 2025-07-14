/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TarotCard } from '@/data/tarotCards';
import { getCardImagePath } from '@/utils/tarotImageMapping';
import { useImageCache } from '@/hooks/useImageCache';
import Image from 'next/image';
import StatusToast from '@/components/reusable/StatusToast';

interface CardProgress {
  cardId: string;
  totalAttempts: number;
  averageScore: number;
  masteryPercentage: number;
  uprightAttempts: number;
  uprightAverage: number;
  reversedAttempts: number;
  reversedAverage: number;
  familiarityLevel: string;
  learningStreak: number;
  lastPlayed: string | null;
}

interface TarotMatchingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
  filteredCards: TarotCard[];
  userProgress: Record<string, CardProgress>;
  userId: string;
}

interface MatchingPair {
  id: string;
  type: 'card' | 'meaning';
  cardId: string;
  content: string; // Card meaning for type 'meaning', empty for type 'card'
  orientation: 'upright' | 'reversed';
  isMatched: boolean;
  isSelected: boolean;
}

interface PhraseChallenge {
  phrase: string;
  correctCardId: string;
  orientation: 'upright' | 'reversed';
}

interface GameStats {
  correctMatches: number;
  incorrectMatches: number;
  totalTime: number;
  score: number;
}

interface CardAttempt {
  cardId: string;
  orientation: 'upright' | 'reversed';
  isCorrect: boolean;
  phrase: string;
}

export default function TarotMatchingExercise({
  isOpen,
  onClose,
  filteredCards,
  userProgress,
  userId
}: TarotMatchingExerciseProps) {
  const [gameCards, setGameCards] = useState<TarotCard[]>([]);
  const [phraseChallenges, setPhraseChallenges] = useState<PhraseChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const cardAttemptsRef = useRef<CardAttempt[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    correctMatches: 0,
    incorrectMatches: 0,
    totalTime: 0,
    score: 0
  });
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showMatchToast, setShowMatchToast] = useState(false);
  const [matchToastMessage, setMatchToastMessage] = useState('');
  const { getCachedImageSrc } = useImageCache();

  // Difficulty settings
  const getDifficultySettings = (level: 'easy' | 'medium' | 'hard') => {
    switch (level) {
      case 'easy':
        return { cardCount: 6, timeBonus: 1.0 };
      case 'medium':
        return { cardCount: 10, timeBonus: 1.2 };
      case 'hard':
        return { cardCount: 16, timeBonus: 1.5 };
    }
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const settings = getDifficultySettings(difficulty);
    
    // Mix prioritized and random cards for variety
    const sortedCards = [...filteredCards].sort((a, b) => {
      const aProgress = userProgress[a.id]?.averageScore || 0;
      const bProgress = userProgress[b.id]?.averageScore || 0;
      return aProgress - bProgress; // Lower scores first for practice
    });
    
    // Take 50% from lowest mastery cards, 50% completely random for more variety
    const priorityCount = Math.ceil(settings.cardCount * 0.5);
    const randomCount = settings.cardCount - priorityCount;
    
    const priorityCards = sortedCards.slice(0, Math.min(priorityCount, sortedCards.length));
    const remainingCards = sortedCards.slice(priorityCount);
    const randomCards = remainingCards.sort(() => Math.random() - 0.5).slice(0, randomCount);
    
    const selectedCards = [...priorityCards, ...randomCards]
      .sort(() => Math.random() - 0.5) // Extra shuffle for more randomness
      .slice(0, Math.min(settings.cardCount, filteredCards.length));
    
    // Create phrase challenges from card meanings
    const challenges: PhraseChallenge[] = [];
    selectedCards.forEach(card => {
      // Create challenges for both orientations
      const orientations: ('upright' | 'reversed')[] = ['upright', 'reversed'];
      
      orientations.forEach(orientation => {
        const meaning = orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning;
        
        // Split meaning into phrases and create challenges
        const phrases = meaning.split(/[.,;]/).filter(phrase => phrase.trim()).map(p => p.trim());
        phrases.forEach(phrase => {
          if (phrase.length > 10) { // Only include substantial phrases
            challenges.push({
              phrase,
              correctCardId: card.id,
              orientation
            });
          }
        });
      });
    });
    
    // Shuffle challenges
    const shuffledChallenges = challenges.sort(() => Math.random() - 0.5);
    
    setGameCards(selectedCards);
    setPhraseChallenges(shuffledChallenges);
    setCurrentChallengeIndex(0);
    cardAttemptsRef.current = []; // Reset card attempts
    setGameStats({
      correctMatches: 0,
      incorrectMatches: 0,
      totalTime: 0,
      score: 0
    });
    setGameStartTime(Date.now());
    setGameActive(true);
    setGameComplete(false);
  }, [difficulty, filteredCards, userProgress]);

  // Update individual card progress based on attempts
  const updateCardProgress = async (attempts: CardAttempt[]) => {
    if (!userId || attempts.length === 0) return;

    // Group attempts by card and orientation
    const cardProgress: Record<string, { correct: number; total: number; orientation: 'upright' | 'reversed' }> = {};
    
    attempts.forEach(attempt => {
      const key = `${attempt.cardId}-${attempt.orientation}`;
      if (!cardProgress[key]) {
        cardProgress[key] = { correct: 0, total: 0, orientation: attempt.orientation };
      }
      cardProgress[key].total++;
      if (attempt.isCorrect) {
        cardProgress[key].correct++;
      }
    });

    // Update progress for each card/orientation combination
    const updatePromises = Object.entries(cardProgress).map(async ([key, data]) => {
      const [cardId] = key.split('-');
      const card = gameCards.find(c => c.id === cardId);
      if (!card) return;

      const score = Math.round((data.correct / data.total) * 100);
      
      try {
        await fetch('/api/tarot/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            cardId,
            cardOrientation: data.orientation,
            situation: `Matching exercise: ${data.total} attempts`,
            interpretation: `Completed ${data.correct}/${data.total} correctly`,
            cardMeaning: data.orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning,
            cardKeywords: data.orientation === 'upright' ? card.keywords.upright : card.keywords.reversed,
            aiConfig: { provider: 'internal', model: 'matching-exercise' }, // Special config for matching
            overrideScore: score // Force specific score based on matching performance
          })
        });
      } catch (error) {
        console.warn(`Failed to update progress for ${card.name} (${data.orientation}):`, error);
      }
    });

    await Promise.all(updatePromises);
  };

  // Handle card selection for current phrase
  const handleCardSelect = (cardId: string) => {
    if (!gameActive || gameComplete || currentChallengeIndex >= phraseChallenges.length) return;
    
    const currentChallenge = phraseChallenges[currentChallengeIndex];
    const isCorrect = cardId === currentChallenge.correctCardId;
    
    // Record this attempt for progress tracking
    const attempt: CardAttempt = {
      cardId,
      orientation: currentChallenge.orientation,
      isCorrect,
      phrase: currentChallenge.phrase
    };
    cardAttemptsRef.current = [...cardAttemptsRef.current, attempt];
    
    if (isCorrect) {
      // Correct answer!
      const cardName = gameCards.find(c => c.id === cardId)?.name || 'Card';
      setMatchToastMessage(`Correct! ${cardName}`);
      setShowMatchToast(true);
      
      setGameStats(prev => ({
        ...prev,
        correctMatches: prev.correctMatches + 1
      }));
      
      // Move to next challenge after a brief delay
      setTimeout(() => {
        setCurrentChallengeIndex(prev => prev + 1);
      }, 1500);
    } else {
      // Incorrect answer
      setGameStats(prev => ({
        ...prev,
        incorrectMatches: prev.incorrectMatches + 1
      }));
      
      // Show incorrect feedback
      setMatchToastMessage(`Try again! That's not the right card.`);
      setShowMatchToast(true);
    }
  };

  // Check if game is complete
  useEffect(() => {
    if (gameActive && currentChallengeIndex >= phraseChallenges.length && phraseChallenges.length > 0) {
      const endTime = Date.now();
      const totalTime = gameStartTime ? (endTime - gameStartTime) / 1000 : 0;
      const finalScore = gameStats.correctMatches - gameStats.incorrectMatches; // Correct answers minus incorrect attempts (can be negative)
      
      setGameStats(prev => ({
        ...prev,
        totalTime,
        score: finalScore
      }));
      setGameActive(false);
      setGameComplete(true);
      
      // Update individual card progress and award total points
      if (userId) {
        // Update individual card mastery progress
        updateCardProgress(cardAttemptsRef.current);
        
        // Award calculated points to user's tarot progress
        fetch('/api/tarot/award-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            points: finalScore,
            source: 'matching_exercise',
            details: {
              difficulty,
              phrasesCompleted: phraseChallenges.length,
              score: finalScore,
              time: totalTime,
              correctMatches: gameStats.correctMatches,
              incorrectMatches: gameStats.incorrectMatches
            }
          })
        }).catch(error => {
          console.warn('Failed to award points:', error);
        });
      }
    }
  }, [currentChallengeIndex, phraseChallenges.length, gameActive, gameStartTime, gameStats.correctMatches, gameStats.incorrectMatches, difficulty, userId]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && filteredCards.length > 0) {
      initializeGame();
    }
  }, [isOpen, initializeGame, filteredCards.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm border border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-black">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-space-grotesk text-black">
                🎯 Tarot Card Matching Practice
              </h2>
              <p className="text-black/70 font-inter mt-1">
                Match tarot cards with their names to improve recognition
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-black/40 hover:text-black text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {/* Game Stats */}
          {gameActive && (
            <div className="mt-4 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#4ade80]">✓</span>
                <span>Correct: {gameStats.correctMatches}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Incorrect: {gameStats.incorrectMatches}</span>
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Selection */}
        {!gameActive && !gameComplete && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 font-space-grotesk">Choose Difficulty</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {(['easy', 'medium', 'hard'] as const).map(level => {
                const settings = getDifficultySettings(level);
                return (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-4 border-2 transition-colors ${
                      difficulty === level
                        ? 'border-black bg-black text-white'
                        : 'border-black bg-white text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    <div className="font-space-grotesk font-semibold capitalize">{level}</div>
                    <div className="text-sm mt-1">{settings.cardCount} cards</div>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={initializeGame}
              className="w-full bg-black text-white py-3 px-6 font-semibold font-space-grotesk border-2 border-black hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 transition-all duration-300 disabled:bg-gray-400 disabled:border-gray-400 disabled:hover:transform-none disabled:hover:shadow-none"
              disabled={filteredCards.length === 0}
            >
              {filteredCards.length === 0 ? 'No cards available' : 'Start Matching Exercise'}
            </button>
          </div>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-4 font-space-grotesk">Exercise Complete!</h3>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-[#e7fff6] border-2 border-[#4ade80] p-3">
                <div className="font-semibold text-black font-space-grotesk">Phrases Completed</div>
                <div className="text-2xl font-bold text-black font-space-grotesk">{phraseChallenges.length}</div>
              </div>
              <div className="bg-red-50 border-2 border-red-400 p-3">
                <div className="font-semibold text-black font-space-grotesk">Incorrect Attempts</div>
                <div className="text-2xl font-bold text-black font-space-grotesk">{gameStats.incorrectMatches}</div>
              </div>
              <div className="bg-gray-50 border-2 border-black p-3">
                <div className="font-semibold text-black font-space-grotesk">Time Taken</div>
                <div className="text-2xl font-bold text-black font-space-grotesk">{Math.round(gameStats.totalTime)}s</div>
              </div>
              <div className="bg-white border-2 border-black p-3">
                <div className="font-semibold text-black font-space-grotesk">Final Score</div>
                <div className="text-2xl font-bold text-black font-space-grotesk">{gameStats.score}</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={initializeGame}
                className="flex-1 bg-black text-white py-3 px-6 font-semibold font-space-grotesk border-2 border-black hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 transition-all duration-300"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white border-2 border-black text-black py-3 px-6 font-semibold font-space-grotesk hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Game Grid */}
        {gameActive && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Side - Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center font-space-grotesk">
                  🃏 Tarot Cards
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gameCards.map(card => {
                    const currentChallenge = phraseChallenges[currentChallengeIndex];
                    // ALL cards show the same orientation as the current challenge
                    const cardOrientation = currentChallenge?.orientation || 'upright';
                    
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardSelect(card.id)}
                        className="aspect-[2/3] transition-all duration-200 relative hover:scale-105 hover:shadow-lg"
                      >
                        <div className="w-full h-full relative">
                          <Image
                            src={getCachedImageSrc(getCardImagePath(card.id))}
                            alt={card.name}
                            fill
                            className={`object-contain transition-transform ${
                              cardOrientation === 'reversed' ? 'rotate-180' : ''
                            }`}
                            sizes="200px"
                            loading="lazy"
                            quality={75}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Side - Current Phrase */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center font-space-grotesk">
                  📖 Match This Meaning
                </h3>
                <div className="p-6 bg-black text-white text-center border-2 border-black">
                  {phraseChallenges.length > 0 && currentChallengeIndex < phraseChallenges.length ? (
                    <>
                      <div className="mb-4">
                        <span className="text-sm text-gray-300">
                          Challenge {currentChallengeIndex + 1} of {phraseChallenges.length}
                        </span>
                      </div>
                      <p className="text-lg font-medium font-inter leading-relaxed">
                        "{phraseChallenges[currentChallengeIndex].phrase}"
                      </p>
                      <div className="mt-4 text-sm text-gray-300">
                        Click the card that matches this meaning
                      </div>
                    </>
                  ) : (
                    <p className="text-lg font-medium font-inter leading-relaxed">
                      Click the card that matches this meaning phrase
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-black/70 font-inter">
                Read the phrase and click the card that best matches its meaning.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Match Success Toast */}
      <StatusToast
        title="Great Match!"
        message={matchToastMessage}
        status="success"
        isVisible={showMatchToast}
        onHide={() => setShowMatchToast(false)}
        duration={2000}
      />
    </div>
  );
}