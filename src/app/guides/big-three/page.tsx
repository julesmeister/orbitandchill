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

export default function BigThreeGuidePage() {
  const guide = {
    id: 'big-three',
    title: 'Your Big Three: Sun, Moon, and Rising Signs',
    description: 'Master the foundation of astrological interpretation by understanding your core personality trio and how they work together to create your unique cosmic signature.',
    level: 'beginner' as const,
    estimatedTime: '25 min',
    sections: [
      {
        id: 'intro',
        title: 'The Foundation Trinity',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'sun-sign',
        title: 'Your Sun Sign: Core Identity',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'moon-sign',
        title: 'Your Moon Sign: Emotional Nature',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'rising-sign',
        title: 'Your Rising Sign: Outer Expression',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'integration',
        title: 'Integrating Your Big Three',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // The Foundation Trinity
        return (
          <div className="space-y-8">
            <HeroCard
              icon="✨"
              title="Your Astrological Trinity"
              description="Your Big Three - Sun, Moon, and Rising signs - form the foundation of your astrological identity. These three placements reveal your core self, emotional nature, and how you interact with the world, creating a comprehensive picture of your personality."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="Why the Big Three Matter"
              items={[
                {
                  icon: "🌟",
                  title: "Complete Picture",
                  description: "Together, they provide a more nuanced understanding than just your Sun sign"
                },
                {
                  icon: "🎭",
                  title: "Multi-Layered Identity",
                  description: "Each sign governs different aspects of your personality and behavior"
                },
                {
                  icon: "🔄",
                  title: "Dynamic Interaction",
                  description: "How these three work together creates your unique expression"
                },
                {
                  icon: "🗝️",
                  title: "Foundation for Growth",
                  description: "Understanding these basics opens the door to deeper astrological study"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Three Pillars of Self</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <div className="text-2xl mb-2">☉</div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Sun Sign</h4>
                  <p className="text-black text-sm">Your core identity, ego, and life purpose. The "you" you're becoming.</p>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="text-2xl mb-2">☽</div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Moon Sign</h4>
                  <p className="text-black text-sm">Your emotional nature, instincts, and inner world. How you process feelings.</p>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="text-2xl mb-2">⬆</div>
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Rising Sign</h4>
                  <p className="text-black text-sm">Your outer personality, first impressions, and approach to life. Your social mask.</p>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Big Three in Your Chart"
              description="How your Sun, Moon, and Rising signs are positioned in your natal chart"
              points={[
                { position: "top-1/2 right-0 transform translate-x-4 -translate-y-1/2", label: "ASC", description: "Rising sign on eastern horizon" },
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "☉", description: "Sun position at birth" },
                { position: "bottom-1/4 left-1/4 transform -translate-x-2 translate-y-2", label: "☽", description: "Moon position at birth" }
              ]}
            />
          </div>
        );

      case 1: // Your Sun Sign: Core Identity
        return (
          <div className="space-y-8">
            <HeroCard
              icon="☉"
              title="Your Solar Self"
              description="Your Sun sign represents your core identity, life purpose, and the essence of who you are. It's your ego, your will, and the energy you're meant to shine into the world. This is the 'you' you're constantly becoming."
              backgroundColor="#f2e356"
            />

            <SymbolGrid
              title="The Sun Through the Signs"
              subtitle="How solar energy expresses through each zodiac sign"
              items={[
                { symbol: "♈", name: "Aries Sun", description: "Pioneer, leader, initiator with fiery independence" },
                { symbol: "♉", name: "Taurus Sun", description: "Stable, practical, sensual with earthy determination" },
                { symbol: "♊", name: "Gemini Sun", description: "Curious, communicative, versatile with airy adaptability" },
                { symbol: "♋", name: "Cancer Sun", description: "Nurturing, intuitive, protective with watery depth" },
                { symbol: "♌", name: "Leo Sun", description: "Creative, confident, generous with radiant warmth" },
                { symbol: "♍", name: "Virgo Sun", description: "Analytical, helpful, perfectionist with practical service" },
                { symbol: "♎", name: "Libra Sun", description: "Diplomatic, harmonious, aesthetic with balanced grace" },
                { symbol: "♏", name: "Scorpio Sun", description: "Intense, transformative, mysterious with powerful depth" },
                { symbol: "♐", name: "Sagittarius Sun", description: "Adventurous, philosophical, optimistic with expansive vision" },
                { symbol: "♑", name: "Capricorn Sun", description: "Ambitious, disciplined, responsible with structured goals" },
                { symbol: "♒", name: "Aquarius Sun", description: "Innovative, humanitarian, independent with revolutionary spirit" },
                { symbol: "♓", name: "Pisces Sun", description: "Compassionate, artistic, spiritual with intuitive flow" }
              ]}
              backgroundColor="#ff91e9"
            />

            <IntegrationCard
              title="Understanding Your Solar Journey"
              description="Your Sun sign shows the path of personal development and self-actualization"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Your Sun sign isn't just about personality traits - it's about your life's journey and the qualities you're meant to develop. Think of it as your spiritual homework in this lifetime.
                </p>
                <p className="leading-relaxed">
                  The Sun represents your conscious mind, your will, and your sense of purpose. It shows how you want to be recognized and what gives you a sense of identity and self-worth.
                </p>
                <div className="bg-black/5 p-4 rounded-lg border border-black/10">
                  <p className="text-sm font-medium text-black">
                    <strong>Key Questions for Your Sun Sign:</strong> What makes me feel alive and authentic? What do I want to be known for? How do I express my unique gifts?
                  </p>
                </div>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // Your Moon Sign: Emotional Nature
        return (
          <div className="space-y-8">
            <HeroCard
              icon="☽"
              title="Your Lunar Self"
              description="Your Moon sign reveals your emotional nature, instincts, and inner world. It governs your subconscious reactions, comfort needs, and how you process feelings. This is your private, intuitive self that often remains hidden from others."
              backgroundColor="#6bdbff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌙"
                title="Emotional Processing"
                subtitle="How you feel and react"
                description="Your Moon sign determines how you process emotions, what makes you feel secure, and your instinctive reactions to situations."
                keyQuestions={[
                  "How do I process emotions?",
                  "What makes me feel safe?",
                  "What are my instinctive reactions?",
                  "How do I nurture myself and others?"
                ]}
                backgroundColor="#51bd94"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏠"
                title="Comfort & Security"
                subtitle="Your emotional needs"
                description="Your Moon sign shows what you need to feel emotionally fulfilled, your relationship with family, and your domestic preferences."
                keyQuestions={[
                  "What do I need to feel at home?",
                  "How do I connect with family?",
                  "What comforts me when stressed?",
                  "How do I show care to others?"
                ]}
                backgroundColor="#f0e3ff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Moon Sign Elements</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Fire Moons (Aries, Leo, Sagittarius)</h4>
                  <p className="text-black text-sm mb-2">React quickly and intensely to emotions</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Need excitement and spontaneity</li>
                    <li>• Express feelings dramatically</li>
                    <li>• Bounce back quickly from setbacks</li>
                    <li>• Require independence and freedom</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Earth Moons (Taurus, Virgo, Capricorn)</h4>
                  <p className="text-black text-sm mb-2">Seek stability and practical comfort</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Need routine and predictability</li>
                    <li>• Express love through practical acts</li>
                    <li>• Find comfort in material security</li>
                    <li>• Process emotions slowly and steadily</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Air Moons (Gemini, Libra, Aquarius)</h4>
                  <p className="text-black text-sm mb-2">Intellectualize emotions and need mental stimulation</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Need to talk through feelings</li>
                    <li>• Seek harmony and balance</li>
                    <li>• Find comfort in social connection</li>
                    <li>• Process emotions through communication</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Water Moons (Cancer, Scorpio, Pisces)</h4>
                  <p className="text-black text-sm mb-2">Feel deeply and intuitively</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Highly empathetic and sensitive</li>
                    <li>• Need emotional depth and intimacy</li>
                    <li>• Find comfort in nurturing environments</li>
                    <li>• Process emotions through intuition</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Your Rising Sign: Outer Expression
        return (
          <div className="space-y-8">
            <HeroCard
              icon="⬆"
              title="Your Rising Self"
              description="Your Rising sign (Ascendant) is your social personality - the mask you wear when meeting others and your approach to new situations. It's the first impression you make and how you navigate the world around you."
              backgroundColor="#51bd94"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="👋"
                title="First Impressions"
                subtitle="How others see you initially"
                description="Your Rising sign determines the energy you project when meeting new people and the impression you make in social situations."
                keyQuestions={[
                  "How do others first perceive me?",
                  "What energy do I project?",
                  "How do I approach new situations?",
                  "What's my social style?"
                ]}
                backgroundColor="#f2e356"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🚀"
                title="Life Approach"
                subtitle="Your strategy for living"
                description="Your Rising sign shows your general approach to life, how you initiate action, and the lens through which you view the world."
                keyQuestions={[
                  "How do I approach challenges?",
                  "What's my natural life strategy?",
                  "How do I start new projects?",
                  "What motivates me to act?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Rising Sign Qualities</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Cardinal Rising (Aries, Cancer, Libra, Capricorn)</h4>
                  <p className="text-black text-sm mb-2">Natural initiators and leaders</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Take charge in new situations</li>
                    <li>• Comfortable with leadership roles</li>
                    <li>• Proactive problem-solving approach</li>
                    <li>• Strong presence and initiative</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Fixed Rising (Taurus, Leo, Scorpio, Aquarius)</h4>
                  <p className="text-black text-sm mb-2">Steady, reliable, and determined</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Consistent in their approach</li>
                    <li>• Strong sense of personal style</li>
                    <li>• Resistant to change</li>
                    <li>• Memorable and distinctive presence</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Mutable Rising (Gemini, Virgo, Sagittarius, Pisces)</h4>
                  <p className="text-black text-sm mb-2">Adaptable and flexible</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Easily adapt to new environments</li>
                    <li>• Skilled at reading social cues</li>
                    <li>• Versatile in their approach</li>
                    <li>• Changeable but approachable</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="The Rising Sign as Your Life's Gateway"
              description="Understanding how your Rising sign shapes your interaction with the world"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Your Rising sign is like the front door to your personality. It's not fake or superficial - it's a genuine part of you that helps you navigate social situations and approach life experiences.
                </p>
                <p className="leading-relaxed">
                  Think of it as your cosmic operating system. While your Sun shows what you're becoming and your Moon shows how you feel, your Rising shows how you interface with the world and take action.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Integrating Your Big Three
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Blending Your Big Three"
              description="Understanding how your Sun, Moon, and Rising work together to create your unique personality"
              items={[
                {
                  number: 1,
                  title: "Identify Your Big Three",
                  description: "Find your Sun, Moon, and Rising signs in your birth chart (exact birth time required for Rising)"
                },
                {
                  number: 2,
                  title: "Study Each Sign Individually",
                  description: "Learn the key traits, elements, and qualities of each of your three signs"
                },
                {
                  number: 3,
                  title: "Notice the Interplay",
                  description: "Look for harmonies and tensions between your three signs"
                },
                {
                  number: 4,
                  title: "Observe in Daily Life",
                  description: "Notice how different signs emerge in different situations and relationships"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Common Big Three Combinations</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Harmonious Combinations</h4>
                  <p className="text-black text-sm mb-2">When your signs support each other</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Same element (Fire, Earth, Air, Water)</li>
                    <li>• Compatible elements (Fire-Air, Earth-Water)</li>
                    <li>• Same quality (Cardinal, Fixed, Mutable)</li>
                    <li>• Signs that naturally complement each other</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Challenging Combinations</h4>
                  <p className="text-black text-sm mb-2">When your signs create internal tension</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Conflicting elements (Fire-Water, Earth-Air)</li>
                    <li>• Different qualities pulling in different directions</li>
                    <li>• Signs with contrasting needs and approaches</li>
                    <li>• Squares and oppositions between signs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Integration Strategies</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">1</div>
                  <div className="text-black text-sm">
                    <strong>Honor All Three:</strong> Don't try to be just one sign. You're a complex blend of all three energies.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">2</div>
                  <div className="text-black text-sm">
                    <strong>Use Context Awareness:</strong> Different situations call for different aspects of your personality.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">3</div>
                  <div className="text-black text-sm">
                    <strong>Develop Your Weaker Signs:</strong> Consciously work on the qualities that don't come naturally.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">4</div>
                  <div className="text-black text-sm">
                    <strong>Find Your Synthesis:</strong> Create a unique blend that authentically represents who you are.
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Living Your Big Three"
              description="Practical ways to integrate your Sun, Moon, and Rising signs into daily life"
              steps={[
                {
                  number: 1,
                  title: "Daily Check-ins",
                  description: "Notice which sign is most active in different situations throughout your day"
                },
                {
                  number: 2,
                  title: "Emotional Awareness",
                  description: "Use your Moon sign knowledge to better understand and process your feelings"
                },
                {
                  number: 3,
                  title: "Authentic Expression",
                  description: "Find ways to express your Sun sign's core identity in your work and relationships"
                },
                {
                  number: 4,
                  title: "Social Consciousness",
                  description: "Be aware of how your Rising sign affects your interactions with others"
                },
                {
                  number: 5,
                  title: "Holistic Integration",
                  description: "Work on blending all three signs into a cohesive, authentic self-expression"
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
      title: "Discover Your Big Three",
      description: "Generate your natal chart to find your Sun, Moon, and Rising signs and begin understanding your cosmic trinity.",
      href: "/chart",
      linkText: "Generate Chart",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Explore Advanced Concepts",
      description: "Ready to dive deeper? Explore our advanced astrology guides and expand your cosmic knowledge.",
      href: "/guides",
      linkText: "More Guides",
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