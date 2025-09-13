/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Other Astrological Event Interpretations
 * 
 * Interpretations for conjunctions, stelliums, grand trines, void moon, and eclipses
 */

import { EventInterpretation } from '../eventInterpretations';

// Void Moon interpretations
export const VOID_MOON_INTERPRETATIONS: Record<string, EventInterpretation> = {
  general: {
    title: "Void of Course Moon",
    subtitle: "Pause & Reflection Period",
    description: "When the Moon is void of course, it's making no major aspects before changing signs. This creates a natural pause in cosmic energy, perfect for reflection, rest, and avoiding major decisions.",
    advice: {
      overview: "Void Moon periods offer natural breaks in cosmic momentum, ideal for reflection and routine activities rather than new beginnings.",
      energy: "Neutral, reflective, and internally focused. Energy feels suspended or in transition between influences.",
      timing: "Occurs several times per week, lasting from minutes to hours. Use this time for introspection and routine tasks.",
      dos: [
        "Focus on routine, familiar tasks",
        "Practice meditation and reflection",
        "Rest and recharge your energy",
        "Complete ongoing projects",
        "Organize and clean your space",
        "Engage in creative activities without pressure",
        "Journal about recent experiences"
      ],
      donts: [
        "Start important new projects or ventures",
        "Make major decisions or commitments",
        "Sign important contracts or agreements",
        "Begin new relationships or partnerships",
        "Launch products or services",
        "Schedule important meetings or interviews",
        "Rush into action without clear direction"
      ],
      opportunities: [
        "Gain clarity through quiet reflection",
        "Catch up on routine tasks and organization",
        "Rest and restore your energy levels",
        "Process recent experiences and emotions",
        "Connect with your inner wisdom"
      ],
      warnings: [
        "New ventures may lack momentum or direction",
        "Decisions made may need revision later",
        "Energy may feel scattered or unfocused",
        "Important matters may get overlooked"
      ],
      rituals: [
        "Practice mindfulness and present-moment awareness",
        "Create sacred space for quiet reflection",
        "Perform gentle cleansing and organizing rituals",
        "Engage in restorative yoga or meditation"
      ],
      affirmations: [
        "I honor the natural rhythms of rest and action",
        "I use quiet moments for inner wisdom and clarity",
        "I trust in perfect timing for all my endeavors",
        "I find peace in stillness and reflection"
      ]
    }
  }
};

// Eclipse interpretations
export const ECLIPSE_INTERPRETATIONS: Record<string, EventInterpretation> = {
  general: {
    title: "Eclipse",
    subtitle: "Powerful Portal for Change",
    description: "Eclipses are cosmic reset buttons that bring sudden changes, revelations, and new directions. They offer powerful opportunities for transformation and alignment with your deeper purpose.",
    advice: {
      overview: "Eclipses bring accelerated change and transformation, offering powerful portals for growth and new beginnings.",
      energy: "Intense, transformative, and destiny-oriented. Cosmic forces align to create significant shifts and opportunities.",
      timing: "Occurs in pairs every 6 months. Effects can be felt for weeks before and months after the eclipse.",
      dos: [
        "Stay open to unexpected changes and opportunities",
        "Pay attention to signs, synchronicities, and messages",
        "Release what no longer serves your highest good",
        "Set powerful intentions for transformation",
        "Trust the process even when changes feel sudden",
        "Practice flexibility and adaptability",
        "Honor your intuition and inner guidance"
      ],
      donts: [
        "Resist necessary changes or transformations",
        "Force outcomes or try to control everything",
        "Make major decisions during the eclipse itself",
        "Ignore important messages or opportunities",
        "Cling to situations that need to end",
        "Fear the changes that are trying to emerge",
        "Dismiss unusual events as mere coincidence"
      ],
      opportunities: [
        "Experience major life breakthroughs and shifts",
        "Align with your deeper purpose and destiny",
        "Release old patterns and embrace new directions",
        "Manifest significant positive changes",
        "Connect with your authentic path and calling"
      ],
      warnings: [
        "Changes may happen suddenly and unexpectedly",
        "What you think you want may not be what you need",
        "Old structures may need to collapse for new growth",
        "Emotions and events may feel more intense than usual"
      ],
      rituals: [
        "Create powerful intention-setting ceremonies",
        "Practice release rituals for what no longer serves",
        "Perform transformation meditations and visualizations",
        "Create eclipse intention wheels or vision boards"
      ],
      affirmations: [
        "I welcome the changes that align me with my highest good",
        "I trust in the perfect timing of cosmic transformation",
        "I am open to the new directions emerging in my life",
        "I embrace my destiny with courage and faith"
      ]
    }
  }
};

