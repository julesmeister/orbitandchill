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

export default function ElementsAndModalitiesGuidePage() {
  const guide = {
    id: 'elements-and-modalities',
    title: 'Elements and Modalities: The Building Blocks',
    description: 'Understand the four elements (Fire, Earth, Air, Water) and three modalities (Cardinal, Fixed, Mutable) that shape astrological interpretation and create the foundation of all zodiac signs.',
    level: 'beginner' as const,
    estimatedTime: '20 min',
    sections: [
      {
        id: 'intro',
        title: 'The Foundation System',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'four-elements',
        title: 'The Four Elements',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'three-modalities',
        title: 'The Three Modalities',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'integration',
        title: 'Elements + Modalities = Signs',
        type: 'text' as const,
        content: ''
      },
      {
        id: 'practical-application',
        title: 'Working with Your Elemental Mix',
        type: 'interactive' as const,
        content: ''
      }
    ]
  };

  const renderSectionContent = (currentSection: number) => {
    switch (currentSection) {
      case 0: // The Foundation System
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🧱"
              title="The Cosmic Building Blocks"
              description="Every zodiac sign is created from the combination of an element and a modality. Understanding these fundamental energies gives you the key to understanding all twelve signs and how they express in your chart."
              backgroundColor="#f0e3ff"
            />

            <InfoGrid
              title="Why Elements and Modalities Matter"
              items={[
                {
                  icon: "🔥",
                  title: "Elemental Energy",
                  description: "Elements describe the basic nature and temperament of signs"
                },
                {
                  icon: "⚡",
                  title: "Modal Expression",
                  description: "Modalities show how that elemental energy is expressed and directed"
                },
                {
                  icon: "🎯",
                  title: "Universal Patterns",
                  description: "These patterns repeat throughout nature and human experience"
                },
                {
                  icon: "🔑",
                  title: "Interpretive Foundation",
                  description: "Master these basics to understand any astrological placement"
                }
              ]}
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <div className="font-space-grotesk text-xl font-bold text-black mb-4">The Sacred Geometry of Astrology</div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Four Elements (Triplicities)</div>
                  <p className="text-black text-sm mb-2">Each element contains three signs</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Fire:</strong> Aries, Leo, Sagittarius</li>
                    <li>• <strong>Earth:</strong> Taurus, Virgo, Capricorn</li>
                    <li>• <strong>Air:</strong> Gemini, Libra, Aquarius</li>
                    <li>• <strong>Water:</strong> Cancer, Scorpio, Pisces</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <div className="font-space-grotesk font-bold text-black mb-2">Three Modalities (Quadruplicities)</div>
                  <p className="text-black text-sm mb-2">Each modality contains four signs</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Cardinal:</strong> Aries, Cancer, Libra, Capricorn</li>
                    <li>• <strong>Fixed:</strong> Taurus, Leo, Scorpio, Aquarius</li>
                    <li>• <strong>Mutable:</strong> Gemini, Virgo, Sagittarius, Pisces</li>
                  </ul>
                </div>
              </div>
            </div>

            <VisualChart
              title="The Zodiac Wheel: Elements & Modalities"
              description="How elements and modalities create the twelve zodiac signs"
              points={[
                { position: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-4", label: "♑", description: "Cardinal Earth" },
                { position: "top-1/4 right-1/4 transform translate-x-2 -translate-y-2", label: "♒", description: "Fixed Air" },
                { position: "top-1/2 right-0 transform translate-x-4 -translate-y-1/2", label: "♓", description: "Mutable Water" },
                { position: "bottom-1/4 right-1/4 transform translate-x-2 translate-y-2", label: "♈", description: "Cardinal Fire" },
                { position: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4", label: "♉", description: "Fixed Earth" },
                { position: "bottom-1/4 left-1/4 transform -translate-x-2 translate-y-2", label: "♊", description: "Mutable Air" },
                { position: "top-1/2 left-0 transform -translate-x-4 -translate-y-1/2", label: "♋", description: "Cardinal Water" },
                { position: "top-1/4 left-1/4 transform -translate-x-2 -translate-y-2", label: "♌", description: "Fixed Fire" }
              ]}
            />

            <IntegrationCard
              title="The Ancient Wisdom"
              description="How elements and modalities connect astrology to universal principles"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The four elements and three modalities are not just astrological concepts - they're universal principles found in many wisdom traditions. They represent the fundamental ways energy manifests in the physical world.
                </p>
                <p className="leading-relaxed">
                  By understanding these building blocks, you're learning the same patterns that govern seasons, life cycles, personality types, and natural processes. This knowledge becomes a powerful tool for understanding yourself and others.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 1: // The Four Elements
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🌟"
              title="The Elemental Energies"
              description="The four elements represent different types of energy and temperament. Each element has its own way of processing life, expressing emotions, and approaching challenges. Understanding your elemental mix reveals your natural strengths and needs."
              backgroundColor="#ff91e9"
            />

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🔥"
                title="Fire Element"
                subtitle="Inspiration, Action, Spirit"
                description="Fire signs are passionate, energetic, and action-oriented. They're natural leaders who inspire others and aren't afraid to take risks. Fire needs freedom and excitement."
                keyQuestions={[
                  "What inspires me to take action?",
                  "How do I express my passion?",
                  "What gives me energy and motivation?",
                  "How do I lead and inspire others?"
                ]}
                backgroundColor="#ff6b6b"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌍"
                title="Earth Element"
                subtitle="Practicality, Stability, Matter"
                description="Earth signs are practical, grounded, and reliable. They focus on tangible results and building lasting foundations. Earth needs security and concrete achievements."
                keyQuestions={[
                  "What makes me feel secure?",
                  "How do I create stability?",
                  "What practical skills do I value?",
                  "How do I build lasting foundations?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="💨"
                title="Air Element"
                subtitle="Ideas, Communication, Mind"
                description="Air signs are intellectual, communicative, and social. They process life through thinking and connecting with others. Air needs mental stimulation and social interaction."
                keyQuestions={[
                  "How do I process information?",
                  "What ideas excite me?",
                  "How do I connect with others?",
                  "What stimulates my mind?"
                ]}
                backgroundColor="#6bdbff"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌊"
                title="Water Element"
                subtitle="Emotions, Intuition, Soul"
                description="Water signs are emotional, intuitive, and deeply feeling. They process life through emotions and inner knowing. Water needs emotional connection and depth."
                keyQuestions={[
                  "How do I process emotions?",
                  "What does my intuition tell me?",
                  "How do I connect emotionally?",
                  "What feeds my soul?"
                ]}
                backgroundColor="#f0e3ff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Elemental Characteristics</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Fire & Air (Yang/Masculine)</h4>
                  <p className="text-black text-sm mb-2">Extroverted, active, outwardly focused</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Fire:</strong> Spontaneous, direct, energetic</li>
                    <li>• <strong>Air:</strong> Intellectual, social, communicative</li>
                    <li>• Both initiate and project energy outward</li>
                    <li>• Need stimulation and external interaction</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Earth & Water (Yin/Feminine)</h4>
                  <p className="text-black text-sm mb-2">Introverted, receptive, inwardly focused</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Earth:</strong> Practical, stable, methodical</li>
                    <li>• <strong>Water:</strong> Emotional, intuitive, nurturing</li>
                    <li>• Both receive and process energy internally</li>
                    <li>• Need depth and internal processing time</li>
                  </ul>
                </div>
              </div>
            </div>

            <SymbolGrid
              title="Signs by Element"
              subtitle="How each element expresses through the zodiac"
              items={[
                { symbol: "♈", name: "Aries", description: "Fire: Pioneer energy, direct action" },
                { symbol: "♌", name: "Leo", description: "Fire: Creative expression, confident leadership" },
                { symbol: "♐", name: "Sagittarius", description: "Fire: Adventurous spirit, philosophical quest" },
                { symbol: "♉", name: "Taurus", description: "Earth: Sensual stability, practical building" },
                { symbol: "♍", name: "Virgo", description: "Earth: Analytical precision, helpful service" },
                { symbol: "♑", name: "Capricorn", description: "Earth: Ambitious structure, responsible achievement" },
                { symbol: "♊", name: "Gemini", description: "Air: Curious communication, versatile thinking" },
                { symbol: "♎", name: "Libra", description: "Air: Harmonious balance, diplomatic relating" },
                { symbol: "♒", name: "Aquarius", description: "Air: Innovative ideas, humanitarian vision" },
                { symbol: "♋", name: "Cancer", description: "Water: Nurturing protection, emotional depth" },
                { symbol: "♏", name: "Scorpio", description: "Water: Transformative intensity, psychic insight" },
                { symbol: "♓", name: "Pisces", description: "Water: Compassionate flow, spiritual connection" }
              ]}
              backgroundColor="#6bdbff"
            />
          </div>
        );

      case 2: // The Three Modalities
        return (
          <div className="space-y-8">
            <HeroCard
              icon="⚡"
              title="The Three Modes of Expression"
              description="Modalities describe how elemental energy is expressed and directed. They represent the three phases of any cycle: initiation, sustaining, and adapting. Understanding modalities reveals your natural approach to action and change."
              backgroundColor="#51bd94"
            />

            <div className="grid md:grid-cols-3 gap-0 border border-black">
              <SectionCard
                icon="🚀"
                title="Cardinal"
                subtitle="Initiation & Leadership"
                description="Cardinal signs start things. They're natural leaders who initiate action and begin new cycles. Cardinal energy is about taking charge and getting things moving."
                keyQuestions={[
                  "How do I initiate change?",
                  "What leadership style do I use?",
                  "How do I start new projects?",
                  "What motivates me to take action?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🏔️"
                title="Fixed"
                subtitle="Stability & Determination"
                description="Fixed signs sustain and maintain. They're determined, reliable, and focused on building lasting value. Fixed energy is about persistence and seeing things through."
                keyQuestions={[
                  "How do I maintain stability?",
                  "What am I determined to achieve?",
                  "How do I handle change?",
                  "What do I persistently work toward?"
                ]}
                backgroundColor="#f2e356"
                className="border-r border-black"
              />

              <SectionCard
                icon="🌊"
                title="Mutable"
                subtitle="Adaptation & Flexibility"
                description="Mutable signs adapt and transform. They're flexible, versatile, and skilled at navigating change. Mutable energy is about adjustment and transition."
                keyQuestions={[
                  "How do I adapt to change?",
                  "What makes me flexible?",
                  "How do I handle transitions?",
                  "What helps me stay versatile?"
                ]}
                backgroundColor="#6bdbff"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Modality Patterns in Life</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Cardinal Seasons</h4>
                  <p className="text-black text-sm mb-2">Season beginnings, equinoxes and solstices</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Aries:</strong> Spring equinox, new life</li>
                    <li>• <strong>Cancer:</strong> Summer solstice, peak growth</li>
                    <li>• <strong>Libra:</strong> Autumn equinox, balance</li>
                    <li>• <strong>Capricorn:</strong> Winter solstice, structure</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Fixed Seasons</h4>
                  <p className="text-black text-sm mb-2">Season peaks, stable energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Taurus:</strong> Late spring, abundance</li>
                    <li>• <strong>Leo:</strong> Mid-summer, full expression</li>
                    <li>• <strong>Scorpio:</strong> Deep autumn, transformation</li>
                    <li>• <strong>Aquarius:</strong> Deep winter, innovation</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Mutable Seasons</h4>
                  <p className="text-black text-sm mb-2">Season transitions, change energy</p>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Gemini:</strong> Late spring, exploration</li>
                    <li>• <strong>Virgo:</strong> Late summer, refinement</li>
                    <li>• <strong>Sagittarius:</strong> Late autumn, seeking</li>
                    <li>• <strong>Pisces:</strong> Late winter, dissolving</li>
                  </ul>
                </div>
              </div>
            </div>

            <IntegrationCard
              title="The Natural Cycle"
              description="How modalities represent the universal pattern of creation, maintenance, and transformation"
            >
              <div className="text-black/80 space-y-4">
                <p className="leading-relaxed">
                  The three modalities mirror the natural cycle found everywhere in life: birth, growth, death, and rebirth. Cardinal energy initiates, Fixed energy maintains and builds, and Mutable energy adapts and transforms.
                </p>
                <p className="leading-relaxed">
                  You can see this pattern in seasons, life phases, project cycles, and even in your daily rhythms. Understanding your modal emphasis helps you work with your natural timing and energy patterns.
                </p>
              </div>
            </IntegrationCard>
          </div>
        );

      case 3: // Elements + Modalities = Signs
        return (
          <div className="space-y-8">
            <HeroCard
              icon="🧩"
              title="The Perfect Combination"
              description="Every zodiac sign is a unique blend of one element and one modality. This combination creates twelve distinct energetic signatures, each with its own gifts, challenges, and expression style."
              backgroundColor="#6bdbff"
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">The Complete Zodiac Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border border-black p-2 text-left">Element</th>
                      <th className="border border-black p-2 text-center">Cardinal</th>
                      <th className="border border-black p-2 text-center">Fixed</th>
                      <th className="border border-black p-2 text-center">Mutable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-red-100">
                      <td className="border border-black p-2 font-semibold">Fire</td>
                      <td className="border border-black p-2 text-center">♈ Aries</td>
                      <td className="border border-black p-2 text-center">♌ Leo</td>
                      <td className="border border-black p-2 text-center">♐ Sagittarius</td>
                    </tr>
                    <tr className="bg-green-100">
                      <td className="border border-black p-2 font-semibold">Earth</td>
                      <td className="border border-black p-2 text-center">♑ Capricorn</td>
                      <td className="border border-black p-2 text-center">♉ Taurus</td>
                      <td className="border border-black p-2 text-center">♍ Virgo</td>
                    </tr>
                    <tr className="bg-blue-100">
                      <td className="border border-black p-2 font-semibold">Air</td>
                      <td className="border border-black p-2 text-center">♎ Libra</td>
                      <td className="border border-black p-2 text-center">♒ Aquarius</td>
                      <td className="border border-black p-2 text-center">♊ Gemini</td>
                    </tr>
                    <tr className="bg-purple-100">
                      <td className="border border-black p-2 font-semibold">Water</td>
                      <td className="border border-black p-2 text-center">♋ Cancer</td>
                      <td className="border border-black p-2 text-center">♏ Scorpio</td>
                      <td className="border border-black p-2 text-center">♓ Pisces</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-0 border border-black">
              <SectionCard
                icon="🎯"
                title="Cardinal Fire: Aries"
                subtitle="The Pioneer"
                description="Combines Fire's passion with Cardinal's initiative. Result: Bold leadership, pioneering spirit, and the courage to start new adventures."
                keyQuestions={[
                  "How do I channel my pioneering spirit?",
                  "What new territories am I exploring?",
                  "How do I lead with courage?",
                  "What battles am I willing to fight?"
                ]}
                backgroundColor="#ff91e9"
                className="border-r border-black"
              />
              
              <SectionCard
                icon="🌱"
                title="Fixed Earth: Taurus"
                subtitle="The Builder"
                description="Combines Earth's practicality with Fixed's determination. Result: Steady persistence, sensual appreciation, and the ability to build lasting value."
                keyQuestions={[
                  "What am I building for the long term?",
                  "How do I appreciate life's pleasures?",
                  "What gives me a sense of security?",
                  "How do I persist through challenges?"
                ]}
                backgroundColor="#51bd94"
                className=""
              />
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#f0e3ff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Understanding Sign Combinations</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🔥</div>
                  <div className="text-black text-sm">
                    <strong>Cardinal Fire (Aries):</strong> Initiates with passion and direct action
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🌍</div>
                  <div className="text-black text-sm">
                    <strong>Fixed Earth (Taurus):</strong> Sustains through practical determination
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">💨</div>
                  <div className="text-black text-sm">
                    <strong>Mutable Air (Gemini):</strong> Adapts through intellectual flexibility
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🌊</div>
                  <div className="text-black text-sm">
                    <strong>Cardinal Water (Cancer):</strong> Initiates through emotional nurturing
                  </div>
                </div>
              </div>
            </div>

            <AssessmentExercise
              title="Analyzing Your Elemental-Modal Mix"
              description="Understanding how elements and modalities work together in your chart"
              items={[
                {
                  number: 1,
                  title: "Count Your Elements",
                  description: "Count planets in Fire, Earth, Air, and Water signs to see your elemental emphasis"
                },
                {
                  number: 2,
                  title: "Count Your Modalities",
                  description: "Count planets in Cardinal, Fixed, and Mutable signs to understand your modal emphasis"
                },
                {
                  number: 3,
                  title: "Identify Patterns",
                  description: "Notice what elements or modalities are emphasized or missing"
                },
                {
                  number: 4,
                  title: "Understand Your Balance",
                  description: "See how your elemental-modal mix creates your unique approach to life"
                }
              ]}
            />
          </div>
        );

      case 4: // Working with Your Elemental Mix
        return (
          <div className="space-y-8">
            <AssessmentExercise
              title="Balancing Your Elemental Energies"
              description="Practical ways to work with your elemental and modal strengths and challenges"
              items={[
                {
                  number: 1,
                  title: "Identify Your Strongest Elements",
                  description: "Find which elements dominate your chart and how this affects your natural approach"
                },
                {
                  number: 2,
                  title: "Notice Missing Elements",
                  description: "See which elements are weak or missing and how to consciously develop them"
                },
                {
                  number: 3,
                  title: "Understand Your Modal Style",
                  description: "Recognize whether you're naturally more initiating, sustaining, or adapting"
                },
                {
                  number: 4,
                  title: "Create Conscious Balance",
                  description: "Use activities and practices to strengthen your weaker elements and modalities"
                }
              ]}
            />

            <div className="border border-black p-8" style={{ backgroundColor: '#ff91e9' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Elemental Balancing Practices</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Strengthening Weak Elements</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Fire:</strong> Exercise, dance, adventure, creative projects</li>
                    <li>• <strong>Earth:</strong> Gardening, crafts, nature walks, practical skills</li>
                    <li>• <strong>Air:</strong> Reading, writing, socializing, learning new concepts</li>
                    <li>• <strong>Water:</strong> Meditation, art, therapy, emotional expression</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Balancing Excess Elements</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• <strong>Too much Fire:</strong> Grounding practices, patience exercises</li>
                    <li>• <strong>Too much Earth:</strong> Spontaneity, creative expression</li>
                    <li>• <strong>Too much Air:</strong> Body awareness, emotional connection</li>
                    <li>• <strong>Too much Water:</strong> Logical thinking, practical action</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#51bd94' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Modal Balancing Strategies</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Developing Cardinal Energy</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Practice leadership skills</li>
                    <li>• Set clear goals and deadlines</li>
                    <li>• Take initiative in projects</li>
                    <li>• Start new ventures</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Developing Fixed Energy</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Build consistent routines</li>
                    <li>• Practice persistence</li>
                    <li>• Focus on quality over quantity</li>
                    <li>• Develop expertise in chosen areas</li>
                  </ul>
                </div>
                <div className="bg-white border border-black p-4">
                  <h4 className="font-space-grotesk font-bold text-black mb-2">Developing Mutable Energy</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Practice flexibility</li>
                    <li>• Learn new skills</li>
                    <li>• Embrace change gracefully</li>
                    <li>• Develop adaptability</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Common Elemental Patterns</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🔥</div>
                  <div className="text-black text-sm">
                    <strong>Fire Dominant:</strong> Passionate and energetic but may lack patience or persistence
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🌍</div>
                  <div className="text-black text-sm">
                    <strong>Earth Dominant:</strong> Practical and reliable but may resist change or lack inspiration
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">💨</div>
                  <div className="text-black text-sm">
                    <strong>Air Dominant:</strong> Intellectual and communicative but may lack emotional depth or grounding
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs mt-1">🌊</div>
                  <div className="text-black text-sm">
                    <strong>Water Dominant:</strong> Intuitive and empathetic but may be overly emotional or impractical
                  </div>
                </div>
              </div>
            </div>

            <NextSteps
              title="Mastering Elemental Awareness"
              description="How to integrate elemental and modal understanding into your daily life"
              steps={[
                {
                  number: 1,
                  title: "Daily Elemental Check-in",
                  description: "Notice which elements you're expressing throughout the day"
                },
                {
                  number: 2,
                  title: "Seasonal Awareness",
                  description: "Align your activities with the natural elemental and modal cycles"
                },
                {
                  number: 3,
                  title: "Relationship Dynamics",
                  description: "Understand how different elemental combinations interact in relationships"
                },
                {
                  number: 4,
                  title: "Career Alignment",
                  description: "Choose work that aligns with your elemental and modal strengths"
                },
                {
                  number: 5,
                  title: "Conscious Development",
                  description: "Actively work to develop your weaker elements and modalities"
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
      title: "Discover Your Elemental Mix",
      description: "Generate your natal chart to see how elements and modalities are distributed in your cosmic blueprint.",
      href: "/chart",
      linkText: "Analyze Chart",
      backgroundColor: "#f0e3ff"
    },
    secondary: {
      title: "Explore Sign Combinations",
      description: "Dive deeper into how your specific zodiac sign combinations express these elemental energies.",
      href: "/guides/big-three",
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