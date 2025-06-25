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

export default function AstrocartographyGuidePage() {
  const guide = {
    id: 'astrocartography',
    title: 'Astrocartography: Finding Your Perfect Places',
    description: 'Discover how different locations around the world can enhance various aspects of your life based on your natal chart\'s planetary power lines.',
    level: 'intermediate' as const,
    estimatedTime: '45 min',
    sections: [
      {
        id: 'intro',
        title: 'What is Astrocartography?',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'planetary-lines',
        title: 'Understanding Planetary Lines',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'line-meanings',
        title: 'Planetary Line Meanings',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-application',
        title: 'Practical Application',
        type: 'interactive' as const,
        content: ''
      },
      {
        id: 'getting-started',
        title: 'Getting Started',
        type: 'text' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // What is Astrocartography?
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🗺️"
              title="Your Cosmic GPS"
              description="Astrocartography reveals how different geographic locations can influence your life experiences based on your birth chart. Think of it as your personal cosmic GPS that shows where in the world your planetary energies are strongest."
              backgroundColor="#6bdbff"
            />

            <InfoGrid
              title="How Location Affects Your Energy"
              items={[
                {
                  icon: "📍",
                  title: "Geographic Activation",
                  description: "Different locations activate different planetary energies from your chart"
                },
                {
                  icon: "⚡",
                  title: "Power Line Mapping",
                  description: "Planetary lines show where specific cosmic influences are strongest"
                },
                {
                  icon: "🎯",
                  title: "Intentional Living",
                  description: "Choose locations that support your specific life goals"
                },
                {
                  icon: "🌍",
                  title: "Global Perspective",
                  description: "Understand the cosmic weather patterns of different places worldwide"
                }
              ]}
              backgroundColor="#f2e356"
            />

            <IntegrationCard
              title="What Astrocartography Can Help You With"
              description="Practical applications for understanding your locational astrology"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">🏠</div>
                    <span className="text-black font-medium">Finding ideal places to live for specific goals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">✈️</div>
                    <span className="text-black font-medium">Choosing supportive vacation destinations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">💼</div>
                    <span className="text-black font-medium">Planning business ventures or career moves</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">💫</div>
                    <span className="text-black font-medium">Enhancing creativity and spiritual growth</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">💝</div>
                    <span className="text-black font-medium">Improving relationships and love life</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">⚠️</div>
                    <span className="text-black font-medium">Avoiding challenging energy zones</span>
                  </div>
                </div>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Understanding Planetary Lines
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌅"
                title="Ascendant Lines"
                subtitle="Rising Energy"
                description="Where planets rise on the eastern horizon. These lines influence your personality, appearance, and how you present yourself to the world."
                keyQuestions={[
                  "How do I appear to others here?",
                  "What energy do I project?",
                  "How does this place affect my identity?",
                  "What new aspects of myself emerge?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="👑"
                title="Midheaven Lines"
                subtitle="Career & Reputation"
                description="Where planets culminate at the highest point. These lines affect your career, public reputation, and life direction."
                keyQuestions={[
                  "What career opportunities arise here?",
                  "How is my reputation affected?",
                  "What achievements are possible?",
                  "How do I gain recognition?"
                ]}
                backgroundColor="#f2e356"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌇"
                title="Descendant Lines"
                subtitle="Relationships & Others"
                description="Where planets set on the western horizon. These lines influence partnerships, marriage, and how others relate to you."
                keyQuestions={[
                  "What types of people do I attract?",
                  "How do my relationships change?",
                  "What partnerships are possible?",
                  "How do others perceive me?"
                ]}
                backgroundColor="#51bd94"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏠"
                title="IC Lines"
                subtitle="Home & Roots"
                description="Where planets are at the lowest point. These lines affect your home life, family connections, and inner foundation."
                keyQuestions={[
                  "How does this place feel like home?",
                  "What family connections emerge?",
                  "How is my inner life affected?",
                  "What foundations can I build?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <VisualChart
              title="Astrocartography Map Structure"
              description="How planetary lines appear on your personal map"
              points={[
                { position: "-top-6 left-1/2 transform -translate-x-1/2", label: "MC", description: "Career & reputation" },
                { position: "-left-6 top-1/2 transform -translate-y-1/2", label: "ASC", description: "Identity & appearance" },
                { position: "-right-6 top-1/2 transform -translate-y-1/2", label: "DSC", description: "Relationships" },
                { position: "-bottom-6 left-1/2 transform -translate-x-1/2", label: "IC", description: "Home & roots" }
              ]}
            />
          </div>
        );

      case 2: // Planetary Line Meanings
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SymbolGrid
                title="Personal Planet Lines"
                subtitle="Core personality influences"
                items={[
                  { symbol: "☉", name: "Sun Lines", description: "Confidence, vitality, leadership, recognition" },
                  { symbol: "☽", name: "Moon Lines", description: "Emotions, intuition, nurturing, home feelings" },
                  { symbol: "☿", name: "Mercury Lines", description: "Communication, learning, short trips, networking" },
                  { symbol: "♀", name: "Venus Lines", description: "Love, beauty, creativity, financial gain" },
                  { symbol: "♂", name: "Mars Lines", description: "Energy, ambition, competition, action" }
                ]}
                backgroundColor="#ff91e9"
              />

              <SymbolGrid
                title="Outer Planet Lines"
                subtitle="Transformational influences"
                items={[
                  { symbol: "♃", name: "Jupiter Lines", description: "Growth, luck, expansion, opportunities" },
                  { symbol: "♄", name: "Saturn Lines", description: "Discipline, career, responsibility, structure" },
                  { symbol: "♅", name: "Uranus Lines", description: "Innovation, freedom, sudden changes" },
                  { symbol: "♆", name: "Neptune Lines", description: "Spirituality, creativity, illusion, compassion" },
                  { symbol: "♇", name: "Pluto Lines", description: "Transformation, power, deep change" }
                ]}
                backgroundColor="#51bd94"
              />
            </div>

            <IntegrationCard
              title="Combining Planet and Angle Meanings"
              description="Understanding how planetary energy combines with angular positions"
              exampleText="Living on your Venus Midheaven line might bring recognition for your artistic talents and beauty, while your Venus Descendant line could attract loving partnerships. Your Mars Ascendant line would make you appear more energetic and assertive."
            >
              <div className="text-black/80">
                <p className="leading-relaxed">Living on your Venus Midheaven line might bring recognition for your artistic talents and beauty, while your Venus Descendant line could attract loving partnerships. Your Mars Ascendant line would make you appear more energetic and assertive.</p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Practical Application
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Reading Your Astrocartography Map"
              description="Step-by-step process for interpreting your personal location map"
              items={[
                {
                  number: 1,
                  title: "Identify Your Goals",
                  description: "What do you want to achieve? Career success, love, creativity, spiritual growth?"
                },
                {
                  number: 2,
                  title: "Find Relevant Lines",
                  description: "Look for planetary lines that support your intentions (Jupiter for growth, Venus for love, etc.)"
                },
                {
                  number: 3,
                  title: "Consider the Angles",
                  description: "Decide whether you want identity change (ASC), career focus (MC), relationship emphasis (DSC), or home/roots (IC)"
                },
                {
                  number: 4,
                  title: "Check Practical Factors",
                  description: "Consider visa requirements, cost of living, language barriers, and cultural fit"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Location Considerations</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">For Career Growth</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Jupiter MC or ASC lines</li>
                    <li>• Sun MC lines</li>
                    <li>• Saturn MC lines (with effort)</li>
                    <li>• Mars lines for entrepreneurship</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">For Love & Relationships</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Venus DSC or ASC lines</li>
                    <li>• Jupiter DSC lines</li>
                    <li>• Moon lines for emotional connection</li>
                    <li>• Sun DSC for attracting partners</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">For Creativity & Spirituality</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Neptune lines</li>
                    <li>• Venus lines for artistic expression</li>
                    <li>• Moon lines for intuition</li>
                    <li>• Jupiter lines for expansion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Getting Started
        return (
          <div className="space-y-8">
            <NextSteps
              title="Your Astrocartography Journey"
              description="Steps to begin exploring your locational astrology"
              steps={[
                {
                  number: 1,
                  title: "Get Your Astrocartography Map",
                  description: "Generate your personal map using accurate birth data (exact time, date, and location)"
                },
                {
                  number: 2,
                  title: "Start with Short Visits",
                  description: "Before making major moves, visit interesting line locations for vacations or short trips"
                },
                {
                  number: 3,
                  title: "Keep a Location Journal",
                  description: "Note how you feel, what opportunities arise, and what changes you notice in different places"
                },
                {
                  number: 4,
                  title: "Consider Timing",
                  description: "Combine astrocartography with transit timing for optimal relocation planning"
                },
                {
                  number: 5,
                  title: "Trust Your Experience",
                  description: "While maps provide guidance, your personal experience in a location is the ultimate truth"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Important Reminders</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">⚠️</div>
                  <div className="text-black text-sm">
                    <strong>No location is perfect:</strong> Every place has its challenges. Look for locations that support your primary goals while being realistic about trade-offs.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🎯</div>
                  <div className="text-black text-sm">
                    <strong>You are not limited by your map:</strong> Astrocartography shows influences, not restrictions. You can thrive anywhere with awareness and intention.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">💫</div>
                  <div className="text-black text-sm">
                    <strong>Personal growth matters most:</strong> Sometimes challenging lines provide the exact experiences needed for your evolution.
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

  const quickActions = {
    primary: {
      title: "Explore Astrocartography",
      description: "Generate your personal astrocartography map and discover your power places around the world.",
      href: "/astrocartography",
      linkText: "Create Your Map",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Plan Your Journey",
      description: "Discuss your astrocartography insights and travel plans with fellow explorers.",
      href: "/discussions",
      linkText: "Join Community",
      backgroundColor: "#f2e356"
    }
  };

  return (
    <GuideTemplate 
      guide={guide} 
      renderSectionContent={renderSectionContent}
      quickActions={quickActions}
    />
  );
}