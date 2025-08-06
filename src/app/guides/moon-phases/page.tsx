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

export default function MoonPhasesGuidePage() {
  const guide = {
    id: 'moon-phases',
    title: 'The Moon Phases and Your Emotional Cycle',
    description: 'Learn how lunar cycles connect to your emotional patterns and how to work with moon energy for personal growth, manifestation, and emotional balance.',
    level: 'intermediate' as const,
    estimatedTime: '35 min',
    sections: [
      {
        id: 'intro',
        title: 'Understanding Lunar Cycles',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'eight-phases',
        title: 'The Eight Moon Phases',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'emotional-patterns',
        title: 'Emotional Patterns and Moon Cycles',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'lunar-returns',
        title: 'Personal Lunar Returns',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-moon-work',
        title: 'Working with Lunar Energy',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Understanding Lunar Cycles
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌙"
              title="The Celestial Timekeeper"
              description="The Moon's 29.5-day cycle creates natural rhythms that influence our emotions, energy levels, and inner world. Understanding these cycles helps you align with natural timing for emotional balance and personal growth."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="How Lunar Cycles Affect You"
              items={[
                {
                  icon: "💧",
                  title: "Emotional Rhythms",
                  description: "The Moon governs our emotional tides and feeling patterns"
                },
                {
                  icon: "🌱",
                  title: "Natural Timing",
                  description: "Lunar phases provide optimal timing for different activities"
                },
                {
                  icon: "🔄",
                  title: "Cyclical Nature",
                  description: "Monthly cycles mirror larger life patterns and growth"
                },
                {
                  icon: "🎯",
                  title: "Manifestation Tool",
                  description: "New and Full Moons are powerful times for intention setting"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Science Behind Moon Influence</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Physical Influences</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Human body is 60% water (like Earth's oceans)</li>
                    <li>• Moon's gravity creates tides in all bodies of water</li>
                    <li>• Sleep patterns and menstrual cycles follow lunar rhythms</li>
                    <li>• Emergency rooms report increased activity during Full Moons</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Emotional Influences</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Increased sensitivity during Full Moons</li>
                    <li>• Introspective energy during New Moons</li>
                    <li>• Heightened emotions during lunar eclipses</li>
                    <li>• Energy fluctuations throughout the cycle</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Complete Lunar Cycle"
              description="How the Moon's phases create a monthly emotional and energetic rhythm"
              points={[
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "🌕", description: "Full Moon - Peak energy" },
                { position: "top-1/4 right-1/4 transform translate-x-2 -translate-y-2", label: "🌖", description: "Waning Gibbous - Gratitude" },
                { position: "top-1/2 right-0 transform translate-x-4 -translate-y-1/2", label: "🌗", description: "Last Quarter - Release" },
                { position: "bottom-1/4 right-1/4 transform translate-x-2 translate-y-2", label: "🌘", description: "Waning Crescent - Rest" },
                { position: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4", label: "🌑", description: "New Moon - New beginnings" },
                { position: "bottom-1/4 left-1/4 transform -translate-x-2 translate-y-2", label: "🌒", description: "Waxing Crescent - Intention" },
                { position: "top-1/2 left-0 transform -translate-x-4 -translate-y-1/2", label: "🌓", description: "First Quarter - Action" },
                { position: "top-1/4 left-1/4 transform -translate-x-2 -translate-y-2", label: "🌔", description: "Waxing Gibbous - Refinement" }
              ]}
            />

            <IntegrationCard
              title="Ancient Wisdom, Modern Application"
              description="How traditional lunar knowledge applies to contemporary life"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  For thousands of years, cultures worldwide have recognized the Moon's influence on human emotions and behavior. Ancient farmers planted by lunar cycles, while healers and mystics used Moon phases for ritual and healing work.
                </p>
                <p className="leading-relaxed">
                  Modern research confirms what ancient wisdom knew - our bodies and emotions are deeply connected to lunar rhythms. By understanding these cycles, you can work with natural timing instead of against it.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // The Eight Moon Phases
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌙"
              title="The Eight-Phase Journey"
              description="Each lunar cycle contains eight distinct phases, each with its own energy, purpose, and optimal activities. Learning to work with these phases creates natural rhythm and flow in your life."
              backgroundColor="#6bdbff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌑"
                title="New Moon"
                subtitle="New Beginnings & Intention Setting"
                description="The dark moon phase when lunar energy is at its lowest. Perfect time for introspection, setting intentions, and planting seeds for new projects."
                keyQuestions={[
                  "What new intentions am I setting?",
                  "What do I want to manifest this cycle?",
                  "How can I create space for new beginnings?",
                  "What inner work needs attention?"
                ]}
                backgroundColor="#2c2c2c"
                className="border-r border-black text-white"
              />
              
              <SectionCard
                icon="🌒"
                title="Waxing Crescent"
                subtitle="Taking Action & Building"
                description="The first visible sliver of moon. Energy begins to build. Time to take initial steps toward your New Moon intentions and overcome resistance."
                keyQuestions={[
                  "What actions support my intentions?",
                  "What obstacles am I facing?",
                  "How can I build momentum?",
                  "What support do I need?"
                ]}
                backgroundColor="#f2e356"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌓"
                title="First Quarter"
                subtitle="Decision Making & Action"
                description="Half moon phase with building energy. Time to make decisions, take bold action, and push through challenges with determination."
                keyQuestions={[
                  "What decisions need to be made?",
                  "Where do I need to take action?",
                  "What challenges am I ready to face?",
                  "How can I stay motivated?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌔"
                title="Waxing Gibbous"
                subtitle="Refinement & Adjustment"
                description="Moon is almost full. Time to refine your approach, make adjustments, and prepare for the Full Moon culmination."
                keyQuestions={[
                  "What needs fine-tuning?",
                  "How can I improve my approach?",
                  "What details need attention?",
                  "Am I on track with my goals?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌕"
                title="Full Moon"
                subtitle="Culmination & Celebration"
                description="Peak lunar energy. Time for completion, celebration, heightened emotions, and receiving the fruits of your efforts."
                keyQuestions={[
                  "What am I celebrating?",
                  "What has come to completion?",
                  "How are my emotions heightened?",
                  "What insights am I receiving?"
                ]}
                backgroundColor="#f0e3ff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌖"
                title="Waning Gibbous"
                subtitle="Gratitude & Sharing"
                description="Energy begins to wane. Time for gratitude, sharing your wisdom, and giving back to others what you've learned."
                keyQuestions={[
                  "What am I grateful for?",
                  "How can I share my knowledge?",
                  "What wisdom have I gained?",
                  "How can I give back?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌗"
                title="Last Quarter"
                subtitle="Release & Forgiveness"
                description="Half moon waning phase. Time to release what no longer serves, forgive old wounds, and clear space for new growth."
                keyQuestions={[
                  "What needs to be released?",
                  "What can I forgive?",
                  "How can I let go gracefully?",
                  "What space am I creating?"
                ]}
                backgroundColor="#ff6b6b"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌘"
                title="Waning Crescent"
                subtitle="Rest & Reflection"
                description="Final phase before New Moon. Time for rest, deep reflection, and preparing for the next cycle's new beginnings."
                keyQuestions={[
                  "What have I learned this cycle?",
                  "How can I rest and recharge?",
                  "What patterns am I noticing?",
                  "How do I prepare for the next cycle?"
                ]}
                backgroundColor="#d4d4d4"
                className=""
              />
            </div>
          </div>
        );

      case 2: // Emotional Patterns and Moon Cycles
        return (
          <div className="space-y-8">
            <HeroCard
              icon="💧"
              title="Your Emotional Lunar Map"
              description="Everyone responds to lunar cycles differently based on their natal Moon sign, but there are universal patterns of emotional flow that you can learn to recognize and work with for greater emotional balance."
              backgroundColor="#51bd94"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Universal Emotional Patterns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Waxing Moon (New → Full)</h4>
                  <p className="text-black text-sm mb-2">Building energy, increasing emotion</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Optimism and hope increase</li>
                    <li>• Energy levels rise gradually</li>
                    <li>• Motivation and drive strengthen</li>
                    <li>• Social desires increase</li>
                    <li>• Creativity and inspiration flow</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Waning Moon (Full → New)</h4>
                  <p className="text-black text-sm mb-2">Releasing energy, decreasing emotion</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Natural inclination to withdraw</li>
                    <li>• Energy levels gradually decrease</li>
                    <li>• Introspection and reflection increase</li>
                    <li>• Desire for solitude grows</li>
                    <li>• Letting go becomes easier</li>
                  </ul>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="Moon Signs and Lunar Sensitivity"
              subtitle="How your natal Moon sign affects your lunar cycle experience"
              items={[
                { symbol: "♈", name: "Aries Moon", description: "Intense, immediate emotional responses to lunar changes" },
                { symbol: "♉", name: "Taurus Moon", description: "Steady, sensual connection to lunar rhythms" },
                { symbol: "♊", name: "Gemini Moon", description: "Mental processing of lunar energy shifts" },
                { symbol: "♋", name: "Cancer Moon", description: "Highly sensitive to all lunar phases" },
                { symbol: "♌", name: "Leo Moon", description: "Dramatic emotional expression during Full Moons" },
                { symbol: "♍", name: "Virgo Moon", description: "Practical approach to lunar cycle planning" },
                { symbol: "♎", name: "Libra Moon", description: "Seeks balance and harmony through lunar work" },
                { symbol: "♏", name: "Scorpio Moon", description: "Deep transformation during lunar cycles" },
                { symbol: "♐", name: "Sagittarius Moon", description: "Philosophical approach to lunar wisdom" },
                { symbol: "♑", name: "Capricorn Moon", description: "Goal-oriented lunar cycle planning" },
                { symbol: "♒", name: "Aquarius Moon", description: "Innovative approaches to lunar practices" },
                { symbol: "♓", name: "Pisces Moon", description: "Intuitive, dreamy lunar sensitivity" }
              ]}
              backgroundColor="#ff91e9"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Tracking Your Personal Patterns</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">📊</div>
                  <div className="text-black text-sm">
                    <strong>Energy Levels:</strong> Track how your energy fluctuates throughout the lunar cycle
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">💭</div>
                  <div className="text-black text-sm">
                    <strong>Emotional Patterns:</strong> Notice recurring emotional themes during specific phases
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">💤</div>
                  <div className="text-black text-sm">
                    <strong>Sleep Quality:</strong> Observe how different phases affect your sleep and dreams
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🤝</div>
                  <div className="text-black text-sm">
                    <strong>Relationship Dynamics:</strong> Notice how lunar phases affect your interactions with others
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Working with Your Emotional Rhythms"
              description="How to honor and work with your natural lunar-influenced emotional patterns"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Rather than fighting against your natural emotional rhythms, learning to work with them creates greater ease and flow in your life. When you understand that certain emotions are amplified during specific lunar phases, you can plan accordingly.
                </p>
                <p className="leading-relaxed">
                  For example, if you know you're more sensitive during Full Moons, you can schedule lighter social activities and more self-care during these times. If you're naturally more introspective during New Moons, you can plan important decision-making for other phases.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Personal Lunar Returns
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🎯"
              title="Your Personal Moon Calendar"
              description="Your Lunar Return occurs when the Moon returns to the exact position it was at your birth - about every 27.3 days. This personal lunar cycle creates your unique emotional rhythm and timing."
              backgroundColor="#f0e3ff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🌙"
                title="Monthly Lunar Return"
                subtitle="Your personal emotional new year"
                description="Every month, the Moon returns to your natal Moon position, creating a personal emotional reset and new beginning for your inner world."
                keyQuestions={[
                  "What emotions am I processing this month?",
                  "How is my inner world shifting?",
                  "What emotional patterns am I noticing?",
                  "How can I nurture myself better?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏠"
                title="House-Based Lunar Cycle"
                subtitle="Monthly focus areas"
                description="Each month, your Lunar Return activates a different house in your chart, highlighting different life areas for emotional focus and growth."
                keyQuestions={[
                  "Which house is being activated?",
                  "What life area needs emotional attention?",
                  "How can I nurture this area of life?",
                  "What emotional healing is needed here?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Lunar Return Through the Houses</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Houses 1-4: Personal Foundation</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>1st House:</strong> Self-identity and personal needs</li>
                    <li>• <strong>2nd House:</strong> Self-worth and security</li>
                    <li>• <strong>3rd House:</strong> Communication and learning</li>
                    <li>• <strong>4th House:</strong> Home and family emotions</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Houses 5-8: Creative Expression</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>5th House:</strong> Creativity and romance</li>
                    <li>• <strong>6th House:</strong> Daily routines and health</li>
                    <li>• <strong>7th House:</strong> Partnerships and relationships</li>
                    <li>• <strong>8th House:</strong> Transformation and shared resources</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Houses 9-12: Higher Purpose</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>9th House:</strong> Beliefs and higher learning</li>
                    <li>• <strong>10th House:</strong> Career and public image</li>
                    <li>• <strong>11th House:</strong> Friendships and hopes</li>
                    <li>• <strong>12th House:</strong> Spirituality and subconscious</li>
                  </ul>
                </div>
              </div>
            </div>

            <AssessmentExercise
              title="Calculating Your Lunar Return"
              description="How to track your personal lunar cycle and its themes"
              items={[
                {
                  number: 1,
                  title: "Find Your Natal Moon",
                  description: "Identify your Moon's sign, degree, and house position in your birth chart"
                },
                {
                  number: 2,
                  title: "Track Monthly Returns",
                  description: "Use an ephemeris or app to find when the Moon returns to your natal position"
                },
                {
                  number: 3,
                  title: "Note the Activated House",
                  description: "See which house your Lunar Return falls in each month"
                },
                {
                  number: 4,
                  title: "Journal Your Patterns",
                  description: "Track how you feel and what themes emerge during each return"
                }
              ]}
            />

            <IntegrationCard
              title="Your Unique Lunar Rhythm"
              description="How your personal lunar cycle differs from the universal one"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  While everyone experiences the universal lunar cycle, your personal Lunar Return creates your unique emotional rhythm. This is why some people feel more energized during Full Moons while others feel drained - it depends on how the current Moon phase relates to your natal Moon.
                </p>
                <p className="leading-relaxed">
                  By tracking your Lunar Returns, you can discover your personal emotional patterns and plan your month accordingly. You might find that your most creative time comes when the Moon is in your 5th house, or that you need extra self-care when it's in your 12th house.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Working with Lunar Energy
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Creating Your Lunar Practice"
              description="Building a sustainable practice for working with Moon energy"
              items={[
                {
                  number: 1,
                  title: "Choose Your Approach",
                  description: "Decide whether to work with universal phases, your personal lunar return, or both"
                },
                {
                  number: 2,
                  title: "Start with New and Full Moons",
                  description: "Begin by tracking just the two most powerful phases each month"
                },
                {
                  number: 3,
                  title: "Create Simple Rituals",
                  description: "Develop easy practices for each phase that fit your lifestyle"
                },
                {
                  number: 4,
                  title: "Track Your Results",
                  description: "Keep a lunar journal to notice patterns and improvements"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Lunar Phase Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">New Moon Practices</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Set intentions for the coming month</li>
                    <li>• Journal about what you want to create</li>
                    <li>• Meditate on new beginnings</li>
                    <li>• Create vision boards or goal lists</li>
                    <li>• Practice gratitude for fresh starts</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Full Moon Practices</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Celebrate what you've accomplished</li>
                    <li>• Practice gratitude for abundance</li>
                    <li>• Release what no longer serves you</li>
                    <li>• Charge crystals or sacred objects</li>
                    <li>• Do emotional clearing work</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Waxing Moon Practices</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Take action on your goals</li>
                    <li>• Build new habits and routines</li>
                    <li>• Network and connect with others</li>
                    <li>• Learn new skills or knowledge</li>
                    <li>• Invest in growth opportunities</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Waning Moon Practices</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Declutter your physical space</li>
                    <li>• Release toxic relationships or habits</li>
                    <li>• Practice forgiveness and letting go</li>
                    <li>• Reflect on lessons learned</li>
                    <li>• Prepare for rest and renewal</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Lunar Journal Template</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Date: _____ | Phase: _____ | Sign: _____</h5>
                  </div>
                  <div className="space-y-2">
                    <p className="text-black text-sm"><strong>Energy Level (1-10):</strong> ______</p>
                    <p className="text-black text-sm"><strong>Emotional State:</strong> ________________</p>
                    <p className="text-black text-sm"><strong>Sleep Quality:</strong> ________________</p>
                    <p className="text-black text-sm"><strong>Key Events Today:</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      What happened? Any patterns or synchronicities?
                    </div>
                    <p className="text-black text-sm"><strong>Intentions/Releases:</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      What am I focusing on this lunar phase?
                    </div>
                    <p className="text-black text-sm"><strong>Gratitude:</strong></p>
                    <div className="border border-gray-300 p-2 h-12 text-sm text-gray-500">
                      What am I grateful for today?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Mastering Lunar Awareness"
              description="Advanced strategies for deepening your relationship with lunar cycles"
              steps={[
                {
                  number: 1,
                  title: "Develop Lunar Sensitivity",
                  description: "Practice noticing subtle energy shifts throughout the monthly cycle"
                },
                {
                  number: 2,
                  title: "Integrate with Life Planning",
                  description: "Align important decisions and activities with supportive lunar phases"
                },
                {
                  number: 3,
                  title: "Create Monthly Rituals",
                  description: "Establish meaningful practices for each New and Full Moon"
                },
                {
                  number: 4,
                  title: "Track Long-term Patterns",
                  description: "Notice how lunar cycles affect your yearly rhythms and growth"
                },
                {
                  number: 5,
                  title: "Share Your Knowledge",
                  description: "Help others understand and work with lunar energy in their lives"
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
      title: "Track Current Moon Phase",
      description: "See tonight's Moon phase and discover how it connects to your emotional patterns and personal growth opportunities.",
      href: "/moon-tracker",
      linkText: "View Moon Phase",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Explore Lunar Discussions",
      description: "Connect with others who work with lunar energy and share your Moon phase experiences.",
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