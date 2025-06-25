/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { 
  HeroCard, 
  InfoGrid, 
  SectionCard, 
  IntegrationCard, 
  AssessmentExercise,
  VisualChart,
  NextSteps,
  SymbolGrid
} from '@/components/guides/GuideComponents';

export const renderHoraryContent = (currentSection: number) => {
  switch (currentSection) {
    case 0: // What is Horary Astrology?
      return (
        <div className="space-y-8">
          <HeroCard
            icon="🔮"
            title="Ancient Wisdom for Modern Questions"
            description="Horary astrology is one of the oldest and most precise branches of astrology, designed to answer specific questions by examining the astrological chart cast for the exact moment when a question is sincerely asked."
            backgroundColor="#6bdbff"
          />

          <IntegrationCard
            title="The Foundation Principle"
            description="Understanding the cosmic significance of questioning"
            exampleText="Every genuine question arises at a cosmically significant moment. The planetary positions at that instant reflect not just the question itself, but also contain the information needed to answer it. This is why horary astrology can be remarkably accurate when applied correctly."
          >
            <div className="text-black/80">
              <p className="leading-relaxed">Every genuine question arises at a cosmically significant moment. The planetary positions at that instant reflect not just the question itself, but also contain the information needed to answer it. This is why horary astrology can be remarkably accurate when applied correctly.</p>
            </div>
          </IntegrationCard>

          <InfoGrid
            title="What Makes Horary Unique"
            items={[
              {
                icon: "🎯",
                title: "Specific Answers",
                description: "Provides precise answers to precise questions, not general character analysis"
              },
              {
                icon: "⏰",
                title: "Moment of Questioning",
                description: "Uses the exact time and place where the question was sincerely asked"
              },
              {
                icon: "🏛️",
                title: "Traditional Methods",
                description: "Follows ancient techniques developed over centuries of practice"
              },
              {
                icon: "✨",
                title: "Remarkably Accurate",
                description: "Can provide startlingly precise answers when applied correctly"
              }
            ]}
            backgroundColor="#f2e356"
          />

          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <div className="p-8 border-r border-black" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Perfect Questions for Horary</h3>
              <div className="space-y-3">
                {[
                  { icon: "💼", text: "Should I take this job offer?" },
                  { icon: "🏠", text: "Will this house purchase go through?" },
                  { icon: "💔", text: "Is my relationship over?" },
                  { icon: "🔍", text: "Where are my lost keys?" },
                  { icon: "💰", text: "Will this investment be profitable?" },
                  { icon: "🏥", text: "What's wrong with my health?" },
                  { icon: "✈️", text: "Should I move to another city?" },
                  { icon: "👥", text: "Can I trust this person?" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-black text-sm italic">"{item.text}"</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Questions That Don't Work</h3>
              <div className="space-y-3">
                {[
                  "Vague questions without specific focus",
                  "Questions you don't really care about",
                  "Testing questions to see if astrology works",
                  "Questions about inevitable events (death timing)",
                  "Questions you've asked multiple times recently",
                  "Hypothetical 'what if' scenarios",
                  "Questions with obvious answers",
                  "Questions that violate others' privacy"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
                    <span className="text-black text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Key Differences from Other Astrology</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-2">Natal Astrology</h4>
                <p className="text-black text-xs mb-2"><strong>Purpose:</strong> Describes character, potential, life patterns</p>
                <p className="text-black text-xs"><strong>Chart:</strong> Birth moment</p>
              </div>
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-2">Horary Astrology</h4>
                <p className="text-black text-xs mb-2"><strong>Purpose:</strong> Answers specific questions with yes/no or concrete details</p>
                <p className="text-black text-xs"><strong>Chart:</strong> Question moment</p>
              </div>
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-2">Electional Astrology</h4>
                <p className="text-black text-xs mb-2"><strong>Purpose:</strong> Chooses optimal timing for future events</p>
                <p className="text-black text-xs"><strong>Chart:</strong> Future planned moment</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 1: // Traditional Horary Methods
      return (
        <div className="space-y-8">
          <HeroCard
            icon="🏛️"
            title="Traditional Horary Techniques"
            description="Horary astrology follows time-tested methods developed by masters like William Lilly, Guido Bonatti, and other traditional astrologers. These techniques have proven their accuracy over centuries of practice."
            backgroundColor="#ff91e9"
          />

          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <SectionCard
              icon="👑"
              title="Significators"
              subtitle="Key Players in the Chart"
              description="Every horary chart has significators - planets that represent the querent (person asking) and the quesited (thing being asked about)."
              keyQuestions={[
                "Who is the querent in this question?",
                "What is being asked about?",
                "Which planets represent each party?",
                "Are there any co-significators involved?"
              ]}
              backgroundColor="#6bdbff"
              className="border-r border-black"
            />
            
            <SectionCard
              icon="🎭"
              title="House System"
              subtitle="Where the Story Unfolds"
              description="Houses in horary represent different areas of life and different people involved in the question."
              keyQuestions={[
                "Which house represents the querent?",
                "Which house rules what's being asked about?",
                "Are there derived houses to consider?",
                "What do the house rulers reveal?"
              ]}
              backgroundColor="#f2e356"
              className=""
            />
          </div>

          <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-6">Traditional House Meanings in Horary</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { houses: "1st House", meaning: "Querent (person asking)", examples: "Your appearance, health, general condition" },
                { houses: "2nd House", meaning: "Querent's money & possessions", examples: "Your income, belongings, values" },
                { houses: "3rd House", meaning: "Siblings, communication, short trips", examples: "Brothers/sisters, messages, local travel" },
                { houses: "4th House", meaning: "Home, family, endings", examples: "House/property, parents, conclusions" },
                { houses: "5th House", meaning: "Children, creativity, pleasure", examples: "Kids, art projects, entertainment, romance" },
                { houses: "6th House", meaning: "Work, health, service", examples: "Job, illness, employees, small animals" },
                { houses: "7th House", meaning: "Partners, opponents, contracts", examples: "Spouse, business partner, open enemies" },
                { houses: "8th House", meaning: "Other's money, death, transformation", examples: "Partner's resources, inheritance, deep change" },
                { houses: "9th House", meaning: "Higher learning, law, foreign affairs", examples: "University, courts, distant travel, religion" },
                { houses: "10th House", meaning: "Career, reputation, authority", examples: "Professional status, fame, government" },
                { houses: "11th House", meaning: "Friends, hopes, groups", examples: "Friendships, wishes, organizations" },
                { houses: "12th House", meaning: "Hidden things, enemies, loss", examples: "Secrets, large animals, self-undoing" }
              ].map((house, index) => (
                <div key={index} className="bg-white border border-black p-3">
                  <h4 className="font-space-grotesk font-bold text-black text-sm mb-1">{house.houses}</h4>
                  <p className="text-black text-xs font-medium mb-2">{house.meaning}</p>
                  <p className="text-black text-xs opacity-80">{house.examples}</p>
                </div>
              ))}
            </div>
          </div>

          <SymbolGrid
            title="Traditional Dignity System"
            subtitle="Planetary strength assessment"
            items={[
              { symbol: "👑", name: "Domicile", description: "Planet in its own sign - strongest position" },
              { symbol: "⬆️", name: "Exaltation", description: "Planet in its exaltation sign - very strong" },
              { symbol: "🤝", name: "Triplicity", description: "Planet ruling its element - moderately strong" },
              { symbol: "📐", name: "Term", description: "Planet in its Egyptian terms - somewhat strong" },
              { symbol: "👤", name: "Face", description: "Planet in its decan - weakly dignified" }
            ]}
            backgroundColor="#f0e3ff"
          />
        </div>
      );

    case 2: // Analyzing Questions and Significators
      return (
        <div className="space-y-8">
          <AssessmentExercise
            title="Step-by-Step Question Analysis"
            description="A systematic approach to analyzing horary questions"
            items={[
              {
                number: 1,
                title: "Clarify the Question",
                description: "Ensure the question is specific, sincere, and genuinely important to the querent"
              },
              {
                number: 2,
                title: "Identify the Querent",
                description: "The querent is represented by the 1st house and its ruler in most cases"
              },
              {
                number: 3,
                title: "Find the Quesited",
                description: "Determine which house and planet represent what's being asked about"
              },
              {
                number: 4,
                title: "Check Planetary Condition",
                description: "Assess the dignity, aspects, and house placement of significators"
              },
              {
                number: 5,
                title: "Look for Perfection",
                description: "Will the significators form a perfect aspect before leaving their signs?"
              },
              {
                number: 6,
                title: "Consider Prohibitions",
                description: "Are there any planets that interfere with or prevent the outcome?"
              }
            ]}
          />

          <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-6">Question Categories & Their Houses</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Relationship Questions</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Marriage/Partnership:</strong> 7th house</li>
                    <li>• <strong>Secret relationships:</strong> 12th house</li>
                    <li>• <strong>Casual romance:</strong> 5th house</li>
                    <li>• <strong>The other person:</strong> 7th house ruler</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Career Questions</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Job/profession:</strong> 10th house</li>
                    <li>• <strong>Daily work:</strong> 6th house</li>
                    <li>• <strong>Business partnerships:</strong> 7th house</li>
                    <li>• <strong>Income from job:</strong> 11th house (2nd from 10th)</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Money Questions</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Your money:</strong> 2nd house</li>
                    <li>• <strong>Investments/speculations:</strong> 5th house</li>
                    <li>• <strong>Partner's money:</strong> 8th house</li>
                    <li>• <strong>Salary/wages:</strong> 6th house</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Lost Object Questions</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>The object:</strong> 2nd house (if it belongs to querent)</li>
                    <li>• <strong>Location clues:</strong> Sign and house of significator</li>
                    <li>• <strong>Recovery potential:</strong> Aspects to significators</li>
                    <li>• <strong>Time frame:</strong> Speed of approaching aspects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <IntegrationCard
            title="Example: 'Will I Get This Job?'"
            description="Step-by-step analysis of a career question"
          >
            <div className="bg-white border border-black p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">1. Question Analysis</h4>
                  <p className="text-black text-sm">Clear, specific question about a particular job opportunity. Querent genuinely cares about the outcome.</p>
                </div>
                <div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">2. Significators</h4>
                  <p className="text-black text-sm"><strong>Querent:</strong> 1st house ruler (represents the person asking)<br/>
                  <strong>Job:</strong> 10th house ruler (represents the career/position)</p>
                </div>
                <div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">3. Analysis</h4>
                  <p className="text-black text-sm">Look for applying aspects between the 1st and 10th house rulers. A conjunction, sextile, or trine suggests success. A square or opposition might indicate challenges or rejection.</p>
                </div>
                <div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">4. Timing</h4>
                  <p className="text-black text-sm">The degrees between significators often indicate timing - whether in days, weeks, or months depends on the signs and houses involved.</p>
                </div>
              </div>
            </div>
          </IntegrationCard>
        </div>
      );

    case 3: // Timing and Final Judgment
      return (
        <div className="space-y-8">
          <HeroCard
            icon="⏰"
            title="The Art of Horary Timing"
            description="One of horary's most remarkable features is its ability to provide specific timing for when events will occur. This requires understanding traditional timing techniques and the symbolic language of planetary motion."
            backgroundColor="#f2e356"
          />

          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <div className="p-6 border-r border-black" style={{ backgroundColor: '#51bd94' }}>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Positive Indicators</h4>
              <div className="space-y-3">
                {[
                  { indicator: "Perfect Aspect", description: "Significators will form conjunction, sextile, or trine" },
                  { indicator: "Mutual Reception", description: "Planets are in each other's dignities" },
                  { indicator: "Translation of Light", description: "Faster planet carries energy between significators" },
                  { indicator: "Collection of Light", description: "Heavier planet receives both significators" },
                  { indicator: "Strong Dignities", description: "Significators are well-placed and dignified" }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-black p-3">
                    <div className="font-bold text-black text-sm mb-1">{item.indicator}</div>
                    <div className="text-black text-xs">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: '#ff91e9' }}>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Negative Indicators</h4>
              <div className="space-y-3">
                {[
                  { indicator: "No Perfection", description: "Significators won't aspect before changing signs" },
                  { indicator: "Prohibition", description: "Another planet interferes with the aspect" },
                  { indicator: "Refranation", description: "Planet turns retrograde before perfecting aspect" },
                  { indicator: "Combustion", description: "Significator too close to the Sun (within 8°)" },
                  { indicator: "Weak Dignities", description: "Significators in detriment or fall" }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-black p-3">
                    <div className="font-bold text-black text-sm mb-1">{item.indicator}</div>
                    <div className="text-black text-xs">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-6">Timing Guidelines</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-3">Cardinal Signs</h4>
                <p className="text-black text-sm mb-2"><strong>Aries, Cancer, Libra, Capricorn</strong></p>
                <p className="text-black text-xs mb-2"><strong>Speed:</strong> Fast action</p>
                <p className="text-black text-xs"><strong>Timing:</strong> Days to weeks</p>
              </div>
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-3">Fixed Signs</h4>
                <p className="text-black text-sm mb-2"><strong>Taurus, Leo, Scorpio, Aquarius</strong></p>
                <p className="text-black text-xs mb-2"><strong>Speed:</strong> Stable, enduring</p>
                <p className="text-black text-xs"><strong>Timing:</strong> Months to years</p>
              </div>
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-3">Mutable Signs</h4>
                <p className="text-black text-sm mb-2"><strong>Gemini, Virgo, Sagittarius, Pisces</strong></p>
                <p className="text-black text-xs mb-2"><strong>Speed:</strong> Variable</p>
                <p className="text-black text-xs"><strong>Timing:</strong> Weeks to months</p>
              </div>
            </div>
          </div>

          <NextSteps
            title="Mastering Horary Judgment"
            description="Developing your skills in traditional horary astrology"
            steps={[
              {
                number: 1,
                title: "Study the Masters",
                description: "Read William Lilly's 'Christian Astrology' and other traditional sources to understand classical techniques"
              },
              {
                number: 2,
                title: "Practice with Simple Questions",
                description: "Start with straightforward yes/no questions before attempting complex multi-part inquiries"
              },
              {
                number: 3,
                title: "Keep Detailed Records",
                description: "Track your horary charts and their outcomes to see which techniques work best for you"
              },
              {
                number: 4,
                title: "Learn House Derivation",
                description: "Master the art of derived houses for complex relationship and multi-person questions"
              },
              {
                number: 5,
                title: "Understand Planetary Nature",
                description: "Study how each planet's essential nature affects its function as a significator"
              },
              {
                number: 6,
                title: "Practice Timing Techniques",
                description: "Develop your skills in determining when predicted events will manifest"
              }
            ]}
          />

          <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Ethical Considerations</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🤝</div>
                <div className="text-black text-sm">
                  <strong>Respect privacy:</strong> Don't cast charts about others without their permission, especially for intimate or personal matters.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🎯</div>
                <div className="text-black text-sm">
                  <strong>Honest interpretation:</strong> Report what the chart shows, not what the querent wants to hear.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">⚖️</div>
                <div className="text-black text-sm">
                  <strong>Professional boundaries:</strong> Horary astrology is not a substitute for medical, legal, or financial advice.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🔮</div>
                <div className="text-black text-sm">
                  <strong>Sincere practice:</strong> Approach horary with genuine respect for its traditional wisdom and proven methods.
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div>Section content not found</div>;
  }
};