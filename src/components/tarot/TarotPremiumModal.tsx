/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface TarotPremiumModalProps {
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
}

export default function TarotPremiumModal({ showPremiumModal, setShowPremiumModal }: TarotPremiumModalProps) {
  if (!showPremiumModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 max-w-md w-full border-2 border-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center mx-auto mb-4">
            ⭐
          </div>
          <h3 className="text-2xl font-bold mb-4 font-space-grotesk text-black">Premium Feature</h3>
          <p className="text-black/70 mb-6 font-inter">
            The Tarot Learning Game is a premium feature. Upgrade to access interactive card interpretation challenges, AI-powered feedback, and compete on the global leaderboard!
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-black"></div>
              <span className="font-inter text-black/80">Learn all 78 tarot card meanings</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-black"></div>
              <span className="font-inter text-black/80">Get personalized AI feedback on interpretations</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-black"></div>
              <span className="font-inter text-black/80">Track your progress and accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-black"></div>
              <span className="font-inter text-black/80">Compete on global leaderboard</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="flex-1 px-4 py-3 bg-white text-black border-2 border-black font-semibold hover:bg-black hover:text-white transition-all duration-300 font-inter"
            >
              Maybe Later
            </button>
            <button
              onClick={() => {
                setShowPremiumModal(false);
                // TODO: Navigate to premium upgrade page
              }}
              className="flex-1 px-4 py-3 bg-black text-white border-2 border-black font-semibold hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 transition-all duration-300 font-inter"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}