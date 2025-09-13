/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Moon Phase Interpretations
 * 
 * Detailed interpretations for lunar cycle phases
 */

import { EventInterpretation } from '../eventInterpretations';

export const MOON_PHASE_INTERPRETATIONS: Record<string, EventInterpretation> = {
  newMoon: {
    title: "New Moon",
    subtitle: "New Beginnings & Intention Setting",
    description: "The New Moon represents a fresh start, a blank slate for new intentions and beginnings. This is the most potent time for manifestation and setting the tone for the lunar cycle ahead.",
    advice: {
      overview: "New Moon energy is perfect for planting seeds of intention and starting fresh in any area of life.",
      energy: "Fresh, receptive, and manifestation-focused. Energy is building from zero toward fullness.",
      timing: "Occurs monthly, with effects strongest for 3 days after the exact new moon.",
      dos: [
        "Set clear, specific intentions for the lunar cycle",
        "Start new projects or ventures",
        "Create vision boards or manifestation lists",
        "Plant literal or metaphorical seeds",
        "Meditate on your deepest desires",
        "Clean and organize your space for fresh energy",
        "Begin new healthy habits or routines"
      ],
      donts: [
        "Focus on what you want to release (save for full moon)",
        "Make major decisions while emotions are low",
        "Expect immediate results from new beginnings",
        "Overcommit to too many new projects",
        "Ignore the need for rest and reflection",
        "Rush the natural timing of manifestation",
        "Start things without clear intention"
      ],
      opportunities: [
        "Manifest new opportunities and relationships",
        "Break free from old patterns that no longer serve",
        "Connect with your intuitive wisdom",
        "Align your actions with your deeper purpose",
        "Create positive momentum for the month ahead"
      ],
      warnings: [
        "Energy may feel low initially - this is natural",
        "Avoid making major commitments during the dark moon phase",
        "Don't expect others to share your enthusiasm immediately",
        "New ventures may need time to gain momentum"
      ],
      rituals: [
        "Write intentions by candlelight",
        "Create a manifestation altar or sacred space",
        "Plant seeds in soil while focusing on your goals",
        "Perform a cleansing bath with intention-setting"
      ],
      affirmations: [
        "I am ready to receive all the good coming to me",
        "My intentions are clear and powerful",
        "I trust in the perfect timing of my manifestations",
        "I am open to new possibilities and opportunities"
      ]
    }
  },
  firstQuarter: {
    title: "First Quarter Moon",
    subtitle: "Action & Decision Making",
    description: "The First Quarter Moon is the crisis of action phase, where we must take decisive steps and overcome obstacles to manifest what was set in motion at the New Moon. This is a time of commitment and perseverance.",
    advice: {
      overview: "First Quarter energy demands action, decision-making, and pushing through challenges to achieve your goals.",
      energy: "Dynamic, challenging, and action-oriented. Building tension requires decisive movement forward.",
      timing: "Occurs about 7 days after New Moon, with effects strongest for 1-2 days around the exact quarter.",
      dos: [
        "Take decisive action on your New Moon intentions",
        "Make important decisions and commitments",
        "Push through obstacles and resistance",
        "Stand up for what you believe in",
        "Address challenges head-on with courage",
        "Adjust your plans based on what you've learned",
        "Persist through difficulties with determination"
      ],
      donts: [
        "Give up when facing the first obstacles",
        "Avoid making necessary decisions",
        "Let fear stop you from taking action",
        "Procrastinate on important commitments",
        "Ignore the lessons that challenges are teaching",
        "Force outcomes without considering consequences",
        "Become discouraged by temporary setbacks"
      ],
      opportunities: [
        "Build strength and resilience through overcoming challenges",
        "Demonstrate your commitment to your goals",
        "Learn valuable lessons about persistence and courage",
        "Refine your approach based on early feedback",
        "Develop confidence in your decision-making abilities"
      ],
      warnings: [
        "Resistance and obstacles are normal and expected",
        "Emotions may feel tense or conflicted",
        "Others may challenge your decisions or direction",
        "This is a test of your commitment to your goals"
      ],
      rituals: [
        "Create an action plan for overcoming current obstacles",
        "Perform courage-building exercises or meditations",
        "Write about the challenges you're facing and how to address them",
        "Engage in physical activities that build strength and confidence"
      ],
      affirmations: [
        "I have the courage to take action on my dreams",
        "I persist through challenges with determination and grace",
        "I make decisions that align with my highest good",
        "I am strong enough to overcome any obstacle"
      ]
    }
  },
  lastQuarter: {
    title: "Last Quarter Moon", 
    subtitle: "Release & Forgiveness",
    description: "The Last Quarter Moon is the crisis of consciousness phase, where we must release what no longer serves and forgive what has held us back. This is a time of letting go and making space for new growth.",
    advice: {
      overview: "Last Quarter energy focuses on release, forgiveness, and clearing away what blocks your progress.",
      energy: "Reflective, releasing, and wisdom-seeking. Waning energy supports letting go and inner work.", 
      timing: "Occurs about 21 days after New Moon, with effects strongest for 1-2 days around the exact quarter.",
      dos: [
        "Release habits, thoughts, or situations that no longer serve",
        "Practice forgiveness for yourself and others",
        "Reflect on lessons learned during this lunar cycle",
        "Clear physical and emotional clutter from your life",
        "Let go of expectations that create suffering",
        "Make amends where appropriate and possible",
        "Prepare space for new opportunities to enter"
      ],
      donts: [
        "Hold onto grudges or resentments",
        "Cling to situations that need to end",
        "Ignore the wisdom gained from recent experiences",
        "Resist the natural process of letting go",
        "Use this time to start major new projects",
        "Avoid dealing with emotional or practical cleanup",
        "Judge yourself harshly for past mistakes"
      ],
      opportunities: [
        "Gain wisdom and perspective from recent experiences",
        "Create space for new and better opportunities",
        "Heal relationships through forgiveness and understanding",
        "Develop greater emotional freedom and lightness",
        "Prepare yourself for the next New Moon cycle"
      ],
      warnings: [
        "Emotions may feel heavy or melancholic initially",
        "Resistance to letting go is natural but counterproductive",
        "Others may not be ready to forgive or release at the same pace",
        "This inner work is necessary preparation for future growth"
      ],
      rituals: [
        "Write down what you want to release and burn or bury the paper",
        "Perform forgiveness meditations or ceremonies",
        "Clean and declutter your physical spaces",
        "Practice gratitude for lessons learned through challenges"
      ],
      affirmations: [
        "I release what no longer serves my highest good",
        "I forgive myself and others with compassion and understanding",
        "I make space for new blessings to enter my life",
        "I am wise enough to let go and trust the process"
      ]
    }
  },
  fullMoon: {
    title: "Full Moon",
    subtitle: "Culmination & Release",
    description: "The Full Moon is a time of culmination, completion, and release. What was planted at the New Moon now comes to fruition, and what no longer serves can be released with grace.",
    advice: {
      overview: "Full Moon energy amplifies everything - emotions, manifestations, and the need for release and gratitude.",
      energy: "Intense, emotional, and revelatory. Energy is at peak intensity and ready for release.",
      timing: "Occurs monthly, with effects strongest for 3 days around the exact full moon.",
      dos: [
        "Express gratitude for manifestations received",
        "Release what no longer serves your highest good",
        "Complete projects and tie up loose ends",
        "Have important conversations and clear the air",
        "Trust your heightened intuition and emotions",
        "Cleanse your space and energy field",
        "Celebrate achievements and progress made"
      ],
      donts: [
        "Start major new projects (wait for new moon)",
        "Make important decisions based solely on heightened emotions",
        "Ignore the need for emotional release",
        "Hold onto grudges or outdated patterns",
        "Overwhelm yourself with too much stimulation",
        "Suppress natural emotional responses",
        "Forget to ground yourself after intense energy"
      ],
      opportunities: [
        "Gain clarity on relationships and situations",
        "Release blocks to your personal growth",
        "Receive insights about your life path",
        "Complete important projects with enhanced focus",
        "Heal emotional wounds through conscious release"
      ],
      warnings: [
        "Emotions and reactions may be more intense than usual",
        "Sleep patterns might be disrupted",
        "Conflicts may surface for healing and resolution",
        "Avoid making permanent decisions during peak emotional states"
      ],
      rituals: [
        "Write down what you want to release and burn the paper",
        "Take a cleansing bath with sea salt and herbs",
        "Charge crystals and oracle cards under the moonlight",
        "Perform gratitude meditation under the full moon"
      ],
      affirmations: [
        "I release all that no longer serves my highest good",
        "I am grateful for the abundance in my life",
        "I trust my intuition to guide me forward",
        "I embrace both light and shadow within myself"
      ]
    }
  }
};