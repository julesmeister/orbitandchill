/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { hasPremiumAccess } from '@/utils/premiumHelpers';
import { useTarotGame } from '@/hooks/useTarotGame';
import CardMasteryGrid from '@/components/tarot/CardMasteryGrid';
import LevelBadge, { calculateLevel } from '@/components/tarot/LevelBadge';
import TarotPremiumModal from '@/components/tarot/TarotPremiumModal';
import TarotLeaderboard from '@/components/tarot/TarotLeaderboard';
import TarotGameInterface from '@/components/tarot/TarotGameInterface';

export default function TarotLearningPage() {
  const { user } = useUserStore();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Check if user has premium access
  const userHasPremium = hasPremiumAccess(user);

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
    getUserLevelFromProgress
  } = useTarotGame(user?.id);

  const startGame = async () => {
    if (!userHasPremium) {
      setShowPremiumModal(true);
      return;
    }
    await gameStartGame();
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