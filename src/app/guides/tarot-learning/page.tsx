/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { tarotCards, getRandomCard, TarotCard } from '@/data/tarotCards';
import { BRAND } from '@/config/brand';
import { useUserStore } from '@/store/userStore';
import { hasPremiumAccess } from '@/utils/premiumHelpers';
import { useSituationGeneration } from '@/hooks/useSituationGeneration';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';
import CardMasteryGrid from '@/components/tarot/CardMasteryGrid';
import LevelBadge, { calculateLevel, getLevelInfo } from '@/components/tarot/LevelBadge';
import TarotPremiumModal from '@/components/tarot/TarotPremiumModal';
import TarotLeaderboard from '@/components/tarot/TarotLeaderboard';
import TarotGameGuide from '@/components/tarot/TarotGameGuide';
import TarotGameInterface from '@/components/tarot/TarotGameInterface';

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

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  cardsCompleted: number;
  accuracy: number;
  lastPlayed: string;
}

const situations = [
  "A young professional is considering a major career change and has drawn this card for guidance.",
  "Someone is facing relationship challenges and wants to understand what this card reveals about their situation.",
  "A person is dealing with family conflicts and seeks insight from this card.",
  "An entrepreneur is launching a new business and draws this card for advice on their venture.",
  "Someone is struggling with self-doubt and personal growth, and this card appears in their reading.",
  "A person is making an important financial decision and this card comes up in their spread.",
  "Someone is dealing with grief and loss, and this card appears as guidance for healing.",
  "A student is facing academic challenges and draws this card for educational insight.",
  "A person is considering relocating to a new city and this card appears in their reading.",
  "Someone is dealing with health concerns and seeks guidance from this card."
];

export default function TarotLearningPage() {
  const { user } = useUserStore();
  
  // Get persisted AI configuration and situation generation hook
  const { aiProvider, aiModel, aiApiKey, temperature } = useSeedingPersistence();
  const { generateSituation, generateFallbackSituation } = useSituationGeneration();
  
  // AI config with fallback
  const aiConfig = {
    provider: aiProvider as 'openrouter' | 'openai' | 'claude' | 'gemini',
    model: aiModel || 'deepseek/deepseek-r1-distill-llama-70b:free',
    apiKey: aiApiKey || '',
    temperature: temperature || 0.7
  };
  
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

  const [userProgress, setUserProgress] = useState({
    totalScore: 0,
    totalCards: 0,
    accuracy: 0,
    level: 'Novice'
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Check if user has premium access
  const userHasPremium = hasPremiumAccess(user);

  useEffect(() => {
    loadUserProgress();
    loadLeaderboard();
  }, [user?.id]);

  const loadUserProgress = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/tarot/progress?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
      }
    } catch (error) {
      console.warn('Failed to load user progress:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/tarot/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
    }
  };

  const startGame = async () => {
    if (!userHasPremium) {
      setShowPremiumModal(true);
      return;
    }

    const randomCard = getRandomCard();
    const initialOrientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';
    
    setGameState({
      ...gameState,
      isPlaying: true,
      currentCard: randomCard,
      cardOrientation: initialOrientation,
      situation: '',
      userInterpretation: '',
      feedback: null,
      isLoading: true
    });

    // Generate AI situation for the starting card
    try {
      const generated = await generateSituation({
        card: randomCard,
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
      
      // Emergency fallback
      const emergency = generateFallbackSituation(randomCard);
      const fullSituation = `${emergency.situation}\n\n${emergency.question}`;
      
      setGameState(prev => ({
        ...prev,
        situation: fullSituation,
        isLoading: false
      }));
    }
  };

  const submitInterpretation = async (): Promise<void> => {
    if (!gameState.currentCard || !gameState.userInterpretation.trim()) return;

    setGameState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/tarot/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
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
    const randomCard = getRandomCard();
    const nextOrientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';
    
    setGameState(prev => ({
      ...prev,
      currentCard: randomCard,
      cardOrientation: nextOrientation,
      userInterpretation: '',
      feedback: null,
      isLoading: true
    }));

    // Generate AI situation for the new card
    try {
      const generated = await generateSituation({
        card: randomCard,
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
      
      // Emergency fallback
      const emergency = generateFallbackSituation(randomCard);
      const fullSituation = `${emergency.situation}\n\n${emergency.question}`;
      
      setGameState(prev => ({
        ...prev,
        situation: fullSituation,
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
  
  const getUserLevelFromProgress = (userProgress: any) => {
    return getUserLevel(userProgress.totalScore);
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 py-8 border-b border-black">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/guides" className="inline-flex items-center gap-2 text-black hover:text-black/70 font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Guides
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-black font-space-grotesk mb-2">
                Tarot Learning Game 🔮
              </h1>
              <p className="text-black/70 font-inter">
                Master the meanings of all 78 tarot cards through interactive scenarios and AI-powered feedback
              </p>
            </div>
            {userHasPremium && (
              <LevelBadge 
                level={calculateLevel(userProgress.totalScore)} 
                size="large" 
                showLabel={false}
              />
            )}
          </div>
        </section>

        {!gameState.isPlaying ? (
          <div className="px-6 md:px-12 lg:px-20 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Game Guide */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 font-space-grotesk text-black">How to Play</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white  flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 font-space-grotesk text-black">Draw a Card</h3>
                      <p className="text-black/70 font-inter">A random tarot card will be presented along with a real-life situation.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white  flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 font-space-grotesk text-black">Interpret the Card</h3>
                      <p className="text-black/70 font-inter">Write your interpretation of what the card means in the given context.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white  flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 font-space-grotesk text-black">Get AI Feedback</h3>
                      <p className="text-black/70 font-inter">Receive personalized feedback on your interpretation and learn the traditional meanings.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-black text-white  flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 font-space-grotesk text-black">Track Progress</h3>
                      <p className="text-black/70 font-inter">Build your familiarity with each card and climb the leaderboard!</p>
                    </div>
                  </div>
                </div>


                <button
                  onClick={startGame}
                  className="w-full mt-8 bg-black text-white px-8 py-4  font-semibold text-lg border-2 border-black hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 transition-all duration-300 font-space-grotesk"
                >
                  Start Learning Journey
                </button>
              </div>

              {/* Sidebar: Leaderboard & Progress */}
              <TarotLeaderboard 
                leaderboard={leaderboard}
                userProgress={userProgress}
                user={user}
                userHasPremium={userHasPremium}
                getUserLevel={getUserLevelFromProgress}
              />
            </div>
            
            {/* Card Mastery Grid */}
            {user && userHasPremium && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-space-grotesk">Card Mastery Progress</h2>
                  <div className="text-sm text-gray-500">
                    Track your progress with all 78 tarot cards
                  </div>
                </div>
                
                <CardMasteryGrid userId={user.id} />
              </div>
            )}
          </div>
        ) : (
          <TarotGameInterface 
            gameState={gameState}
            setGameState={setGameState}
            endGame={endGame}
            submitInterpretation={submitInterpretation}
            nextCard={nextCard}
            userId={user?.id}
          />
        )}
      </div>

      <TarotPremiumModal 
        showPremiumModal={showPremiumModal}
        setShowPremiumModal={setShowPremiumModal}
      />
    </div>
  );
}