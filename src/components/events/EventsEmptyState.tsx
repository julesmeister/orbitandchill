"use client";

import React from 'react';

interface EventsEmptyStateProps {
  selectedTab: string;
  selectedType: string;
  isProfileComplete: boolean;
  setShowAddForm: (show: boolean) => void;
  setShowTimingOptions: (show: boolean) => void;
}

export default function EventsEmptyState({
  selectedTab,
  selectedType,
  isProfileComplete,
  setShowAddForm,
  setShowTimingOptions
}: EventsEmptyStateProps) {
  return (
    <div className="text-center py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-100 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-20 right-16 w-16 h-16 bg-blue-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-16 left-1/3 w-12 h-12 bg-indigo-100 rounded-full opacity-50 animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 right-10 w-8 h-8 bg-cyan-100 rounded-full opacity-60 animate-pulse delay-500"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Elegant floating stars */}
        <div className="relative mb-8">
          <div className="flex justify-center space-x-6 mb-4">
            <div className="text-4xl animate-pulse">✨</div>
            <div className="text-5xl animate-pulse delay-500">🌙</div>
            <div className="text-4xl animate-pulse delay-1000">⭐</div>
          </div>
          <div className="flex justify-center space-x-4">
            <div className="text-2xl animate-pulse delay-300">💫</div>
            <div className="text-3xl animate-pulse delay-700">🔮</div>
            <div className="text-2xl animate-pulse delay-200">✨</div>
          </div>
        </div>

        {/* Text content */}
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {selectedTab === 'bookmarked' ? (
              <>🔖 No Bookmarked Events</>
            ) : selectedType === 'challenging' ? (
              <>⚡ No Challenging Events</>
            ) : selectedType === 'benefic' ? (
              <>✨ No Favorable Events</>
            ) : (
              <>🌟 Your Cosmic Calendar Awaits</>
            )}
          </h3>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {selectedTab === 'bookmarked' 
              ? 'Start bookmarking important astrological events to create your personalized collection of meaningful dates.'
              : selectedType === 'challenging'
              ? 'No challenging planetary alignments found with current filters. That\'s good news for your cosmic journey!'
              : selectedType === 'benefic'
              ? 'No favorable events match your current filters. Try generating optimal timing or adjusting your view.'
              : 'Begin your astrological journey by creating events or discovering optimal timing based on planetary alignments.'}
          </p>

          {/* Enhanced action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-black text-white font-semibold text-base border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 overflow-hidden"
            >
              {/* Animated gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div className="relative flex items-center">
                <div className="bg-white text-black p-1.5 mr-3 border border-black">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-space-grotesk">Create Event</span>
              </div>
            </button>
            
            {isProfileComplete && (
              <button
                onClick={() => setShowTimingOptions(true)}
                className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="bg-white/20 rounded-lg p-1 mr-3 group-hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                Generate Timing
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">🔮</div>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}