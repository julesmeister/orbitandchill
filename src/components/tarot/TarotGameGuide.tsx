/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface TarotGameGuideProps {
  startGame: () => void;
}

export default function TarotGameGuide({ startGame }: TarotGameGuideProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 font-space-grotesk text-black">How to Play</h2>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk border border-black">
            1
          </div>
          <div>
            <h3 className="font-semibold mb-2 font-space-grotesk text-black">Draw a Card</h3>
            <p className="text-black/70 font-inter">A random tarot card will be presented along with a real-life situation.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk border border-black">
            2
          </div>
          <div>
            <h3 className="font-semibold mb-2 font-space-grotesk text-black">Interpret the Card</h3>
            <p className="text-black/70 font-inter">Write your interpretation of what the card means in the given context.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk border border-black">
            3
          </div>
          <div>
            <h3 className="font-semibold mb-2 font-space-grotesk text-black">Get AI Feedback</h3>
            <p className="text-black/70 font-inter">Receive personalized feedback on your interpretation and learn the traditional meanings.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold flex-shrink-0 font-space-grotesk border border-black">
            4
          </div>
          <div>
            <h3 className="font-semibold mb-2 font-space-grotesk text-black">Track Progress</h3>
            <p className="text-black/70 font-inter">Build your familiarity with each card and climb the leaderboard!</p>
          </div>
        </div>
      </div>


      <button
        onClick={startGame}
        className="w-full mt-8 bg-black text-white px-8 py-4 font-semibold text-lg border-2 border-black hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 transition-all duration-300 font-inter"
      >
        Start Learning Journey
      </button>
    </div>
  );
}