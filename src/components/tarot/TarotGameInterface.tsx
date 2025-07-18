/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { TarotCard } from '@/data/tarotCards';
import { getCardImagePath } from '@/utils/tarotImageMapping';
import { useTarotGameInterface } from '@/hooks/useTarotGameInterface';
import { calculateLevelProgress, getPointsToNextLevel } from '@/components/tarot/LevelBadge';
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
  canPlayMore?: boolean;
  remainingPlays?: number;
  onShowUsageLimit?: () => void;
}

export default function TarotGameInterface({
  gameState,
  setGameState,
  endGame,
  submitInterpretation,
  nextCard,
  userId,
  canPlayMore = true,
  remainingPlays,
  onShowUsageLimit
}: TarotGameInterfaceProps) {
  // Use the extracted hook for all component logic
  const {
    userRanking,
    totalPlayers,
    showHints,
    isFirstTimeCard,
    userProgress,
    situationLoadingToast,
    errorToast,
    evaluationLoadingToast,
    isGenerating,
    generateNewSituation,
    toggleHints,
    updateUserInterpretation,
    setSituationLoadingToast,
    setErrorToast,
    setEvaluationLoadingToast,
    aiConfig,
    hasValidConfig
  } = useTarotGameInterface(gameState, setGameState, userId);

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="px-6 py-12">
        {/* AI Configuration Warning */}
        {!hasValidConfig && (
          <div className="mb-6 bg-yellow-100 border-2 border-yellow-300 p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-yellow-800 font-space-grotesk">AI Configuration Required</h3>
                <p className="text-yellow-700 font-inter text-sm">
                  AI features are currently limited. An administrator needs to configure the AI settings 
                  with a valid API key to enable situation generation and interpretation feedback.
                </p>
                {aiConfig?.provider && (
                  <p className="text-yellow-600 font-inter text-xs mt-1">
                    Current config: {aiConfig.provider} - {aiConfig.model} (API key: {aiConfig.apiKey ? 'Present' : 'Missing'})
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
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
                    onChange={(e) => updateUserInterpretation(e.target.value)}
                    placeholder="Write your interpretation here... Consider what guidance this card would offer in this situation."
                    className="w-full h-40 p-4 border-2 border-black font-inter resize-none focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {gameState.userInterpretation.trim() && (
                    <button
                      onClick={() => {
                        setEvaluationLoadingToast(true);
                        submitInterpretation().finally(() => {
                          setEvaluationLoadingToast(false);
                        });
                      }}
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
                      onClick={() => {
                        setSituationLoadingToast(true);
                        nextCard();
                      }}
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
                    onClick={toggleHints}
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
                      <h4 className="font-semibold text-black mb-2 font-space-grotesk">Card Meaning ({gameState.cardOrientation})</h4>
                      <p className="text-sm text-black/70 font-inter mb-3">
                        {gameState.cardOrientation === 'upright' 
                          ? gameState.currentCard.uprightMeaning 
                          : gameState.currentCard.reversedMeaning}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2 font-space-grotesk">Key Themes ({gameState.cardOrientation})</h4>
                      <div className="flex flex-wrap gap-1">
                        {(gameState.cardOrientation === 'upright' 
                          ? gameState.currentCard.keywords.upright 
                          : gameState.currentCard.keywords.reversed
                        ).slice(0, 4).map((keyword, index) => (
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
                        {gameState.cardOrientation === 'upright' ? (
                          <>
                            <li>• Focus on the card's positive, flowing energy</li>
                            <li>• Consider the natural expression of the card's themes</li>
                            <li>• Think about growth, action, or manifestation</li>
                            <li>• Look for opportunities and forward movement</li>
                          </>
                        ) : (
                          <>
                            <li>• Consider blocked, delayed, or internal energy</li>
                            <li>• Think about lessons learned or past experiences</li>
                            <li>• Look for what needs to be released or healed</li>
                            <li>• Consider alternative perspectives or hidden aspects</li>
                          </>
                        )}
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
                      style={{ width: `${calculateLevelProgress(userProgress.totalScore)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-black/70 font-inter">
                    <span>{userProgress.totalScore.toLocaleString()} points</span>
                    <span>{getPointsToNextLevel(userProgress.totalScore).toLocaleString()} to next level</span>
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

      {/* Status Toast for errors */}
      <StatusToast
        title="Generation Failed"
        message={errorToast.message}
        status="error"
        isVisible={errorToast.visible}
        onHide={() => setErrorToast({ visible: false, message: '' })}
        duration={5000}
      />

      {/* Status Toast for evaluation */}
      <StatusToast
        title="Evaluating Interpretation"
        message="Your interpretation is being analyzed by our expert AI tarot reader..."
        status="loading"
        isVisible={evaluationLoadingToast}
        onHide={() => setEvaluationLoadingToast(false)}
      />
    </div>
  );
}