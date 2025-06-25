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

export const renderNatalChartContent = (currentSection: number) => {
  switch (currentSection) {
    case 0: // What is a Natal Chart?
      return (
        <div className="space-y-8">
          <HeroCard
            icon="🌟"
            title="Your Cosmic Blueprint Awaits"
            description="Your natal chart is like a cosmic photograph taken at the exact moment and location of your birth. Think of it as your personal astrological DNA - a unique cosmic fingerprint that reveals insights about your personality, natural talents, challenges, and life patterns."
            backgroundColor="#6bdbff"
          />

          <InfoGrid
            title="What Makes Your Chart Unique"
            items={[
              {
                icon: "📅",
                title: "Exact Birth Details",
                description: "Date, time, and precise location"
              },
              {
                icon: "🌌",
                title: "Planetary Positions",
                description: "Where all celestial bodies were at your birth moment"
              },
              {
                icon: "🔗",
                title: "Cosmic Relationships",
                description: "How these celestial bodies relate to each other"
              },
              {
                icon: "🎯",
                title: "Personal Insights",
                description: "Your unique astrological makeup and potential"
              }
            ]}
            backgroundColor="#f2e356"
          />

          <IntegrationCard
            title="What Your Natal Chart Can Tell You"
            description="Unlike daily horoscopes based only on your sun sign, your natal chart considers all planetary positions"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">💭</div>
                  <span className="text-black font-medium">Core personality traits and motivations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">💝</div>
                  <span className="text-black font-medium">Emotional patterns and needs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">🗣️</div>
                  <span className="text-black font-medium">How you communicate and think</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">⚡</div>
                  <span className="text-black font-medium">What drives you and gives you energy</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">✨</div>
                  <span className="text-black font-medium">Natural talents and potential challenges</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">💕</div>
                  <span className="text-black font-medium">Relationship patterns and compatibility</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">🎯</div>
                  <span className="text-black font-medium">Career inclinations and life direction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">🔮</div>
                  <span className="text-black font-medium">Understanding your highest potential</span>
                </div>
              </div>
            </div>
          </IntegrationCard>
        </div>
      );

    case 1: // The Big Three
      return (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-0 border border-black">
            <SectionCard
              icon="☉"
              title="Your Sun Sign"
              subtitle="Core Identity & Ego"
              description="Your Sun sign represents your core identity, ego, and what you're actively becoming. It shows your conscious self and how you shine in the world."
              keyQuestions={[
                "What is my core identity?",
                "How do I express my ego?",
                "What am I consciously becoming?",
                "How do I shine and create?"
              ]}
              backgroundColor="#f2e356"
              className="border-r border-black"
            />
            
            <SectionCard
              icon="☽"
              title="Your Moon Sign"
              subtitle="Emotions & Inner World"
              description="Your Moon sign governs your emotional nature, instinctive reactions, and deepest needs. It shows your most natural, unguarded self."
              keyQuestions={[
                "How do I process emotions?",
                "What makes me feel secure?",
                "What are my instinctive reactions?",
                "What do I need for emotional fulfillment?"
              ]}
              backgroundColor="#4ade80"
              className="border-r border-black"
            />
            
            <SectionCard
              icon="↗"
              title="Your Rising Sign"
              subtitle="Outer Personality & First Impressions"
              description="Your Rising sign is the 'mask' you wear when meeting new people. It's your first impression and natural approach to life."
              keyQuestions={[
                "How do I come across to others?",
                "What is my natural approach to life?",
                "How do I handle new situations?",
                "What is my outer personality like?"
              ]}
              backgroundColor="#ff91e9"
              className=""
            />
          </div>

          <IntegrationCard
            title="How the Big Three Work Together"
            description="Understanding the interplay between your core personality layers"
            exampleText="I am essentially practical and perfectionistic (Virgo Sun), but emotionally I need security and nurturing (Cancer Moon), and I present myself as confident and dramatic (Leo Rising). This creates an interesting contrast between my organized nature, emotional sensitivity, and bold exterior."
          >
            <div className="grid md:grid-cols-3 gap-0 border border-black mb-6">
              <div className="border-r border-black p-6 text-center" style={{ backgroundColor: '#ff91e9' }}>
                <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🚪</span>
                </div>
                <div className="font-space-grotesk font-bold text-black mb-2">Rising Sign</div>
                <div className="text-black text-sm font-medium mb-2">The Front Door</div>
                <div className="text-black text-xs leading-relaxed">What people see first when they meet you.</div>
              </div>
              <div className="border-r border-black p-6 text-center" style={{ backgroundColor: '#f2e356' }}>
                <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🏠</span>
                </div>
                <div className="font-space-grotesk font-bold text-black mb-2">Sun Sign</div>
                <div className="text-black text-sm font-medium mb-2">The Living Room</div>
                <div className="text-black text-xs leading-relaxed">Where you spend your conscious energy.</div>
              </div>
              <div className="p-6 text-center" style={{ backgroundColor: '#4ade80' }}>
                <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🛏️</span>
                </div>
                <div className="font-space-grotesk font-bold text-black mb-2">Moon Sign</div>
                <div className="text-black text-sm font-medium mb-2">The Bedroom</div>
                <div className="text-black text-xs leading-relaxed">Your private emotional self.</div>
              </div>
            </div>
          </IntegrationCard>

          <AssessmentExercise
            title="Quick Assessment Exercise"
            description="Reflect on how your Big Three show up in daily life"
            items={[
              {
                number: 1,
                title: "Rising Sign Check:",
                description: "Does my Rising sign match how people describe meeting me for the first time?"
              },
              {
                number: 2,
                title: "Sun Sign Check:",
                description: "Does my Sun sign reflect what I'm consciously trying to become and achieve?"
              },
              {
                number: 3,
                title: "Moon Sign Check:",
                description: "Does my Moon sign capture my emotional needs and instinctive reactions?"
              },
              {
                number: 4,
                title: "Integration Check:",
                description: "How do these three energies work together or create interesting contrasts in my personality?"
              }
            ]}
          />
        </div>
      );

    case 2: // Understanding Your Chart Wheel
      return (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <div className="p-6 border-r border-black" style={{ backgroundColor: '#f2e356' }}>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-4 flex items-center">
                <span className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🧭</span>
                </span>
                The Four Angles
              </h4>
              
              <div className="space-y-4">
                <div className="p-3 bg-white border border-black">
                  <div className="font-bold text-black text-sm mb-1">Left (around 1st house):</div>
                  <div className="text-black text-sm font-medium">Your Ascendant (ASC)</div>
                  <div className="text-black text-xs mt-1 opacity-80">How you appear, your rising sign, first impressions</div>
                </div>
                <div className="p-3 bg-white border border-black">
                  <div className="font-bold text-black text-sm mb-1">Top (around 10th house):</div>
                  <div className="text-black text-sm font-medium">Your Midheaven (MC)</div>
                  <div className="text-black text-xs mt-1 opacity-80">Career, reputation, public image, life direction</div>
                </div>
                <div className="p-3 bg-white border border-black">
                  <div className="font-bold text-black text-sm mb-1">Right (around 7th house):</div>
                  <div className="text-black text-sm font-medium">Your Descendant (DSC)</div>
                  <div className="text-black text-xs mt-1 opacity-80">Relationships, partnerships, what you attract</div>
                </div>
                <div className="p-3 bg-white border border-black">
                  <div className="font-bold text-black text-sm mb-1">Bottom (around 4th house):</div>
                  <div className="text-black text-sm font-medium">Your IC (Imum Coeli)</div>
                  <div className="text-black text-xs mt-1 opacity-80">Roots, family, private self, inner foundation</div>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="Essential Planetary Symbols"
              subtitle="Personal Planets (Core Personality)"
              items={[
                { symbol: "☉", name: "Sun", description: "Core identity & ego" },
                { symbol: "☽", name: "Moon", description: "Emotions & instincts" },
                { symbol: "☿", name: "Mercury", description: "Communication & thought" },
                { symbol: "♀", name: "Venus", description: "Love & values" },
                { symbol: "♂", name: "Mars", description: "Energy & action" }
              ]}
              backgroundColor="#ff91e9"
            />
          </div>

          <VisualChart
            title="Chart Wheel Orientation"
            description="The four cardinal points of your chart"
            points={[
              { position: "-top-6 left-1/2 transform -translate-x-1/2", label: "MC", description: "Career & reputation" },
              { position: "-left-6 top-1/2 transform -translate-y-1/2", label: "ASC", description: "Identity & appearance" },
              { position: "-right-6 top-1/2 transform -translate-y-1/2", label: "DSC", description: "Relationships" },
              { position: "-bottom-6 left-1/2 transform -translate-x-1/2", label: "IC", description: "Home & roots" }
            ]}
          />
        </div>
      );

    case 3: // Houses: Life Areas
      return (
        <div className="space-y-8">
          <HeroCard
            icon="🏠"
            title="The Twelve Life Areas"
            description="Houses represent different areas of life experience. They show WHERE planetary energies play out in your life - from your identity and possessions to relationships and spirituality."
            backgroundColor="#51bd94"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-space-grotesk font-bold text-black text-lg">Personal Houses (1-6)</h4>
              <div className="space-y-3">
                {[
                  { number: "1st", name: "Identity", keywords: "Self, appearance, first impressions" },
                  { number: "2nd", name: "Resources", keywords: "Money, possessions, values" },
                  { number: "3rd", name: "Communication", keywords: "Siblings, short trips, learning" },
                  { number: "4th", name: "Home", keywords: "Family, roots, private life" },
                  { number: "5th", name: "Creativity", keywords: "Romance, children, self-expression" },
                  { number: "6th", name: "Daily Life", keywords: "Work, health, routines" }
                ].map((house, index) => (
                  <div key={index} className="p-3 bg-white border border-black">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold">
                        {house.number}
                      </div>
                      <div>
                        <div className="font-space-grotesk font-bold text-black text-sm">{house.name}</div>
                        <div className="text-black text-xs opacity-80">{house.keywords}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-space-grotesk font-bold text-black text-lg">Interpersonal Houses (7-12)</h4>
              <div className="space-y-3">
                {[
                  { number: "7th", name: "Partnerships", keywords: "Marriage, business partners, open enemies" },
                  { number: "8th", name: "Transformation", keywords: "Shared resources, death/rebirth, mysteries" },
                  { number: "9th", name: "Philosophy", keywords: "Higher learning, travel, beliefs" },
                  { number: "10th", name: "Career", keywords: "Reputation, authority, life direction" },
                  { number: "11th", name: "Community", keywords: "Friends, groups, hopes and dreams" },
                  { number: "12th", name: "Spirituality", keywords: "Subconscious, hidden things, sacrifice" }
                ].map((house, index) => (
                  <div key={index} className="p-3 bg-white border border-black">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold">
                        {house.number}
                      </div>
                      <div>
                        <div className="font-space-grotesk font-bold text-black text-sm">{house.name}</div>
                        <div className="text-black text-xs opacity-80">{house.keywords}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 4: // Putting It All Together
      return (
        <div className="space-y-8">
          <AssessmentExercise
            title="Beginning Chart Synthesis"
            description="Practice combining the basic elements you've learned"
            items={[
              {
                number: 1,
                title: "Identify Your Big Three",
                description: "Write down your Sun, Moon, and Rising signs. How do they work together or create interesting contrasts?"
              },
              {
                number: 2,
                title: "Find Your Chart Ruler",
                description: "Look for the planet that rules your Rising sign. Where is it placed in your chart?"
              },
              {
                number: 3,
                title: "Note Major Patterns",
                description: "Are most of your planets in certain elements, qualities, or areas of the chart?"
              },
              {
                number: 4,
                title: "Practice Integration",
                description: "Write a short paragraph describing your astrological personality based on what you've learned"
              }
            ]}
          />

          <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Sample Mini-Reading</h3>
            <div className="bg-white border border-black p-6">
              <div className="text-black text-sm leading-relaxed italic">
                "I have a Gemini Sun in the 10th house, Cancer Moon in the 11th house, and Virgo Rising. I have 4 planets in air signs and 3 in earth signs, with most planets in the upper half of my chart.
                <br/><br/>
                <strong>This suggests:</strong> I'm intellectual and communicative (Gemini Sun, air emphasis) with career focus (10th house Sun). I need emotional security through friendships and groups (Cancer Moon in 11th). I appear organized and helpful (Virgo Rising). The upper chart emphasis means I'm focused on public life and achievement rather than personal/private matters."
              </div>
            </div>
          </div>

          <NextSteps
            title="Your Astrological Journey Continues"
            description="Next steps for deepening your chart knowledge"
            steps={[
              {
                number: 1,
                title: "Start a Chart Journal",
                description: "Note patterns you recognize in yourself and track how they show up in daily life"
              },
              {
                number: 2,
                title: "Study Your Aspects",
                description: "Learn how planets in your chart relate to each other through geometric angles"
              },
              {
                number: 3,
                title: "Explore Progressions & Transits",
                description: "Understand how your chart evolves over time and current planetary influences"
              },
              {
                number: 4,
                title: "Compare Charts",
                description: "Study family and friends' charts to see how astrological patterns manifest differently"
              },
              {
                number: 5,
                title: "Join the Community",
                description: "Share insights and learn from other astrology enthusiasts in discussions"
              }
            ]}
          />
        </div>
      );

    default:
      return <div>Section content not found</div>;
  }
};