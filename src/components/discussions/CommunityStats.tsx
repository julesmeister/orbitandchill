/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';

interface StatItem {
  label: string;
  value: string;
  color: string;
}

interface CommunityStatsProps {
  className?: string;
}

interface DiscussionStats {
  totalDiscussions: number;
  totalReplies: number;
  totalViews: number;
  totalVotes: number;
  uniqueAuthors: Set<string>;
  recentActivity: number; // discussions in last 7 days
}

export default function CommunityStats({
  className = ''
}: CommunityStatsProps) {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Active Members', value: '...', color: '#6bdbff' },
    { label: 'Discussions', value: '...', color: '#51bd94' },
    { label: 'Total Replies', value: '...', color: '#ff91e9' },
    { label: 'Total Views', value: '...', color: '#f2e356' },
    { label: 'This Week', value: '...', color: '#19181a' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch discussions data
        const response = await fetch('/api/discussions?limit=1000&sortBy=recent');
        const data = await response.json();

        if (data.success && data.discussions) {
          const discussions = data.discussions;

          // Calculate real statistics
          const discussionStats: DiscussionStats = {
            totalDiscussions: discussions.length,
            totalReplies: discussions.reduce((sum: number, d: any) => sum + (d.replies || 0), 0),
            totalViews: discussions.reduce((sum: number, d: any) => sum + (d.views || 0), 0),
            totalVotes: discussions.reduce((sum: number, d: any) => sum + (d.upvotes || 0) + (d.downvotes || 0), 0),
            uniqueAuthors: new Set(discussions.map((d: any) => d.authorId || d.author).filter(Boolean)),
            recentActivity: discussions.filter((d: any) => {
              // Handle various date formats
              let createdAt;
              const rawDate = d.createdAt || d.lastActivity || d.updatedAt;
              
              if (typeof rawDate === 'number') {
                // If it's a Unix timestamp, multiply by 1000 if it looks like seconds
                createdAt = new Date(rawDate > 1000000000000 ? rawDate : rawDate * 1000);
              } else {
                createdAt = new Date(rawDate);
              }
              
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              
              return createdAt > weekAgo;
            }).length
          };

          // Create stats array with real data
          const realStats: StatItem[] = [
            {
              label: 'Active Members',
              value: discussionStats.uniqueAuthors.size.toString(),
              color: '#6bdbff'
            },
            {
              label: 'Discussions',
              value: discussionStats.totalDiscussions.toString(),
              color: '#51bd94'
            },
            {
              label: 'Total Replies',
              value: discussionStats.totalReplies.toString(),
              color: '#ff91e9'
            },
            {
              label: 'Total Views',
              value: discussionStats.totalViews.toString(),
              color: '#f2e356'
            },
            {
              label: 'This Week',
              value: discussionStats.recentActivity.toString(),
              color: '#19181a'
            }
          ];

          setStats(realStats);
        } else {
          // Fallback to default stats if API fails
          setStats([
            { label: 'Active Members', value: '1', color: '#6bdbff' },
            { label: 'Discussions', value: '1', color: '#51bd94' },
            { label: 'Total Replies', value: '10', color: '#ff91e9' },
            { label: 'Total Views', value: '9', color: '#f2e356' },
            { label: 'This Week', value: '0', color: '#19181a' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching community stats:', error);
        // Fallback to default stats
        setStats([
          { label: 'Active Members', value: '1', color: '#6bdbff' },
          { label: 'Discussions', value: '1', color: '#51bd94' },
          { label: 'Total Replies', value: '10', color: '#ff91e9' },
          { label: 'Total Views', value: '9', color: '#f2e356' },
          { label: 'This Week', value: '0', color: '#19181a' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={`border-t border-black ${className}`}>
      <div className="p-4 border-b border-black">
        <h3 className="font-space-grotesk text-base font-bold text-black">Community Stats</h3>
      </div>
      
      <div className="grid grid-cols-2">
        {stats.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="group relative">
            <div className={`flex flex-col items-center justify-center px-3 py-4 border-r border-b border-black transition-all duration-200 hover:pl-5 ${loading ? 'animate-pulse' : ''} ${
              index % 2 === 1 ? 'border-r-0' : ''
            } ${
              index >= stats.length - 2 ? 'border-b-0' : ''
            }`}>
              {/* Animated accent bar on hover */}
              <div
                className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                style={{ backgroundColor: stat.color }}
              />
              
              <span className={`text-xs px-2 py-1 border border-black text-black font-bold mb-2 ${loading ? 'bg-gray-200 text-transparent rounded' : ''}`}>
                {stat.value}
              </span>
              
              <span className={`font-medium text-xs text-black text-center ${loading ? 'bg-gray-200 text-transparent rounded' : ''}`}>
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}