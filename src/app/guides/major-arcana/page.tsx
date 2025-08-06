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

export default function MajorArcanaGuidePage() {
  const guide = {
    id: 'major-arcana',
    title: 'The Fool\'s Journey: Understanding the Major Arcana',
    description: 'Explore the 22 Major Arcana cards as a complete spiritual journey from innocence to wisdom. Learn the archetypal meanings and personal growth lessons of each card.',
    level: 'beginner' as const,
    estimatedTime: '45 min',
    sections: [
      {
        id: 'intro',
        title: 'The Archetypal Journey',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'early-journey',
        title: 'The Early Journey (0-7)',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'middle-journey',
        title: 'The Middle Journey (8-14)',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'final-journey',
        title: 'The Final Journey (15-21)',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'personal-application',
        title: 'Your Personal Journey',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // The Archetypal Journey
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🃏"
              title="The Universal Story"
              description="The Major Arcana tells the story of The Fool's Journey - a universal tale of spiritual growth and self-discovery. Each card represents a stage in the hero's journey from innocence to wisdom, reflecting the archetypal experiences we all face in life."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="Why the Major Arcana Matters"
              items={[
                {
                  icon: "🎭",
                  title: "Archetypal Wisdom",
                  description: "Each card represents universal human experiences and psychological patterns"
                },
                {
                  icon: "📚",
                  title: "Life Lessons",
                  description: "The journey provides guidance for personal growth and spiritual development"
                },
                {
                  icon: "🔄",
                  title: "Cyclical Nature",
                  description: "The journey is not linear - we revisit themes throughout our lives"
                },
                {
                  icon: "🌟",
                  title: "Inner Guidance",
                  description: "The cards help you recognize where you are in your personal journey"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Three Acts of The Fool's Journey</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Act I: The Material World (0-7)</h4>
                  <p className="text-black text-sm mb-2">Learning basic life skills and establishing identity</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Starting the journey with innocence</li>
                    <li>• Developing personal power and skills</li>
                    <li>• Learning about authority and structure</li>
                    <li>• Finding love and making choices</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Act II: The Emotional World (8-14)</h4>
                  <p className="text-black text-sm mb-2">Facing challenges and developing inner strength</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Building inner strength and courage</li>
                    <li>• Seeking wisdom and spiritual guidance</li>
                    <li>• Experiencing major life changes</li>
                    <li>• Finding balance and practicing moderation</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Act III: The Spiritual World (15-21)</h4>
                  <p className="text-black text-sm mb-2">Confronting shadows and achieving enlightenment</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Confronting illusions and shadow work</li>
                    <li>• Experiencing destruction and renewal</li>
                    <li>• Finding hope and spiritual guidance</li>
                    <li>• Achieving completion and cosmic consciousness</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Fool's Journey Path"
              description="The archetypal progression through the Major Arcana"
              points={[
                { position: "bottom-0 left-0 transform translate-y-4", label: "0", description: "The Fool - New beginning" },
                { position: "bottom-1/4 left-1/4 transform translate-y-2", label: "7", description: "The Chariot - Willpower" },
                { position: "top-1/2 left-1/2 transform -translate-y-1/2", label: "14", description: "Temperance - Balance" },
                { position: "top-0 right-0 transform -translate-y-4", label: "21", description: "The World - Completion" }
              ]}
            />

            <IntegrationCard
              title="Your Personal Archetypal Journey"
              description="How the Major Arcana reflects your own life experiences"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The Fool's Journey is not just an ancient story - it's a map of human psychological and spiritual development. Each card represents experiences and lessons that everyone encounters in their lifetime, though not necessarily in linear order.
                </p>
                <p className="leading-relaxed">
                  You might find yourself embodying The Hermit's introspective energy during a period of soul-searching, or experiencing The Tower's sudden changes when old structures in your life collapse. Understanding these archetypes helps you navigate life's challenges with greater wisdom and perspective.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // The Early Journey (0-7)
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌅"
              title="The Material World"
              description="The first act of The Fool's Journey focuses on establishing identity and learning basic life skills. These cards represent the foundational experiences of youth and early adulthood - taking risks, learning from mentors, and making first major choices."
              backgroundColor="#ff91e9"
            />

            <SymbolGrid
              title="Cards 0-7: Building the Foundation"
              subtitle="The archetypal experiences of early spiritual development"
              items={[
                { symbol: "0", name: "The Fool", description: "New beginnings, innocence, leap of faith, unlimited potential" },
                { symbol: "I", name: "The Magician", description: "Willpower, manifestation, skill, conscious creation" },
                { symbol: "II", name: "The High Priestess", description: "Intuition, mystery, subconscious, inner wisdom" },
                { symbol: "III", name: "The Empress", description: "Creativity, abundance, nurturing, feminine power" },
                { symbol: "IV", name: "The Emperor", description: "Authority, structure, leadership, masculine power" },
                { symbol: "V", name: "The Hierophant", description: "Tradition, spiritual guidance, conformity, established wisdom" },
                { symbol: "VI", name: "The Lovers", description: "Love, choice, relationships, moral decisions" },
                { symbol: "VII", name: "The Chariot", description: "Victory, willpower, determination, control" }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🃏"
                title="The Fool (0)"
                subtitle="The Innocent Beginning"
                description="The journey begins with The Fool - pure potential and innocent trust. This card represents new beginnings, taking leaps of faith, and the courage to step into the unknown."
                keyQuestions={[
                  "What new adventure am I beginning?",
                  "Where do I need to take a leap of faith?",
                  "How can I embrace beginner's mind?",
                  "What potential am I ready to explore?"
                ]}
                backgroundColor="#f0e3ff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🎩"
                title="The Magician (I)"
                subtitle="The Skilled Creator"
                description="The Magician represents the power of will and skill. Having learned to focus intention and use tools, The Fool now has the ability to manifest desires in the physical world."
                keyQuestions={[
                  "What skills do I need to develop?",
                  "How can I focus my willpower?",
                  "What do I want to manifest?",
                  "How can I use my talents effectively?"
                ]}
                backgroundColor="#f2e356"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Key Themes of the Early Journey</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Personal Development</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Learning to trust intuition (High Priestess)</li>
                    <li>• Developing creative abilities (Empress)</li>
                    <li>• Understanding authority and structure (Emperor)</li>
                    <li>• Receiving spiritual guidance (Hierophant)</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Life Lessons</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Making important choices (Lovers)</li>
                    <li>• Achieving victory through willpower (Chariot)</li>
                    <li>• Balancing masculine and feminine energies</li>
                    <li>• Learning to work with both material and spiritual realms</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Recognizing Your Early Journey Cards"
              description="How to identify when these archetypes are active in your life"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The early journey cards often appear during times of new beginnings, learning, and establishing your place in the world. You might encounter The Fool when starting a new job or relationship, The Magician when developing new skills, or The Lovers when facing important life decisions.
                </p>
                <p className="leading-relaxed">
                  These cards remind us that everyone starts as a beginner and that growth comes through experience, mentorship, and making conscious choices. The early journey is about building the foundation for the more challenging work ahead.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // The Middle Journey (8-14)
        return (
          <div className="space-y-8">
            <HeroCard
              icon="⚖️"
              title="The Emotional World"
              description="The middle journey represents the trials and challenges of life. Having established basic skills and identity, The Fool now faces deeper lessons about strength, wisdom, change, and balance. These cards often appear during life's most transformative periods."
              backgroundColor="#51bd94"
            />

            <SymbolGrid
              title="Cards 8-14: The Trials and Wisdom"
              subtitle="Developing inner strength and spiritual understanding"
              items={[
                { symbol: "VIII", name: "Strength", description: "Inner courage, patience, compassion, gentle power" },
                { symbol: "IX", name: "The Hermit", description: "Soul searching, inner guidance, spiritual quest, wisdom" },
                { symbol: "X", name: "Wheel of Fortune", description: "Cycles, fate, change, turning points, destiny" },
                { symbol: "XI", name: "Justice", description: "Balance, fairness, truth, karma, moral decisions" },
                { symbol: "XII", name: "The Hanged Man", description: "Surrender, new perspective, sacrifice, letting go" },
                { symbol: "XIII", name: "Death", description: "Transformation, endings, rebirth, major change" },
                { symbol: "XIV", name: "Temperance", description: "Moderation, patience, balance, healing, integration" }
              ]}
              backgroundColor="#ff91e9"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🦁"
                title="Strength (VIII)"
                subtitle="The Gentle Warrior"
                description="Strength represents not physical force, but inner courage and the ability to face challenges with compassion and patience. It's about taming the inner beast through love, not force."
                keyQuestions={[
                  "How can I show courage in difficult situations?",
                  "What inner strength do I need to develop?",
                  "How can I approach challenges with compassion?",
                  "What fears do I need to face gently?"
                ]}
                backgroundColor="#f2e356"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏮"
                title="The Hermit (IX)"
                subtitle="The Wise Seeker"
                description="The Hermit represents the need for solitude and inner reflection. This card appears when it's time to withdraw from the world to seek wisdom and spiritual guidance from within."
                keyQuestions={[
                  "What wisdom am I seeking?",
                  "How can I find guidance within myself?",
                  "What do I need to reflect on in solitude?",
                  "How can I share my wisdom with others?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Great Transformation Cards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">The Hanged Man (XII)</h4>
                  <p className="text-black text-sm mb-2">Surrender and new perspective</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Letting go of control</li>
                    <li>• Seeing situations from a new angle</li>
                    <li>• Accepting temporary sacrifice</li>
                    <li>• Finding wisdom in stillness</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Death (XIII)</h4>
                  <p className="text-black text-sm mb-2">Transformation and rebirth</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Ending old patterns and habits</li>
                    <li>• Embracing necessary change</li>
                    <li>• Releasing what no longer serves</li>
                    <li>• Preparing for new beginnings</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Temperance (XIV)</h4>
                  <p className="text-black text-sm mb-2">Balance and integration</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Finding the middle path</li>
                    <li>• Healing and patience</li>
                    <li>• Integrating opposing forces</li>
                    <li>• Practicing moderation</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Navigating the Middle Journey"
              description="How to work with the challenges and transformations of cards 8-14"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The middle journey cards often appear during life's most challenging periods - career changes, relationship transitions, health crises, or spiritual awakenings. These cards remind us that struggle and transformation are necessary parts of growth.
                </p>
                <p className="leading-relaxed">
                  When these cards appear, they encourage us to find strength in difficulty, seek wisdom in solitude, accept the cycles of change, and trust that periods of destruction lead to renewal. The middle journey teaches us that true wisdom comes through experience and surrender.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // The Final Journey (15-21)
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌟"
              title="The Spiritual World"
              description="The final journey represents the deepest spiritual lessons and ultimate integration. These cards deal with shadow work, spiritual crisis, and the achievement of cosmic consciousness. They often appear during profound spiritual transformations."
              backgroundColor="#6bdbff"
            />

            <SymbolGrid
              title="Cards 15-21: Shadow Work and Enlightenment"
              subtitle="Confronting illusions and achieving spiritual completion"
              items={[
                { symbol: "XV", name: "The Devil", description: "Temptation, bondage, illusion, shadow work, materialism" },
                { symbol: "XVI", name: "The Tower", description: "Sudden change, destruction, revelation, breakthrough" },
                { symbol: "XVII", name: "The Star", description: "Hope, healing, inspiration, spiritual guidance" },
                { symbol: "XVIII", name: "The Moon", description: "Illusion, intuition, subconscious, dreams, mystery" },
                { symbol: "XIX", name: "The Sun", description: "Joy, success, vitality, clarity, achievement" },
                { symbol: "XX", name: "Judgement", description: "Rebirth, forgiveness, calling, spiritual awakening" },
                { symbol: "XXI", name: "The World", description: "Completion, fulfillment, cosmic consciousness, unity" }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="😈"
                title="The Devil (XV)"
                subtitle="The Shadow Teacher"
                description="The Devil represents our shadow, addictions, and the illusion of being trapped. This card teaches us to recognize our chains and understand that most of our limitations are self-imposed."
                keyQuestions={[
                  "What illusions am I holding onto?",
                  "Where do I feel trapped or limited?",
                  "What addictions or unhealthy patterns need attention?",
                  "How can I reclaim my personal power?"
                ]}
                backgroundColor="#2c2c2c"
                className="border-r border-black text-white"
              />
              
              <SectionCard
                icon="🗲"
                title="The Tower (XVI)"
                subtitle="The Great Awakening"
                description="The Tower represents sudden, dramatic change that destroys false structures. While shocking, this destruction is necessary to clear the way for authentic growth and new foundations."
                keyQuestions={[
                  "What false structures in my life need to fall?",
                  "How can I embrace necessary change?",
                  "What revelations are emerging?",
                  "How can I rebuild on solid foundations?"
                ]}
                backgroundColor="#ff6b6b"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Path to Enlightenment</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">The Healing Cards (17-19)</h4>
                  <p className="text-black text-sm mb-2">Recovery and spiritual awakening</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>The Star:</strong> Hope and healing after crisis</li>
                    <li>• <strong>The Moon:</strong> Navigating illusions and dreams</li>
                    <li>• <strong>The Sun:</strong> Joy, clarity, and success</li>
                    <li>• Moving from darkness to light</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">The Completion Cards (20-21)</h4>
                  <p className="text-black text-sm mb-2">Spiritual awakening and cosmic consciousness</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Judgement:</strong> Spiritual calling and rebirth</li>
                    <li>• <strong>The World:</strong> Completion and unity</li>
                    <li>• Integration of all previous lessons</li>
                    <li>• Achievement of wholeness</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="The Return to Wholeness"
              description="How the final journey cards lead to spiritual completion and new beginnings"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The final journey cards represent the most profound spiritual work - confronting our shadow, surviving crisis, and ultimately achieving a state of integrated wholeness. These cards often appear during spiritual emergencies and breakthroughs.
                </p>
                <p className="leading-relaxed">
                  The journey culminates with The World, representing not an ending but a completion that leads to new beginnings. Having traveled the full circle, we return to the innocent wisdom of The Fool, but now with the depth of experience and spiritual understanding.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Personal Application
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Finding Your Current Position"
              description="Discover where you are in your personal Fool's Journey"
              items={[
                {
                  number: 1,
                  title: "Reflect on Your Current Life Phase",
                  description: "What major themes and challenges are you currently experiencing?"
                },
                {
                  number: 2,
                  title: "Identify Resonant Cards",
                  description: "Which Major Arcana cards feel most relevant to your current situation?"
                },
                {
                  number: 3,
                  title: "Explore the Lessons",
                  description: "What is each card trying to teach you about your current journey?"
                },
                {
                  number: 4,
                  title: "Plan Your Next Steps",
                  description: "Based on your current cards, what growth opportunities are available?"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Personal Journey Mapping</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Life Phase Indicators</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>New Beginnings:</strong> The Fool, The Magician</li>
                    <li>• <strong>Learning & Growth:</strong> High Priestess, Empress, Emperor</li>
                    <li>• <strong>Seeking Guidance:</strong> The Hierophant, The Hermit</li>
                    <li>• <strong>Major Decisions:</strong> The Lovers, Justice</li>
                    <li>• <strong>Facing Challenges:</strong> Strength, The Hanged Man</li>
                    <li>• <strong>Transformation:</strong> Death, The Tower</li>
                    <li>• <strong>Integration:</strong> Temperance, The World</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Working with Your Cards</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Meditate on the card's imagery and symbolism</li>
                    <li>• Journal about how the card's themes appear in your life</li>
                    <li>• Look for the card's lessons in your daily experiences</li>
                    <li>• Consider what the card is preparing you for</li>
                    <li>• Practice the card's positive qualities</li>
                    <li>• Seek to understand the card's shadow aspects</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Major Arcana Reflection Exercise</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Current Life Themes</h5>
                  </div>
                  <div className="space-y-2">
                    <p className="text-black text-sm"><strong>Which cards feel most relevant to your current situation?</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      List 2-3 Major Arcana cards that resonate with your current life...
                    </div>
                    <p className="text-black text-sm"><strong>What lessons are these cards teaching you?</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      Reflect on the themes and messages of your chosen cards...
                    </div>
                    <p className="text-black text-sm"><strong>How can you apply these lessons in your daily life?</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      Consider practical ways to embody the card's wisdom...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Deepening Your Major Arcana Practice"
              description="How to continue working with the archetypal wisdom of the Major Arcana"
              steps={[
                {
                  number: 1,
                  title: "Daily Card Meditation",
                  description: "Spend time each day contemplating one Major Arcana card and its relevance to your life"
                },
                {
                  number: 2,
                  title: "Journal Your Journey",
                  description: "Track which cards appear in your life and what lessons they bring"
                },
                {
                  number: 3,
                  title: "Study the Symbols",
                  description: "Deepen your understanding by researching the symbolic meanings of each card"
                },
                {
                  number: 4,
                  title: "Practice Archetypal Awareness",
                  description: "Notice how the archetypes play out in your relationships and experiences"
                },
                {
                  number: 5,
                  title: "Embrace the Cycles",
                  description: "Understand that The Fool's Journey is cyclical - you'll revisit themes throughout life"
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
      title: "Practice with Tarot Learning Game",
      description: "Test your Major Arcana knowledge with our interactive tarot learning game and climb the leaderboard.",
      href: "/guides/tarot-learning",
      linkText: "Play Game",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Explore Minor Arcana",
      description: "Continue your tarot journey by learning about the four suits and their elemental wisdom.",
      href: "/guides/minor-arcana",
      linkText: "Learn More",
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