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

export const renderElectionalContent = (currentSection: number) => {
  switch (currentSection) {
    case 0: // What is Electional Astrology?
      return (
        <div className="space-y-8">
          <HeroCard
            icon="⏰"
            title="Cosmic Event Planning"
            description="Electional astrology is the art and science of choosing the most auspicious timing for important events and decisions. Think of it as cosmic event planning - timing your actions to flow with universal energies rather than against them."
            backgroundColor="#f2e356"
          />

          <InfoGrid
            title="What Makes Electional Astrology Powerful"
            items={[
              {
                icon: "🎯",
                title: "Proactive Approach",
                description: "You choose the timing instead of reacting to it"
              },
              {
                icon: "⚡",
                title: "Optimization",
                description: "Selects the best possible moment from available options"
              },
              {
                icon: "🛡️",
                title: "Preventative",
                description: "Helps avoid problematic timing that could sabotage efforts"
              },
              {
                icon: "🚀",
                title: "Enhances Success",
                description: "Amplifies your natural efforts with cosmic support"
              }
            ]}
            backgroundColor="#6bdbff"
          />

          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <div className="p-8 border-r border-black" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">When to Use Electional Astrology</h3>
              <div className="space-y-3">
                {[
                  { icon: "🏢", text: "Business launches and product releases" },
                  { icon: "📄", text: "Important contracts and agreements" },
                  { icon: "💒", text: "Weddings and ceremonies" },
                  { icon: "🏥", text: "Medical procedures (when timing is flexible)" },
                  { icon: "✈️", text: "Travel and relocations" },
                  { icon: "🏠", text: "Real estate transactions" },
                  { icon: "🎨", text: "Creative project launches" },
                  { icon: "💰", text: "Major financial decisions" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-black text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">What Electional Cannot Do</h3>
              <div className="space-y-3">
                {[
                  "Change your fundamental nature or abilities",
                  "Guarantee success regardless of your efforts",
                  "Work when timing is completely fixed by others",
                  "Override extremely challenging natal patterns",
                  "Replace good planning and hard work"
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
                    <span className="text-black text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <IntegrationCard
            title="The Core Principle"
            description="Understanding cosmic timing for optimal results"
            exampleText="Every moment has its own astrological 'weather.' Some moments are naturally conducive to new beginnings, others favor completion, and some are better for rest and reflection. By understanding these cosmic rhythms, you can time your important actions to flow with, rather than against, the universal energies." children={undefined}          />
        </div>
      );

    case 1: // Core Timing Principles
      return (
        <div className="space-y-8">
          <HeroCard
            icon="🌙"
            title="The Moon: Your Most Important Guide"
            description="The Moon moves fastest through the zodiac and changes the energy every 2.5 days. It's your primary tool for electional timing, setting the emotional and intuitive tone for any endeavor."
            backgroundColor="#6bdbff"
          />

          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <SectionCard
              icon="🌕"
              title="Moon Phases"
              subtitle="Natural Timing Cycles"
              description="Each lunar phase supports different types of activities and intentions."
              keyQuestions={[
                "What am I trying to begin or complete?",
                "Do I need building or releasing energy?",
                "Is this for manifestation or letting go?",
                "What phase supports my intention?"
              ]}
              backgroundColor="#f2e356"
              className="border-r border-black"
            />
            
            <SectionCard
              icon="♈"
              title="Moon Signs"
              subtitle="Emotional & Practical Flavor"
              description="The Moon's zodiac sign colors the emotional quality and practical approach of the timing."
              keyQuestions={[
                "What energy quality do I want?",
                "Should this feel serious or playful?",
                "Do I want stability or innovation?",
                "What approach fits my goal?"
              ]}
              backgroundColor="#ff91e9"
              className=""
            />
          </div>

          <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-6">Moon Phase Timing Guide</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2 flex items-center">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs mr-2">●</span>
                    New Moon
                  </h4>
                  <p className="text-black text-sm mb-2"><strong>Best for:</strong> Fresh starts, planting seeds, setting intentions</p>
                  <p className="text-black text-xs opacity-80">Quiet energy perfect for planning and beginning new ventures</p>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2 flex items-center">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs mr-2">◐</span>
                    Waxing Moon
                  </h4>
                  <p className="text-black text-sm mb-2"><strong>Best for:</strong> Building momentum, developing projects, growth</p>
                  <p className="text-black text-xs opacity-80">Increasing energy supports expansion and development</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2 flex items-center">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs mr-2">○</span>
                    Full Moon
                  </h4>
                  <p className="text-black text-sm mb-2"><strong>Best for:</strong> Launches, celebrations, culminations</p>
                  <p className="text-black text-xs opacity-80">Peak energy for maximum visibility and impact</p>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2 flex items-center">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs mr-2">◑</span>
                    Waning Moon
                  </h4>
                  <p className="text-black text-sm mb-2"><strong>Best for:</strong> Finishing projects, releasing, cleansing</p>
                  <p className="text-black text-xs opacity-80">Decreasing energy supports completion and letting go</p>
                </div>
              </div>
            </div>
          </div>

          <SymbolGrid
            title="Key Planetary Considerations"
            subtitle="Essential planets for electional timing"
            items={[
              { symbol: "☽", name: "Moon", description: "Primary timer - emotional tone and practical flow" },
              { symbol: "☿", name: "Mercury", description: "Communication, contracts, technology, travel" },
              { symbol: "♀", name: "Venus", description: "Relationships, aesthetics, money, partnerships" },
              { symbol: "♂", name: "Mars", description: "Action, competition, surgery, physical activities" },
              { symbol: "♃", name: "Jupiter", description: "Growth, luck, legal matters, expansion" }
            ]}
            backgroundColor="#f2e356"
          />
        </div>
      );

    case 2: // Practical Applications
      return (
        <div className="space-y-8">
          <AssessmentExercise
            title="Choosing Timing for Different Goals"
            description="Match your intention with the appropriate cosmic timing"
            items={[
              {
                number: 1,
                title: "Define Your Intention",
                description: "What exactly are you trying to achieve? Be specific about the desired outcome."
              },
              {
                number: 2,
                title: "Identify the Key Planet",
                description: "Which planet governs your activity? Business (Jupiter), relationships (Venus), communication (Mercury)?"
              },
              {
                number: 3,
                title: "Choose Moon Phase",
                description: "New/Waxing for beginnings, Full for launches, Waning for completions"
              },
              {
                number: 4,
                title: "Check Planetary Aspects",
                description: "Avoid challenging aspects to your key planet. Seek supportive ones."
              }
            ]}
          />

          <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-6">Timing Examples by Activity</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-3 flex items-center">
                  <span className="text-xl mr-2">💼</span>
                  Business Launch
                </h4>
                <div className="space-y-2 text-black text-sm">
                  <div><strong>Best Moon:</strong> New or Waxing in Fire signs</div>
                  <div><strong>Key Planet:</strong> Jupiter well-aspected</div>
                  <div><strong>Avoid:</strong> Mercury retrograde</div>
                  <div><strong>Day:</strong> Thursday (Jupiter's day)</div>
                </div>
              </div>
              
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-3 flex items-center">
                  <span className="text-xl mr-2">💒</span>
                  Wedding
                </h4>
                <div className="space-y-2 text-black text-sm">
                  <div><strong>Best Moon:</strong> Waxing in Libra/Taurus</div>
                  <div><strong>Key Planet:</strong> Venus strong and well-aspected</div>
                  <div><strong>Avoid:</strong> Mars-Venus squares</div>
                  <div><strong>Day:</strong> Friday (Venus's day)</div>
                </div>
              </div>
              
              <div className="bg-white border border-black p-4">
                <h4 className="font-space-grotesk font-bold text-black mb-3 flex items-center">
                  <span className="text-xl mr-2">📄</span>
                  Signing Contracts
                </h4>
                <div className="space-y-2 text-black text-sm">
                  <div><strong>Best Moon:</strong> Steady earth signs</div>
                  <div><strong>Key Planet:</strong> Mercury direct and supported</div>
                  <div><strong>Avoid:</strong> Mercury retrograde</div>
                  <div><strong>Day:</strong> Wednesday (Mercury's day)</div>
                </div>
              </div>
            </div>
          </div>

          <IntegrationCard
            title="The Art of Compromise"
            description="Balancing ideal timing with practical constraints"
            exampleText="Perfect electional timing is rare. The art lies in finding the best available window that balances astrological favorability with practical necessities. Sometimes a 'good enough' time that you can actually use is better than perfect timing that's impossible to achieve." children={undefined}          />
        </div>
      );

    case 3: // Planetary Hours and Daily Timing
      return (
        <div className="space-y-8">
          <HeroCard
            icon="🕐"
            title="Planetary Hours: Fine-Tuning Your Timing"
            description="Beyond daily planning, you can refine your timing using planetary hours - ancient techniques that assign each hour of the day to a specific planet, allowing you to choose the most supportive energy for your activity."
            backgroundColor="#ff91e9"
          />

          <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-6">Daily Planetary Rulers</h3>
            <div className="grid md:grid-cols-7 gap-2">
              {[
                { day: "Sunday", planet: "☉", name: "Sun", color: "#f59e0b", theme: "Leadership, vitality, authority" },
                { day: "Monday", planet: "☽", name: "Moon", color: "#6b7280", theme: "Emotions, intuition, home" },
                { day: "Tuesday", planet: "♂", name: "Mars", color: "#dc2626", theme: "Action, energy, competition" },
                { day: "Wednesday", planet: "☿", name: "Mercury", color: "#059669", theme: "Communication, learning" },
                { day: "Thursday", planet: "♃", name: "Jupiter", color: "#7c3aed", theme: "Growth, opportunity, wisdom" },
                { day: "Friday", planet: "♀", name: "Venus", color: "#ec4899", theme: "Love, beauty, partnerships" },
                { day: "Saturday", planet: "♄", name: "Saturn", color: "#374151", theme: "Structure, discipline, endings" }
              ].map((item) => (
                <div key={item.day} className="bg-white border border-black p-3 text-center">
                  <div className="text-black font-bold text-xs mb-1">{item.day}</div>
                  <div className="text-2xl mb-1" style={{ color: item.color }}>{item.planet}</div>
                  <div className="text-black text-xs font-medium mb-2">{item.name}</div>
                  <div className="text-black text-xs leading-tight">{item.theme}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0 border border-black">
            <div className="p-6 border-r border-black" style={{ backgroundColor: '#51bd94' }}>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Planetary Hour Basics</h4>
              <div className="space-y-3 text-black text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">1</div>
                  <div>Each day and night is divided into 12 planetary hours</div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">2</div>
                  <div>Hours vary in length by season (longer days = longer daytime hours)</div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">3</div>
                  <div>First hour always matches the day ruler (Sun hour starts Sunday)</div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">4</div>
                  <div>Hours follow Chaldean order: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn</div>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ backgroundColor: '#6bdbff' }}>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Practical Applications</h4>
              <div className="space-y-3">
                {[
                  { planet: "☉ Sun Hour", activity: "Leadership meetings, presentations, authority matters" },
                  { planet: "☽ Moon Hour", activity: "Emotional conversations, family time, intuitive work" },
                  { planet: "♂ Mars Hour", activity: "Exercise, confrontations, starting engines" },
                  { planet: "☿ Mercury Hour", activity: "Writing, emails, learning, short trips" },
                  { planet: "♃ Jupiter Hour", activity: "Legal matters, teaching, expansion plans" },
                  { planet: "♀ Venus Hour", activity: "Romance, art creation, beauty treatments" },
                  { planet: "♄ Saturn Hour", activity: "Serious work, endings, discipline" }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-black p-2">
                    <div className="font-bold text-black text-xs mb-1">{item.planet}</div>
                    <div className="text-black text-xs">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 4: // Getting Started with Elections
      return (
        <div className="space-y-8">
          <NextSteps
            title="Your Electional Astrology Practice"
            description="Build your skills in cosmic timing step by step"
            steps={[
              {
                number: 1,
                title: "Start Simple",
                description: "Begin with basic Moon phase timing. Notice how new moon starts feel different from full moon launches."
              },
              {
                number: 2,
                title: "Track Planetary Days",
                description: "Use planetary day rulers for daily activities. Schedule important communications on Wednesdays (Mercury)."
              },
              {
                number: 3,
                title: "Learn Your Void-of-Course Moon",
                description: "Avoid starting important activities during void Moon periods when lunar energy is unfocused."
              },
              {
                number: 4,
                title: "Study Planetary Hours",
                description: "Calculate planetary hours for your location and experiment with hour-specific timing."
              },
              {
                number: 5,
                title: "Consider Your Natal Chart",
                description: "Choose elections that work harmoniously with your personal planetary placements."
              },
              {
                number: 6,
                title: "Keep an Election Journal",
                description: "Track the results of timed events to develop your intuitive understanding of cosmic timing."
              }
            ]}
          />

          <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
            <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Important Reminders</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">⚡</div>
                <div className="text-black text-sm">
                  <strong>Action still matters most:</strong> Perfect timing with poor execution beats poor timing with great execution, but great execution with good timing is unbeatable.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🎯</div>
                <div className="text-black text-sm">
                  <strong>Practical constraints are real:</strong> Sometimes you must work with the time available rather than the perfect time. Do the best you can within your constraints.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">📈</div>
                <div className="text-black text-sm">
                  <strong>Experience builds wisdom:</strong> The more you practice electional timing, the more you'll develop an intuitive sense of cosmic rhythms.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🌟</div>
                <div className="text-black text-sm">
                  <strong>Trust the process:</strong> Even when you can't feel the difference immediately, conscious timing creates subtle but real advantages over time.
                </div>
              </div>
            </div>
          </div>

          <IntegrationCard
            title="Building Your Timing Intuition"
            description="Developing sensitivity to cosmic rhythms"
            exampleText="Start by paying attention to natural rhythms you already know - how Monday feels different from Friday, how morning energy differs from evening. This awareness of natural timing cycles is the foundation for developing sensitivity to astrological timing. The more you practice, the more you'll start to feel the subtle differences between planetary energies." children={undefined}          />
        </div>
      );

    default:
      return <div>Section content not found</div>;
  }
};