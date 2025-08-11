/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import GuideTemplate from '@/components/guides/GuideTemplate';
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

export default function TransitsAndTimingGuidePage() {
  const guide = {
    id: 'transits-and-timing',
    title: 'Transits and Timing: When the Planets Move',
    description: 'Understand how current planetary movements affect your natal chart and learn to track important life cycles for better timing and personal growth.',
    level: 'advanced' as const,
    estimatedTime: '50 min',
    sections: [
      {
        id: 'intro',
        title: 'Understanding Transits',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'personal-transits',
        title: 'Personal Planet Transits',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'collective-transits',
        title: 'Collective Planet Transits',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'timing-events',
        title: 'Timing Life Events',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-tracking',
        title: 'Tracking Your Transits',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Understanding Transits
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌍"
              title="The Cosmic Clock"
              description="Transits are the current positions of planets as they move through the sky, creating dynamic relationships with your natal chart. They act like a cosmic clock, timing when different themes and opportunities will emerge in your life."
              backgroundColor="#51bd94"
            />

            <InfoGrid
              title="How Transits Work"
              items={[
                {
                  icon: "⏰",
                  title: "Timing Mechanisms",
                  description: "Planets moving at different speeds create various timing cycles"
                },
                {
                  icon: "🎯",
                  title: "Activation Points",
                  description: "Transits activate specific areas of your natal chart"
                },
                {
                  icon: "🔄",
                  title: "Cyclical Patterns",
                  description: "Planetary returns and cycles create predictable life themes"
                },
                {
                  icon: "🌱",
                  title: "Growth Opportunities",
                  description: "Transits bring lessons, challenges, and development opportunities"
                }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <div className="font-space-grotesk text-xl font-bold text-black mb-4">Types of Transit Aspects</div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Harmonious Aspects</div>
                  <p className="text-black text-sm mb-2">Supportive, flowing energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Conjunction (0°):</strong> New beginnings, intensification</li>
                    <li>• <strong>Trine (120°):</strong> Easy flow, natural talents</li>
                    <li>• <strong>Sextile (60°):</strong> Opportunities, cooperation</li>
                    <li>• Generally feel easier to navigate</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Challenging Aspects</div>
                  <p className="text-black text-sm mb-2">Growth-oriented, dynamic tension</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Square (90°):</strong> Tension, action required</li>
                    <li>• <strong>Opposition (180°):</strong> Balance, external pressure</li>
                    <li>• <strong>Quincunx (150°):</strong> Adjustment, adaptation</li>
                    <li>• Provide motivation for growth and change</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="Transit Movement Through Your Chart"
              description="How transiting planets interact with your natal chart positions"
              points={[
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "T♃", description: "Transiting Jupiter" },
                { position: "top-1/2 right-0 transform translate-x-4 -translate-y-1/2", label: "N☉", description: "Natal Sun" },
                { position: "bottom-1/4 left-1/4 transform -translate-x-2 translate-y-2", label: "T♄", description: "Transiting Saturn" },
                { position: "bottom-0 right-1/2 transform translate-x-1/2 translate-y-4", label: "N☽", description: "Natal Moon" }
              ]}
            />

            <IntegrationCard
              title="The Nature of Planetary Timing"
              description="Understanding how different planetary speeds create various life cycles"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Each planet moves at its own speed, creating different timing cycles in your life. Fast-moving planets (Sun, Moon, Mercury, Venus, Mars) create short-term influences, while slow-moving planets (Jupiter, Saturn, Uranus, Neptune, Pluto) create longer life cycles and major developmental phases.
                </p>
                <p className="leading-relaxed">
                  The key to working with transits is understanding that they represent opportunities for growth, not fixed fates. Your free will and conscious choices determine how you experience and integrate these cosmic influences.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Personal Planet Transits
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🏃‍♂️"
              title="Fast-Moving Influences"
              description="Personal planets (Sun, Moon, Mercury, Venus, Mars) create short-term transits that influence your daily life, mood, communication, relationships, and energy levels. These transits help you understand immediate timing and short-term cycles."
              backgroundColor="#ff91e9"
            />

            <SymbolGrid
              title="Personal Planet Transit Cycles"
              subtitle="How fast-moving planets affect your daily experience"
              items={[
                { symbol: "☉", name: "Sun Transits", description: "Annual cycle, monthly themes, confidence and vitality" },
                { symbol: "☽", name: "Moon Transits", description: "Monthly cycle, emotional rhythms, intuitive timing" },
                { symbol: "☿", name: "Mercury Transits", description: "3-4 month cycle, communication, learning, travel" },
                { symbol: "♀", name: "Venus Transits", description: "10-12 month cycle, love, money, values, creativity" },
                { symbol: "♂", name: "Mars Transits", description: "2-year cycle, energy, action, motivation, conflict" }
              ]}
              backgroundColor="#f0e3ff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="📅"
                title="Monthly Cycles"
                subtitle="Moon and Sun transits"
                description="The Moon's monthly journey through your chart creates emotional rhythms, while the Sun's annual cycle highlights different life areas each month."
                keyQuestions={[
                  "What house is the Moon transiting?",
                  "How does this affect my emotional needs?",
                  "What area of life needs attention now?",
                  "How can I work with this energy?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="💫"
                title="Action Cycles"
                subtitle="Mercury, Venus, and Mars transits"
                description="These planets create cycles for communication, relationships, and taking action. Their retrograde periods offer opportunities for review and revision."
                keyQuestions={[
                  "What projects need attention?",
                  "How are my relationships evolving?",
                  "What communication patterns am I noticing?",
                  "Where should I focus my energy?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <div className="font-space-grotesk text-xl font-bold text-black mb-4">Working with Personal Planet Transits</div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">☽</div>
                  <div className="text-black text-sm">
                    <strong>Moon Transits:</strong> Track your emotional rhythms and energy levels. Use New and Full Moons for intention-setting and release.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">☿</div>
                  <div className="text-black text-sm">
                    <strong>Mercury Transits:</strong> Time important communications, contracts, and learning. Be extra careful during Mercury retrograde.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">♀</div>
                  <div className="text-black text-sm">
                    <strong>Venus Transits:</strong> Focus on relationships, finances, and creative projects. Venus retrograde is time for relationship review.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">♂</div>
                  <div className="text-black text-sm">
                    <strong>Mars Transits:</strong> Channel energy into appropriate action. Mars retrograde calls for patience and strategy revision.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Collective Planet Transits
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌌"
              title="Generational Influences"
              description="Collective planets (Jupiter, Saturn, Uranus, Neptune, Pluto) create longer cycles that shape major life phases, generational themes, and profound personal transformation. These transits mark significant life transitions and evolutionary growth."
              backgroundColor="#6bdbff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🎯"
                title="Social Planets"
                subtitle="Jupiter and Saturn"
                description="Jupiter (12-year cycle) brings expansion and opportunities, while Saturn (29-year cycle) brings structure, responsibility, and life lessons."
                keyQuestions={[
                  "What opportunities are expanding?",
                  "What structures need building?",
                  "What lessons am I learning?",
                  "How am I growing and maturing?"
                ]}
                backgroundColor="#51bd94"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🔮"
                title="Outer Planets"
                subtitle="Uranus, Neptune, and Pluto"
                description="These generational planets (84, 165, and 248-year cycles) bring profound transformation, spiritual awakening, and evolutionary growth."
                keyQuestions={[
                  "What needs to transform?",
                  "How am I evolving spiritually?",
                  "What illusions am I releasing?",
                  "What authentic self is emerging?"
                ]}
                backgroundColor="#f0e3ff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <div className="font-space-grotesk text-xl font-bold text-black mb-4">Major Life Cycle Transits</div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Saturn Return (Ages 29, 58, 87)</div>
                  <p className="text-black text-sm mb-2">Major life restructuring and maturation</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Taking on adult responsibilities</li>
                    <li>• Career and relationship commitments</li>
                    <li>• Building lasting foundations</li>
                    <li>• Facing reality and limitations</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Uranus Opposition (Age 42)</div>
                  <p className="text-black text-sm mb-2">Midlife awakening and liberation</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Questioning established patterns</li>
                    <li>• Desire for freedom and authenticity</li>
                    <li>• Sudden changes and revelations</li>
                    <li>• Breaking free from limitations</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Neptune Square (Age 42)</div>
                  <p className="text-black text-sm mb-2">Spiritual crisis and dissolution</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Disillusionment with material success</li>
                    <li>• Seeking deeper meaning and purpose</li>
                    <li>• Spiritual or creative awakening</li>
                    <li>• Letting go of ego attachments</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Pluto Square (Ages 36-45)</div>
                  <p className="text-black text-sm mb-2">Deep transformation and empowerment</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Confronting shadow aspects</li>
                    <li>• Power struggles and transformation</li>
                    <li>• Death and rebirth of identity</li>
                    <li>• Claiming authentic power</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Working with Collective Transits"
              description="How to navigate the profound changes brought by slow-moving planets"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Collective planet transits often coincide with major life events and transitions. Unlike personal planet transits, these can't be rushed or avoided - they require patience, surrender, and trust in the process of transformation.
                </p>
                <p className="leading-relaxed">
                  The key is to work with these energies rather than against them. Jupiter transits offer opportunities for growth and expansion, Saturn transits teach discipline and responsibility, while outer planet transits facilitate evolutionary leaps in consciousness.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Timing Life Events
        return (
          <div className="space-y-8">
            <HeroCard
              icon="📊"
              title="Cosmic Timing Strategies"
              description="Learn to use transits for optimal timing of important life decisions, launches, and major changes. Understanding planetary cycles helps you align your actions with cosmic support rather than swimming against the current."
              backgroundColor="#f2e356"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🚀"
                title="Launching Projects"
                subtitle="New beginnings and initiatives"
                description="Use supportive transits to launch new projects, start relationships, or begin important ventures with cosmic backing."
                keyQuestions={[
                  "What transits support new beginnings?",
                  "When is my energy highest?",
                  "What areas of life are expanding?",
                  "How can I use favorable timing?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🔄"
                title="Making Changes"
                subtitle="Transitions and transformations"
                description="Identify when transits support major life changes, career shifts, relocations, or ending chapters that no longer serve you."
                keyQuestions={[
                  "What needs to change in my life?",
                  "When are transformation energies strongest?",
                  "What am I ready to release?",
                  "How can I embrace necessary changes?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Timing Guidelines for Life Events</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Good Times to Start</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Jupiter making positive aspects to personal planets</li>
                    <li>• New Moon in a supportive house</li>
                    <li>• Mars in a strong, forward-moving position</li>
                    <li>• No major retrograde periods affecting your goals</li>
                    <li>• Venus supporting relationship or financial ventures</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Times to Wait or Revise</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Mercury retrograde for contracts or communication</li>
                    <li>• Mars retrograde for new initiatives</li>
                    <li>• Saturn making challenging aspects to personal planets</li>
                    <li>• Eclipse season for major decisions</li>
                    <li>• Multiple planets retrograde simultaneously</li>
                  </ul>
                </div>
              </div>
            </div>

            <AssessmentExercise
              title="Personal Timing Assessment"
              description="Evaluate your current transits to understand the timing of your life right now"
              items={[
                {
                  number: 1,
                  title: "Identify Active Transits",
                  description: "Look up what planets are currently making aspects to your natal chart"
                },
                {
                  number: 2,
                  title: "Assess Transit Types",
                  description: "Determine if current transits are supportive, challenging, or neutral"
                },
                {
                  number: 3,
                  title: "Note Affected Life Areas",
                  description: "See which houses and life themes are being activated"
                },
                {
                  number: 4,
                  title: "Plan Accordingly",
                  description: "Align your actions and decisions with current cosmic weather"
                }
              ]}
            />
          </div>
        );

      case 4: // Tracking Your Transits
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Building Your Transit Tracking System"
              description="Create a personalized system for monitoring and working with your transits"
              items={[
                {
                  number: 1,
                  title: "Choose Your Tools",
                  description: "Select transit tracking apps, websites, or create your own calendar system"
                },
                {
                  number: 2,
                  title: "Focus on Key Transits",
                  description: "Prioritize major transits to your Sun, Moon, Rising, and important natal planets"
                },
                {
                  number: 3,
                  title: "Keep a Transit Journal",
                  description: "Record how different transits manifest in your life for future reference"
                },
                {
                  number: 4,
                  title: "Plan Around Cycles",
                  description: "Use your transit knowledge for better timing of important decisions"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <div className="font-space-grotesk text-xl font-bold text-black mb-4">Transit Tracking Priorities</div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Daily Tracking</div>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Moon phases and sign changes</li>
                    <li>• Mercury, Venus, Mars movements</li>
                    <li>• Void of course Moon periods</li>
                    <li>• Daily emotional and energy patterns</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Monthly Tracking</div>
                  <ul className="text-black text-sm space-y-1">
                    <li>• New and Full Moon themes</li>
                    <li>• Sun's journey through houses</li>
                    <li>• Personal planet aspect patterns</li>
                    <li>• Upcoming retrograde periods</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Yearly Tracking</div>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Jupiter and Saturn major aspects</li>
                    <li>• Outer planet transits to natal chart</li>
                    <li>• Eclipse cycles and themes</li>
                    <li>• Annual progressions and returns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Transit Journal Template</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Date: ___________</h5>
                  </div>
                  <div className="space-y-2">
                    <p className="text-black text-sm"><strong>Active Transit:</strong> ________________</p>
                    <p className="text-black text-sm"><strong>Aspect Type:</strong> ________________</p>
                    <p className="text-black text-sm"><strong>Life Area Affected:</strong> ________________</p>
                    <p className="text-black text-sm"><strong>How I'm Experiencing It:</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      Write about events, feelings, opportunities, or challenges...
                    </div>
                    <p className="text-black text-sm"><strong>Actions Taken:</strong></p>
                    <div className="border border-gray-300 p-2 h-12 text-sm text-gray-500">
                      How did I respond or what did I do?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Mastering Transit Work"
              description="Advanced strategies for working with planetary timing in your life"
              steps={[
                {
                  number: 1,
                  title: "Develop Transit Sensitivity",
                  description: "Practice noticing how different transits manifest in your daily experience"
                },
                {
                  number: 2,
                  title: "Study Historical Patterns",
                  description: "Look back at how similar transits affected you in the past"
                },
                {
                  number: 3,
                  title: "Integrate with Life Planning",
                  description: "Use transit knowledge for career, relationship, and life decision timing"
                },
                {
                  number: 4,
                  title: "Practice Patience",
                  description: "Learn to work with natural timing rather than forcing outcomes"
                },
                {
                  number: 5,
                  title: "Trust the Process",
                  description: "Develop faith in cosmic timing and your ability to navigate changes"
                }
              ]}
            />
          </div>
        );

      default:
        return <div>Section content not found</div>;
    }
  };

  const quickActions = {
    primary: {
      title: "Track Your Current Transits",
      description: "Generate your natal chart and explore current planetary transits affecting your life right now.",
      href: "/chart",
      linkText: "View Transits",
      backgroundColor: "#51bd94"
    },
    secondary: {
      title: "Join Transit Discussions",
      description: "Connect with other astrology enthusiasts to discuss current planetary movements and their effects.",
      href: "/discussions",
      linkText: "Join Community",
      backgroundColor: "#6bdbff"
    }
  };

  return (
    <GuideTemplate 
      guide={guide} 
      quickActions={quickActions}
    />
  );
}