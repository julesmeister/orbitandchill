/* eslint-disable react/no-unescaped-entities */
import React from 'react';

export default function HoraryQuestionAnalysisSection() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center mr-6">
            <span className="text-white text-3xl">🔍</span>
          </div>
          <div>
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Question Analysis Foundation</h3>
            <div className="w-24 h-1 bg-black"></div>
          </div>
        </div>
        <p className="text-black font-open-sans text-lg leading-relaxed">
          The foundation of successful horary astrology lies in properly analyzing the question and identifying the correct significators. This step determines the entire interpretation that follows.
        </p>
      </div>

      {/* Question Categories */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#f2e356' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">📋</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Question Categories & Significators</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          {/* Career Questions */}
          <div className="border-r border-black border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">💼</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Career & Work</h4>
                <span className="text-black text-xs font-medium">Professional matters</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="text-black font-medium text-sm mb-1">"Will I get the promotion?"</div>
                <div className="text-black text-xs space-y-1">
                  <div><span className="font-bold">Querent:</span> 1st house ruler</div>
                  <div><span className="font-bold">Promotion:</span> 10th house ruler</div>
                  <div><span className="font-bold">Process:</span> Applying aspects between 1st and 10th</div>
                </div>
              </div>
            </div>
          </div>

          {/* Relationship Questions */}
          <div className="border-b border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">💕</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Relationships</h4>
                <span className="text-black text-xs font-medium">Love & partnerships</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="text-black font-medium text-sm mb-1">"Will my relationship work out?"</div>
                <div className="text-black text-xs space-y-1">
                  <div><span className="font-bold">Querent:</span> 1st house ruler + Moon</div>
                  <div><span className="font-bold">Partner:</span> 7th house ruler</div>
                  <div><span className="font-bold">Outcome:</span> Aspects + Venus condition</div>
                </div>
              </div>
            </div>
          </div>

          {/* Lost Objects */}
          <div className="border-r border-black p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">🔑</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Lost Objects</h4>
                <span className="text-black text-xs font-medium">Finding possessions</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="text-black font-medium text-sm mb-1">"Where are my car keys?"</div>
                <div className="text-black text-xs space-y-1">
                  <div><span className="font-bold">Querent:</span> 1st house ruler</div>
                  <div><span className="font-bold">Keys:</span> 2nd house ruler</div>
                  <div><span className="font-bold">Location:</span> House placement of 2nd ruler</div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Questions */}
          <div className="p-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">🏥</span>
              </div>
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-lg">Health</h4>
                <span className="text-black text-xs font-medium">Medical concerns</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-black p-3">
                <div className="text-black font-medium text-sm mb-1">"Will my surgery be successful?"</div>
                <div className="text-black text-xs space-y-1">
                  <div><span className="font-bold">Querent:</span> 1st house ruler + Moon</div>
                  <div><span className="font-bold">Surgery:</span> 6th house ruler</div>
                  <div><span className="font-bold">Doctor:</span> 7th house ruler</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Significator Rules */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#4ade80' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Significator Identification Rules</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          {/* Primary Significators */}
          <div className="border-r border-black border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Primary Significators</h4>
            <div className="space-y-4">
              <div className="bg-white border border-black p-4">
                <div className="font-space-grotesk font-bold text-black mb-2">The Querent is ALWAYS:</div>
                <div className="space-y-2 text-black font-open-sans text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black"></div>
                    <span><span className="font-bold">1st house ruler</span> (primary)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-black"></div>
                    <span><span className="font-bold">Moon</span> (co-significator)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quesited Significators */}
          <div className="border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Quesited (Thing Asked About)</h4>
            <div className="space-y-2 text-black font-open-sans text-sm">
              <div className="flex justify-between">
                <span>Spouse/Partner:</span>
                <span className="font-bold">7th house ruler</span>
              </div>
              <div className="flex justify-between">
                <span>Money/Possessions:</span>
                <span className="font-bold">2nd house ruler</span>
              </div>
              <div className="flex justify-between">
                <span>Career/Job:</span>
                <span className="font-bold">10th house ruler</span>
              </div>
              <div className="flex justify-between">
                <span>Children:</span>
                <span className="font-bold">5th house ruler</span>
              </div>
              <div className="flex justify-between">
                <span>Health:</span>
                <span className="font-bold">6th house ruler</span>
              </div>
              <div className="flex justify-between">
                <span>Travel:</span>
                <span className="font-bold">9th house ruler</span>
              </div>
              <div className="flex justify-between">
                <span>Friends:</span>
                <span className="font-bold">11th house ruler</span>
              </div>
            </div>
          </div>

          {/* Complex Examples */}
          <div className="p-8 col-span-full">
            <h4 className="font-space-grotesk font-bold text-black mb-6 text-lg">Complex Question Examples</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black">
              <div className="border-r border-black p-6">
                <div className="text-black font-medium text-sm mb-3">"Should I buy this house?"</div>
                <div className="bg-white border border-black p-3">
                  <div className="space-y-2 text-black font-open-sans text-xs">
                    <div><span className="font-bold">Querent:</span> 1st house ruler + Moon</div>
                    <div><span className="font-bold">House:</span> 4th house ruler</div>
                    <div><span className="font-bold">Money:</span> 2nd house ruler</div>
                    <div className="text-black/80 italic">1st lord aspects 4th lord + 2nd shows resources</div>
                  </div>
                </div>
              </div>
              <div className="border-r border-black p-6">
                <div className="text-black font-medium text-sm mb-3">"Will my son get into Harvard?"</div>
                <div className="bg-white border border-black p-3">
                  <div className="space-y-2 text-black font-open-sans text-xs">
                    <div><span className="font-bold">Querent:</span> 1st house ruler</div>
                    <div><span className="font-bold">Son:</span> 5th house ruler</div>
                    <div><span className="font-bold">Harvard:</span> 9th house ruler</div>
                    <div className="text-black/80 italic">5th lord applying to 9th lord</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-black font-medium text-sm mb-3">"Is my partner stealing?"</div>
                <div className="bg-white border border-black p-3">
                  <div className="space-y-2 text-black font-open-sans text-xs">
                    <div><span className="font-bold">Querent:</span> 1st house ruler</div>
                    <div><span className="font-bold">Partner:</span> 7th house ruler</div>
                    <div><span className="font-bold">Business money:</span> 8th house ruler</div>
                    <div className="text-black/80 italic">7th lord afflicts 8th lord or in 2nd</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moon's Special Role */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#ff91e9' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-2xl">🌙</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Moon's Special Role</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
          <p className="text-black font-open-sans leading-relaxed mb-6">
            The Moon serves multiple crucial functions in horary astrology:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-black">
          {/* Co-significator */}
          <div className="border-r border-black border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">As Co-significator of Querent</h4>
            <div className="space-y-3 text-black font-open-sans text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span>Always represents the querent's emotional state</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span>Shows how the querent truly feels about the matter</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span>Reveals subconscious knowledge about the outcome</span>
              </div>
            </div>
          </div>

          {/* Flow of Events */}
          <div className="border-b border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">As the Flow of Events</h4>
            <div className="space-y-3 text-black font-open-sans text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span>Next major aspect shows next significant development</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span>Final aspect before sign change shows ultimate outcome</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span>Void of course Moon = "nothing will come of the matter"</span>
              </div>
            </div>
          </div>

          {/* Translation & Collection */}
          <div className="border-r border-black p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">Translation of Light</h4>
            <div className="bg-white border border-black p-4">
              <div className="text-black font-open-sans text-sm space-y-2">
                <div>When significators don't aspect directly:</div>
                <div className="text-xs space-y-1 ml-4">
                  <div>1. Moon first aspects one significator</div>
                  <div>2. Then Moon aspects the other</div>
                  <div>3. This brings the two parties together</div>
                </div>
              </div>
            </div>
          </div>

          {/* Collection */}
          <div className="p-8">
            <h4 className="font-space-grotesk font-bold text-black mb-4">Collection of Light</h4>
            <div className="bg-white border border-black p-4">
              <div className="text-black font-open-sans text-sm space-y-2">
                <div>When heavier planet receives aspects from both significators:</div>
                <div className="text-xs space-y-1 ml-4">
                  <div>• The heavier planet becomes a mediator</div>
                  <div>• Often represents a person who helps facilitate outcome</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Steps */}
      <div className="border border-black mb-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="p-8 pb-0">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-black flex items-center justify-center mr-4">
              <span className="text-white text-xl">✅</span>
            </div>
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">Practical Analysis Steps</h3>
              <div className="w-24 h-1 bg-black"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black">
          {[
            { step: "1", title: "Write exact question clearly", desc: "Precise wording matters" },
            { step: "2", title: "Note precise time crystallized", desc: "Moment of genuine concern" },
            { step: "3", title: "Identify all relevant significators", desc: "Querent, quesited, co-significators" },
            { step: "4", title: "Check chart radicality", desc: "Is chart fit to judge?" },
            { step: "5", title: "Examine significator conditions", desc: "Dignity, strength, placement" },
            { step: "6", title: "Look for applying aspects", desc: "Between primary significators" },
            { step: "7", title: "Consider Moon's role", desc: "Aspects and special functions" },
            { step: "8", title: "Apply traditional considerations", desc: "Combustion, retrograde, etc." },
            { step: "9", title: "Synthesize into clear answer", desc: "Combine all factors" }
          ].map((item, index) => {
            const isLastRow = index >= 6; // Items 7, 8, 9 (indices 6, 7, 8)
            const isLastColumn = (index + 1) % 3 === 0;
            return (
              <div 
                key={index} 
                className={`p-6 ${!isLastRow ? 'border-b' : ''} ${!isLastColumn ? 'border-r' : ''} border-black`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm mr-3">
                    {item.step}
                  </div>
                  <div className="font-space-grotesk font-bold text-black text-sm">{item.title}</div>
                </div>
                <div className="text-black font-open-sans text-xs">{item.desc}</div>
              </div>
            );
          })}
        </div>

        <div className="p-8 border-t border-black">
          <div className="bg-white border border-black p-6 text-center">
            <div className="text-black font-open-sans text-sm italic">
              <span className="font-bold">Remember:</span> The art of horary lies not just in technical rules, but in understanding the spiritual principle that genuine questions contain their own answers within the cosmic patterns of the asking moment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}