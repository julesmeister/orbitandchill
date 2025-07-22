/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SeedingTabNavigationProps } from '@/types/seeding';

export default function SeedingTabNavigation({ activeTab, onTabChange }: SeedingTabNavigationProps) {
  return (
    <div className="bg-white border border-black mb-8">
      <div className="flex border-b border-black">
        <button
          onClick={() => onTabChange('generation')}
          className={`flex-1 px-6 py-4 font-space-grotesk font-semibold text-center transition-colors ${
            activeTab === 'generation'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Content Generation
          </div>
        </button>
        <button
          onClick={() => onTabChange('management')}
          className={`flex-1 px-6 py-4 font-space-grotesk font-semibold text-center transition-colors border-l border-black ${
            activeTab === 'management'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Discussion Management
          </div>
        </button>
      </div>

      {/* Tab Descriptions */}
      <div className="p-4 bg-gray-50">
        {activeTab === 'generation' && (
          <p className="text-sm text-gray-700 font-open-sans">
            Create new discussions by pasting content, processing it with AI, and generating forum discussions with replies.
          </p>
        )}
        {activeTab === 'management' && (
          <p className="text-sm text-gray-700 font-open-sans">
            Browse existing discussions and add AI-generated comments to enhance engagement and activity.
          </p>
        )}
      </div>
    </div>
  );
}