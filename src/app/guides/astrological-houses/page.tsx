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

export default function AstrologicalHousesGuidePage() {
  const guide = {
    id: 'astrological-houses',
    title: 'The Astrological Houses: Life\'s Twelve Stages',
    description: 'Explore the twelve life themes that shape your cosmic blueprint and discover how planetary placements in each house influence your experiences.',
    level: 'beginner' as const,
    estimatedTime: '35 min',
    sections: [
      {
        id: 'intro',
        title: 'Understanding the House System',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'personal-houses',
        title: 'Personal Houses (1-4)',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'social-houses',
        title: 'Social Houses (5-8)',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'universal-houses',
        title: 'Universal Houses (9-12)',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-application',
        title: 'Reading Your Houses',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Understanding the House System
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🏛️"
              title="The Theater of Life"
              description="The twelve astrological houses represent different life themes and experiences. Think of them as stages in a cosmic theater where your planetary actors perform their roles, each house highlighting a specific area of your life journey."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="How Houses Shape Your Experience"
              items={[
                {
                  icon: "🎭",
                  title: "Life Themes",
                  description: "Each house governs specific areas of life experience and growth"
                },
                {
                  icon: "🌍",
                  title: "Earthly Concerns",
                  description: "Houses show how cosmic energies manifest in practical, everyday life"
                },
                {
                  icon: "🔄",
                  title: "Developmental Stages",
                  description: "Houses represent the natural progression of human development"
                },
                {
                  icon: "🎯",
                  title: "Focus Areas",
                  description: "Planetary placements in houses show where your attention and energy naturally flow"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The House Wheel: A Natural Progression</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Houses 1-4: Personal Foundation</h4>
                  <p className="text-black text-sm">Your identity, values, communication, and roots form the foundation of who you are.</p>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Houses 5-8: Social Expression</h4>
                  <p className="text-black text-sm">Creative expression, relationships, and shared resources expand your world.</p>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Houses 9-12: Universal Connection</h4>
                  <p className="text-black text-sm">Higher learning, purpose, and spiritual transcendence complete the journey.</p>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Astrological House Wheel"
              description="The natural order of houses around the zodiac wheel"
              points={[
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "10", description: "Career & reputation" },
                { position: "top-1/4 right-1/4 transform translate-x-2 -translate-y-2", label: "11", description: "Friends & hopes" },
                { position: "top-1/2 right-0 transform translate-x-4 -translate-y-1/2", label: "12", description: "Spirituality & endings" },
                { position: "bottom-1/4 right-1/4 transform translate-x-2 translate-y-2", label: "1", description: "Self & identity" },
                { position: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4", label: "2", description: "Values & resources" },
                { position: "bottom-1/4 left-1/4 transform -translate-x-2 translate-y-2", label: "3", description: "Communication & siblings" },
                { position: "top-1/2 left-0 transform -translate-x-4 -translate-y-1/2", label: "4", description: "Home & family" },
                { position: "top-1/4 left-1/4 transform -translate-x-2 -translate-y-2", label: "5", description: "Creativity & romance" }
              ]}
            />
          </div>
        );

      case 1: // Personal Houses (1-4)
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌅"
                title="1st House"
                subtitle="The Self"
                description="Your identity, appearance, and first impressions. How you present yourself to the world and your natural approach to life."
                keyQuestions={[
                  "Who am I?",
                  "How do I appear to others?",
                  "What is my natural approach to life?",
                  "What energy do I project?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="💎"
                title="2nd House"
                subtitle="Values & Resources"
                description="Your personal values, possessions, earning ability, and what you find valuable. Your relationship with material security."
                keyQuestions={[
                  "What do I value most?",
                  "How do I earn and spend money?",
                  "What makes me feel secure?",
                  "What are my natural talents?"
                ]}
                backgroundColor="#f2e356"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🗣️"
                title="3rd House"
                subtitle="Communication & Learning"
                description="How you communicate, learn, and process information. Your relationship with siblings, neighbors, and your immediate environment."
                keyQuestions={[
                  "How do I communicate?",
                  "What interests me intellectually?",
                  "How do I learn best?",
                  "What is my relationship with siblings?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏠"
                title="4th House"
                subtitle="Home & Roots"
                description="Your home, family, ancestry, and emotional foundation. Your private life and what makes you feel emotionally secure."
                keyQuestions={[
                  "What does home mean to me?",
                  "How do I nurture others?",
                  "What are my family patterns?",
                  "Where do I find emotional security?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <IntegrationCard
              title="The Personal Foundation"
              description="How the first four houses create your core identity and life foundation"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The first four houses form the foundation of your personality and life approach. They represent your core self (1st), what you value (2nd), how you communicate (3rd), and where you come from (4th).
                </p>
                <p className="leading-relaxed">
                  Strong planetary placements in these houses often indicate someone who is self-reliant, values personal security, has strong communication skills, and maintains close family ties. These houses shape how you approach all other areas of life.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // Social Houses (5-8)
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🎨"
                title="5th House"
                subtitle="Creativity & Romance"
                description="Your creative expression, romance, children, and what brings you joy. Your playful, spontaneous side and artistic talents."
                keyQuestions={[
                  "What brings me joy?",
                  "How do I express creativity?",
                  "What is my romantic style?",
                  "How do I relate to children?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="💼"
                title="6th House"
                subtitle="Work & Health"
                description="Your daily routines, work environment, health habits, and service to others. How you organize your life and maintain wellness."
                keyQuestions={[
                  "What are my daily routines?",
                  "How do I approach work?",
                  "What affects my health?",
                  "How do I serve others?"
                ]}
                backgroundColor="#f2e356"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="💕"
                title="7th House"
                subtitle="Partnerships & Marriage"
                description="Your one-on-one relationships, marriage, business partnerships, and open enemies. How you relate to others as equals."
                keyQuestions={[
                  "What do I seek in partnership?",
                  "How do I handle conflict?",
                  "What attracts me to others?",
                  "How do I compromise?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🔮"
                title="8th House"
                subtitle="Transformation & Shared Resources"
                description="Shared resources, transformation, psychology, and deep change. Your relationship with power, mystery, and life's deeper truths."
                keyQuestions={[
                  "How do I handle change?",
                  "What transforms me?",
                  "How do I share resources?",
                  "What are my deepest fears?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <IntegrationCard
              title="The Social Expansion"
              description="How houses 5-8 expand your world through relationships and creative expression"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Houses 5-8 represent your expansion into the social world. After establishing your foundation (houses 1-4), you begin to express yourself creatively (5th), serve others (6th), form partnerships (7th), and transform through deep connections (8th).
                </p>
                <p className="leading-relaxed">
                  These houses show how you engage with others, share your gifts, and grow through relationships. They represent the bridge between your personal world and the broader community.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Universal Houses (9-12)
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌍"
                title="9th House"
                subtitle="Higher Learning & Philosophy"
                description="Your beliefs, higher education, long-distance travel, and search for meaning. Your personal philosophy and quest for truth."
                keyQuestions={[
                  "What do I believe in?",
                  "How do I find meaning?",
                  "What cultures fascinate me?",
                  "How do I expand my horizons?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="👑"
                title="10th House"
                subtitle="Career & Public Image"
                description="Your career, reputation, public image, and life direction. How you want to be known and remembered by the world."
                keyQuestions={[
                  "What is my life purpose?",
                  "How do I want to be known?",
                  "What legacy will I leave?",
                  "How do I achieve success?"
                ]}
                backgroundColor="#f2e356"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🤝"
                title="11th House"
                subtitle="Friends & Community"
                description="Your friendships, group associations, hopes, and dreams. Your role in the community and connection to collective goals."
                keyQuestions={[
                  "Who are my true friends?",
                  "What are my hopes and dreams?",
                  "How do I contribute to groups?",
                  "What causes do I support?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="✨"
                title="12th House"
                subtitle="Spirituality & Transcendence"
                description="Your spiritual life, unconscious patterns, hidden strengths, and connection to the divine. Your relationship with the unseen world."
                keyQuestions={[
                  "What is my spiritual path?",
                  "What do I need to release?",
                  "How do I connect with the divine?",
                  "What are my hidden gifts?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <IntegrationCard
              title="The Universal Connection"
              description="How houses 9-12 connect you to the greater cosmos and collective consciousness"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The final four houses represent your connection to the universal and transcendent. After personal development (1-4) and social expansion (5-8), you seek higher meaning (9th), public recognition (10th), community connection (11th), and spiritual transcendence (12th).
                </p>
                <p className="leading-relaxed">
                  These houses show how you contribute to the world beyond yourself, connect with collective consciousness, and ultimately transcend the ego to serve a higher purpose.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Reading Your Houses
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Understanding Your House Placements"
              description="Step-by-step process for interpreting planetary placements in your houses"
              items={[
                {
                  number: 1,
                  title: "Identify Planetary Placements",
                  description: "Look at which planets are in which houses in your birth chart"
                },
                {
                  number: 2,
                  title: "Note Empty Houses",
                  description: "Empty houses aren't 'bad' - they represent areas that may be less emphasized in this lifetime"
                },
                {
                  number: 3,
                  title: "Consider House Rulers",
                  description: "The planetary ruler of each house cusp shows how that life area is activated"
                },
                {
                  number: 4,
                  title: "Look for Patterns",
                  description: "Notice if you have many planets in certain quadrants or house types"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">House Emphasis Patterns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Angular Houses (1, 4, 7, 10)</h4>
                  <p className="text-black text-sm mb-2">Action-oriented, cardinal energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Natural leaders and initiators</li>
                    <li>• Focus on major life areas</li>
                    <li>• Strong sense of purpose</li>
                    <li>• Prominent in their fields</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Succedent Houses (2, 5, 8, 11)</h4>
                  <p className="text-black text-sm mb-2">Resource-building, fixed energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Value stability and security</li>
                    <li>• Focus on building and maintaining</li>
                    <li>• Strong determination</li>
                    <li>• Practical approach to life</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Cadent Houses (3, 6, 9, 12)</h4>
                  <p className="text-black text-sm mb-2">Learning-oriented, mutable energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Natural teachers and communicators</li>
                    <li>• Focus on learning and adapting</li>
                    <li>• Flexible and versatile</li>
                    <li>• Bridge different worlds</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Stelliums (3+ planets in one house)</h4>
                  <p className="text-black text-sm mb-2">Concentrated life focus</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Intense focus on that life area</li>
                    <li>• Major life theme</li>
                    <li>• Potential for mastery</li>
                    <li>• May feel overwhelming at times</li>
                  </ul>
                </div>
              </div>
            </div>

            <NextSteps
              title="Applying House Knowledge"
              description="How to use your house placements for personal growth and life planning"
              steps={[
                {
                  number: 1,
                  title: "Identify Your Power Houses",
                  description: "Notice which houses contain the most planets or your personal planets (Sun, Moon, Mercury, Venus, Mars)"
                },
                {
                  number: 2,
                  title: "Understand Your Life Themes",
                  description: "Your strongest house placements show where you're meant to focus energy and experience growth"
                },
                {
                  number: 3,
                  title: "Work with Empty Houses",
                  description: "Use the ruling planet of empty houses to understand how to activate those life areas"
                },
                {
                  number: 4,
                  title: "Track Transits Through Houses",
                  description: "Notice how your experience changes as planets transit through different houses"
                },
                {
                  number: 5,
                  title: "Balance Your Life Wheel",
                  description: "Consciously develop areas represented by empty or weak houses for a more balanced life"
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
      title: "Generate Your Natal Chart",
      description: "Create your personal birth chart and discover your unique house placements and planetary positions.",
      href: "/chart",
      linkText: "Create Chart",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Explore More Guides",
      description: "Continue your astrological journey with our comprehensive guide collection.",
      href: "/guides",
      linkText: "Browse Guides",
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