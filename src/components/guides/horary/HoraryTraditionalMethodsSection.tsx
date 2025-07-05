/* eslint-disable react/no-unescaped-entities */
import React from 'react';

export default function HoraryTraditionalMethodsSection() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mr-6">
            <span className="text-white text-3xl">📚</span>
          </div>
          <div>
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Time-Tested Wisdom</h3>
            <div className="w-24 h-1 bg-black"></div>
          </div>
        </div>
        <p className="text-black font-open-sans text-lg leading-relaxed">
          Traditional horary astrology follows time-tested rules developed over centuries by master astrologers. These methods form the foundation of accurate horary practice.
        </p>
      </div>

      {/* The House System */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#f2e356' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">🏠</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">The House System</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
          <p className="text-black font-open-sans leading-relaxed mb-6">
            Horary uses the traditional house meanings, but with specific question-related focus:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-black">
          {[
            { house: "1st", title: "Self & Identity", meaning: "The querent (person asking)", icon: "👤" },
            { house: "2nd", title: "Money & Possessions", meaning: "Querent's resources & lost objects", icon: "💰" },
            { house: "3rd", title: "Communication", meaning: "Siblings, contracts, short trips", icon: "📱" },
            { house: "4th", title: "Home & Family", meaning: "Real estate, father, end of matters", icon: "🏠" },
            { house: "5th", title: "Creativity & Romance", meaning: "Children, love affairs, speculation", icon: "💝" },
            { house: "6th", title: "Health & Work", meaning: "Daily routine, small animals", icon: "⚕️" },
            { house: "7th", title: "Partners & Others", meaning: "Spouses, open enemies, thieves", icon: "🤝" },
            { house: "8th", title: "Transformation", meaning: "Death, partner's money, inheritance", icon: "🔄" },
            { house: "9th", title: "Higher Learning", meaning: "Education, long journeys, law", icon: "🎓" },
            { house: "10th", title: "Career & Status", meaning: "Reputation, mother, authority", icon: "👔" },
            { house: "11th", title: "Friends & Hopes", meaning: "Advisers, wishes, aspirations", icon: "🤗" },
            { house: "12th", title: "Hidden & Spiritual", meaning: "Secret enemies, large animals", icon: "🔮" }
          ].map((item, index) => {
            const isLastRow = index >= 9; // Last row starts at index 9 (items 10, 11, 12)
            const isLastColumn = (index + 1) % 3 === 0;
            return (
              <div 
                key={index} 
                className={`p-8 ${!isLastRow ? 'border-b' : ''} ${!isLastColumn ? 'border-r' : ''} border-black group hover:bg-white/50 transition-colors duration-200`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mr-4 group-hover:bg-gray-800 transition-colors">
                    <span className="text-white text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <div className="font-space-grotesk font-bold text-black text-lg mb-1">{item.house} House</div>
                    <div className="font-space-grotesk font-bold text-black text-sm">{item.title}</div>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="text-black font-open-sans text-sm leading-relaxed">{item.meaning}</div>
                </div>
                
                {/* Visual accent bar */}
                <div className="mt-4 w-full h-1 bg-black/20 group-hover:bg-black transition-colors duration-200"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Significators */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#4ade80' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Significators: The Key Players</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
          <p className="text-black font-open-sans text-sm mb-6">Understanding who represents what in your horary chart</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black">
          {/* Querent */}
          <div className="border-r border-black border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Querent</h4>
                <span className="text-black text-xs font-medium">The Person Asking</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">1st House & Its Ruler</div>
                    <div className="text-black text-xs">Primary representation</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">Moon as Co-significator</div>
                    <div className="text-black text-xs">Secondary representation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quesited */}
          <div className="border-r border-black border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">🎯</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Quesited</h4>
                <span className="text-black text-xs font-medium">Subject of Question</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">7th House</div>
                    <div className="text-black text-xs">Partners, opponents</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">10th House</div>
                    <div className="text-black text-xs">Bosses, authorities</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">5th House</div>
                    <div className="text-black text-xs">Children, romance</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">2nd House</div>
                    <div className="text-black text-xs">Lost objects, money</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Co-significators */}
          <div className="border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">🌙</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Co-significators</h4>
                <span className="text-black text-xs font-medium">Supporting Elements</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">Moon (Querent)</div>
                    <div className="text-black text-xs">Always represents questioner</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">Moon (Development)</div>
                    <div className="text-black text-xs">Shows event progression</div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-black font-medium text-sm">Part of Fortune</div>
                    <div className="text-black text-xs">Material outcomes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Flow */}
          <div className="p-8 col-span-full">
            <div className="bg-white border border-black p-4">
              <div className="flex items-center justify-center space-x-4 text-black">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Querent</span>
                </div>
                <div className="text-black">⟷</div>
                <div className="flex items-center space-x-2">
                  <span className="text-black">🎯</span>
                  <span className="text-sm font-medium">Quesited</span>
                </div>
                <div className="text-black">+</div>
                <div className="flex items-center space-x-2">
                  <span className="text-black">🌙</span>
                  <span className="text-sm font-medium">Co-significators</span>
                </div>
                <div className="text-black">=</div>
                <div className="text-sm font-bold">Chart Reading</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Three Essential Judgments */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#ff91e9' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚖️</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">The Three Essential Judgments</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl font-bold">1</span>
            </div>
            <h4 className="font-space-grotesk font-bold text-black text-xl">Radical Chart Assessment</h4>
          </div>
          <div className="mb-4">
            <p className="text-black font-open-sans text-sm leading-relaxed">
              Before interpreting, determine if the chart is "radical" (fit to be judged):
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
            <div className="border-r border-black p-8 group hover:bg-white/30 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 flex items-center justify-center mr-3 group-hover:bg-green-700 transition-colors">
                  <span className="text-white text-lg">✓</span>
                </div>
                <h5 className="font-space-grotesk font-bold text-black text-lg">Chart is Radical When</h5>
              </div>
              <div className="space-y-3 text-black font-open-sans text-sm">
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ascendant between 3° and 27° of any sign</span>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Question is sincere and important to querent</span>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Astrologer feels confident about timing</span>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Question not asked repeatedly</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 group hover:bg-white/30 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-600 flex items-center justify-center mr-3 group-hover:bg-red-700 transition-colors">
                  <span className="text-white text-lg">✗</span>
                </div>
                <h5 className="font-space-grotesk font-bold text-black text-lg">Avoid Judgment When</h5>
              </div>
              <div className="space-y-3 text-black font-open-sans text-sm">
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ascendant in first 3° or last 3° of sign</span>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Moon is void of course (with exceptions)</span>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Saturn in 1st or 7th house (traditional caution)</span>
                  </div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Question is not genuine or repeated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl font-bold">2</span>
            </div>
            <h4 className="font-space-grotesk font-bold text-black text-xl">Planetary Condition Analysis</h4>
          </div>
          <div className="mb-4">
            <p className="text-black font-open-sans text-sm leading-relaxed">
              Evaluate the strength and condition of significator planets:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
            <div className="border-r border-black p-8 group hover:bg-white/30 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-700 transition-colors">
                  <span className="text-white text-lg">⭐</span>
                </div>
                <h5 className="font-space-grotesk font-bold text-black text-lg">Essential Dignity</h5>
              </div>
              <div className="space-y-3 text-black font-open-sans text-sm">
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Ruler</span>
                    <span className="text-xs bg-green-100 px-2 py-1 border border-green-400">Strongest</span>
                  </div>
                  <div className="text-xs mt-1">Planet in its own sign</div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Exaltation</span>
                    <span className="text-xs bg-blue-100 px-2 py-1 border border-blue-400">Very Strong</span>
                  </div>
                  <div className="text-xs mt-1">Planet in exaltation sign</div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Triplicity</span>
                    <span className="text-xs bg-yellow-100 px-2 py-1 border border-yellow-400">Moderate</span>
                  </div>
                  <div className="text-xs mt-1">Elemental rulership</div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Terms</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 border border-gray-400">Mild</span>
                  </div>
                  <div className="text-xs mt-1">Degree-based rulership</div>
                </div>
              </div>
            </div>
            <div className="p-8 group hover:bg-white/30 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 flex items-center justify-center mr-3 group-hover:bg-purple-700 transition-colors">
                  <span className="text-white text-lg">🏠</span>
                </div>
                <h5 className="font-space-grotesk font-bold text-black text-lg">Accidental Dignity</h5>
              </div>
              <div className="space-y-3 text-black font-open-sans text-sm">
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Angular</span>
                    <span className="text-xs bg-green-100 px-2 py-1 border border-green-400">Strongest</span>
                  </div>
                  <div className="text-xs mt-1">Houses 1, 4, 7, 10</div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Succedent</span>
                    <span className="text-xs bg-yellow-100 px-2 py-1 border border-yellow-400">Moderate</span>
                  </div>
                  <div className="text-xs mt-1">Houses 2, 5, 8, 11</div>
                </div>
                <div className="bg-white border border-black p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Cadent</span>
                    <span className="text-xs bg-red-100 px-2 py-1 border border-red-400">Weakest</span>
                  </div>
                  <div className="text-xs mt-1">Houses 3, 6, 9, 12</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl font-bold">3</span>
            </div>
            <h4 className="font-space-grotesk font-bold text-black text-xl">Aspect Analysis</h4>
          </div>
          <div className="mb-4">
            <p className="text-black font-open-sans text-sm leading-relaxed">
              Examine how planets interact and what their relationships reveal:
            </p>
          </div>
          <div className="space-y-6">
            {/* Applying vs Separating */}
            <div className="border border-black p-8 group hover:bg-white/30 transition-colors">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-orange-600 flex items-center justify-center mr-3 group-hover:bg-orange-700 transition-colors">
                  <span className="text-white text-lg">⏳</span>
                </div>
                <h5 className="font-space-grotesk font-bold text-black text-lg">Applying vs Separating</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-600 flex items-center justify-center mr-3">
                      <span className="text-white text-sm">→</span>
                    </div>
                    <span className="font-space-grotesk font-bold text-black">Applying Aspects</span>
                  </div>
                  <div className="space-y-2 text-black font-open-sans text-sm">
                    <div>• Future developments and outcomes</div>
                    <div>• Generally indicates "yes" to questions</div>
                    <div>• Shows what will happen</div>
                  </div>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-600 flex items-center justify-center mr-3">
                      <span className="text-white text-sm">←</span>
                    </div>
                    <span className="font-space-grotesk font-bold text-black">Separating Aspects</span>
                  </div>
                  <div className="space-y-2 text-black font-open-sans text-sm">
                    <div>• Past influences and events</div>
                    <div>• Generally indicates "no" or "already happened"</div>
                    <div>• Shows what has been</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Perfect Aspects */}
            <div className="border border-black p-8 group hover:bg-white/30 transition-colors">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center mr-3 group-hover:bg-indigo-700 transition-colors">
                  <span className="text-white text-lg">⚡</span>
                </div>
                <h5 className="font-space-grotesk font-bold text-black text-lg">Perfect Aspects</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-black p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-space-grotesk font-bold text-black">Conjunction (0°)</span>
                    <span className="text-xs bg-purple-100 px-2 py-1 border border-purple-400">Union</span>
                  </div>
                  <div className="text-xs text-black font-open-sans">Planets work together intensively</div>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-space-grotesk font-bold text-black">Trine (120°)</span>
                    <span className="text-xs bg-green-100 px-2 py-1 border border-green-400">Harmony</span>
                  </div>
                  <div className="text-xs text-black font-open-sans">Natural flow and ease</div>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-space-grotesk font-bold text-black">Square (90°)</span>
                    <span className="text-xs bg-orange-100 px-2 py-1 border border-orange-400">Friction</span>
                  </div>
                  <div className="text-xs text-black font-open-sans">Dynamic tension, action required</div>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-space-grotesk font-bold text-black">Opposition (180°)</span>
                    <span className="text-xs bg-red-100 px-2 py-1 border border-red-400">Separation</span>
                  </div>
                  <div className="text-xs text-black font-open-sans">Balance through contrast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}