/* eslint-disable react/no-unescaped-entities */
import React from 'react';

export default function HoraryTimingJudgmentSection() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mr-6">
            <span className="text-white text-3xl">⚖️</span>
          </div>
          <div>
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Final Judgment & Timing</h3>
            <div className="w-24 h-1 bg-black"></div>
          </div>
        </div>
        <p className="text-black font-inter text-lg leading-relaxed">
          The final stage of horary interpretation involves synthesizing all astrological factors into a clear answer and, when possible, determining the timing of events.
        </p>
      </div>

      {/* Making the Final Judgment */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#f2e356' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Making the Final Judgment</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
          <p className="text-black font-inter leading-relaxed mb-6">
            After analyzing significators, aspects, and planetary conditions, you must weave together all factors:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black">
          {/* Positive Indicators */}
          <div className="border-r border-black border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">✅</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Positive Indicators</h4>
                <span className="text-black text-xs font-medium">"Yes" signals</span>
              </div>
            </div>
            <div className="space-y-3 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Significators in applying aspect (conjunction, sextile, trine)</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Both significators well-dignified</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Moon applying to querent's significator</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Reception between significators</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Translation or collection of light</span>
                </div>
              </div>
            </div>
          </div>

          {/* Negative Indicators */}
          <div className="border-r border-black border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">❌</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Negative Indicators</h4>
                <span className="text-black text-xs font-medium">"No" signals</span>
              </div>
            </div>
            <div className="space-y-3 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>No applying aspects between significators</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Significators separating from aspect</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Significators poorly dignified (detriment/fall)</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Moon void of course</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Combustion or other afflictions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mixed Indicators */}
          <div className="border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">⚠️</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Mixed Indicators</h4>
                <span className="text-black text-xs font-medium">Conditional outcomes</span>
              </div>
            </div>
            <div className="space-y-3 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span>Applying square (yes, but with difficulties)</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span>Retrograde significators (delays, reconsider)</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span>Cazimi planets (hidden but powerful)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reception & Mutual Reception */}
          <div className="p-8 col-span-full">
            <h4 className="font-space-grotesk font-bold text-black mb-6 text-lg">Reception & Mutual Reception</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
              <div className="border-r border-black p-6">
                <h5 className="font-space-grotesk font-bold text-black mb-3">Reception</h5>
                <div className="bg-white border border-black p-4">
                  <div className="text-black font-inter text-sm space-y-2">
                    <div>When one significator is in a sign ruled by the other:</div>
                    <div className="space-y-1 ml-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">→</span>
                        </div>
                        <span>Shows natural affinity and cooperation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">→</span>
                        </div>
                        <span>Can override difficult aspects</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">→</span>
                        </div>
                        <span>Indicates willingness to work together</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h5 className="font-space-grotesk font-bold text-black mb-3">Mutual Reception</h5>
                <div className="bg-white border border-black p-4">
                  <div className="text-black font-inter text-sm space-y-2">
                    <div>When significators are each in signs ruled by the other:</div>
                    <div className="space-y-1 ml-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                        <span>Very powerful positive indicator</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                        <span>Shows natural partnership and exchange</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                        <span>Often indicates "yes" even without major aspects</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timing Techniques */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#4ade80' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-2xl">⏰</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Timing Techniques</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          {/* Aspect-Based Timing */}
          <div className="border-r border-black border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">Aspect-Based Timing</h4>
            <div className="bg-white border border-black p-4 mb-4">
              <div className="font-space-grotesk font-bold text-black mb-2">Orb = Time Units</div>
              <div className="text-black font-inter text-sm">
                If orb is 5°, event occurs in 5 time units
              </div>
            </div>
            <div className="space-y-2 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Immediate questions:</span>
                  <span className="font-bold">Hours</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Short-term questions:</span>
                  <span className="font-bold">Days</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Long-term questions:</span>
                  <span className="font-bold">Weeks/Months</span>
                </div>
              </div>
            </div>
          </div>

          {/* House-Based Timing */}
          <div className="border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">House-Based Timing</h4>
            <div className="space-y-2 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Angular houses (1, 4, 7, 10):</span>
                  <span className="font-bold">Fast</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Succedent houses (2, 5, 8, 11):</span>
                  <span className="font-bold">Medium</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Cadent houses (3, 6, 9, 12):</span>
                  <span className="font-bold">Slow</span>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-white border border-black p-3">
              <div className="text-black font-inter text-xs">
                <span className="font-bold">Note:</span> Speed can also be determined by planetary motion and sign modality
              </div>
            </div>
          </div>

          {/* Sign-Based Timing */}
          <div className="border-r border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">Sign-Based Timing</h4>
            <div className="space-y-2 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="font-bold mb-1">Cardinal Signs (♈♋♎♑)</div>
                <div className="text-xs">Quick action, immediate results</div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="font-bold mb-1">Fixed Signs (♉♌♏♒)</div>
                <div className="text-xs">Slow but steady, long delays</div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="font-bold mb-1">Mutable Signs (♊♍♐♓)</div>
                <div className="text-xs">Variable timing, changes possible</div>
              </div>
            </div>
          </div>

          {/* Planetary Speed */}
          <div className="p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">Planetary Speed</h4>
            <div className="space-y-2 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Moon, Mercury:</span>
                  <span className="font-bold">Very Fast</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Venus, Mars:</span>
                  <span className="font-bold">Fast</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex justify-between">
                  <span>Jupiter, Saturn:</span>
                  <span className="font-bold">Slow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* William Lilly's Time Guidelines */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#ff91e9' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">📚</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">William Lilly's Time Guidelines</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-black">
          {[
            { condition: "Cardinal signs on angles", timing: "Hours or days" },
            { condition: "Fixed signs on angles", timing: "Months or years" },
            { condition: "Mutable signs on angles", timing: "Weeks or months" },
            { condition: "Succedent houses", timing: "Double angular time" },
            { condition: "Cadent houses", timing: "Uncertain or very long" },
            { condition: "Critical degrees (0°, 29°)", timing: "Urgent, immediate" }
          ].map((item, index) => {
            const isLastRow = index >= 3; // Last row items (indices 3, 4, 5)
            const isLastColumn = (index + 1) % 3 === 0;
            return (
              <div 
                key={index} 
                className={`p-6 ${!isLastRow ? 'border-b' : ''} ${!isLastColumn ? 'border-r' : ''} border-black`}
              >
                <div className="font-space-grotesk font-bold text-black text-sm mb-2">{item.condition}</div>
                <div className="bg-white border border-black p-2">
                  <div className="text-black font-inter text-xs">{item.timing}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample Final Judgment */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Sample Final Judgment</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white border border-black p-6">
            <div className="space-y-4">
              <div>
                <div className="font-space-grotesk font-bold text-black mb-2">Question:</div>
                <div className="text-black font-inter">"Will I get the job I interviewed for?"</div>
              </div>
              
              <div>
                <div className="font-space-grotesk font-bold text-black mb-2">Chart Analysis:</div>
                <div className="text-black font-inter text-sm">
                  Querent's ruler (Mercury) applying to conjunction with 10th house ruler (Venus) in 3°. Both planets well-dignified. Moon applying to sextile querent's ruler.
                </div>
              </div>
              
              <div>
                <div className="font-space-grotesk font-bold text-black mb-2">Final Answer:</div>
                <div className="text-black font-inter text-sm">
                  "Yes, you will get the job. The applying conjunction between your significator and the job significator shows success. Venus is well-dignified, suggesting the position is genuine and worthwhile. The 3° orb in a cardinal sign suggests you'll hear within 3 days."
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-space-grotesk font-bold text-black mb-4">The Three-Part Answer</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black">
              <div className="border-r border-black p-4 text-center">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold mx-auto mb-2">1</div>
                <div className="font-space-grotesk font-bold text-black text-sm">Direct Answer</div>
                <div className="bg-white border border-black p-2 mt-2">
                  <div className="text-black font-inter text-xs">Yes, No, or Conditional</div>
                </div>
              </div>
              <div className="border-r border-black p-4 text-center">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold mx-auto mb-2">2</div>
                <div className="font-space-grotesk font-bold text-black text-sm">Explanation</div>
                <div className="bg-white border border-black p-2 mt-2">
                  <div className="text-black font-inter text-xs">Why this outcome is indicated</div>
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold mx-auto mb-2">3</div>
                <div className="font-space-grotesk font-bold text-black text-sm">Timing</div>
                <div className="bg-white border border-black p-2 mt-2">
                  <div className="text-black font-inter text-xs">When it will occur (if applicable)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Considerations */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#f2e356' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">⚖️</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Professional Considerations</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          {/* Ethical Guidelines */}
          <div className="border-r border-black border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">Ethical Guidelines</h4>
            <div className="space-y-3 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Maintain querent confidentiality</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Avoid playing God with predictions</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Present as cosmic guidance, not absolute fate</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-indigo-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Encourage querent empowerment</span>
                </div>
              </div>
            </div>
          </div>

          {/* When to Decline */}
          <div className="border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">When to Decline Reading</h4>
            <div className="space-y-3 text-black font-inter text-sm">
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Questions about death (traditionally forbidden)</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Harm to others</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Invasion of privacy</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>Repeated questions on same matter</span>
                </div>
              </div>
              <div className="bg-white border border-black p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-xs">×</span>
                  </div>
                  <span>When you feel uncertain about the chart</span>
                </div>
              </div>
            </div>
          </div>

          {/* Final Note */}
          <div className="p-8 col-span-full">
            <div className="bg-white border border-black p-6 text-center">
              <div className="text-black font-inter text-sm italic">
                <span className="font-bold">Mastery Note:</span> The mastery of horary timing comes through practice and developing intuitive sensitivity to the cosmic rhythms. Start with clear-cut charts and gradually work with more complex scenarios as your skills develop.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}