// Conjunction interpretations
export const CONJUNCTION_INTERPRETATIONS: Record<string, EventInterpretation> = {
  general: {
    title: "Planetary Conjunction",
    subtitle: "Unified Cosmic Energy",
    description: "When two planets come together in the sky, their energies merge and amplify each other. This creates a powerful focal point for manifestation and transformation in the themes represented by both planets.",
    advice: {
      overview: "Conjunctions represent new beginnings and the birth of fresh cycles in the areas governed by the planets involved.",
      energy: "Intense, focused, and initiatory. The combined planetary energies create a concentrated force for change.",
      timing: "Most powerful at the exact moment, with effects lasting several days to weeks depending on the planets involved.",
      dos: [
        "Focus your energy on the themes represented by both planets",
        "Initiate new projects related to the planetary combination",
        "Pay attention to synchronicities and meaningful coincidences",
        "Use this concentrated energy for manifestation work",
        "Journal about insights and revelations that arise",
        "Meditate on the unified energy of the planets",
        "Set intentions aligned with the planetary themes"
      ],
      donts: [
        "Ignore the powerful energy available to you",
        "Scatter your focus across too many different areas",
        "Resist the changes that want to emerge",
        "Use the intense energy in destructive ways",
        "Overlook the subtler messages and guidance",
        "Force outcomes instead of flowing with the energy",
        "Dismiss unusual events or feelings as unimportant"
      ],
      opportunities: [
        "Birth new projects and ventures",
        "Experience breakthrough insights and clarity",
        "Align with your deeper purpose and calling",
        "Create powerful change in the affected life areas",
        "Connect with like-minded people and opportunities"
      ],
      warnings: [
        "Energy may feel overwhelming or intense",
        "Old patterns may resist the new energy",
        "Changes may happen faster than expected",
        "Other people may react strongly to your transformation"
      ],
      rituals: [
        "Create an altar representing both planetary energies",
        "Perform a unification ceremony or meditation",
        "Write down your intentions for this cosmic moment",
        "Spend time in nature connecting with planetary forces"
      ],
      affirmations: [
        "I align with the powerful cosmic forces supporting my growth",
        "I welcome the changes this conjunction brings to my life",
        "I use this concentrated energy for my highest good",
        "I am open to the new possibilities being born within me"
      ]
    }
  }
};

