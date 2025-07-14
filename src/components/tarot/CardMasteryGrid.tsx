/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { tarotCards, TarotCard } from '@/data/tarotCards';
import { getCardImagePath } from '@/utils/tarotImageMapping';
import { useImageCache } from '@/hooks/useImageCache';
import Image from 'next/image';
import TarotMatchingExercise from './TarotMatchingExercise';

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

interface CardMasteryGridProps {
  userId: string;
  onMatchingComplete?: () => void;
}

export default function CardMasteryGrid({ userId, onMatchingComplete }: CardMasteryGridProps) {
  const [cardProgress, setCardProgress] = useState<Record<string, CardProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [showMatchingExercise, setShowMatchingExercise] = useState(false);
  const [suitFilter, setSuitFilter] = useState<'all' | 'major' | 'cups' | 'wands' | 'pentacles' | 'swords'>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'not-started' | 'beginner' | 'learning' | 'good' | 'advanced' | 'master'>('all');
  const { preloadImages, getCachedImageSrc } = useImageCache();

  useEffect(() => {
    loadCardProgress();
  }, [userId]);

  // Preload visible card images
  useEffect(() => {
    const filteredCards = getFilteredCards();
    const imagePaths = filteredCards.slice(0, 20).map(card => getCardImagePath(card.id));
    preloadImages(imagePaths);
  }, [suitFilter, masteryFilter, preloadImages]);

  const loadCardProgress = async () => {
    try {
      // console.log('CardMasteryGrid: Loading progress for userId:', userId);
      const response = await fetch(`/api/tarot/card-progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        // console.log('CardMasteryGrid: API response:', data);
        // console.log('CardMasteryGrid: Progress data keys:', Object.keys(data.progress || {}));
        
        // Log sample progress data
        const progressKeys = Object.keys(data.progress || {});
        if (progressKeys.length > 0) {
          // console.log('CardMasteryGrid: Sample progress entry:', data.progress[progressKeys[0]]);
        }
        
        setCardProgress(data.progress || {});
      } else {
        // console.log('CardMasteryGrid: API response not ok:', response.status);
      }
    } catch (error) {
      console.warn('Failed to load card progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCards = (): TarotCard[] => {
    let cards = tarotCards;

    // Apply suit filter
    switch (suitFilter) {
      case 'major':
        cards = cards.filter(card => card.type === 'Major Arcana');
        break;
      case 'cups':
        cards = cards.filter(card => card.suit === 'Cups');
        break;
      case 'wands':
        cards = cards.filter(card => card.suit === 'Wands');
        break;
      case 'pentacles':
        cards = cards.filter(card => card.suit === 'Pentacles');
        break;
      case 'swords':
        cards = cards.filter(card => card.suit === 'Swords');
        break;
      default:
        break; // Keep all cards
    }

    // Apply mastery filter
    if (masteryFilter !== 'all') {
      cards = cards.filter(card => {
        const progress = cardProgress[card.id];
        const averageScore = progress?.averageScore || 0;
        const hasAttempts = progress?.totalAttempts > 0;

        switch (masteryFilter) {
          case 'not-started':
            return !hasAttempts;
          case 'beginner':
            return hasAttempts && averageScore < 50;
          case 'learning':
            return hasAttempts && averageScore >= 50 && averageScore < 70;
          case 'good':
            return hasAttempts && averageScore >= 70 && averageScore < 80;
          case 'advanced':
            return hasAttempts && averageScore >= 80 && averageScore < 90;
          case 'master':
            return hasAttempts && averageScore >= 90;
          default:
            return true;
        }
      });
    }

    return cards;
  };

  const getMasteryColor = (card: TarotCard): string => {
    const progress = cardProgress[card.id];
    if (!progress || progress.totalAttempts === 0) {
      return 'bg-white border-black';
    }
    
    const score = progress.averageScore;
    if (score >= 90) return 'bg-green-500 border-black text-white';
    if (score >= 80) return 'bg-[#4ade80] border-black text-black';
    if (score >= 70) return 'bg-[#f2e356] border-black text-black';
    if (score >= 60) return 'bg-orange-400 border-black text-black';
    if (score >= 50) return 'bg-red-400 border-black text-white';
    return 'bg-red-300 border-black text-white';
  };

  const getCardIcon = (card: TarotCard): string => {
    if (card.type === 'Major Arcana') {
      return '🔮';
    }
    switch (card.suit) {
      case 'Cups': return '💧';
      case 'Wands': return '🔥';
      case 'Pentacles': return '🪙';
      case 'Swords': return '⚔️';
      default: return '🃏';
    }
  };

  const getStreakIcon = (streak: number): string => {
    if (streak === 0) return '';
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '✨';
    if (streak >= 3) return '⭐';
    return '•';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200  w-1/3 mb-4"></div>
          <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-13 gap-2">
            {Array.from({ length: 78 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 "></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Suit Filter Tabs */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 font-space-grotesk text-black">Filter by Suit</h3>
        <div className="flex gap-0 border border-black overflow-x-auto">
          {[
            { key: 'all', label: 'All Cards', count: tarotCards.length },
            { key: 'major', label: 'Major Arcana', count: 22 },
            { key: 'cups', label: 'Cups', count: 14 },
            { key: 'wands', label: 'Wands', count: 14 },
            { key: 'pentacles', label: 'Pentacles', count: 14 },
            { key: 'swords', label: 'Swords', count: 14 },
          ].map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => setSuitFilter(tab.key as any)}
              className={`relative group px-4 py-3 font-space-grotesk font-medium text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${
                suitFilter === tab.key
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              } ${index < 5 ? 'border-r border-black' : ''}`}
            >
              {suitFilter !== tab.key && (
                <div className="absolute inset-0 bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
              )}
              <span className="relative z-10">
                {tab.label} ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mastery Filter Tabs */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 font-space-grotesk text-black">Filter by Mastery Level</h3>
        <div className="flex gap-0 border border-black overflow-x-auto">
          {[
            { key: 'all', label: 'All Levels', icon: '🃏' },
            { key: 'not-started', label: 'Not Started', icon: '⚪' },
            { key: 'beginner', label: 'Beginner (0-50%)', icon: '🔴' },
            { key: 'learning', label: 'Learning (50-70%)', icon: '🟠' },
            { key: 'good', label: 'Good (70-80%)', icon: '🟡' },
            { key: 'advanced', label: 'Advanced (80-90%)', icon: '🟢' },
            { key: 'master', label: 'Master (90%+)', icon: '🏆' },
          ].map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => setMasteryFilter(tab.key as any)}
              className={`relative group px-3 py-2 font-space-grotesk font-medium text-xs transition-all duration-300 whitespace-nowrap overflow-hidden ${
                masteryFilter === tab.key
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              } ${index < 6 ? 'border-r border-black' : ''}`}
            >
              {masteryFilter !== tab.key && (
                <div className="absolute inset-0 bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
              )}
              <span className="relative z-10">
                {tab.icon} {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>


      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-black/70 font-inter">
          Showing <span className="font-semibold text-black">{getFilteredCards().length}</span> of {tarotCards.length} cards
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMatchingExercise(true)}
            className="text-sm px-4 py-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors font-space-grotesk"
          >
            🎯 Practice Matching
          </button>
          {(suitFilter !== 'all' || masteryFilter !== 'all') && (
            <button
              onClick={() => {
                setSuitFilter('all');
                setMasteryFilter('all');
              }}
              className="text-xs px-3 py-1 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors font-space-grotesk"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
          {getFilteredCards().map((card) => {
          const progress = cardProgress[card.id];
          const masteryColor = getMasteryColor(card);
          
          
          return (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`relative flex flex-col p-2 border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${masteryColor}`}
              title={`${card.name} - ${progress ? `${Math.round(progress.masteryPercentage || 0)}% mastery (${progress.averageScore}% avg)` : 'Not started'}`}
              style={{ aspectRatio: '2/3' }}
            >
              {/* Card Image */}
              <div className="w-full flex-1 relative mb-1">
                <Image
                  src={getCachedImageSrc(getCardImagePath(card.id))}
                  alt={card.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, (max-width: 1280px) 140px, 120px"
                  loading="lazy"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  priority={false}
                />
              </div>
              
              {/* Card Name (abbreviated) */}
              <div className="text-xs font-medium leading-tight text-center px-1">
                {card.name.replace('The ', '').replace(' of ', ' ')}
              </div>
              
              {/* Upright/Reversed Progress Bars */}
              {progress && progress.totalAttempts > 0 ? (
                <div className="mt-1 space-y-1">
                  {/* Upright Progress */}
                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-gray-600 font-inter">↑</span>
                      <span className="font-semibold font-space-grotesk">{Math.round(progress.uprightAverage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 border border-black">
                      <div 
                        className="bg-black h-full transition-all duration-300"
                        style={{ width: `${Math.min(progress.uprightAverage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Reversed Progress */}
                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-gray-600 font-inter">↓</span>
                      <span className="font-semibold font-space-grotesk">{Math.round(progress.reversedAverage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 border border-black">
                      <div 
                        className="bg-black h-full transition-all duration-300"
                        style={{ width: `${Math.min(progress.reversedAverage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Streak indicator */}
                  {progress.learningStreak > 0 && (
                    <div className="absolute top-1 right-1 text-xs text-orange-600">
                      {getStreakIcon(progress.learningStreak)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-1 space-y-1">
                  {/* Empty progress bars for cards not started */}
                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-gray-400 font-inter">↑</span>
                      <span className="text-gray-400 font-space-grotesk">—</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 border border-black"></div>
                  </div>
                  
                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-gray-400 font-inter">↓</span>
                      <span className="text-gray-400 font-space-grotesk">—</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1 border border-black"></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white  p-6 max-w-md w-full border border-black max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold font-space-grotesk text-black">{selectedCard.name}</h3>
                <p className="text-black/70 text-sm font-inter">{selectedCard.type}{selectedCard.suit && ` • ${selectedCard.suit}`}</p>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-black/40 hover:text-black text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Card Icon */}
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{getCardIcon(selectedCard)}</div>
              <div className="text-sm text-gray-500">
                {selectedCard.element && `Element: ${selectedCard.element}`}
              </div>
            </div>

            {/* Progress Stats */}
            {cardProgress[selectedCard.id] ? (
              <div className="bg-gray-50  p-4 mb-4">
                <h4 className="font-semibold mb-3">Your Progress</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Mastery Level:</span>
                    <span className="font-bold">{Math.round(cardProgress[selectedCard.id].masteryPercentage)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span className="font-bold">{Math.round(cardProgress[selectedCard.id].averageScore)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Attempts:</span>
                    <span className="font-bold">{cardProgress[selectedCard.id].totalAttempts}</span>
                  </div>
                  {/* Only show upright/reversed if the game actually tracks these orientations */}
                  {(cardProgress[selectedCard.id].uprightAttempts > 0 || cardProgress[selectedCard.id].reversedAttempts > 0) && (
                    <>
                      <div className="border-t pt-2 mt-2">
                        <h5 className="font-semibold mb-2 text-xs text-gray-600">Orientation Breakdown:</h5>
                        {cardProgress[selectedCard.id].uprightAttempts > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Upright Score:</span>
                            <span className="font-bold">{Math.round(cardProgress[selectedCard.id].uprightAverage)}%</span>
                          </div>
                        )}
                        {cardProgress[selectedCard.id].reversedAttempts > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Reversed Score:</span>
                            <span className="font-bold">{Math.round(cardProgress[selectedCard.id].reversedAverage)}%</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>Learning Streak:</span>
                    <span className="font-bold">{cardProgress[selectedCard.id].learningStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mastery Level:</span>
                    <span className="font-bold capitalize">{cardProgress[selectedCard.id].familiarityLevel}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200  p-4 mb-4 text-center">
                <p className="text-yellow-800 text-sm">
                  You haven't practiced this card yet. Start playing to track your progress!
                </p>
              </div>
            )}

            {/* Card Meanings */}
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Upright Meaning</h4>
                <p className="text-gray-700">{selectedCard.uprightMeaning}</p>
                <div className="mt-2">
                  <span className="font-medium">Keywords: </span>
                  <span className="text-gray-600">{selectedCard.keywords.upright.join(', ')}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Reversed Meaning</h4>
                <p className="text-gray-700">{selectedCard.reversedMeaning}</p>
                <div className="mt-2">
                  <span className="font-medium">Keywords: </span>
                  <span className="text-gray-600">{selectedCard.keywords.reversed.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matching Exercise Modal */}
      {showMatchingExercise && (
        <TarotMatchingExercise
          isOpen={showMatchingExercise}
          onClose={() => setShowMatchingExercise(false)}
          filteredCards={getFilteredCards()}
          userProgress={cardProgress}
          userId={userId}
          onComplete={async () => {
            // Refresh card progress after matching exercise completion
            await loadCardProgress();
            // Also refresh parent leaderboard and user progress
            if (onMatchingComplete) {
              await onMatchingComplete();
            }
          }}
        />
      )}
    </div>
  );
}