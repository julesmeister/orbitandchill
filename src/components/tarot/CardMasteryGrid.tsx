/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { tarotCards, TarotCard } from '@/data/tarotCards';
import { getCardImagePath } from '@/utils/tarotImageMapping';
import Image from 'next/image';

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
}

export default function CardMasteryGrid({ userId }: CardMasteryGridProps) {
  const [cardProgress, setCardProgress] = useState<Record<string, CardProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [filter, setFilter] = useState<'all' | 'major' | 'cups' | 'wands' | 'pentacles' | 'swords'>('all');

  useEffect(() => {
    loadCardProgress();
  }, [userId]);

  const loadCardProgress = async () => {
    try {
      console.log('CardMasteryGrid: Loading progress for userId:', userId);
      const response = await fetch(`/api/tarot/card-progress?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('CardMasteryGrid: API response:', data);
        console.log('CardMasteryGrid: Progress data keys:', Object.keys(data.progress || {}));
        
        // Log sample progress data
        const progressKeys = Object.keys(data.progress || {});
        if (progressKeys.length > 0) {
          console.log('CardMasteryGrid: Sample progress entry:', data.progress[progressKeys[0]]);
        }
        
        setCardProgress(data.progress || {});
      } else {
        console.log('CardMasteryGrid: API response not ok:', response.status);
      }
    } catch (error) {
      console.warn('Failed to load card progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCards = (): TarotCard[] => {
    switch (filter) {
      case 'major':
        return tarotCards.filter(card => card.type === 'Major Arcana');
      case 'cups':
        return tarotCards.filter(card => card.suit === 'Cups');
      case 'wands':
        return tarotCards.filter(card => card.suit === 'Wands');
      case 'pentacles':
        return tarotCards.filter(card => card.suit === 'Pentacles');
      case 'swords':
        return tarotCards.filter(card => card.suit === 'Swords');
      default:
        return tarotCards;
    }
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
      {/* Debug info */}
      <div className="bg-yellow-100 p-2 text-xs border border-yellow-300">
        <strong>DEBUG:</strong> Loaded {Object.keys(cardProgress).length} cards with progress data
        {Object.keys(cardProgress).length > 0 && (
          <div>Sample: {JSON.stringify(cardProgress[Object.keys(cardProgress)[0]], null, 2)}</div>
        )}
      </div>
      
      {/* Filter Tabs */}
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
            onClick={() => setFilter(tab.key as any)}
            className={`relative group px-4 py-3 font-space-grotesk font-medium text-sm transition-all duration-300 whitespace-nowrap overflow-hidden ${
              filter === tab.key
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            } ${index < 5 ? 'border-r border-black' : ''}`}
          >
            {filter !== tab.key && (
              <div className="absolute inset-0 bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
            )}
            <span className="relative z-10">
              {tab.label} ({tab.count})
            </span>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border border-gray-200 p-4">
        <h3 className="font-semibold text-sm mb-3">Mastery Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 "></div>
            <span>Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 border border-red-400 "></div>
            <span>Beginner (0-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 border border-orange-500 "></div>
            <span>Learning (50-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-yellow-500 "></div>
            <span>Good (70-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 border border-green-500 "></div>
            <span>Advanced (80-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 border border-green-600 "></div>
            <span>Master (90%+)</span>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-13 gap-3">
        {getFilteredCards().map((card) => {
          const progress = cardProgress[card.id];
          const masteryColor = getMasteryColor(card);
          
          // Debug logging for specific cards that should have progress
          if (progress && progress.totalAttempts > 0) {
            console.log(`CardMasteryGrid: Rendering card ${card.id} with progress:`, {
              totalAttempts: progress.totalAttempts,
              averageScore: progress.averageScore,
              masteryPercentage: progress.masteryPercentage,
              title: `${Math.round(progress.masteryPercentage)}% mastery`
            });
          }
          
          return (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`relative p-2 -lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${masteryColor}`}
              title={`${card.name} - ${progress ? `${Math.round(progress.masteryPercentage || 0)}% mastery (${progress.averageScore}% avg)` : 'Not started'}`}
            >
              {/* Card Image */}
              <div className="w-full h-48 mb-2 relative">
                <Image
                  src={getCardImagePath(card.id)}
                  alt={card.name}
                  fill
                  className="object-contain border border-black"
                  sizes="(max-width: 768px) 120px, 150px"
                />
              </div>
              
              {/* Card Name (abbreviated) */}
              <div className="text-xs font-medium leading-tight">
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
    </div>
  );
}