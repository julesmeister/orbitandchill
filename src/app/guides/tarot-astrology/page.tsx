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

export default function TarotAstrologyGuidePage() {
  const guide = {
    id: 'tarot-astrology',
    title: 'Tarot & Astrology: Weaving Two Sacred Systems',
    description: 'Discover the profound connections between tarot and astrology. Learn how zodiac signs, planets, and elements correspond to tarot cards for deeper, more nuanced readings.',
    level: 'intermediate' as const,
    estimatedTime: '55 min',
    sections: [
      {
        id: 'intro',
        title: 'The Sacred Connection',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'major-arcana-astrology',
        title: 'Major Arcana & Zodiac',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'minor-arcana-astrology',
        title: 'Minor Arcana & Elements',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'court-cards-astrology',
        title: 'Court Cards & Signs',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'integrated-reading',
        title: 'Integrated Readings',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // The Sacred Connection
        return (
          <div className="space-y-8">
            <HeroCard
              icon="✨"
              title="When Stars Meet Cards"
              description="Tarot and astrology are sister systems of wisdom, each offering unique perspectives on the human experience. When combined, they create a powerful synthesis that deepens understanding and provides more nuanced guidance."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="Why Combine Tarot & Astrology?"
              items={[
                {
                  icon: "🌟",
                  title: "Layered Meaning",
                  description: "Astrological associations add depth and precision to card interpretations"
                },
                {
                  icon: "🔄",
                  title: "Timing Insights",
                  description: "Use astrological timing with tarot for when events may unfold"
                },
                {
                  icon: "🎯",
                  title: "Personality Profiling",
                  description: "Court cards align with zodiac signs for accurate character reading"
                },
                {
                  icon: "🌊",
                  title: "Elemental Wisdom",
                  description: "Both systems use the four elements as foundational principles"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Historical Connections</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Golden Dawn System</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Established in late 1800s</li>
                    <li>• Systematically linked tarot to astrology</li>
                    <li>• Created correspondences still used today</li>
                    <li>• Influenced Rider-Waite-Smith deck</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Modern Integration</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Most tarot decks include astrological symbols</li>
                    <li>• Readers combine both in practice</li>
                    <li>• Birth charts inform tarot spreads</li>
                    <li>• Tarot timing uses astrological cycles</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Four Elements Bridge"
              description="How elements connect tarot suits to astrological signs"
              points={[
                { position: "top-0 left-1/4 transform -translate-x-1/2 -translate-y-4", label: "🔥", description: "Fire: Wands/Aries, Leo, Sagittarius" },
                { position: "top-0 right-1/4 transform translate-x-1/2 -translate-y-4", label: "🌊", description: "Water: Cups/Cancer, Scorpio, Pisces" },
                { position: "bottom-0 left-1/4 transform -translate-x-1/2 translate-y-4", label: "💨", description: "Air: Swords/Gemini, Libra, Aquarius" },
                { position: "bottom-0 right-1/4 transform translate-x-1/2 translate-y-4", label: "🌍", description: "Earth: Pentacles/Taurus, Virgo, Capricorn" }
              ]}
            />

            <IntegrationCard
              title="A Unified Language of Symbols"
              description="How tarot and astrology speak the same symbolic language"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Both tarot and astrology use archetypal symbols to describe human experience. The Fool's journey through the Major Arcana mirrors the soul's journey through the zodiac. The four suits correspond perfectly to the four elements that group the twelve signs.
                </p>
                <p className="leading-relaxed">
                  Understanding these connections allows you to read with greater depth. When The Emperor appears, you're not just seeing authority - you're seeing Aries energy: pioneering leadership, initiating action, and cardinal fire. This adds layers of meaning that enrich your interpretations.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // Major Arcana & Zodiac
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌌"
              title="The Celestial Major Arcana"
              description="Each Major Arcana card corresponds to either a zodiac sign or a planet, creating a cosmic map of archetypal energies. Understanding these connections deepens your reading practice and reveals the astrological timing of life events."
              backgroundColor="#ff91e9"
            />

            <SymbolGrid
              title="Zodiac Sign Correspondences"
              subtitle="Major Arcana cards ruled by the twelve signs"
              items={[
                { symbol: "♈", name: "The Emperor (IV)", description: "Aries - Leadership, initiative, pioneering spirit" },
                { symbol: "♉", name: "The Hierophant (V)", description: "Taurus - Tradition, values, material wisdom" },
                { symbol: "♊", name: "The Lovers (VI)", description: "Gemini - Choices, duality, communication" },
                { symbol: "♋", name: "The Chariot (VII)", description: "Cancer - Emotional mastery, protection, home" },
                { symbol: "♌", name: "Strength (VIII)", description: "Leo - Courage, heart-centered power, creativity" },
                { symbol: "♍", name: "The Hermit (IX)", description: "Virgo - Analysis, perfection, service" },
                { symbol: "♎", name: "Justice (XI)", description: "Libra - Balance, fairness, relationships" },
                { symbol: "♏", name: "Death (XIII)", description: "Scorpio - Transformation, depth, regeneration" },
                { symbol: "♐", name: "Temperance (XIV)", description: "Sagittarius - Expansion, philosophy, integration" },
                { symbol: "♑", name: "The Devil (XV)", description: "Capricorn - Ambition, material world, shadow" },
                { symbol: "♒", name: "The Star (XVII)", description: "Aquarius - Hope, innovation, humanitarian ideals" },
                { symbol: "♓", name: "The Moon (XVIII)", description: "Pisces - Intuition, dreams, spiritual depths" }
              ]}
              backgroundColor="#f2e356"
            />

            <SymbolGrid
              title="Planetary Correspondences"
              subtitle="Major Arcana cards ruled by celestial bodies"
              items={[
                { symbol: "☉", name: "The Sun (XIX)", description: "Sun - Vitality, consciousness, self-expression" },
                { symbol: "☽", name: "The High Priestess (II)", description: "Moon - Intuition, subconsciousness, cycles" },
                { symbol: "☿", name: "The Magician (I)", description: "Mercury - Communication, skill, mental agility" },
                { symbol: "♀", name: "The Empress (III)", description: "Venus - Love, beauty, abundance, creativity" },
                { symbol: "♂", name: "The Tower (XVI)", description: "Mars - Sudden change, conflict, breakthrough" },
                { symbol: "♃", name: "Wheel of Fortune (X)", description: "Jupiter - Expansion, luck, cycles of growth" },
                { symbol: "♄", name: "The World (XXI)", description: "Saturn - Completion, mastery, material success" },
                { symbol: "⛢", name: "The Fool (0)", description: "Uranus - New beginnings, freedom, rebellion" },
                { symbol: "♆", name: "The Hanged Man (XII)", description: "Neptune - Surrender, spirituality, illusion" },
                { symbol: "♇", name: "Judgement (XX)", description: "Pluto - Rebirth, transformation, calling" }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Reading Astrological Influences</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Sign Energy in Readings</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Cardinal signs (Emperor, Chariot, Justice, Devil): Initiation</li>
                    <li>• Fixed signs (Hierophant, Strength, Death, Star): Persistence</li>
                    <li>• Mutable signs (Lovers, Hermit, Temperance, Moon): Adaptation</li>
                    <li>• Look for elemental patterns in spreads</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Timing with Planets</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Mercury cards: Days to weeks</li>
                    <li>• Venus/Mars cards: Weeks to months</li>
                    <li>• Jupiter cards: Months to a year</li>
                    <li>• Saturn/Outer planets: Years or major life phases</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Major Arcana in Your Birth Chart"
              description="How to identify your personal Major Arcana cards"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  Your birth chart reveals your personal Major Arcana cards. Your Sun sign's card represents your core identity and life purpose. Your Moon sign's card (if the Moon rules it) or The High Priestess shows your emotional nature. Your Rising sign's card indicates how you appear to others and approach new experiences.
                </p>
                <p className="leading-relaxed">
                  When these cards appear in readings, pay special attention - they're speaking directly to your natal energies and may indicate important personal developments or the need to embody those archetypal qualities more fully.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 2: // Minor Arcana & Elements
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🔮"
              title="Elemental Astrology in the Minor Arcana"
              description="The Minor Arcana's four suits perfectly align with astrology's four elements and their associated signs. Each card also corresponds to specific degrees of the zodiac, creating a detailed astrological map of daily life."
              backgroundColor="#51bd94"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🔥"
                title="Fire Signs & Wands"
                subtitle="Aries, Leo, Sagittarius"
                description="Wands embody fire's passionate, creative, and action-oriented nature. They represent the same dynamic energy as the fire signs - inspiration, leadership, and spiritual growth."
                keyQuestions={[
                  "How does my passion manifest?",
                  "Where do I need to take inspired action?",
                  "What creative fire needs expression?",
                  "How can I lead with enthusiasm?"
                ]}
                backgroundColor="#ff6b6b"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌊"
                title="Water Signs & Cups"
                subtitle="Cancer, Scorpio, Pisces"
                description="Cups flow with water's emotional, intuitive, and relational nature. They mirror the water signs' depth of feeling, psychic sensitivity, and healing abilities."
                keyQuestions={[
                  "What emotions need acknowledgment?",
                  "How can I deepen my intuition?",
                  "What relationships need attention?",
                  "Where do I need emotional healing?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="💨"
                title="Air Signs & Swords"
                subtitle="Gemini, Libra, Aquarius"
                description="Swords cut through with air's intellectual, communicative, and analytical nature. They reflect the air signs' mental agility, objectivity, and truth-seeking."
                keyQuestions={[
                  "What thoughts dominate my mind?",
                  "How can I communicate more clearly?",
                  "Where do I need mental clarity?",
                  "What truth must be acknowledged?"
                ]}
                backgroundColor="#e0e0e0"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌍"
                title="Earth Signs & Pentacles"
                subtitle="Taurus, Virgo, Capricorn"
                description="Pentacles ground us in earth's practical, material, and sensual nature. They embody the earth signs' focus on tangible results, resources, and physical well-being."
                keyQuestions={[
                  "What needs practical attention?",
                  "How can I build lasting value?",
                  "Where do I need grounding?",
                  "What material goals call to me?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Decan Correspondences</h3>
              <div className="space-y-4">
                <p className="text-black text-sm mb-4">Each numbered Minor Arcana card (2-10) corresponds to a 10-degree segment (decan) of the zodiac:</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-black p-4">
                    <h4 className="font-space-grotesk font-bold text-black mb-2">Example: Wands Decans</h4>
                    <ul className="text-black text-sm space-y-1">
                      <li>• 2 of Wands: Mars in Aries (0-10° Aries)</li>
                      <li>• 3 of Wands: Sun in Aries (10-20° Aries)</li>
                      <li>• 4 of Wands: Venus in Aries (20-30° Aries)</li>
                      <li>• 5 of Wands: Saturn in Leo (0-10° Leo)</li>
                    </ul>
                  </div>
                  <div className="bg-white border border-black p-4">
                    <h4 className="font-space-grotesk font-bold text-black mb-2">Using Decans in Reading</h4>
                    <ul className="text-black text-sm space-y-1">
                      <li>• Pinpoint timing of events</li>
                      <li>• Understand planetary influences</li>
                      <li>• Connect to natal chart placements</li>
                      <li>• Add precision to predictions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Elemental Dignities"
              description="How elements interact in tarot spreads"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  When reading multiple cards, notice how their elements interact. Fire and Air support each other (passion needs ideas), as do Water and Earth (emotions need grounding). Fire and Water conflict (passion vs emotion), as do Air and Earth (ideas vs practicality).
                </p>
                <p className="leading-relaxed">
                  Cards of the same element strengthen each other's influence. A spread dominated by one element suggests that area of life needs attention - too much Fire might mean burnout, while too much Water could indicate emotional overwhelm.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Court Cards & Signs
        return (
          <div className="space-y-8">
            <HeroCard
              icon="👑"
              title="Court Cards as Zodiac Personalities"
              description="The sixteen Court Cards represent personality types that blend elemental suits with astrological modalities. Each court card embodies specific zodiac sign energies, helping identify people in your life or aspects of yourself."
              backgroundColor="#f0e3ff"
            />

            <SymbolGrid
              title="Court Card Zodiac Assignments"
              subtitle="Traditional Golden Dawn correspondences"
              items={[
                { symbol: "🔥♈", name: "Queen of Wands", description: "Aries - Bold, pioneering, passionate leader" },
                { symbol: "🌍♉", name: "King of Pentacles", description: "Taurus - Stable, wealthy, sensual provider" },
                { symbol: "💨♊", name: "Knight of Swords", description: "Gemini - Quick-thinking, communicative, restless" },
                { symbol: "🌊♋", name: "King of Cups", description: "Cancer - Nurturing, emotional maturity, protective" },
                { symbol: "🔥♌", name: "King of Wands", description: "Leo - Charismatic, creative, natural leader" },
                { symbol: "🌍♍", name: "Knight of Pentacles", description: "Virgo - Methodical, perfectionist, service-oriented" },
                { symbol: "💨♎", name: "Queen of Swords", description: "Libra - Fair, intellectual, relationship-focused" },
                { symbol: "🌊♏", name: "Knight of Cups", description: "Scorpio - Intense, romantic, transformative" },
                { symbol: "🔥♐", name: "Knight of Wands", description: "Sagittarius - Adventurous, philosophical, freedom-loving" },
                { symbol: "🌍♑", name: "Queen of Pentacles", description: "Capricorn - Practical, nurturing, business-minded" },
                { symbol: "💨♒", name: "King of Swords", description: "Aquarius - Innovative, detached, humanitarian" },
                { symbol: "🌊♓", name: "Queen of Cups", description: "Pisces - Intuitive, compassionate, artistic" }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Reading Court Cards Astrologically</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Identifying People</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Check querent's birth chart for matches</li>
                    <li>• Court cards often represent Sun/Rising signs</li>
                    <li>• Multiple cards can show different facets</li>
                    <li>• Pages represent new elemental energy</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Personality Aspects</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Kings: Mature masculine/yang expression</li>
                    <li>• Queens: Mature feminine/yin expression</li>
                    <li>• Knights: Active pursuit of element</li>
                    <li>• Pages: Learning and messages</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Court Card Modalities</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Cardinal Courts</h4>
                  <p className="text-black text-sm mb-2">Initiating energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Queen of Wands (Aries)</li>
                    <li>• King of Cups (Cancer)</li>
                    <li>• Queen of Swords (Libra)</li>
                    <li>• Queen of Pentacles (Capricorn)</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Fixed Courts</h4>
                  <p className="text-black text-sm mb-2">Stabilizing energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• King of Pentacles (Taurus)</li>
                    <li>• King of Wands (Leo)</li>
                    <li>• Knight of Cups (Scorpio)</li>
                    <li>• King of Swords (Aquarius)</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Mutable Courts</h4>
                  <p className="text-black text-sm mb-2">Adapting energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Knight of Swords (Gemini)</li>
                    <li>• Knight of Pentacles (Virgo)</li>
                    <li>• Knight of Wands (Sagittarius)</li>
                    <li>• Queen of Cups (Pisces)</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="Court Cards in Relationships"
              description="Using astrological knowledge to understand dynamics"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  When court cards appear in relationship readings, their astrological associations reveal compatibility and challenges. Fire courts with Air courts create dynamic partnerships, while Water courts with Earth courts build stable emotional foundations.
                </p>
                <p className="leading-relaxed">
                  Understanding the zodiac signs helps predict behavior: a Knight of Swords (Gemini) will communicate differently than a Knight of Cups (Scorpio). Use this knowledge to provide more specific, actionable guidance in your readings.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 4: // Integrated Readings
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Bringing It All Together"
              description="Practical techniques for combining tarot and astrology in your readings"
              items={[
                {
                  number: 1,
                  title: "Identify Astrological Signatures",
                  description: "Note zodiac and planetary associations for each card drawn"
                },
                {
                  number: 2,
                  title: "Look for Elemental Patterns",
                  description: "Observe dominant elements and what life areas they highlight"
                },
                {
                  number: 3,
                  title: "Connect to Birth Chart",
                  description: "See how cards relate to querent's natal placements"
                },
                {
                  number: 4,
                  title: "Apply Timing Techniques",
                  description: "Use astrological correspondences to predict when events may occur"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Astrological Tarot Spreads</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">12-House Spread</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Draw one card for each astrological house</li>
                    <li>• Reveals life area themes and challenges</li>
                    <li>• Can be done for solar return readings</li>
                    <li>• Combines natal house meanings with tarot</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Elemental Cross Spread</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Position 1: Fire (Spirit/Inspiration)</li>
                    <li>• Position 2: Water (Emotions/Intuition)</li>
                    <li>• Position 3: Air (Thoughts/Communication)</li>
                    <li>• Position 4: Earth (Material/Practical)</li>
                    <li>• Center: Integration/Balance needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Sample Integrated Reading</h3>
              <div className="bg-white border border-black p-6">
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-2">
                    <h5 className="font-space-grotesk font-bold text-black">Question: Career Direction</h5>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">1</div>
                      <div className="text-black text-sm">
                        <strong>Current Situation: Three of Pentacles</strong><br/>
                        Mars in Capricorn - Building skills, ambitious teamwork, laying foundations
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">2</div>
                      <div className="text-black text-sm">
                        <strong>Challenge: The Hermit</strong><br/>
                        Virgo - Need for analysis, perfectionism blocking progress, solo work vs collaboration
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs">3</div>
                      <div className="text-black text-sm">
                        <strong>Advice: Knight of Wands</strong><br/>
                        Sagittarius - Take bold action, expand horizons, pursue passion over security
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <p className="text-black text-sm"><strong>Elemental Summary:</strong> Earth (current) + Earth (challenge) + Fire (advice) = Need to break out of overly practical approach with inspired action</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Mastering the Integration"
              description="Advanced practices for weaving tarot and astrology"
              steps={[
                {
                  number: 1,
                  title: "Study Birth Chart Cards",
                  description: "Calculate your personal tarot cards based on your Sun, Moon, Rising, and other placements"
                },
                {
                  number: 2,
                  title: "Track Transits with Tarot",
                  description: "Pull cards for major transits to understand how the energy will manifest for you"
                },
                {
                  number: 3,
                  title: "Create Ritual Practices",
                  description: "Use tarot for new/full moons, equinoxes, and other astrological events"
                },
                {
                  number: 4,
                  title: "Develop Synthesis Skills",
                  description: "Practice reading cards through their astrological lens until it becomes natural"
                },
                {
                  number: 5,
                  title: "Explore Timing Techniques",
                  description: "Learn to predict timing using planetary speeds and decan systems"
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
      title: "Explore Your Birth Cards",
      description: "Calculate your personal Major Arcana cards based on your astrological placements and discover their meanings.",
      href: "/",
      linkText: "Calculate Cards",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Learn Tarot Basics",
      description: "New to tarot? Start with our comprehensive guide to cards, spreads, and developing intuition.",
      href: "/guides/tarot-fundamentals",
      linkText: "Start Learning",
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