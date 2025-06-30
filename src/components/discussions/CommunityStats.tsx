/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import ThreadingLines from '@/components/threading/ThreadingLines';

interface StatItem {
  label: string;
  value: string;
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
    { label: 'Active Members', value: '...' },
    { label: 'Total Discussions', value: '...' },
    { label: 'Total Replies', value: '...' },
    { label: 'Total Views', value: '...' },
    { label: 'This Week', value: '...' }
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
              
              // console.log('Raw date:', rawDate, 'Parsed date:', createdAt, 'Week ago:', weekAgo, 'Include?', createdAt > weekAgo);
              return createdAt > weekAgo;
            }).length
          };


          // Create stats array with real data
          const realStats: StatItem[] = [
            {
              label: 'Active Members',
              value: discussionStats.uniqueAuthors.size.toString()
            },
            {
              label: 'Total Discussions',
              value: discussionStats.totalDiscussions.toString()
            },
            {
              label: 'Total Replies',
              value: discussionStats.totalReplies.toString()
            },
            {
              label: 'Total Views',
              value: discussionStats.totalViews.toString()
            },
            {
              label: 'This Week',
              value: discussionStats.recentActivity.toString()
            }
          ];

          setStats(realStats);
        } else {
          // Fallback to default stats if API fails
          setStats([
            { label: 'Active Members', value: '1' },
            { label: 'Total Discussions', value: '1' },
            { label: 'Total Replies', value: '10' },
            { label: 'Total Views', value: '9' },
            { label: 'This Week', value: '0' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching community stats:', error);
        // Fallback to default stats
        setStats([
          { label: 'Active Members', value: '1' },
          { label: 'Total Discussions', value: '1' },
          { label: 'Total Replies', value: '10' },
          { label: 'Total Views', value: '9' },
          { label: 'This Week', value: '0' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className={`border-t border-black ${className}`}>
      <div className="p-3">
        <h3 className="font-space-grotesk text-sm font-bold text-black mb-3">Community Stats</h3>
        
        {/* Horizontal Bar Layout */}
        <div className="space-y-1">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="relative">
              <div className={`flex border border-black ${loading ? 'animate-pulse' : ''}`}>
                {/* Left accent bar */}
                <div className="w-1 bg-gray-300"></div>
                
                {/* Middle section - Label (flex grows) */}
                <div className="flex-1 bg-white px-3 py-1 flex items-center">
                  <span className={`text-xs text-black font-medium ${loading ? 'bg-gray-200 text-transparent' : ''}`}>
                    {stat.label}
                  </span>
                </div>
                
                {/* Right section - Value (fixed width) */}
                <div className="w-12 bg-black text-white flex items-center justify-center">
                  <span className={`text-xs font-bold ${loading ? 'bg-gray-200 text-transparent' : ''}`}>
                    {stat.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}