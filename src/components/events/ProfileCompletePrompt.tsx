"use client";

import React from 'react';
import Link from 'next/link';

interface ProfileCompletePromptProps {
  isProfileComplete: boolean;
}

export default function ProfileCompletePrompt({ isProfileComplete }: ProfileCompletePromptProps) {
  if (isProfileComplete) return null;

  return (
    <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold text-amber-900 mb-2">Unlock Personalized Astrological Timing</h3>
          <p className="text-amber-800 mb-4">
            Complete your birth data to generate optimal timing recommendations based on your unique natal chart analysis.
          </p>
          <Link 
            href="/profile" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
}