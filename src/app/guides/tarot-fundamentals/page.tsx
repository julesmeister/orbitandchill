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

export default function TarotFundamentalsGuidePage() {
  const guide = {
    id: 'tarot-fundamentals',
    title: 'Tarot Fundamentals: Cards, Spreads, and Intuition',
    description: 'Master the essential skills of tarot reading. Learn to choose decks, interpret cards, create spreads, and develop your intuitive abilities for accurate and meaningful readings.',
    level: 'beginner' as const,
    estimatedTime: '50 min',
    sections: [
      {
        id: 'intro',
        title: 'Getting Started with Tarot',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'reading-basics',
        title: 'Reading Fundamentals',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'spreads-layouts',
        title: 'Spreads and Layouts',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'intuitive-reading',
        title: 'Developing Intuition',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-skills',
        title: 'Building Your Practice',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Getting Started with Tarot
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔮"
              title="Your Journey into Tarot"
              description="Tarot is a powerful tool for self-reflection, guidance, and personal growth. Whether you're seeking clarity about a specific situation or exploring your inner wisdom, tarot provides a structured way to access your intuition and gain deeper insights."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="What You Need to Know"
              items={[
                {
                  icon: "🎴",
                  title: "78 Cards, Infinite Wisdom",
                  description: "Each tarot deck contains 78 cards with rich symbolism and meaning"
                },
                {
                  icon: "🔍",
                  title: "Mirror, Not Fortune Teller",
                  description: "Tarot reflects your current energy and potential paths, not fixed fate"
                },
                {
                  icon: "🧠",
                  title: "Intuition + Knowledge",
                  description: "Combine card meanings with your intuitive insights for accurate readings"
                },
                {
                  icon: "📚",
                  title: "Practice Makes Perfect",
                  description: "Regular practice develops your reading skills and intuitive abilities"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Choosing Your First Deck</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Popular Beginner Decks</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Rider-Waite-Smith:</strong> Classic imagery, widely studied</li>
                    <li>• <strong>Modern Witch:</strong> Contemporary, inclusive artwork</li>
                    <li>• <strong>Everyday Tarot:</strong> Simple, accessible designs</li>
                    <li>• <strong>Radiant Rider-Waite:</strong> Enhanced colors, clear symbols</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">What to Look For</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Images that speak to you intuitively</li>
                    <li>• Clear, detailed artwork you can study</li>
                    <li>• Good quality cardstock that shuffles well</li>
                    <li>• Comprehensive guidebook included</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Common Tarot Myths Debunked</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">❌</div>
                  <div className="text-black text-sm">
                    <strong>Myth:</strong> You must be "gifted" to read tarot. <strong>Truth:</strong> Anyone can learn with practice and study.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">❌</div>
                  <div className="text-black text-sm">
                    <strong>Myth:</strong> Tarot predicts a fixed future. <strong>Truth:</strong> Tarot shows current energy and potential outcomes.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">❌</div>
                  <div className="text-black text-sm">
                    <strong>Myth:</strong> Someone else must buy your first deck. <strong>Truth:</strong> Choose your own deck based on personal connection.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">❌</div>
                  <div className="text-black text-sm">
                    <strong>Myth:</strong> Tarot is connected to dark forces. <strong>Truth:</strong> Tarot is a tool for self-reflection and personal growth.
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Setting Your Intention"
              description="How to approach tarot reading with the right mindset"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Tarot works best when approached with respect, openness, and clear intention. Before each reading, take a moment to center yourself and clarify what you're seeking guidance about. This isn't about predicting the future, but about gaining insight into your current situation and potential paths forward.
                </p>
                <p className="leading-relaxed">
                  Remember that you are the ultimate authority in your life. Tarot provides perspective and wisdom, but you make the final decisions about your path. Use the cards as a tool for reflection and empowerment, not as a crutch for avoiding personal responsibility.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Reading Fundamentals
        return (
          <div className="space-y-8">
            <HeroCard
              icon="📖"
              title="The Art of Interpretation"
              description="Reading tarot is both an art and a skill. It combines knowledge of traditional card meanings with intuitive interpretation and the ability to weave individual cards into a cohesive narrative that provides meaningful guidance."
              backgroundColor="#6bdbff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🎯"
                title="Card Positioning"
                subtitle="Context shapes meaning"
                description="The same card can have different meanings depending on its position in a spread, surrounding cards, and the question being asked. Learn to read cards in context, not isolation."
                keyQuestions={[
                  "What position does this card occupy?",
                  "How do surrounding cards influence its meaning?",
                  "What aspect of the question does this address?",
                  "Is this card upright or reversed?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🔄"
                title="Reversed Cards"
                subtitle="Shadow and internal aspects"
                description="Reversed cards can indicate blocked energy, internal processes, or the shadow side of a card's meaning. They're not necessarily negative - they add nuance to readings."
                keyQuestions={[
                  "What energy is being blocked or internalized?",
                  "What shadow aspect needs attention?",
                  "How can this energy be rebalanced?",
                  "What internal work is needed?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <SymbolGrid
              title="Reading Techniques"
              subtitle="Essential skills for accurate tarot interpretation"
              items={[
                { symbol: "👁️", name: "Visual Analysis", description: "Study the imagery, colors, and symbols in each card" },
                { symbol: "📚", name: "Traditional Meanings", description: "Learn established interpretations for each card" },
                { symbol: "🎭", name: "Storytelling", description: "Connect cards to create a narrative flow" },
                { symbol: "💡", name: "Intuitive Insights", description: "Trust your first impressions and gut feelings" },
                { symbol: "🤝", name: "Querent Connection", description: "Relate card meanings to the person's situation" },
                { symbol: "⚖️", name: "Balanced Perspective", description: "Present both challenges and opportunities" }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Reading Process</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Before the Reading</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Set clear intention and question</li>
                    <li>• Create sacred space and calm environment</li>
                    <li>• Connect with your deck through shuffling</li>
                    <li>• Ground yourself and center your energy</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">During the Reading</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Observe first impressions of each card</li>
                    <li>• Consider position meanings and card relationships</li>
                    <li>• Look for patterns and recurring themes</li>
                    <li>• Trust your intuitive insights</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">After the Reading</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Summarize key messages and guidance</li>
                    <li>• Suggest practical next steps</li>
                    <li>• Journal about insights and impressions</li>
                    <li>• Thank the cards and close the space</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Developing Your Reading Style"
              description="How to find your unique approach to tarot interpretation"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Every tarot reader develops their own style and approach over time. Some focus heavily on traditional meanings, while others rely more on intuitive interpretation. Some prefer detailed, analytical readings, while others offer brief, focused insights.
                </p>
                <p className="leading-relaxed">
                  The key is to start with solid fundamentals - learn the traditional meanings, understand card relationships, and practice regularly. As you gain experience, you'll naturally develop your own voice and approach that feels authentic and effective for you.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // Spreads and Layouts
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🎲"
              title="The Language of Layouts"
              description="Tarot spreads are structured layouts that organize cards to answer specific questions or explore different aspects of a situation. Each position in a spread has a specific meaning, creating a framework for interpretation."
              backgroundColor="#51bd94"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🎯"
                title="One-Card Pulls"
                subtitle="Simple daily guidance"
                description="The simplest and most versatile spread. Perfect for daily guidance, quick questions, or when you need focused insight on a specific topic."
                keyQuestions={[
                  "What do I need to know today?",
                  "What energy should I embody?",
                  "What is the essence of this situation?",
                  "What guidance do I most need right now?"
                ]}
                backgroundColor="#f2e356"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🔺"
                title="Three-Card Spreads"
                subtitle="Past-Present-Future and more"
                description="Versatile three-card layouts can represent time (past-present-future), decision-making (situation-action-outcome), or any three-part framework."
                keyQuestions={[
                  "How did I get here? Where am I now? Where am I going?",
                  "What's the situation? What should I do? What's the likely outcome?",
                  "Mind-Body-Spirit? Problem-Action-Solution?",
                  "What three aspects need attention?"
                ]}
                backgroundColor="#ff91e9"
                className=""
              />
            </div>

            <SymbolGrid
              title="Popular Tarot Spreads"
              subtitle="Essential layouts for different types of questions"
              items={[
                { symbol: "📅", name: "Daily Draw", description: "Single card for daily guidance and focus" },
                { symbol: "🔄", name: "Past-Present-Future", description: "Three cards showing timeline and trajectory" },
                { symbol: "❤️", name: "Love Triangle", description: "You-Partner-Relationship dynamic" },
                { symbol: "💼", name: "Career Cross", description: "Current job-skills-obstacles-outcome" },
                { symbol: "🌟", name: "Celtic Cross", description: "Comprehensive 10-card life situation reading" },
                { symbol: "🎯", name: "Decision Making", description: "Option A-Option B-Likely outcome format" },
                { symbol: "🌙", name: "New Moon", description: "Release-Intention-Action-Manifestation" },
                { symbol: "🎭", name: "Shadow Work", description: "Conscious-Unconscious-Integration-Growth" }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Celtic Cross Spread</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Positions 1-6: The Cross</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>1. Present situation:</strong> Current circumstances</li>
                    <li>• <strong>2. Challenge/Cross:</strong> What you're dealing with</li>
                    <li>• <strong>3. Distant past:</strong> Foundation of the situation</li>
                    <li>• <strong>4. Recent past:</strong> Recent influences</li>
                    <li>• <strong>5. Possible outcome:</strong> What might happen</li>
                    <li>• <strong>6. Near future:</strong> Immediate next steps</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Positions 7-10: The Staff</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>7. Your approach:</strong> How you're handling things</li>
                    <li>• <strong>8. External influences:</strong> Others' impact on situation</li>
                    <li>• <strong>9. Hopes and fears:</strong> Your internal landscape</li>
                    <li>• <strong>10. Final outcome:</strong> Most likely result</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Creating Your Own Spreads</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">1</div>
                  <div className="text-black text-sm">
                    <strong>Define your question:</strong> What specific area of life or situation do you want to explore?
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">2</div>
                  <div className="text-black text-sm">
                    <strong>Identify key aspects:</strong> What different angles or components need exploration?
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">3</div>
                  <div className="text-black text-sm">
                    <strong>Create position meanings:</strong> Assign a specific focus to each card position.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">4</div>
                  <div className="text-black text-sm">
                    <strong>Test and refine:</strong> Try your spread multiple times and adjust as needed.
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Choosing the Right Spread"
              description="How to match spreads to questions and situations"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The spread you choose should match the complexity of your question and the depth of insight you're seeking. Simple questions often need simple spreads, while complex life situations may benefit from more elaborate layouts.
                </p>
                <p className="leading-relaxed">
                  Start with one-card and three-card spreads until you're comfortable with basic interpretation. As you gain experience, you can work with more complex spreads like the Celtic Cross or create your own custom layouts for specific situations.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Developing Intuition
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔮"
              title="Awakening Your Inner Knowing"
              description="Intuition is your innate ability to know things without logical reasoning. In tarot reading, intuition bridges the gap between memorized card meanings and meaningful, personalized guidance that speaks directly to the situation at hand."
              backgroundColor="#f2e356"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="👁️"
                title="Visual Intuition"
                subtitle="What jumps out at you?"
                description="Before looking up card meanings, spend time observing each card's imagery. Notice what draws your eye, what emotions arise, and what stories the symbols tell you."
                keyQuestions={[
                  "What do I notice first in this card?",
                  "What emotions does this image evoke?",
                  "What story is this card telling me?",
                  "How does this connect to the question?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="💭"
                title="Felt Sense"
                subtitle="Body wisdom and emotional knowing"
                description="Pay attention to physical sensations, emotional responses, and energetic shifts when you look at cards. Your body often knows the answer before your mind does."
                keyQuestions={[
                  "How does my body feel when I see this card?",
                  "What emotions arise spontaneously?",
                  "Does this card feel heavy or light?",
                  "What energy does this card carry?"
                ]}
                backgroundColor="#ff91e9"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Developing Your Intuitive Abilities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Daily Practices</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Morning meditation and centering</li>
                    <li>• Journaling first impressions of cards</li>
                    <li>• Practicing with one-card daily draws</li>
                    <li>• Paying attention to synchronicities</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Intuition Exercises</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Blind card reading (feel before looking)</li>
                    <li>• Symbol association games</li>
                    <li>• Storytelling with random cards</li>
                    <li>• Trusting first impressions</li>
                  </ul>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="Types of Intuitive Information"
              subtitle="Different ways intuition communicates through tarot"
              items={[
                { symbol: "👁️", name: "Visual", description: "Images, symbols, colors that stand out or appear in your mind" },
                { symbol: "👂", name: "Auditory", description: "Words, phrases, or sounds that come to mind" },
                { symbol: "🤚", name: "Kinesthetic", description: "Physical sensations, energy shifts, or bodily feelings" },
                { symbol: "💭", name: "Emotional", description: "Feelings, moods, or emotional responses to cards" },
                { symbol: "🧠", name: "Cognitive", description: "Sudden knowing, insights, or understanding" },
                { symbol: "🌟", name: "Spiritual", description: "Connection to higher guidance or universal wisdom" }
              ]}
              backgroundColor="#f0e3ff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Overcoming Intuitive Blocks</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🚫</div>
                  <div className="text-black text-sm">
                    <strong>Overthinking:</strong> Trust your first impression rather than analyzing every detail.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">😰</div>
                  <div className="text-black text-sm">
                    <strong>Fear of being wrong:</strong> There's no "wrong" in intuitive reading - only different perspectives.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">📚</div>
                  <div className="text-black text-sm">
                    <strong>Over-reliance on books:</strong> Balance traditional meanings with personal insights.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">⚡</div>
                  <div className="text-black text-sm">
                    <strong>Rushing:</strong> Take time to connect with each card before moving to the next.
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Balancing Knowledge and Intuition"
              description="How to integrate traditional meanings with intuitive insights"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The best tarot readers combine solid knowledge of traditional card meanings with strong intuitive abilities. Start by learning the established meanings, then practice adding your own insights and impressions to create richer, more personalized readings.
                </p>
                <p className="leading-relaxed">
                  Remember that intuition is a skill that develops over time. Don't worry if you don't feel "psychic" immediately - most intuitive information comes through subtle impressions rather than dramatic visions. Trust the process and keep practicing.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Building Your Practice
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Building Your Tarot Practice"
              description="Essential steps for developing consistent and effective tarot reading skills"
              items={[
                {
                  number: 1,
                  title: "Establish a Daily Practice",
                  description: "Draw one card each morning and reflect on how it manifests throughout your day"
                },
                {
                  number: 2,
                  title: "Keep a Tarot Journal",
                  description: "Record your readings, insights, and observations to track your growth"
                },
                {
                  number: 3,
                  title: "Practice with Different Questions",
                  description: "Explore various types of questions and situations to broaden your skills"
                },
                {
                  number: 4,
                  title: "Study and Share",
                  description: "Continue learning and practice with friends or online communities"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Reading Ethics and Boundaries</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Healthy Boundaries</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Don't read for others without permission</li>
                    <li>• Avoid reading about people not present</li>
                    <li>• Don't make medical or legal predictions</li>
                    <li>• Respect others' privacy and boundaries</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Empowering Approach</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Focus on guidance, not fixed predictions</li>
                    <li>• Encourage personal responsibility</li>
                    <li>• Present options rather than ultimatums</li>
                    <li>• Support positive change and growth</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Tarot Reading Checklist</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Before Reading</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Clear intention and question formulated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Quiet, sacred space prepared</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Deck shuffled and connected with</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Mind centered and open</span>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-2 pt-4">
                    <h5 className="font-space-grotesk font-bold text-black">During Reading</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">First impressions noted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Position meanings considered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Card relationships explored</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-black text-sm">Intuitive insights included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Advancing Your Tarot Journey"
              description="How to continue growing as a tarot reader"
              steps={[
                {
                  number: 1,
                  title: "Explore Different Decks",
                  description: "Try various tarot decks to find ones that resonate with your style and expand your perspective"
                },
                {
                  number: 2,
                  title: "Study Advanced Techniques",
                  description: "Learn about card combinations, timing methods, and specialized spreads for different situations"
                },
                {
                  number: 3,
                  title: "Practice with Others",
                  description: "Read for friends and family to gain experience with different personalities and questions"
                },
                {
                  number: 4,
                  title: "Join a Community",
                  description: "Connect with other tarot readers through online forums, local groups, or classes"
                },
                {
                  number: 5,
                  title: "Integrate with Other Studies",
                  description: "Combine tarot with astrology, numerology, or other divination systems for deeper insights"
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
      description: "Test your skills with our interactive tarot learning game and practice interpreting cards in different scenarios.",
      href: "/guides/tarot-learning",
      linkText: "Start Practicing",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Explore Tarot & Astrology",
      description: "Deepen your understanding by learning how tarot cards connect to astrological symbols and meanings.",
      href: "/guides/tarot-astrology",
      linkText: "Learn Integration",
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