/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  cardsCompleted: number;
  accuracy: number;
  lastPlayed: string;
}

interface UserProgress {
  totalScore: number;
  totalCards: number;
  accuracy: number;
  level: string;
}

interface TarotLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  userProgress: UserProgress;
  user: any;
  userHasPremium: boolean;
  getUserLevel: (accuracy: number) => string;
  isLoading?: boolean;
}

export default function TarotLeaderboard({ 
  leaderboard, 
  userProgress, 
  user, 
  userHasPremium, 
  getUserLevel,
  isLoading = false
}: TarotLeaderboardProps) {
  return (
    <div className="space-y-8">
      {/* Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-space-grotesk text-black">Leaderboard</h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-black/50 font-inter">
              {isLoading ? 'Loading...' : `${leaderboard.length} players`}
            </div>
            {userHasPremium && leaderboard.length > 5 && (
              <Link 
                href="/guides/tarot-learning/leaderboard"
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold font-inter underline"
              >
                View More
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white border border-black overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <div className="animate-spin text-xl">⏳</div>
              </div>
              <p className="text-sm text-black/70 font-inter">Loading leaderboard...</p>
            </div>
          ) : (!isLoading && leaderboard.length > 0) ? (
            <div className="divide-y divide-black">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div key={entry.id} className="p-3 flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center font-bold text-xs font-space-grotesk ${
                    index === 0 ? 'bg-[#f2e356] text-black border-2 border-black' :
                    index === 1 ? 'bg-[#6bdbff] text-black border-2 border-black' :
                    index === 2 ? 'bg-[#4ade80] text-black border-2 border-black' :
                    'bg-white text-black border-2 border-black'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate text-black font-space-grotesk">{entry.username}</div>
                    <div className="text-xs text-black/50 font-inter">
                      {entry.cardsCompleted} cards • {entry.accuracy}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black text-sm font-space-grotesk">{entry.score.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mx-auto mb-2">
                🏆
              </div>
              <p className="text-sm text-black/70 font-inter">Be the first to join!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}