// Stellium interpretations
export const STELLIUM_INTERPRETATIONS: Record<string, EventInterpretation> = {
  general: {
    title: "Stellium Formation",
    subtitle: "Concentrated Cosmic Power",
    description: "A stellium occurs when three or more planets gather in the same zodiac sign, creating an intense concentration of cosmic energy. This rare formation brings laser-focused attention to the themes and qualities of that particular sign.",
    advice: {
      overview: "Stelliums represent periods of intense focus and accelerated growth in specific life areas governed by the sign involved.",
      energy: "Highly concentrated, transformative, and potentially overwhelming. All the planetary energies work together toward common themes.",
      timing: "Effects build gradually and can last for weeks to months, depending on the planets involved and their movement speeds.",
      dos: [
        "Embrace the concentrated energy in the stellium sign",
        "Focus intensely on developing the qualities of that sign",
        "Use this time for major transformation in related life areas",
        "Study the meaning and lessons of the stellium sign",
        "Channel the intense energy into productive activities",
        "Pay attention to which life areas are being highlighted",
        "Work with the element and modality of the sign"
      ],
      donts: [
        "Try to avoid or suppress the intense energy",
        "Spread your attention too thin across other areas",
        "Become overwhelmed by the concentration of energy",
        "Ignore the important lessons being offered",
        "Use the power in unbalanced or extreme ways",
        "Resist the changes wanting to happen",
        "Neglect other areas of life completely"
      ],
      opportunities: [
        "Experience rapid growth and development",
        "Master the qualities and skills of the stellium sign",
        "Make significant breakthroughs in related life areas",
        "Develop greater self-awareness and personal power",
        "Align more fully with your authentic nature"
      ],
      warnings: [
        "Energy may feel overwhelming or all-consuming",
        "Life may become unbalanced temporarily",
        "Other people may find your intensity challenging",
        "Changes may happen very rapidly"
      ],
      rituals: [
        "Create a focused meditation practice around the stellium sign",
        "Work with gemstones and colors associated with the sign",
        "Perform daily practices that embody the sign's energy",
        "Keep a detailed journal of your transformation process"
      ],
      affirmations: [
        "I harness this concentrated cosmic energy for my highest growth",
        "I embrace the powerful transformation taking place within me",
        "I master the lessons and gifts of this cosmic alignment",
        "I use this focused energy to create positive change in my life"
      ]
    }
  }
};

// Grand Trine interpretations
export const GRAND_TRINE_INTERPRETATIONS: Record<string, EventInterpretation> = {
  general: {
    title: "Grand Trine Formation",
    subtitle: "Harmonious Flow of Cosmic Energy",
    description: "A Grand Trine forms when three planets create a perfect triangle of 120-degree aspects, representing exceptional harmony and flow. This rare and beneficial formation creates a circuit of supportive energy that facilitates natural talent and effortless manifestation.",
    advice: {
      overview: "Grand Trines represent periods of exceptional flow, natural ability, and harmonious manifestation in the element involved.",
      energy: "Harmonious, flowing, and naturally gifted. Energy moves smoothly between the three planetary points, creating ease and natural ability.",
      timing: "Effects can last from days to months depending on the planets involved. The energy builds to peak efficiency and then gradually dissipates.",
      dos: [
        "Flow with the natural harmony and ease available",
        "Use your natural talents and abilities confidently",
        "Trust in the smooth unfolding of events",
        "Share your gifts and abilities with others",
        "Practice gratitude for the blessings and flow",
        "Take inspired action when opportunities arise",
        "Work with the element of the grand trine (fire, earth, air, water)"
      ],
      donts: [
        "Take the harmonious energy completely for granted",
        "Become lazy or complacent with the ease",
        "Ignore opportunities because they seem too easy",
        "Assume everything will work out without any effort",
        "Overlook the spiritual gifts being offered",
        "Use the harmony for selfish purposes only",
        "Forget to appreciate and share your blessings"
      ],
      opportunities: [
        "Experience effortless success and natural flow",
        "Discover and develop hidden talents and abilities",
        "Create beautiful and harmonious outcomes",
        "Inspire and uplift others through your gifts",
        "Manifest desires with unusual ease and grace"
      ],
      warnings: [
        "Easy energy may lead to complacency or laziness",
        "Opportunities may be missed if not acted upon",
        "Others may feel envious of your natural flow",
        "The harmonious period is temporary and should be utilized"
      ],
      rituals: [
        "Create sacred geometry art or altars in triangular patterns",
        "Practice gratitude ceremonies for your natural gifts",
        "Perform flowing movement practices like dance or tai chi",
        "Meditate on the perfect balance and harmony in nature"
      ],
      affirmations: [
        "I flow naturally with the harmonious energies around me",
        "I trust in my natural abilities and talents",
        "I use my gifts to create beauty and harmony in the world",
        "I am grateful for the ease and flow in my life"
      ]
    }
  }
};