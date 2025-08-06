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

export default function MinorArcanaGuidePage() {
  const guide = {
    id: 'minor-arcana',
    title: 'The Four Suits: Mastering the Minor Arcana',
    description: 'Master the 56 Minor Arcana cards through the four elemental suits. Learn how Wands, Cups, Swords, and Pentacles connect to astrology and provide detailed guidance for daily life.',
    level: 'intermediate' as const,
    estimatedTime: '40 min',
    sections: [
      {
        id: 'intro',
        title: 'Understanding the Four Suits',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'wands-and-cups',
        title: 'Wands & Cups: Fire & Water',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'swords-and-pentacles',
        title: 'Swords & Pentacles: Air & Earth',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'court-cards',
        title: 'The Court Cards: People & Personalities',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-application',
        title: 'Reading the Minor Arcana',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Understanding the Four Suits
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🎴"
              title="The Daily Life Cards"
              description="The Minor Arcana represents the everyday experiences, challenges, and opportunities in our lives. Through four elemental suits, these 56 cards provide detailed guidance for practical situations and personal growth."
              backgroundColor="#6bdbff"
            />

            <InfoGrid
              title="How the Minor Arcana Works"
              items={[
                {
                  icon: "🔥",
                  title: "Elemental Foundation",
                  description: "Each suit corresponds to one of the four elements and their associated life areas"
                },
                {
                  icon: "🔢",
                  title: "Numerical Progression",
                  description: "Numbers 1-10 in each suit tell a complete story from beginning to mastery"
                },
                {
                  icon: "👥",
                  title: "Court Card Personalities",
                  description: "Page, Knight, Queen, King represent different personality types and maturity levels"
                },
                {
                  icon: "⭐",
                  title: "Astrological Connections",
                  description: "Each card connects to specific zodiac signs, planets, and degrees"
                }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Four Suits and Their Domains</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Fire & Air Suits (Yang Energy)</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Wands (Fire):</strong> Passion, creativity, inspiration, career</li>
                    <li>• <strong>Swords (Air):</strong> Thoughts, communication, conflict, truth</li>
                    <li>• Active, outward-moving energy</li>
                    <li>• Focus on action and mental processes</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Water & Earth Suits (Yin Energy)</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Cups (Water):</strong> Emotions, relationships, intuition, spirituality</li>
                    <li>• <strong>Pentacles (Earth):</strong> Money, career, health, material world</li>
                    <li>• Receptive, inward-moving energy</li>
                    <li>• Focus on feelings and material manifestation</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Minor Arcana Structure"
              description="How the 56 cards are organized by suit and number"
              points={[
                { position: "top-0 left-1/4 transform -translate-x-1/2 -translate-y-4", label: "🔥", description: "Wands (Fire)" },
                { position: "top-0 right-1/4 transform translate-x-1/2 -translate-y-4", label: "🌊", description: "Cups (Water)" },
                { position: "bottom-0 left-1/4 transform -translate-x-1/2 translate-y-4", label: "⚔️", description: "Swords (Air)" },
                { position: "bottom-0 right-1/4 transform translate-x-1/2 translate-y-4", label: "🪙", description: "Pentacles (Earth)" }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Numerical Meanings Across All Suits</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Ace - 5: Building Foundation</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Ace:</strong> New beginnings, pure potential</li>
                    <li>• <strong>Two:</strong> Choices, partnerships, balance</li>
                    <li>• <strong>Three:</strong> Growth, collaboration, creativity</li>
                    <li>• <strong>Four:</strong> Stability, foundation, structure</li>
                    <li>• <strong>Five:</strong> Conflict, challenge, change</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">6 - 10: Mastery and Completion</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Six:</strong> Harmony, healing, generosity</li>
                    <li>• <strong>Seven:</strong> Challenges, testing, perseverance</li>
                    <li>• <strong>Eight:</strong> Movement, progress, skill</li>
                    <li>• <strong>Nine:</strong> Near completion, culmination</li>
                    <li>• <strong>Ten:</strong> Completion, fulfillment, new cycle</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="The Poetry of Everyday Life"
              description="How the Minor Arcana reveals the sacred in the ordinary"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  While the Major Arcana deals with life's big spiritual lessons, the Minor Arcana shows us that every moment contains wisdom and meaning. A difficult conversation (Swords), a creative project (Wands), a loving relationship (Cups), or a financial decision (Pentacles) - all carry their own teachings.
                </p>
                <p className="leading-relaxed">
                  The Minor Arcana reminds us that spiritual growth happens not only in dramatic moments but in the accumulated wisdom of countless small experiences. Each card offers guidance for navigating life's daily challenges with greater awareness and skill.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Wands & Cups: Fire & Water
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔥"
              title="Fire & Water: Passion & Emotion"
              description="Wands and Cups represent the most dynamic and feeling-oriented suits. Fire ignites passion and creativity, while Water flows with emotion and intuition. Together, they show how inspiration and feeling drive human experience."
              backgroundColor="#ff91e9"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🔥"
                title="Wands (Fire)"
                subtitle="Passion, Creativity, Action"
                description="Wands represent the fire element - passion, creativity, inspiration, and enterprise. They deal with career, projects, personal growth, and the drive to create and achieve."
                keyQuestions={[
                  "What inspires and motivates me?",
                  "How do I express my creativity?",
                  "What projects am I passionate about?",
                  "Where do I need to take action?"
                ]}
                backgroundColor="#ff6b6b"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌊"
                title="Cups (Water)"
                subtitle="Emotions, Relationships, Intuition"
                description="Cups represent the water element - emotions, relationships, intuition, and spirituality. They deal with love, friendship, family, and the inner world of feelings."
                keyQuestions={[
                  "What am I feeling right now?",
                  "How are my relationships evolving?",
                  "What is my intuition telling me?",
                  "How can I nurture my emotional well-being?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <SymbolGrid
              title="Key Wands Cards"
              subtitle="Essential fire energy cards and their meanings"
              items={[
                { symbol: "🔥", name: "Ace of Wands", description: "New creative projects, inspiration, potential" },
                { symbol: "⚡", name: "Two of Wands", description: "Planning, personal power, future possibilities" },
                { symbol: "🌟", name: "Three of Wands", description: "Expansion, foresight, overseas opportunities" },
                { symbol: "🎉", name: "Four of Wands", description: "Celebration, harmony, homecoming" },
                { symbol: "⚔️", name: "Five of Wands", description: "Competition, conflict, disagreement" },
                { symbol: "🏆", name: "Six of Wands", description: "Victory, public recognition, success" },
                { symbol: "🛡️", name: "Seven of Wands", description: "Defending position, perseverance, challenges" },
                { symbol: "🏃", name: "Eight of Wands", description: "Swift action, movement, communication" },
                { symbol: "💪", name: "Nine of Wands", description: "Persistence, resilience, final push" },
                { symbol: "📦", name: "Ten of Wands", description: "Burden, responsibility, completion" }
              ]}
              backgroundColor="#f2e356"
            />

            <SymbolGrid
              title="Key Cups Cards"
              subtitle="Essential water energy cards and their meanings"
              items={[
                { symbol: "💧", name: "Ace of Cups", description: "New love, emotional beginnings, spiritual gift" },
                { symbol: "💕", name: "Two of Cups", description: "Partnership, mutual attraction, union" },
                { symbol: "🥂", name: "Three of Cups", description: "Friendship, celebration, community" },
                { symbol: "😔", name: "Four of Cups", description: "Apathy, meditation, reevaluation" },
                { symbol: "💔", name: "Five of Cups", description: "Loss, grief, disappointment" },
                { symbol: "🎁", name: "Six of Cups", description: "Nostalgia, childhood, innocence" },
                { symbol: "🌈", name: "Seven of Cups", description: "Illusion, choices, wishful thinking" },
                { symbol: "🚶", name: "Eight of Cups", description: "Leaving behind, spiritual quest, abandonment" },
                { symbol: "😊", name: "Nine of Cups", description: "Contentment, satisfaction, wish fulfillment" },
                { symbol: "👨‍👩‍👧‍👦", name: "Ten of Cups", description: "Happy family, emotional fulfillment, bliss" }
              ]}
              backgroundColor="#51bd94"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Fire & Water Dynamics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">When Fire Meets Water</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Passion balanced with emotion</li>
                    <li>• Creative projects inspired by feelings</li>
                    <li>• Action motivated by love and care</li>
                    <li>• Balancing drive with intuition</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Reading Fire & Water Together</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Wands show what you're passionate about</li>
                    <li>• Cups reveal how you feel about it</li>
                    <li>• Both suits deal with personal fulfillment</li>
                    <li>• Balance action with emotional wisdom</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Swords & Pentacles: Air & Earth
        return (
          <div className="space-y-8">
            <HeroCard
              icon="⚔️"
              title="Air & Earth: Mind & Matter"
              description="Swords and Pentacles represent the mental and material realms. Air cuts through illusion with clarity and truth, while Earth manifests ideas into tangible reality. Together, they show how thoughts become things."
              backgroundColor="#51bd94"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="⚔️"
                title="Swords (Air)"
                subtitle="Thoughts, Communication, Truth"
                description="Swords represent the air element - thoughts, communication, conflict, and truth. They deal with mental clarity, decision-making, and the power of words and ideas."
                keyQuestions={[
                  "What thoughts are dominating my mind?",
                  "How can I communicate more clearly?",
                  "What truth needs to be acknowledged?",
                  "Where do I need mental clarity?"
                ]}
                backgroundColor="#d4d4d4"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🪙"
                title="Pentacles (Earth)"
                subtitle="Money, Health, Material World"
                description="Pentacles represent the earth element - money, career, health, and material manifestation. They deal with practical matters, resources, and physical world success."
                keyQuestions={[
                  "How is my financial situation?",
                  "What material goals am I working toward?",
                  "How is my physical health?",
                  "Where do I need practical action?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <SymbolGrid
              title="Key Swords Cards"
              subtitle="Essential air energy cards and their meanings"
              items={[
                { symbol: "⚔️", name: "Ace of Swords", description: "Mental clarity, breakthrough, new ideas" },
                { symbol: "🤔", name: "Two of Swords", description: "Difficult decision, stalemate, avoidance" },
                { symbol: "💔", name: "Three of Swords", description: "Heartbreak, sorrow, emotional pain" },
                { symbol: "😴", name: "Four of Swords", description: "Rest, meditation, mental peace" },
                { symbol: "😤", name: "Five of Swords", description: "Conflict, defeat, win at all costs" },
                { symbol: "🚤", name: "Six of Swords", description: "Transition, moving on, recovery" },
                { symbol: "🥷", name: "Seven of Swords", description: "Deception, theft, getting away with something" },
                { symbol: "🔒", name: "Eight of Swords", description: "Restriction, imprisonment, victim mentality" },
                { symbol: "😰", name: "Nine of Swords", description: "Anxiety, worry, nightmares" },
                { symbol: "🗡️", name: "Ten of Swords", description: "Rock bottom, betrayal, painful ending" }
              ]}
              backgroundColor="#6bdbff"
            />

            <SymbolGrid
              title="Key Pentacles Cards"
              subtitle="Essential earth energy cards and their meanings"
              items={[
                { symbol: "🪙", name: "Ace of Pentacles", description: "New financial opportunity, material gift" },
                { symbol: "🤹", name: "Two of Pentacles", description: "Juggling priorities, balance, multitasking" },
                { symbol: "🏗️", name: "Three of Pentacles", description: "Teamwork, collaboration, skilled work" },
                { symbol: "💰", name: "Four of Pentacles", description: "Saving money, security, possessiveness" },
                { symbol: "🏚️", name: "Five of Pentacles", description: "Financial hardship, poverty, isolation" },
                { symbol: "🤝", name: "Six of Pentacles", description: "Generosity, charity, sharing wealth" },
                { symbol: "🌱", name: "Seven of Pentacles", description: "Assessment, patience, long-term view" },
                { symbol: "🔨", name: "Eight of Pentacles", description: "Skill development, craftsmanship, diligence" },
                { symbol: "🏡", name: "Nine of Pentacles", description: "Luxury, self-sufficiency, material success" },
                { symbol: "👨‍👩‍👧‍👦", name: "Ten of Pentacles", description: "Wealth, family legacy, inheritance" }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Air & Earth Dynamics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">When Air Meets Earth</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Ideas manifested into reality</li>
                    <li>• Mental planning for material goals</li>
                    <li>• Clear thinking about practical matters</li>
                    <li>• Communication about resources</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Reading Air & Earth Together</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Swords show your mental approach</li>
                    <li>• Pentacles reveal material outcomes</li>
                    <li>• Both suits deal with mastery and skill</li>
                    <li>• Balance thinking with practical action</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Court Cards
        return (
          <div className="space-y-8">
            <HeroCard
              icon="👥"
              title="The Court Cards: People & Personalities"
              description="The 16 Court Cards represent different personality types, maturity levels, and approaches to life. They can represent actual people in your life or aspects of your own personality that you're developing or need to embody."
              backgroundColor="#f0e3ff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Four Court Card Ranks</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Pages & Knights (Youth Energy)</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Pages:</strong> Students, messengers, new beginnings</li>
                    <li>• <strong>Knights:</strong> Action-oriented, adventurous, extreme</li>
                    <li>• Represent learning and exploration phases</li>
                    <li>• Often immature but full of potential</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Queens & Kings (Mature Energy)</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Queens:</strong> Nurturing, intuitive, inward mastery</li>
                    <li>• <strong>Kings:</strong> Authoritative, outward mastery, leadership</li>
                    <li>• Represent mastery and wisdom</li>
                    <li>• Balanced expression of their element</li>
                  </ul>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="The Court Card Personalities"
              subtitle="How each rank expresses through the four elements"
              items={[
                { symbol: "🔥👶", name: "Page of Wands", description: "Enthusiastic student, creative messages, new inspiration" },
                { symbol: "🔥🏃", name: "Knight of Wands", description: "Impulsive action, adventure, reckless courage" },
                { symbol: "🔥👸", name: "Queen of Wands", description: "Confident leader, warm encouragement, creative mastery" },
                { symbol: "🔥👑", name: "King of Wands", description: "Visionary leader, entrepreneurial, charismatic authority" },
                { symbol: "🌊👶", name: "Page of Cups", description: "Emotional sensitivity, artistic inspiration, intuitive messages" },
                { symbol: "🌊🏃", name: "Knight of Cups", description: "Romantic dreamer, emotional quests, idealistic pursuit" },
                { symbol: "🌊👸", name: "Queen of Cups", description: "Emotional intelligence, compassionate healing, psychic intuition" },
                { symbol: "🌊👑", name: "King of Cups", description: "Emotional mastery, diplomatic leadership, calm wisdom" },
                { symbol: "⚔️👶", name: "Page of Swords", description: "Curious mind, mental agility, truth-seeking" },
                { symbol: "⚔️🏃", name: "Knight of Swords", description: "Mental focus, direct communication, cutting through illusion" },
                { symbol: "⚔️👸", name: "Queen of Swords", description: "Clear thinking, honest communication, independent wisdom" },
                { symbol: "⚔️👑", name: "King of Swords", description: "Intellectual authority, fair judgment, mental mastery" },
                { symbol: "🪙👶", name: "Page of Pentacles", description: "Practical learning, new opportunities, study" },
                { symbol: "🪙🏃", name: "Knight of Pentacles", description: "Methodical work, reliability, steady progress" },
                { symbol: "🪙👸", name: "Queen of Pentacles", description: "Practical wisdom, nurturing provider, resource management" },
                { symbol: "🪙👑", name: "King of Pentacles", description: "Material success, generous leadership, business mastery" }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Reading Court Cards</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">As People in Your Life</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Consider their elemental nature and maturity level</li>
                    <li>• Look at their approach to life and challenges</li>
                    <li>• Notice their gifts and potential blind spots</li>
                    <li>• Understand how they might influence your situation</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">As Aspects of Yourself</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Which court card qualities do you need to develop?</li>
                    <li>• What aspects of your personality are highlighted?</li>
                    <li>• How mature is your expression of this element?</li>
                    <li>• What lessons is this archetype teaching you?</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Developing Your Inner Court"
              description="How to work with Court Cards for personal development"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The Court Cards represent different aspects of maturity and mastery within each element. You might be a King of Pentacles in your career (skilled and successful) while being a Page of Cups in relationships (still learning about emotional intimacy).
                </p>
                <p className="leading-relaxed">
                  Working with Court Cards helps you understand your current level of development in different areas of life and shows you what qualities to develop next. They provide models for growth and remind you that mastery is a journey, not a destination.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Practical Application
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Mastering Minor Arcana Reading"
              description="Practical techniques for interpreting the Minor Arcana in readings"
              items={[
                {
                  number: 1,
                  title: "Identify the Element",
                  description: "Start by understanding which element dominates your reading and what this suggests"
                },
                {
                  number: 2,
                  title: "Notice the Numbers",
                  description: "Look at the numerical progression to understand the stage of development"
                },
                {
                  number: 3,
                  title: "Interpret Court Cards",
                  description: "Determine if court cards represent people, personality aspects, or approaches to take"
                },
                {
                  number: 4,
                  title: "Synthesize the Story",
                  description: "Combine elements, numbers, and court cards to create a cohesive narrative"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Elemental Combinations in Readings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Dominant Elements</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Mostly Wands:</strong> Action, creativity, passion needed</li>
                    <li>• <strong>Mostly Cups:</strong> Emotional healing, relationships, intuition</li>
                    <li>• <strong>Mostly Swords:</strong> Mental clarity, communication, truth</li>
                    <li>• <strong>Mostly Pentacles:</strong> Practical action, material focus</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Missing Elements</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>No Wands:</strong> Lack of passion or motivation</li>
                    <li>• <strong>No Cups:</strong> Emotional disconnection or avoidance</li>
                    <li>• <strong>No Swords:</strong> Unclear thinking or poor communication</li>
                    <li>• <strong>No Pentacles:</strong> Lack of practical grounding</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Minor Arcana Reading Practice</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Three-Card Practice Reading</h5>
                  </div>
                  <div className="space-y-2">
                    <p className="text-black text-sm"><strong>Card 1 (Situation):</strong> _______________</p>
                    <p className="text-black text-sm"><strong>Card 2 (Action):</strong> _______________</p>
                    <p className="text-black text-sm"><strong>Card 3 (Outcome):</strong> _______________</p>
                    <p className="text-black text-sm"><strong>Dominant Element:</strong> _______________</p>
                    <p className="text-black text-sm"><strong>Key Message:</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      What story do these cards tell together?
                    </div>
                    <p className="text-black text-sm"><strong>Practical Action:</strong></p>
                    <div className="border border-gray-300 p-2 h-12 text-sm text-gray-500">
                      What specific step can you take based on this reading?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Deepening Your Minor Arcana Practice"
              description="Advanced techniques for mastering the everyday wisdom of the Minor Arcana"
              steps={[
                {
                  number: 1,
                  title: "Study Elemental Astrology",
                  description: "Learn how each Minor Arcana card connects to specific astrological placements"
                },
                {
                  number: 2,
                  title: "Practice Daily Draws",
                  description: "Draw one Minor Arcana card daily and observe how it manifests in your day"
                },
                {
                  number: 3,
                  title: "Develop Court Card Relationships",
                  description: "Identify which court cards represent people in your life and practice reading their energy"
                },
                {
                  number: 4,
                  title: "Create Elemental Spreads",
                  description: "Design spreads that explore balance between the four elements in your life"
                },
                {
                  number: 5,
                  title: "Integrate with Major Arcana",
                  description: "Learn to read Major and Minor Arcana together for complete guidance"
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
      title: "Practice Tarot Reading",
      description: "Test your Minor Arcana knowledge with our interactive tarot learning game and improve your reading skills.",
      href: "/guides/tarot-learning",
      linkText: "Practice Now",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Learn Tarot Fundamentals",
      description: "Master the basics of tarot reading with our comprehensive guide to cards, spreads, and intuition.",
      href: "/guides/tarot-fundamentals",
      linkText: "Learn Basics",
      backgroundColor: "#f2e356"
    }
  };

  return (
    <GuideTemplate 
      guide={guide} 
      quickActions={quickActions}
    />
  );
}