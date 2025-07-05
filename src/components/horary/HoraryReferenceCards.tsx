/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

export default function HoraryReferenceCards() {
  return (
    <>
      {/* Quick Reference Cards */}
      <div className="border-x border-t border-black bg-white p-8">
        <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">Quick Horary Reference</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">

          {/* Chart Validity */}
          <div className="border-r border border-black p-6" style={{ backgroundColor: '#4ade80' }}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">✓</span>
              </div>
              <h4 className="font-space-grotesk font-bold text-black">Radical Chart</h4>
            </div>
            <div className="space-y-2 text-sm text-black font-open-sans">
              <div className="flex justify-between items-center">
                <span>Ascendant</span>
                <span className="font-medium">3°-27° in sign</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Moon</span>
                <span className="font-medium">Not void of course</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Saturn</span>
                <span className="font-medium">Not in 1st/7th</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Question</span>
                <span className="font-medium">Sincere</span>
              </div>
            </div>
          </div>

          {/* Moon Conditions */}
          <div className="border-r border border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">☽</span>
              </div>
              <h4 className="font-space-grotesk font-bold text-black">Moon States</h4>
            </div>
            <div className="space-y-2 text-sm text-black font-open-sans">
              <div className="flex justify-between items-center">
                <span><strong>Void</strong></span>
                <span>Nothing comes of matter</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Via Combusta</strong></span>
                <span>Dangerous/unpredictable</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Active</strong></span>
                <span>Normal progression</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Phase</strong></span>
                <span>Waxing = growth</span>
              </div>
            </div>
          </div>

          {/* Aspects */}
          <div className="border-r border border-black p-6" style={{ backgroundColor: '#f2e356' }}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⚹</span>
              </div>
              <h4 className="font-space-grotesk font-bold text-black">Aspects</h4>
            </div>
            <div className="space-y-2 text-sm text-black font-open-sans">
              <div className="flex justify-between items-center">
                <span><strong>Applying</strong></span>
                <span>Coming together</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Separating</strong></span>
                <span>Moving apart</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Conjunction</strong></span>
                <span>Strong union</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Trine</strong></span>
                <span>Harmonious flow</span>
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="border-b border-black p-6" style={{ backgroundColor: '#ff91e9' }}>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⏰</span>
              </div>
              <h4 className="font-space-grotesk font-bold text-black">Timing</h4>
            </div>
            <div className="space-y-2 text-sm text-black font-open-sans">
              <div className="flex justify-between items-center">
                <span><strong>Angular</strong></span>
                <span>Months/years</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Succedent</strong></span>
                <span>Weeks/months</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Cadent</strong></span>
                <span>Days/weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>Fast planets</strong></span>
                <span>Sooner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-x border-t border-black">
        {/* Traditional Method Card */}
        <div className="border-r border-black bg-white p-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
            <span className="text-white text-xl">📚</span>
          </div>
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Traditional Method</h3>
          <p className="font-open-sans text-black/70 text-sm">
            Based on centuries-old techniques from William Lilly and other masters of horary astrology.
          </p>
        </div>

        {/* Precise Timing Card */}
        <div className="border-r border-black bg-white p-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
            <span className="text-white text-xl">⏰</span>
          </div>
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Precise Timing</h3>
          <p className="font-open-sans text-black/70 text-sm">
            Charts are cast for the exact moment you submit your question, capturing celestial positions with precision.
          </p>
        </div>

        {/* Seven Planets Card */}
        <div className="border-r border-black bg-white p-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
            <span className="text-white text-xl">⭐</span>
          </div>
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Seven Planets</h3>
          <p className="font-open-sans text-black/70 text-sm">
            Uses only the traditional seven planets visible to the naked eye, following classical horary rules.
          </p>
        </div>

        {/* Clear Answers Card */}
        <div className="border-black bg-white p-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
            <span className="text-white text-xl">🧭</span>
          </div>
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Clear Answers</h3>
          <p className="font-open-sans text-black/70 text-sm">
            Receive yes/no answers with timing predictions and detailed astrological reasoning.
          </p>
        </div>
      </div>

      {/* Information Notice */}
      <div className="text-center">
        <div className="border border-black bg-white p-6">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
            <span className="font-space-grotesk font-bold text-black">
              Powered by traditional horary astrology methods following William Lilly's principles
            </span>
          </div>
        </div>
      </div>
    </>
  );
}