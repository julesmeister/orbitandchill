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

export default function RetrogradePlanetsGuidePage() {
  const guide = {
    id: 'retrograde-planets',
    title: 'Retrograde Planets: Cosmic Course Corrections',
    description: 'Demystify retrograde planets in your natal chart and current transits. Learn what they really mean beyond the Mercury retrograde hype and how to work with their transformative energy.',
    level: 'intermediate' as const,
    estimatedTime: '30 min',
    sections: [
      {
        id: 'intro',
        title: 'Understanding Retrograde Motion',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'natal-retrogrades',
        title: 'Natal Retrograde Planets',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'transit-retrogrades',
        title: 'Transit Retrograde Periods',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'shadow-periods',
        title: 'Shadow Periods and Cycles',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'working-with-retrogrades',
        title: 'Working with Retrograde Energy',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Understanding Retrograde Motion
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔄"
              title="The Cosmic Rewind"
              description="Retrograde motion isn't about planets moving backward - it's an optical illusion that creates powerful opportunities for review, revision, and internal processing. Think of retrogrades as cosmic course corrections that help you refine and perfect different areas of life."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="What Retrograde Really Means"
              items={[
                {
                  icon: "👁️",
                  title: "Optical Illusion",
                  description: "Planets appear to move backward from Earth's perspective due to orbital mechanics"
                },
                {
                  icon: "🔍",
                  title: "Inward Focus",
                  description: "Energy turns inward for review, reflection, and refinement"
                },
                {
                  icon: "⚡",
                  title: "Intensified Energy",
                  description: "Planetary energy becomes more concentrated and internalized"
                },
                {
                  icon: "🌱",
                  title: "Growth Opportunity",
                  description: "Time to revisit, revise, and perfect areas of life"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Retrograde Myth vs Reality</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Common Misconceptions</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Planets actually move backward</li>
                    <li>• Everything will go wrong</li>
                    <li>• Technology will definitely break</li>
                    <li>• All communication is doomed</li>
                    <li>• You can't start anything new</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">The Reality</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Optical illusion from Earth's perspective</li>
                    <li>• Opportunity for review and revision</li>
                    <li>• Time to slow down and be more careful</li>
                    <li>• Chance to complete unfinished projects</li>
                    <li>• Perfect for inner work and reflection</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="Retrograde Motion Explanation"
              description="How planets appear to move backward from Earth's perspective"
              points={[
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "🌍", description: "Earth's position" },
                { position: "top-1/2 right-0 transform translate-x-4 -translate-y-1/2", label: "♂", description: "Mars (faster orbit)" },
                { position: "bottom-1/4 left-1/4 transform -translate-x-2 translate-y-2", label: "☿R", description: "Mercury retrograde" },
                { position: "bottom-0 right-1/2 transform translate-x-1/2 translate-y-4", label: "♃", description: "Jupiter (slower orbit)" }
              ]}
            />

            <IntegrationCard
              title="The Purpose of Retrograde Periods"
              description="Why the universe provides these natural pause buttons"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Retrograde periods serve as natural rhythm breaks in our fast-paced world. They encourage us to slow down, look inward, and refine our approach to different areas of life. Rather than pushing forward, we're invited to perfect what we've already started.
                </p>
                <p className="leading-relaxed">
                  Think of retrogrades as cosmic editing periods - times when the universe gives us a chance to review our work, correct mistakes, and make improvements before moving forward with greater clarity and precision.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Natal Retrograde Planets
        return (
          <div className="space-y-8">
            <HeroCard
              icon="⭐"
              title="Born Under Retrograde"
              description="Having planets retrograde in your natal chart is actually a gift. These planets represent areas where you naturally process information differently, think more deeply, and often develop unique insights that others miss."
              backgroundColor="#ff91e9"
            />

            <SymbolGrid
              title="Natal Retrograde Planets"
              subtitle="How retrograde planets express in your birth chart"
              items={[
                { symbol: "☿R", name: "Mercury Retrograde", description: "Deep thinker, unique communication style, internal processing" },
                { symbol: "♀R", name: "Venus Retrograde", description: "Unconventional values, internal beauty standards, karmic relationships" },
                { symbol: "♂R", name: "Mars Retrograde", description: "Internalized energy, strategic approach, passionate about causes" },
                { symbol: "♃R", name: "Jupiter Retrograde", description: "Personal philosophy, internal wisdom, skeptical of dogma" },
                { symbol: "♄R", name: "Saturn Retrograde", description: "Self-disciplined, internal authority, karmic lessons" }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🧠"
                title="Mercury Retrograde Natal"
                subtitle="The Internal Processor"
                description="You think deeply before speaking, often have unique insights, and may prefer written communication. Your mind works differently - and that's your superpower."
                keyQuestions={[
                  "How do I process information differently?",
                  "What unique perspectives do I offer?",
                  "How can I honor my thinking style?",
                  "What communication methods work best for me?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="💝"
                title="Venus Retrograde Natal"
                subtitle="The Unique Lover"
                description="You have unconventional ideas about love and beauty, may be drawn to karmic relationships, and develop your own value system independent of society."
                keyQuestions={[
                  "What do I truly value?",
                  "How do I express love uniquely?",
                  "What is my personal definition of beauty?",
                  "How do I heal relationship patterns?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Gifts of Natal Retrograde Planets</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Unique Strengths</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Process information more thoroughly</li>
                    <li>• Develop original ideas and approaches</li>
                    <li>• Less influenced by external trends</li>
                    <li>• Natural ability to see what others miss</li>
                    <li>• Strong internal compass and values</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Potential Challenges</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• May feel misunderstood by others</li>
                    <li>• Can be overly self-critical</li>
                    <li>• Tendency to overthink decisions</li>
                    <li>• May struggle with timing in that area</li>
                    <li>• Need extra time to process and express</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Embracing Your Retrograde Gifts"
              description="How to work with natal retrograde planets as strengths rather than limitations"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  If you have natal retrograde planets, you're not broken or disadvantaged - you're uniquely gifted. These planets represent areas where you naturally march to the beat of your own drum and develop wisdom that comes from deep internal processing.
                </p>
                <p className="leading-relaxed">
                  The key is to honor your different timing and approach. Don't try to force yourself to operate like everyone else. Instead, embrace your natural tendency to go deeper, think longer, and develop more thoughtful, original approaches to life.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // Transit Retrograde Periods
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌊"
              title="Retrograde Seasons"
              description="Transit retrograde periods are temporary times when specific planetary energies turn inward for everyone. These are universal opportunities to review, revise, and refine different areas of life, each with its own rhythm and purpose."
              backgroundColor="#6bdbff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="📱"
                title="Mercury Retrograde"
                subtitle="3-4 times per year, 3 weeks each"
                description="Communication, technology, travel, and contracts need extra attention. Perfect time for reviewing, revising, and reconnecting with the past."
                keyQuestions={[
                  "What communications need clarification?",
                  "What projects need revision?",
                  "What past connections want to return?",
                  "How can I slow down and be more careful?"
                ]}
                backgroundColor="#f2e356"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="❤️"
                title="Venus Retrograde"
                subtitle="Every 18 months, 6 weeks"
                description="Relationships, values, and finances are up for review. Time to reassess what you truly value and heal relationship patterns."
                keyQuestions={[
                  "What relationships need attention?",
                  "What do I truly value?",
                  "How are my finances reflecting my values?",
                  "What beauty standards am I questioning?"
                ]}
                backgroundColor="#ff91e9"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="⚔️"
                title="Mars Retrograde"
                subtitle="Every 2 years, 10 weeks"
                description="Energy, motivation, and action patterns need reassessment. Time to redirect energy and refine your approach to goals and conflicts."
                keyQuestions={[
                  "How am I using my energy?",
                  "What goals need redirection?",
                  "How do I handle conflict?",
                  "What anger needs processing?"
                ]}
                backgroundColor="#51bd94"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏛️"
                title="Outer Planet Retrogrades"
                subtitle="Annual, several months each"
                description="Jupiter, Saturn, Uranus, Neptune, and Pluto retrograde annually, offering time to integrate their transformative energies internally."
                keyQuestions={[
                  "What beliefs need updating?",
                  "What structures need strengthening?",
                  "What changes need integrating?",
                  "What spiritual insights are emerging?"
                ]}
                backgroundColor="#f0e3ff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Retrograde Do's and Don'ts</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Excellent Times For</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Reviewing and revising projects</li>
                    <li>• Reconnecting with old friends</li>
                    <li>• Completing unfinished business</li>
                    <li>• Internal reflection and meditation</li>
                    <li>• Backing up important data</li>
                    <li>• Editing and proofreading</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Approach with Caution</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Signing important contracts</li>
                    <li>• Launching major projects</li>
                    <li>• Making hasty decisions</li>
                    <li>• Buying expensive electronics</li>
                    <li>• Starting new relationships</li>
                    <li>• Traveling without backup plans</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Shadow Periods and Cycles
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌗"
              title="The Shadow Dance"
              description="Shadow periods occur before and after retrograde phases, creating a three-part cycle. Understanding these phases helps you navigate retrograde energy more skillfully and recognize the complete transformation process."
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Complete Retrograde Cycle</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Pre-Shadow Phase</h4>
                  <p className="text-black text-sm mb-2">Planet slows down, themes emerge</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Initial slowdown and preparation</li>
                    <li>• First hints of retrograde themes</li>
                    <li>• Issues begin to surface</li>
                    <li>• Energy starts to shift inward</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Retrograde Phase</h4>
                  <p className="text-black text-sm mb-2">Full retrograde, deep work</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Maximum inward energy</li>
                    <li>• Review and revision time</li>
                    <li>• Past issues resurface</li>
                    <li>• Internal processing intensifies</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Post-Shadow Phase</h4>
                  <p className="text-black text-sm mb-2">Integration and forward movement</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Gradual return to normal speed</li>
                    <li>• Integration of lessons learned</li>
                    <li>• Implementation of changes</li>
                    <li>• Clear forward movement</li>
                  </ul>
                </div>
              </div>
            </div>

            <AssessmentExercise
              title="Tracking Your Retrograde Cycles"
              description="How to observe and work with complete retrograde cycles in your life"
              items={[
                {
                  number: 1,
                  title: "Note the Pre-Shadow",
                  description: "Pay attention when planets slow down and themes first emerge"
                },
                {
                  number: 2,
                  title: "Embrace the Retrograde",
                  description: "Use the retrograde phase for deep review and internal work"
                },
                {
                  number: 3,
                  title: "Integrate Post-Shadow",
                  description: "Apply lessons learned as the planet returns to normal speed"
                },
                {
                  number: 4,
                  title: "Journal the Journey",
                  description: "Keep track of how different retrograde cycles affect you personally"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Mercury Retrograde Shadow Dates</h3>
              <p className="text-black text-sm mb-4">Understanding the complete Mercury retrograde cycle with shadow periods</p>
              <div className="bg-white border border-black p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Pre-Shadow:</span>
                    <span>Issues begin to surface, slow down starts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Retrograde:</span>
                    <span>Full retrograde phase, deep review work</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Post-Shadow:</span>
                    <span>Integration phase, implementing changes</span>
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Working with Shadow Periods"
              description="How to use the complete retrograde cycle for maximum benefit"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Shadow periods are just as important as the retrograde phase itself. The pre-shadow gives you time to prepare and notice emerging themes, while the post-shadow helps you integrate and implement what you've learned.
                </p>
                <p className="leading-relaxed">
                  Think of it as a three-act play: setup, confrontation, and resolution. Each phase has its own purpose and timing, and understanding this helps you work with retrograde energy more effectively.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Working with Retrograde Energy
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Mastering Retrograde Periods"
              description="Practical strategies for thriving during retrograde phases"
              items={[
                {
                  number: 1,
                  title: "Shift Your Perspective",
                  description: "View retrogrades as opportunities for growth and refinement, not obstacles"
                },
                {
                  number: 2,
                  title: "Slow Down Intentionally",
                  description: "Use retrograde periods to naturally reduce your pace and be more mindful"
                },
                {
                  number: 3,
                  title: "Focus on the Re- Words",
                  description: "Review, revise, reconnect, refresh, renew - all perfect retrograde activities"
                },
                {
                  number: 4,
                  title: "Practice Extra Patience",
                  description: "Allow extra time for tasks and be patient with delays and miscommunications"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Retrograde Survival Kit</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Mercury Retrograde Kit</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Back up all important files</li>
                    <li>• Double-check travel arrangements</li>
                    <li>• Confirm appointments and meetings</li>
                    <li>• Keep receipts and warranties handy</li>
                    <li>• Have backup communication methods</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Venus Retrograde Kit</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Review your relationship patterns</li>
                    <li>• Reassess your values and priorities</li>
                    <li>• Avoid major beauty changes</li>
                    <li>• Review financial investments</li>
                    <li>• Practice self-love and acceptance</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Mars Retrograde Kit</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Reassess your goals and direction</li>
                    <li>• Practice anger management techniques</li>
                    <li>• Focus on internal motivation</li>
                    <li>• Review conflict resolution skills</li>
                    <li>• Channel energy into creative projects</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">General Retrograde Kit</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Keep a retrograde journal</li>
                    <li>• Practice mindfulness and meditation</li>
                    <li>• Be extra patient with yourself</li>
                    <li>• Allow extra time for everything</li>
                    <li>• Focus on completion over starting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Retrograde Opportunities</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">✍️</div>
                  <div className="text-black text-sm">
                    <strong>Creative Projects:</strong> Perfect time for editing, revising, and refining your creative work to new levels of excellence.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🔍</div>
                  <div className="text-black text-sm">
                    <strong>Self-Reflection:</strong> Use the inward energy to gain insights about yourself and your life patterns.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🤝</div>
                  <div className="text-black text-sm">
                    <strong>Relationship Healing:</strong> Address old wounds, have important conversations, and strengthen existing bonds.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🧘</div>
                  <div className="text-black text-sm">
                    <strong>Spiritual Practice:</strong> Deepen your meditation, contemplation, and connection to inner wisdom.
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Becoming a Retrograde Master"
              description="Advanced strategies for working with retrograde energy as a tool for growth"
              steps={[
                {
                  number: 1,
                  title: "Track Your Patterns",
                  description: "Notice how different retrograde periods affect you personally over time"
                },
                {
                  number: 2,
                  title: "Prepare Proactively",
                  description: "Use pre-shadow periods to prepare for the themes that will emerge"
                },
                {
                  number: 3,
                  title: "Embrace the Process",
                  description: "Welcome retrogrades as natural cycles that support your growth"
                },
                {
                  number: 4,
                  title: "Share Your Experience",
                  description: "Help others understand retrograde energy by sharing your insights"
                },
                {
                  number: 5,
                  title: "Celebrate Integration",
                  description: "Acknowledge the wisdom and growth that comes from working with retrograde cycles"
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
      title: "Check Your Natal Retrogrades",
      description: "Generate your birth chart to discover which planets are retrograde in your natal chart and learn about your unique gifts.",
      href: "/chart",
      linkText: "View Chart",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Join Retrograde Discussions",
      description: "Connect with others navigating current retrograde periods and share experiences and insights.",
      href: "/discussions",
      linkText: "Join Community",
      backgroundColor: "#6bdbff"
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