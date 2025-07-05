/* eslint-disable react/no-unescaped-entities */
import React from 'react';

export default function HoraryIntroSection() {
  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <div className="border border-black p-8 mb-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mr-6">
            <span className="text-white text-3xl">🔮</span>
          </div>
          <div>
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Ancient Wisdom for Modern Questions</h3>
            <div className="w-24 h-1 bg-black"></div>
          </div>
        </div>
        <p className="text-black font-open-sans text-lg leading-relaxed">Horary astrology is one of the oldest and most precise branches of astrology, designed to answer specific questions by examining the astrological chart cast for the exact moment when a question is sincerely asked.</p>
      </div>

      <div className="mb-8">
        <p className="text-black font-open-sans leading-relaxed mb-6">Unlike natal astrology which describes your character and potential, horary astrology provides specific answers to specific questions. It's based on the principle that the moment of sincere questioning contains within it the seed of the answer.</p>
      </div>

      {/* Foundation Principle */}
      <div className="border border-black p-8 mb-8" style={{ backgroundColor: '#f2e356' }}>
        <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">The Foundation Principle</h3>
        <p className="text-black font-open-sans leading-relaxed">Every genuine question arises at a cosmically significant moment. The planetary positions at that instant reflect not just the question itself, but also contain the information needed to answer it. This is why horary astrology can be remarkably accurate when applied correctly.</p>
      </div>

      {/* What Makes Horary Unique */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#4ade80' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">✨</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">What Makes Horary Unique</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          <div className="border-r border-black border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                <span className="text-white text-lg">⚡</span>
              </div>
              <span className="font-space-grotesk font-bold text-black text-lg">Question-specific</span>
            </div>
            <div className="bg-white border border-black p-3">
              <p className="text-black font-open-sans text-sm">Each chart answers one particular question</p>
            </div>
          </div>
          <div className="border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                <span className="text-white text-lg">⏰</span>
              </div>
              <span className="font-space-grotesk font-bold text-black text-lg">Time-sensitive</span>
            </div>
            <div className="bg-white border border-black p-3">
              <p className="text-black font-open-sans text-sm">Uses the exact moment of questioning</p>
            </div>
          </div>
          <div className="border-r border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                <span className="text-white text-lg">✓</span>
              </div>
              <span className="font-space-grotesk font-bold text-black text-lg">Binary outcomes</span>
            </div>
            <div className="bg-white border border-black p-3">
              <p className="text-black font-open-sans text-sm">Often provides clear yes/no answers</p>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                <span className="text-white text-lg">📅</span>
              </div>
              <span className="font-space-grotesk font-bold text-black text-lg">Detailed timing</span>
            </div>
            <div className="bg-white border border-black p-3">
              <p className="text-black font-open-sans text-sm">Can predict when events will occur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Perfect Questions for Horary */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#ff91e9' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">✓</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Perfect Questions for Horary</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          <div className="border-r border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Clear & Specific</h4>
            <div className="bg-white border border-black p-4">
              <div className="space-y-3 text-black font-open-sans">
                <div>• "Will I get the job I interviewed for?"</div>
                <div>• "Should I move to Los Angeles?"</div>
                <div>• "Where did I lose my keys?"</div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Important & Sincere</h4>
            <div className="bg-white border border-black p-4">
              <div className="space-y-3 text-black font-open-sans">
                <div>• "Will my relationship with John work out?"</div>
                <div>• "Is this business deal worth pursuing?"</div>
                <div>• "When will I hear back about the loan application?"</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions to Avoid */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#f2e356' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Questions to Avoid</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          <div className="border-r border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Problematic Structure</h4>
            <div className="bg-white border border-black p-4">
              <div className="space-y-3 text-black font-open-sans">
                <div>• Overly general: "What should I do with my life?"</div>
                <div>• Multiple questions: "Will I get married and have children?"</div>
                <div>• Repeated questions (first sincere asking matters)</div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Ethical Issues</h4>
            <div className="bg-white border border-black p-4">
              <div className="space-y-3 text-black font-open-sans">
                <div>• Questions you don't genuinely care about</div>
                <div>• Invasion of others' privacy</div>
                <div>• Asking about other people's private matters</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Beauty of Horary Astrology */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-start p-8">
          <div className="w-20 h-20 bg-black flex items-center justify-center flex-shrink-0 mr-6">
            <span className="text-white text-3xl">✨</span>
          </div>
          <div className="flex-1">
            <h3 className="font-space-grotesk text-3xl font-bold text-black mb-4">The Beauty of Horary Astrology</h3>
            <p className="font-open-sans text-lg text-black leading-relaxed mb-6">
              The beauty of horary lies in its <span className="font-bold">precision and practicality</span>. When you have a burning question that keeps you awake at night, horary astrology can provide the clarity and direction you seek.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black">
              <div className="border-r border-black p-6">
                <div className="w-10 h-10 bg-black flex items-center justify-center mb-4">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <h4 className="font-space-grotesk font-bold text-black mb-2">Precise</h4>
                <div className="bg-white border border-black p-2">
                  <p className="text-black font-open-sans text-sm">Answers specific questions with remarkable accuracy</p>
                </div>
              </div>
              <div className="border-r border-black p-6">
                <div className="w-10 h-10 bg-black flex items-center justify-center mb-4">
                  <span className="text-white text-sm">🛠️</span>
                </div>
                <h4 className="font-space-grotesk font-bold text-black mb-2">Practical</h4>
                <div className="bg-white border border-black p-2">
                  <p className="text-black font-open-sans text-sm">Provides actionable guidance for real-world decisions</p>
                </div>
              </div>
              <div className="p-6">
                <div className="w-10 h-10 bg-black flex items-center justify-center mb-4">
                  <span className="text-white text-sm">💡</span>
                </div>
                <h4 className="font-space-grotesk font-bold text-black mb-2">Clarifying</h4>
                <div className="bg-white border border-black p-2">
                  <p className="text-black font-open-sans text-sm">Cuts through confusion to reveal clear direction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}