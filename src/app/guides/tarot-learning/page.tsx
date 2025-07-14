/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { hasPremiumAccess } from '@/utils/premiumHelpers';
import { useTarotGame } from '@/hooks/useTarotGame';
import { useDailyUsage } from '@/hooks/useDailyUsage';
import CardMasteryGrid from '@/components/tarot/CardMasteryGrid';
import LevelBadge, { calculateLevel } from '@/components/tarot/LevelBadge';
import TarotFreemiumModal from '@/components/tarot/TarotFreemiumModal';
import TarotLeaderboard from '@/components/tarot/TarotLeaderboard';
import TarotGameInterface from '@/components/tarot/TarotGameInterface';

export default function TarotLearningPage() {
  const { user } = useUserStore();
  const [showFreemiumModal, setShowFreemiumModal] = useState(false);

  // Check if user has premium access
  const userHasPremium = hasPremiumAccess(user);

  // Track daily usage for freemium system
  const {
    interpretationsToday,
    canPlayToday,
    remainingPlays,
    dailyLimit,
    incrementUsage,
    resetIfNewDay
  } = useDailyUsage(user?.id, userHasPremium);

  // Use the extracted tarot game hook
  const {
    gameState,
    setGameState,
    userProgress,
    leaderboard,
    startGame: gameStartGame,
    submitInterpretation,
    nextCard,
    endGame,
    getUserLevelFromProgress,
    getUserLevelFromAccuracy
  } = useTarotGame(user?.id, incrementUsage);

  const startGame = async () => {
    resetIfNewDay(); // Check if it's a new day and reset counters
    
    if (!canPlayToday) {
      setShowFreemiumModal(true);
      return;
    }
    
    // Show freemium modal for first-time users or as introduction
    if (!userHasPremium && interpretationsToday === 0) {
      setShowFreemiumModal(true);
      return;
    }
    
    await gameStartGame();
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 py-8 border-b border-black">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
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
              {!userHasPremium && (
                <div className="mt-4 bg-blue-50 border border-blue-200 p-3 inline-block">
                  <p className="text-blue-800 text-sm font-inter">
                    <strong>Free Daily Limit:</strong> {remainingPlays} interpretation{remainingPlays !== 1 ? 's' : ''} remaining today
                  </p>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <LevelBadge 
                level={calculateLevel(userProgress.totalScore)} 
                size="large" 
                showLabel={false}
                showProgressDetails={true}
                totalPoints={userProgress.totalScore}
              />
            </div>
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
                  {userHasPremium ? 'Start Learning Journey' : 
                   canPlayToday ? `Play Today (${remainingPlays} left)` : 
                   'Daily Limit Reached'}
                </button>
              </div>

              {/* Sidebar: Leaderboard & Progress */}
              <div>
                <TarotLeaderboard 
                  leaderboard={leaderboard}
                  userProgress={userProgress}
                  user={user}
                  userHasPremium={userHasPremium}
                  getUserLevel={getUserLevelFromAccuracy}
                />
                
                {!userHasPremium && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200">
                    <h3 className="font-bold text-yellow-800 mb-2 font-space-grotesk">Upgrade to Premium</h3>
                    <ul className="text-sm text-yellow-700 space-y-1 font-inter">
                      <li>• Unlimited daily interpretations</li>
                      <li>• Advanced progress tracking</li>
                      <li>• Future: Multi-card spreads</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Card Mastery Grid */}
            {user && (
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
            canPlayMore={canPlayToday}
            remainingPlays={remainingPlays}
            onShowUsageLimit={() => setShowFreemiumModal(true)}
          />
        )}
      </div>

      <TarotFreemiumModal 
        isOpen={showFreemiumModal}
        onClose={() => setShowFreemiumModal(false)}
        interpretationsToday={interpretationsToday}
        remainingPlays={remainingPlays}
        onUpgrade={() => {
          // Could redirect to upgrade page or show upgrade options
          console.log('User wants to upgrade to premium');
        }}
      />
    </div>
  );
}