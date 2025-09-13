/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { hasPremiumAccess } from '@/utils/premiumHelpers';
import LevelBadge, { calculateLevel } from '@/components/tarot/LevelBadge';
import { formatShortDate } from '@/utils/dateFormatting';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  cardsCompleted: number;
  accuracy: number;
  lastPlayed: string;
  level: string;
  gamesPlayed: number;
  averageScore: number;
  streak: number;
  joinedDate: string;
}

interface LeaderboardStats {
  totalPlayers: number;
  averageScore: number;
  topScore: number;
  gamesPlayedToday: number;
}

type TimeFilter = 'all-time' | 'monthly' | 'weekly' | 'daily';
type SortBy = 'score' | 'accuracy' | 'cards' | 'streak';

export default function TarotLeaderboardPage() {
  const { user } = useUserStore();
  const userHasPremium = hasPremiumAccess(user);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 25;

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter, sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tarot/leaderboard?timeFilter=${timeFilter}&sortBy=${sortBy}&extended=true`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.warn('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and paginate leaderboard
  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaderboard = filteredLeaderboard.slice(startIndex, startIndex + itemsPerPage);

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-400 text-black border-2 border-black';
    if (index === 1) return 'bg-gray-300 text-black border-2 border-black';
    if (index === 2) return 'bg-orange-400 text-black border-2 border-black';
    return 'bg-white text-black border border-black';
  };


  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⭐';
    return '';
  };

  if (!userHasPremium) {
    return (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="min-h-screen bg-white px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 font-space-grotesk">Tarot Learning Leaderboard</h1>
            <div className="bg-yellow-50 border-2 border-yellow-400 p-8 rounded">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-xl font-bold mb-4 font-space-grotesk">Premium Feature</h2>
              <p className="text-gray-700 mb-6 font-inter">
                The full leaderboard is available to premium users. Upgrade to see your ranking among all tarot learners!
              </p>
              <Link 
                href="/guides/tarot-learning"
                className="inline-block bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors font-space-grotesk"
              >
                Back to Game
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 py-8 border-b border-black">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/guides/tarot-learning" className="inline-flex items-center gap-2 text-black hover:text-black/70 font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Game
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-black font-space-grotesk mb-2">
                Tarot Learning Leaderboard 🏆
              </h1>
              <p className="text-black/70 font-inter">
                See how you rank among tarot learners worldwide
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        {stats && (
          <section className="px-6 md:px-12 lg:px-20 py-8 bg-gray-50 border-b border-black">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-space-grotesk">{stats.totalPlayers.toLocaleString()}</div>
                <div className="text-sm text-black/70 font-inter">Total Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-space-grotesk">{stats.topScore.toLocaleString()}</div>
                <div className="text-sm text-black/70 font-inter">Highest Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-space-grotesk">{Math.round(stats.averageScore)}%</div>
                <div className="text-sm text-black/70 font-inter">Average Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black font-space-grotesk">{stats.gamesPlayedToday}</div>
                <div className="text-sm text-black/70 font-inter">Games Today</div>
              </div>
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <section className="px-6 md:px-12 lg:px-20 py-6 border-b border-black">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Time Filters */}
            <div className="flex gap-0 border border-black">
              {[
                { key: 'all-time', label: 'All Time' },
                { key: 'monthly', label: 'This Month' },
                { key: 'weekly', label: 'This Week' },
                { key: 'daily', label: 'Today' }
              ].map((filter, index) => (
                <button
                  key={filter.key}
                  onClick={() => setTimeFilter(filter.key as TimeFilter)}
                  className={`px-4 py-2 font-space-grotesk font-medium text-sm transition-all duration-300 ${
                    timeFilter === filter.key
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  } ${index < 3 ? 'border-r border-black' : ''}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-0 border border-black">
              {[
                { key: 'score', label: 'Score' },
                { key: 'accuracy', label: 'Accuracy' },
                { key: 'cards', label: 'Cards' },
                { key: 'streak', label: 'Streak' }
              ].map((sort, index) => (
                <button
                  key={sort.key}
                  onClick={() => setSortBy(sort.key as SortBy)}
                  className={`px-4 py-2 font-space-grotesk font-medium text-sm transition-all duration-300 ${
                    sortBy === sort.key
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-black hover:text-white'
                  } ${index < 3 ? 'border-r border-black' : ''}`}
                >
                  {sort.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-black font-inter focus:outline-none focus:ring-2 focus:ring-black"
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Leaderboard Table */}
        <section className="px-6 md:px-12 lg:px-20 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-black/70 font-inter">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-100 border-2 border-black p-4 font-space-grotesk font-bold text-sm grid grid-cols-7 gap-4">
                <div>Rank</div>
                <div className="col-span-2">Player</div>
                <div className="text-center">Score</div>
                <div className="text-center">Accuracy</div>
                <div className="text-center">Cards</div>
                <div className="text-center">Streak</div>
              </div>

              {/* Table Body */}
              <div className="border-2 border-t-0 border-black">
                {paginatedLeaderboard.map((entry, index) => {
                  const globalIndex = startIndex + index;
                  const isCurrentUser = user?.id === entry.id;
                  
                  return (
                    <div
                      key={entry.id}
                      className={`p-4 border-b border-black grid grid-cols-7 gap-4 items-center hover:bg-gray-50 transition-colors ${
                        isCurrentUser ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs font-space-grotesk ${getRankStyle(globalIndex)}`}>
                          {globalIndex < 3 ? getRankIcon(globalIndex) : globalIndex + 1}
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-sm truncate font-space-grotesk ${isCurrentUser ? 'text-blue-800' : 'text-black'}`}>
                              {entry.username}
                              {isCurrentUser && <span className="text-xs text-blue-600">(You)</span>}
                            </span>
                            <LevelBadge level={calculateLevel(entry.score)} size="small" showLabel={false} />
                          </div>
                          <div className="text-xs text-black/50 font-inter">
                            Joined {formatShortDate(entry.joinedDate)}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-center">
                        <div className="font-bold text-black text-sm font-space-grotesk">{entry.score.toLocaleString()}</div>
                        <div className="text-xs text-black/50 font-inter">{entry.gamesPlayed} games</div>
                      </div>

                      {/* Accuracy */}
                      <div className="text-center">
                        <div className="font-bold text-black text-sm font-space-grotesk">{entry.accuracy}%</div>
                        <div className="text-xs text-black/50 font-inter">avg {entry.averageScore}%</div>
                      </div>

                      {/* Cards */}
                      <div className="text-center">
                        <div className="font-bold text-black text-sm font-space-grotesk">{entry.cardsCompleted}</div>
                        <div className="text-xs text-black/50 font-inter">cards</div>
                      </div>

                      {/* Streak */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-black text-sm font-space-grotesk">{entry.streak}</span>
                          <span className="text-xs">{getStreakIcon(entry.streak)}</span>
                        </div>
                        <div className="text-xs text-black/50 font-inter">
                          Last: {formatShortDate(entry.lastPlayed)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-black/70 font-inter">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLeaderboard.length)} of {filteredLeaderboard.length} players
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-black text-sm font-space-grotesk hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 border border-black text-sm font-space-grotesk transition-colors ${
                            currentPage === page ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-black text-sm font-space-grotesk hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}