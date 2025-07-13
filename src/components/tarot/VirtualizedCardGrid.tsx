/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { TarotCard } from '@/data/tarotCards';
import { getCardImagePath } from '@/utils/tarotImageMapping';
import { useImageCache } from '@/hooks/useImageCache';
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

interface VirtualizedCardGridProps {
  cards: TarotCard[];
  cardProgress: Record<string, CardProgress>;
  onCardSelect: (card: TarotCard) => void;
  containerWidth: number;
  containerHeight: number;
}

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    cards: TarotCard[];
    cardProgress: Record<string, CardProgress>;
    onCardSelect: (card: TarotCard) => void;
    columnsPerRow: number;
    getCachedImageSrc: (src: string) => string;
    getMasteryColor: (card: TarotCard) => string;
  };
}

const CardCell: React.FC<CellProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { cards, cardProgress, onCardSelect, columnsPerRow, getCachedImageSrc, getMasteryColor } = data;
  const cardIndex = rowIndex * columnsPerRow + columnIndex;
  
  if (cardIndex >= cards.length) {
    return <div style={style} />;
  }

  const card = cards[cardIndex];
  const progress = cardProgress[card.id];
  const masteryColor = getMasteryColor(card);

  return (
    <div style={style} className="p-1">
      <button
        onClick={() => onCardSelect(card)}
        className={`relative w-full h-full border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${masteryColor}`}
        title={`${card.name} - ${progress ? `${Math.round(progress.masteryPercentage || 0)}% mastery (${progress.averageScore}% avg)` : 'Not started'}`}
      >
        {/* Card Image */}
        <div className="w-full h-32 mb-1 relative">
          <Image
            src={getCachedImageSrc(getCardImagePath(card.id))}
            alt={card.name}
            fill
            className="object-contain"
            sizes="120px"
            loading="lazy"
            quality={60}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
        
        {/* Card Name (abbreviated) */}
        <div className="text-xs font-medium leading-tight px-1">
          {card.name.replace('The ', '').replace(' of ', ' ')}
        </div>
        
        {/* Progress Indicators */}
        {progress && progress.totalAttempts > 0 ? (
          <div className="mt-1 px-1">
            <div className="flex gap-1">
              {/* Upright Progress */}
              <div className="flex-1 h-1 bg-gray-200 border border-black">
                <div 
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(progress.uprightAverage, 100)}%` }}
                ></div>
              </div>
              {/* Reversed Progress */}
              <div className="flex-1 h-1 bg-gray-200 border border-black">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(progress.reversedAverage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-1 px-1">
            <div className="flex gap-1">
              <div className="flex-1 h-1 bg-gray-200 border border-black"></div>
              <div className="flex-1 h-1 bg-gray-200 border border-black"></div>
            </div>
          </div>
        )}

        {/* Streak indicator */}
        {progress?.learningStreak > 0 && (
          <div className="absolute top-1 right-1 text-xs text-orange-600">
            {progress.learningStreak >= 10 ? '🔥' : progress.learningStreak >= 5 ? '✨' : progress.learningStreak >= 3 ? '⭐' : '•'}
          </div>
        )}
      </button>
    </div>
  );
};

export default function VirtualizedCardGrid({ 
  cards, 
  cardProgress, 
  onCardSelect, 
  containerWidth, 
  containerHeight 
}: VirtualizedCardGridProps) {
  const { getCachedImageSrc, preloadImages } = useImageCache();
  
  // Calculate grid dimensions
  const cardWidth = 140; // Width of each card cell
  const cardHeight = 180; // Height of each card cell
  const columnsPerRow = Math.floor(containerWidth / cardWidth);
  const rowCount = Math.ceil(cards.length / columnsPerRow);

  // Preload visible images
  useEffect(() => {
    const imagePaths = cards.slice(0, Math.min(cards.length, columnsPerRow * 3)).map(card => 
      getCardImagePath(card.id)
    );
    preloadImages(imagePaths);
  }, [cards, columnsPerRow, preloadImages]);

  const getMasteryColor = (card: TarotCard): string => {
    const progress = cardProgress[card.id];
    if (!progress || progress.totalAttempts === 0) {
      return 'bg-white border-black';
    }
    
    const score = progress.averageScore;
    if (score >= 90) return 'bg-green-500 border-black text-white';
    if (score >= 80) return 'bg-green-400 border-black text-black';
    if (score >= 70) return 'bg-yellow-400 border-black text-black';
    if (score >= 60) return 'bg-orange-400 border-black text-black';
    if (score >= 50) return 'bg-red-400 border-black text-white';
    return 'bg-red-300 border-black text-white';
  };

  const itemData = useMemo(() => ({
    cards,
    cardProgress,
    onCardSelect,
    columnsPerRow,
    getCachedImageSrc,
    getMasteryColor
  }), [cards, cardProgress, onCardSelect, columnsPerRow, getCachedImageSrc, getMasteryColor]);

  return (
    <div style={{ width: containerWidth, height: containerHeight }}>
      <Grid
        columnCount={columnsPerRow}
        columnWidth={cardWidth}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={cardHeight}
        width={containerWidth}
        itemData={itemData}
        overscanRowCount={2}
        overscanColumnCount={1}
      >
        {CardCell}
      </Grid>
    </div>
  );
}