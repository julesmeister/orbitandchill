"use client";

import Image from 'next/image';
import Link from 'next/link';
import { getAvatarByIdentifier } from '../../utils/avatarUtils';

// Temporary interface for existing mock data
interface DiscussionTemp {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isLocked: boolean;
  isPinned: boolean;
  tags: string[];
  upvotes: number;
}

interface DiscussionsSidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  mockDiscussions: DiscussionTemp[];
}

export default function DiscussionsSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  mockDiscussions
}: DiscussionsSidebarProps) {
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-6 space-y-4">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              href="/discussions/new"
              className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm text-center"
            >
              Start New Discussion
            </Link>
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
              Browse Popular Topics
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="space-y-2">
            {categories.slice(1).map(category => {
              const isActive = selectedCategory === category;
              const discussionCount = mockDiscussions.filter(d => d.category === category).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {discussionCount}
                    </span>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setSelectedCategory('All Categories')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'All Categories'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">All Categories</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === 'All Categories' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {mockDiscussions.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'natal-chart', 'mercury-retrograde', 'relationships', 'mars', 'synastry',
              'transits', 'planets', 'houses', 'aspects', 'compatibility'
            ].map(tag => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {[
              { user: 'AstroMaster', action: 'replied to', topic: 'Mars in Scorpio', time: '5m ago' },
              { user: 'StarSeeker', action: 'started', topic: 'Venus Transit Questions', time: '12m ago' },
              { user: 'CosmicSeer', action: 'liked', topic: 'Mercury Retrograde', time: '1h ago' },
              { user: 'MoonChild', action: 'replied to', topic: 'Synastry Help', time: '2h ago' }
            ].map((activity, index) => (
              <div key={index} className="text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
                    <Image
                      src={getAvatarByIdentifier(activity.user)}
                      alt={activity.user}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium text-blue-600 cursor-pointer hover:text-blue-700">
                        {activity.topic}
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Community Stats</h3>
          <div className="space-y-3">
            {/* Online Now */}
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Online Now</p>
                  <p className="text-base font-bold text-green-800">342</p>
                </div>
              </div>
              <div className="text-xs text-green-600">active users</div>
            </div>

            {/* Today's Posts */}
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Today</p>
                  <p className="text-base font-bold text-blue-800">127</p>
                </div>
              </div>
              <div className="text-xs text-blue-600">new posts</div>
            </div>

            {/* This Week */}
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-purple-700 font-medium uppercase tracking-wide">This Week</p>
                  <p className="text-base font-bold text-purple-800">1,234</p>
                </div>
              </div>
              <div className="text-xs text-purple-600">discussions</div>
            </div>

            {/* Total Members */}
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-700 font-medium uppercase tracking-wide">Total Members</p>
                  <p className="text-base font-bold text-gray-800">24,567</p>
                </div>
              </div>
              <div className="text-xs text-gray-600">members</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}