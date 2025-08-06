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

export default function DestinyMatrixGuidePage() {
  const guide = {
    id: 'destiny-matrix',
    title: 'Destiny Matrix: Your Sacred Numerological Blueprint',
    description: 'Unlock the power of the Destiny Matrix system to discover your life purpose, karmic lessons, and soul\'s journey through the ancient wisdom of numerology and sacred geometry.',
    level: 'intermediate' as const,
    estimatedTime: '60 min',
    sections: [
      {
        id: 'intro',
        title: 'Understanding Destiny Matrix',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'core-numbers',
        title: 'Your Core Energy Centers',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'matrix-structure',
        title: 'The Sacred Geometry',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'life-paths',
        title: 'Life Paths & Karmic Lessons',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-application',
        title: 'Living Your Matrix',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // Understanding Destiny Matrix
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔷"
              title="The Sacred Code of Your Soul"
              description="The Destiny Matrix is a powerful numerological system that reveals your soul's blueprint through birth date calculations. Based on the 22 Major Arcana energies, it maps your life purpose, talents, challenges, and karmic path through a sacred geometric pattern."
              backgroundColor="#6bdbff"
            />

            <InfoGrid
              title="Why Destiny Matrix Matters"
              items={[
                {
                  icon: "🎯",
                  title: "Life Purpose Clarity",
                  description: "Discover your soul's mission and the unique gifts you're meant to share"
                },
                {
                  icon: "🔄",
                  title: "Karmic Understanding",
                  description: "Understand past life patterns and current life lessons for spiritual growth"
                },
                {
                  icon: "💎",
                  title: "Hidden Talents",
                  description: "Uncover dormant abilities and potential waiting to be activated"
                },
                {
                  icon: "🗺️",
                  title: "Life Navigation",
                  description: "Get a roadmap for major life cycles and transformational periods"
                }
              ]}
              backgroundColor="#f2e356"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The 22 Archetypal Energies</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Based on Major Arcana</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Each number 1-22 corresponds to a Major Arcana card</li>
                    <li>• Numbers represent archetypal life energies</li>
                    <li>• Your birth date activates specific energies</li>
                    <li>• Creates unique soul blueprint</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Sacred Geometry</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Matrix forms octagonal sacred pattern</li>
                    <li>• Eight points represent life areas</li>
                    <li>• Center holds soul essence</li>
                    <li>• Lines show energy flow and connections</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Matrix Structure"
              description="Eight sacred points forming your destiny blueprint"
              points={[
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "1", description: "Soul Purpose" },
                { position: "top-1/4 right-0 transform translate-x-4", label: "2", description: "Talents" },
                { position: "bottom-1/4 right-0 transform translate-x-4", label: "3", description: "Karma" },
                { position: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4", label: "4", description: "Foundation" },
                { position: "bottom-1/4 left-0 transform -translate-x-4", label: "5", description: "Shadow" },
                { position: "top-1/4 left-0 transform -translate-x-4", label: "6", description: "Resources" },
                { position: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", label: "C", description: "Center/Soul" }
              ]}
            />

            <IntegrationCard
              title="Your Birth Date as Sacred Code"
              description="How your birth date reveals your soul's blueprint"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  In the Destiny Matrix system, your birth date is not random but a sacred code chosen by your soul. Each number in your date of birth - day, month, and year - carries specific archetypal energy that shapes your life path, personality, and spiritual journey.
                </p>
                <p className="leading-relaxed">
                  The system uses reduction to bring all numbers to the 1-22 range, corresponding to the Major Arcana. These numbers are then placed in specific positions within the matrix, creating a unique pattern that serves as your personal mandala and life guide.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Your Core Energy Centers
        return (
          <div className="space-y-8">
            <HeroCard
              icon="💫"
              title="The Eight Sacred Points"
              description="Your Destiny Matrix contains eight primary energy centers plus a soul center. Each position holds specific significance for your life journey, revealing different aspects of your purpose, challenges, and gifts."
              backgroundColor="#51bd94"
            />

            <SymbolGrid
              title="Primary Matrix Positions"
              subtitle="The eight points of your destiny star"
              items={[
                { symbol: "👑", name: "Point 1: Crown Purpose", description: "Your highest spiritual mission and life purpose" },
                { symbol: "🎁", name: "Point 2: Natural Talents", description: "Innate gifts and abilities you're born with" },
                { symbol: "🔄", name: "Point 3: Karmic Lessons", description: "Past life patterns to resolve and transform" },
                { symbol: "🏠", name: "Point 4: Root Foundation", description: "Material world mastery and grounding energy" },
                { symbol: "🌑", name: "Point 5: Shadow Work", description: "Hidden aspects requiring integration" },
                { symbol: "💰", name: "Point 6: Resources", description: "How you attract and manage energy/money" },
                { symbol: "❤️", name: "Point 7: Relationships", description: "Love patterns and partnership dynamics" },
                { symbol: "🌟", name: "Point 8: Social Mission", description: "Your role in collective consciousness" }
              ]}
              backgroundColor="#f0e3ff"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🎯"
                title="Center Point"
                subtitle="Your Soul Essence"
                description="The center of your matrix holds your core soul energy - the essential vibration you carry throughout life. This is your spiritual DNA and deepest truth."
                keyQuestions={[
                  "What is my soul's core vibration?",
                  "How do I express my authentic self?",
                  "What energy do I radiate naturally?",
                  "How can I stay centered in my truth?"
                ]}
                backgroundColor="#f2e356"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🔗"
                title="Energy Lines"
                subtitle="Sacred Connections"
                description="The lines connecting your matrix points show energy flow and life themes. They reveal how different areas of your life influence each other and create patterns."
                keyQuestions={[
                  "How do my talents serve my purpose?",
                  "What connects my karma to my resources?",
                  "How does shadow work affect relationships?",
                  "Where is energy blocked or flowing?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Calculating Your Numbers</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Basic Calculation</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Day:</strong> If born on 23rd = 2+3 = 5</li>
                    <li>• <strong>Month:</strong> November (11) = 11</li>
                    <li>• <strong>Year:</strong> 1990 = 1+9+9+0 = 19</li>
                    <li>• Numbers 1-22 stay as is</li>
                    <li>• Numbers &gt;22 reduce again</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Matrix Placement</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Day number → Point 1 (Purpose)</li>
                    <li>• Month number → Point 2 (Talents)</li>
                    <li>• Year number → Point 3 (Karma)</li>
                    <li>• Combined calculations fill remaining points</li>
                    <li>• Center = special soul calculation</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Understanding Your Numbers"
              description="How to interpret the energies in your matrix"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Each number in your Destiny Matrix corresponds to a Major Arcana card and its archetypal energy. For example, if you have 5 in your Purpose position, you carry The Hierophant energy - teaching, tradition, and spiritual guidance are central to your life mission.
                </p>
                <p className="leading-relaxed">
                  The key is understanding both the light and shadow aspects of each number. A 16 (The Tower) in your karma position might indicate past life traumas around sudden change, but also the power to help others through transformation.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // The Sacred Geometry
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔺"
              title="Sacred Patterns of Destiny"
              description="The Destiny Matrix forms sacred geometric patterns that reveal the flow of energy through your life. Understanding these patterns helps you work with cosmic forces rather than against them."
              backgroundColor="#f0e3ff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Three Sacred Triangles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Spirit Triangle</h4>
                  <p className="text-black text-sm mb-2">Points 1, 2, 8</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Your spiritual mission</li>
                    <li>• How talents serve purpose</li>
                    <li>• Impact on collective</li>
                    <li>• Higher calling activation</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Matter Triangle</h4>
                  <p className="text-black text-sm mb-2">Points 4, 5, 6</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Material world mastery</li>
                    <li>• Shadow integration</li>
                    <li>• Resource management</li>
                    <li>• Earthly success patterns</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Soul Triangle</h4>
                  <p className="text-black text-sm mb-2">Points 3, 7, Center</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Karmic healing work</li>
                    <li>• Relationship patterns</li>
                    <li>• Soul essence expression</li>
                    <li>• Past-present integration</li>
                  </ul>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="Energy Flow Patterns"
              subtitle="How energy moves through your matrix"
              items={[
                { symbol: "↻", name: "Clockwise Flow", description: "Natural evolution and growth direction" },
                { symbol: "↺", name: "Counter-Clockwise", description: "Reflection and integration direction" },
                { symbol: "↕️", name: "Vertical Axis", description: "Spirit to matter, heaven to earth connection" },
                { symbol: "↔️", name: "Horizontal Axis", description: "Past to future, karma to dharma flow" },
                { symbol: "✕", name: "Diagonal Lines", description: "Integration of opposites and balance" },
                { symbol: "⊕", name: "Center Point", description: "Still point where all energies meet" }
              ]}
              backgroundColor="#51bd94"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Life Cycles in the Matrix</h3>
              <div className="space-y-4">
                <p className="text-black text-sm mb-4">Your Destiny Matrix reveals three major life cycles:</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-black p-4">
                    <h4 className="font-space-grotesk font-bold text-black mb-2">First Cycle (0-30)</h4>
                    <p className="text-black text-sm">Formation Period</p>
                    <ul className="text-black text-sm space-y-1 mt-2">
                      <li>• Discovering talents</li>
                      <li>• Early karmic lessons</li>
                      <li>• Building foundation</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-black p-4">
                    <h4 className="font-space-grotesk font-bold text-black mb-2">Second Cycle (30-60)</h4>
                    <p className="text-black text-sm">Manifestation Period</p>
                    <ul className="text-black text-sm space-y-1 mt-2">
                      <li>• Living your purpose</li>
                      <li>• Shadow integration</li>
                      <li>• Creating legacy</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-black p-4">
                    <h4 className="font-space-grotesk font-bold text-black mb-2">Third Cycle (60+)</h4>
                    <p className="text-black text-sm">Wisdom Period</p>
                    <ul className="text-black text-sm space-y-1 mt-2">
                      <li>• Sharing wisdom</li>
                      <li>• Spiritual mastery</li>
                      <li>• Soul completion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Working with Sacred Geometry"
              description="How to use the geometric patterns for growth"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The geometric patterns in your Destiny Matrix are not just symbolic - they represent actual energy flows in your life. When you understand which triangle is activated during different periods, you can focus your efforts more effectively.
                </p>
                <p className="leading-relaxed">
                  For example, if you're in a Spirit Triangle activation (focusing on purpose, talents, and social mission), trying to force material success might feel frustrating. Instead, align with the spiritual growth happening and trust that material rewards will follow.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Life Paths & Karmic Lessons
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌀"
              title="Your Karmic Journey"
              description="The Destiny Matrix reveals not just your current life purpose but also karmic patterns from past lives that influence your present journey. Understanding these patterns helps you break free from limiting cycles and embrace your highest potential."
              backgroundColor="#ff91e9"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🔄"
                title="Karmic Debts"
                subtitle="Past patterns to resolve"
                description="Position 3 and its connections show karmic debts - unresolved energies from past lives that create recurring challenges until consciously addressed and transformed."
                keyQuestions={[
                  "What patterns keep repeating in my life?",
                  "Which fears seem irrational but persistent?",
                  "What comes too easily or too hard?",
                  "Where do I feel stuck or blocked?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="✨"
                title="Dharmic Gifts"
                subtitle="Soul talents to share"
                description="Positions 1 and 2 reveal your dharma - the positive karma and soul gifts you've earned through past life experiences, ready to be shared in this lifetime."
                keyQuestions={[
                  "What abilities feel ancient and familiar?",
                  "Which skills came naturally from childhood?",
                  "How can I serve others effortlessly?",
                  "What is my soul here to contribute?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Common Karmic Patterns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Karmic Numbers & Themes</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>13 (Death):</strong> Fear of change, transformation karma</li>
                    <li>• <strong>15 (Devil):</strong> Material attachment, power misuse</li>
                    <li>• <strong>16 (Tower):</strong> Sudden loss trauma, ego destruction</li>
                    <li>• <strong>18 (Moon):</strong> Illusion, deception, psychic wounds</li>
                    <li>• <strong>12 (Hanged Man):</strong> Sacrifice, martyrdom patterns</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Dharmic Numbers & Gifts</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>1 (Magician):</strong> Manifestation mastery</li>
                    <li>• <strong>3 (Empress):</strong> Creative abundance</li>
                    <li>• <strong>6 (Lovers):</strong> Heart wisdom</li>
                    <li>• <strong>9 (Hermit):</strong> Spiritual teaching</li>
                    <li>• <strong>11 (Justice):</strong> Karmic balance</li>
                  </ul>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="Life Path Combinations"
              subtitle="How your numbers create your unique path"
              items={[
                { symbol: "🎯", name: "Purpose + Talent", description: "Your mission supported by natural abilities" },
                { symbol: "⚖️", name: "Karma + Resources", description: "Past patterns affecting current abundance" },
                { symbol: "💑", name: "Relationships + Shadow", description: "How unconscious patterns affect partnerships" },
                { symbol: "🌟", name: "Soul + Social Mission", description: "Inner essence expressed in the world" },
                { symbol: "🏔️", name: "Foundation + Purpose", description: "Building material support for spiritual mission" },
                { symbol: "🔮", name: "All Points Integration", description: "Mastery through balancing all energies" }
              ]}
              backgroundColor="#f0e3ff"
            />

            <IntegrationCard
              title="Transforming Karma into Dharma"
              description="How to work with challenging patterns"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Every karmic challenge in your matrix is also a doorway to mastery. For example, if you have The Tower (16) in a prominent position, you may have experienced sudden upheavals. But this also gives you the power to help others navigate crisis with grace.
                </p>
                <p className="leading-relaxed">
                  The key is conscious awareness and choice. Once you recognize a karmic pattern, you can choose to respond differently. Each time you break an old pattern, you not only free yourself but also clear that karma from your lineage and collective consciousness.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Living Your Matrix
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Practical Matrix Applications"
              description="How to use your Destiny Matrix for daily guidance and life decisions"
              items={[
                {
                  number: 1,
                  title: "Calculate Your Matrix",
                  description: "Use your birth date to determine all eight points and your center number"
                },
                {
                  number: 2,
                  title: "Study Your Archetypes",
                  description: "Learn the light and shadow aspects of each number in your matrix"
                },
                {
                  number: 3,
                  title: "Identify Current Themes",
                  description: "Notice which matrix points are most active in your life right now"
                },
                {
                  number: 4,
                  title: "Create Integration Practices",
                  description: "Develop rituals and practices to balance and activate your energies"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Matrix Activation Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Daily Practices</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Morning meditation on your center number</li>
                    <li>• Journaling with archetype questions</li>
                    <li>• Tarot card study of your numbers</li>
                    <li>• Energy visualization exercises</li>
                    <li>• Mantra work with your archetypes</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Life Decisions</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Career choices aligned with purpose point</li>
                    <li>• Relationships matching your love number</li>
                    <li>• Shadow work during challenging transits</li>
                    <li>• Resource decisions based on Point 6</li>
                    <li>• Social contributions through Point 8</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Your Personal Matrix Map</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Calculate & Record Your Matrix</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-black text-sm"><strong>Birth Date:</strong> _______________</p>
                      <p className="text-black text-sm"><strong>Point 1 (Purpose):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Point 2 (Talents):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Point 3 (Karma):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Point 4 (Foundation):</strong> _____ = _____________</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-black text-sm"><strong>Point 5 (Shadow):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Point 6 (Resources):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Point 7 (Love):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Point 8 (Mission):</strong> _____ = _____________</p>
                      <p className="text-black text-sm"><strong>Center (Soul):</strong> _____ = _____________</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-black text-sm"><strong>Current Life Focus:</strong></p>
                    <div className="border border-gray-300 p-2 h-16 text-sm text-gray-500">
                      Which area of your matrix needs attention now?
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Deepening Your Matrix Journey"
              description="Advanced practices for mastering your Destiny Matrix"
              steps={[
                {
                  number: 1,
                  title: "Study Archetypal Combinations",
                  description: "Learn how your numbers interact and create unique energy patterns"
                },
                {
                  number: 2,
                  title: "Track Matrix Transits",
                  description: "Monitor when different points activate throughout the year based on numerological cycles"
                },
                {
                  number: 3,
                  title: "Create Matrix Rituals",
                  description: "Develop personal ceremonies for each point activation and life transition"
                },
                {
                  number: 4,
                  title: "Map Relationships",
                  description: "Compare matrices with partners, family, and friends to understand dynamics"
                },
                {
                  number: 5,
                  title: "Live Your Purpose",
                  description: "Make daily choices aligned with your matrix guidance and soul mission"
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
      title: "Calculate Your Matrix",
      description: "Generate your personal Destiny Matrix chart and discover your soul blueprint with our interactive calculator.",
      href: "/",
      linkText: "Calculate Now",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Learn Numerology Basics",
      description: "New to numerology? Start with understanding how numbers shape your destiny and life path.",
      href: "/guides",
      linkText: "Explore Guides",
      backgroundColor: "#f0e3ff"
    }
  };

  return (
    <GuideTemplate 
      guide={guide} 
      quickActions={quickActions}
    />
  );
}