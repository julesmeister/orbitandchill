/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { TarotCard } from '@/data/tarotCards';
import { getCardImagePath } from '@/utils/tarotImageMapping';
import { useSituationGeneration } from '@/hooks/useSituationGeneration';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';
import Image from 'next/image';
import StatusToast from '@/components/reusable/StatusToast';

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

interface TarotGameInterfaceProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  endGame: () => void;
  submitInterpretation: () => Promise<void>;
  nextCard: () => void;
  userId?: string;
}

export default function TarotGameInterface({
  gameState,
  setGameState,
  endGame,
  submitInterpretation,
  nextCard,
  userId
}: TarotGameInterfaceProps) {
  const [userRanking, setUserRanking] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [showHints, setShowHints] = useState(false);
  const [isFirstTimeCard, setIsFirstTimeCard] = useState(false);
  const [previousSituations, setPreviousSituations] = useState<string[]>([]);
  const [userProgress, setUserProgress] = useState({
    totalScore: 0,
    totalCards: 0,
    accuracy: 0,
    level: 'Novice'
  });
  const [situationLoadingToast, setSituationLoadingToast] = useState(false);

  // Get persisted AI configuration from SeedingTab
  const { aiProvider, aiModel, aiApiKey, temperature } = useSeedingPersistence();

  // Create AI config object with fallback
  const aiConfig = {
    provider: aiProvider as 'openrouter' | 'openai' | 'claude' | 'gemini',
    model: aiModel || 'deepseek/deepseek-r1-distill-llama-70b:free',
    apiKey: aiApiKey || '',
    temperature: temperature || 0.7
  };

  const { generateSituation, generateFallbackSituation, isGenerating } = useSituationGeneration();

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

      // Emergency fallback
      if (gameState.currentCard) {
        const emergency = generateFallbackSituation(gameState.currentCard);
        const fullSituation = `${emergency.situation}\n\n${emergency.question}`;
        const newOrientation: 'upright' | 'reversed' = Math.random() < 0.5 ? 'upright' : 'reversed';

        setGameState(prev => ({
          ...prev,
          situation: fullSituation,
          cardOrientation: newOrientation,
          userInterpretation: '',
          feedback: null,
          isLoading: false
        }));
      }

      // Delay hiding the toast for fallback too
      setTimeout(() => {
        setSituationLoadingToast(false);
        console.log('StatusToast set to visible: false (fallback)');
      }, 1000);
    }
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="px-6 py-12">
        {gameState.currentCard && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card Display */}
            <div>
              <div className="flex gap-6 mb-6">
                {/* Card Image */}
                <div className="w-48 h-72 relative flex-shrink-0">
                  <Image
                    src={getCardImagePath(gameState.currentCard.id)}
                    alt={`${gameState.currentCard.name} (${gameState.cardOrientation})`}
                    fill
                    className={`object-contain transition-transform duration-300 ${
                      gameState.cardOrientation === 'reversed' ? 'rotate-180' : ''
                    }`}
                    sizes="192px"
                  />
                  {/* Orientation indicator */}
                  <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-inter">
                    {gameState.cardOrientation === 'upright' ? '↑' : '↓'}
                  </div>
                </div>

                {/* Card Description */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 font-space-grotesk text-black">
                    {gameState.currentCard.name}
                    <span className="ml-2 text-sm font-inter text-black/60">
                      ({gameState.cardOrientation})
                    </span>
                  </h2>
                  <div className="text-black/70 mb-4 font-inter">
                    {gameState.currentCard.type}
                    {gameState.currentCard.suit && ` • ${gameState.currentCard.suit}`}
                  </div>
                  <div className="text-sm text-black/70 font-inter">
                    {gameState.currentCard.element && `Element: ${gameState.currentCard.element}`}
                  </div>
                </div>
              </div>

              {/* Traditional Meaning - only shown after evaluation */}
              {gameState.feedback && (
                <div className="bg-white border-2 border-black p-4 mt-6">
                  <h4 className="font-semibold mb-2 font-space-grotesk text-black">
                    Traditional Meaning ({gameState.cardOrientation})
                  </h4>
                  <p className="text-black/80 mb-3 font-inter">
                    {gameState.cardOrientation === 'upright' 
                      ? gameState.currentCard.uprightMeaning 
                      : gameState.currentCard.reversedMeaning}
                  </p>
                  <div className="text-sm">
                    <span className="font-semibold font-space-grotesk text-black">Keywords: </span>
                    <span className="text-black/70 font-inter">
                      {gameState.cardOrientation === 'upright'
                        ? gameState.currentCard.keywords.upright.join(', ')
                        : gameState.currentCard.keywords.reversed.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div>
              {/* Situation */}
              <div className="bg-blue-200 border-2 border-black p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-black font-space-grotesk">📖 Situation</h3>
                  <button
                    onClick={() => generateNewSituation()}
                    disabled={isGenerating || gameState.isLoading}
                    className="px-3 py-1 text-sm bg-white text-black border border-black hover:bg-black hover:text-white disabled:bg-gray-200 disabled:cursor-not-allowed transition-all duration-300 font-inter"
                  >
                    {isGenerating || gameState.isLoading ? '⏳' : '↻'}
                  </button>
                </div>
                <p className="text-black font-inter">{gameState.situation}</p>
              </div>

              {!gameState.feedback ? (
                <div>
                  <h3 className="text-xl font-bold mb-4 font-space-grotesk text-black">Your Interpretation</h3>
                  <p className="text-black/70 mb-4 font-inter">
                    How would you interpret this {gameState.cardOrientation} card in the given situation? Consider the traditional meanings and how they apply to the specific context.
                  </p>
                  <textarea
                    value={gameState.userInterpretation}
                    onChange={(e) => setGameState(prev => ({ ...prev, userInterpretation: e.target.value }))}
                    placeholder="Write your interpretation here... Consider what guidance this card would offer in this situation."
                    className="w-full h-40 p-4 border-2 border-black font-inter resize-none focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {gameState.userInterpretation.trim() && (
                    <button
                      onClick={submitInterpretation}
                      disabled={gameState.isLoading}
                      className="w-full mt-4 bg-white text-black px-6 py-3 font-semibold border-2 border-black hover:bg-black hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-inter"
                    >
                      {gameState.isLoading ? 'Evaluating...' : 'Submit Interpretation'}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-4 font-space-grotesk text-black">AI Feedback</h3>
                  <div className="bg-green-200 border-2 border-black p-6 mb-6">
                    <div className="text-black font-inter space-y-4">
                      {gameState.feedback.split('\n\n').map((section, index) => {
                        // Clean up asterisks and markdown formatting
                        const cleanSection = section
                          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold asterisks
                          .replace(/\*(.*?)\*/g, '$1')     // Remove italic asterisks
                          .replace(/^\*\s+/gm, '• ')       // Convert bullet asterisks to bullets
                          .trim();

                        return (
                          <div key={index}>
                            {cleanSection.startsWith('EXPERT EXAMPLE:') ? (
                              <div>
                                <h4 className="font-bold mb-2 text-blue-800">Expert Example:</h4>
                                <div className="bg-blue-50 p-3 border-l-4 border-blue-400 italic">
                                  {cleanSection.replace('EXPERT EXAMPLE:', '').trim()}
                                </div>
                              </div>
                            ) : cleanSection.startsWith('TRADITIONAL MEANING:') ? (
                              <div>
                                <h4 className="font-bold mb-2 text-purple-800">Card Meaning:</h4>
                                <p className="bg-purple-50 p-3 border-l-4 border-purple-400">
                                  {cleanSection.replace('TRADITIONAL MEANING:', '').trim()}
                                </p>
                              </div>
                            ) : cleanSection.startsWith('SAMPLE INTERPRETATION:') ? (
                              <div>
                                <h4 className="font-bold mb-2 text-blue-800">Expert Example:</h4>
                                <div className="bg-blue-50 p-3 border-l-4 border-blue-400 italic">
                                  {cleanSection.replace('SAMPLE INTERPRETATION:', '').trim()}
                                </div>
                              </div>
                            ) : (
                              <div className="leading-relaxed" dangerouslySetInnerHTML={{
                                __html: cleanSection
                                  .replace(/\n/g, '<br>')
                                  .replace(/• /g, '<span class="inline-block w-2 h-2 bg-gray-600 rounded-full mr-2 mb-1"></span>')
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>


                  <div className="flex gap-3">
                    <button
                      onClick={nextCard}
                      className="flex-1 bg-white text-black px-6 py-3 font-semibold border-2 border-black hover:bg-black hover:text-white transition-all duration-300 font-inter"
                    >
                      Next Card
                    </button>
                    <button
                      onClick={endGame}
                      className="px-6 py-3 bg-white text-black border-2 border-black font-semibold hover:bg-black hover:text-white transition-all duration-300 font-inter"
                    >
                      End Game
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hints Section */}
            <div>
              <div className="bg-gray-50 border-2 border-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-space-grotesk text-black">Beginner Hints</h3>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="px-3 py-1 text-sm bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-300 font-inter"
                  >
                    {showHints ? 'Hide' : 'Show'}
                  </button>
                </div>

                {isFirstTimeCard && (
                  <div className="bg-yellow-100 border border-yellow-300 p-3 mb-4">
                    <p className="text-sm text-yellow-800 font-inter">
                      🔥 First time encountering this card! Take your time to study it.
                    </p>
                  </div>
                )}

                {showHints && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-black mb-2 font-space-grotesk">Card Type</h4>
                      <p className="text-sm text-black/70 font-inter">
                        {gameState.currentCard.type === 'Major Arcana'
                          ? 'Major Arcana cards represent major life themes, spiritual lessons, and karmic influences.'
                          : `Minor Arcana ${gameState.currentCard.suit} cards relate to ${gameState.currentCard.suit === 'Cups' ? 'emotions, relationships, and intuition' : gameState.currentCard.suit === 'Wands' ? 'passion, creativity, and action' : gameState.currentCard.suit === 'Pentacles' ? 'material matters, work, and resources' : 'thoughts, communication, and challenges'}.`
                        }
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2 font-space-grotesk">Key Themes</h4>
                      <div className="flex flex-wrap gap-1">
                        {gameState.currentCard.keywords.upright.slice(0, 4).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-black text-white text-xs font-inter"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2 font-space-grotesk">Interpretation Tips</h4>
                      <ul className="text-sm text-black/70 space-y-1 font-inter">
                        <li>• Consider how the card's energy applies to the situation</li>
                        <li>• Think about what advice this card would give</li>
                        <li>• Connect the symbolism to the person's circumstances</li>
                        <li>• Consider both positive and challenging aspects</li>
                      </ul>
                    </div>

                    {gameState.currentCard.element && (
                      <div>
                        <h4 className="font-semibold text-black mb-2 font-space-grotesk">Elemental Energy</h4>
                        <p className="text-sm text-black/70 font-inter">
                          {gameState.currentCard.element} energy: {gameState.currentCard.element === 'Fire' ? 'Passion, action, inspiration' : gameState.currentCard.element === 'Water' ? 'Emotion, intuition, relationships' : gameState.currentCard.element === 'Air' ? 'Thoughts, communication, ideas' : 'Practical matters, resources, stability'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Game Stats */}
              <div className="mt-6 pt-6 border-t-2 border-black">
                <h3 className="text-lg font-bold font-space-grotesk text-black mb-4">Game Progress</h3>
                <div className="flex gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black font-space-grotesk">
                      {userRanking ? `#${userRanking}` : '—'}
                    </div>
                    <div className="text-sm text-black/50 font-inter">
                      Rank {totalPlayers > 0 && `of ${totalPlayers}`}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black font-space-grotesk">{gameState.cardsCompleted}</div>
                    <div className="text-sm text-black/50 font-inter">Cards</div>
                  </div>
                </div>
              </div>

              {/* User Level Progress */}
              <div className="mt-4 p-4 bg-white border-2 border-black">
                <h4 className="font-semibold text-black mb-3 font-space-grotesk">Level Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-inter text-black">Current Level:</span>
                    <span className="font-bold font-space-grotesk text-black">{userProgress.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 border border-black">
                    <div
                      className="bg-black h-full transition-all duration-300"
                      style={{ width: `${(userProgress.totalScore % 1000) / 10}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-black/70 font-inter">
                    <span>{userProgress.totalScore % 1000} points</span>
                    <span>{1000 - (userProgress.totalScore % 1000)} to next level</span>
                  </div>
                </div>
              </div>

              {/* End Game Button */}
              <button
                onClick={endGame}
                className="w-full mt-6 px-4 py-3 bg-white text-black border-2 border-black font-semibold hover:bg-black hover:text-white transition-all duration-300 font-inter"
              >
                End Game
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Toast for situation loading */}
      <StatusToast
        title="Generating Situation"
        message="Creating a unique scenario for your card..."
        status="loading"
        isVisible={situationLoadingToast}
        onHide={() => setSituationLoadingToast(false)}
      />
    </div>
  );
}