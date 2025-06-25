/* eslint-disable @typescript-eslint/no-unused-vars */

import { ChartAspect } from "../natalChart";
import { AspectInfo, getAspectType, getAspectIcon, getAspectColor } from "./aspectUtilities";

export const getAspectInterpretation = (aspect: ChartAspect): string => {
  const aspectInfo = getFullAspectInfo(aspect);
  return aspectInfo.interpretation;
};

export const getFullAspectInfo = (aspect: ChartAspect): AspectInfo => {
  // PLANETARY ASPECT INTERPRETATIONS CHECKLIST
  // ==========================================
  // 
  // COMPLETE COMBINATIONS (ALL 45 POSSIBLE COMBINATIONS):
  // ✅ sun-moon, sun-mercury, sun-venus, sun-mars, sun-jupiter, sun-saturn, sun-uranus, sun-neptune, sun-pluto (9)
  // ✅ moon-mercury, moon-venus, moon-mars, moon-jupiter, moon-saturn, moon-uranus, moon-neptune, moon-pluto (8)
  // ✅ mercury-venus, mercury-mars, mercury-jupiter, mercury-saturn, mercury-uranus, mercury-neptune, mercury-pluto (7)
  // ✅ venus-mars, venus-jupiter, venus-saturn, venus-uranus, venus-neptune, venus-pluto (6)
  // ✅ mars-jupiter, mars-saturn, mars-uranus, mars-neptune, mars-pluto (5)
  // ✅ jupiter-saturn, jupiter-uranus, jupiter-neptune, jupiter-pluto (4)
  // ✅ saturn-uranus, saturn-neptune, saturn-pluto (3)
  // ✅ uranus-neptune, uranus-pluto (2)
  // ✅ neptune-pluto (1)
  //
  // TOTAL: 45 planetary combinations × 5 major aspects = 225 interpretations
  // Each combination includes: conjunction, sextile, square, trine, opposition

  const planetCombinations: Record<
    string,
    Record<string, Record<string, string>>
  > = {
    sun: {
      moon: {
        conjunction:
          "Your conscious self and emotional nature are perfectly aligned, creating inner harmony and authenticity",
        sextile:
          "Your ego and emotions support each other, leading to balanced self-expression",
        square:
          "Tension between your outer self and inner feelings creates dynamic energy but requires conscious integration",
        trine:
          "Natural flow between your identity and emotions creates ease in self-expression",
        opposition:
          "Your conscious mind and subconscious create a dynamic tension that seeks balance through relationships",
      },
      mercury: {
        conjunction:
          "Your identity and communication are merged, making you a natural spokesperson for your beliefs",
        sextile: "Your self-expression and thinking work together harmoniously",
        square:
          "Mental restlessness and ego conflicts drive you to communicate more assertively",
        trine: "Natural eloquence and confident self-expression",
        opposition:
          "Difficulty integrating your thoughts with your core identity",
      },
      venus: {
        conjunction:
          "Charm, creativity, and self-love are central to your identity",
        sextile: "Natural grace and appeal in how you present yourself",
        square:
          "Creative tension between your values and ego drives artistic expression",
        trine: "Effortless charm and artistic ability",
        opposition: "Seeking validation through relationships and partnerships",
      },
      mars: {
        conjunction:
          "Powerful drive and assertiveness define your core identity",
        sextile: "Confident action and healthy assertiveness",
        square:
          "Impulsive energy and potential for conflict, but great motivation",
        trine: "Natural leadership ability and courageous self-expression",
        opposition:
          "Tendency to project aggression onto others or attract conflict",
      },
      jupiter: {
        conjunction:
          "Expansive, optimistic nature with natural leadership and philosophical outlook",
        sextile: "Confidence enhanced by wisdom and good fortune",
        square:
          "Over-confidence and excess can lead to unrealistic expectations, but drives big thinking",
        trine: "Natural luck, generosity, and ability to inspire others",
        opposition: "Tension between ego and higher wisdom requires balance",
      },
      saturn: {
        conjunction:
          "Serious, disciplined approach to life with strong sense of responsibility",
        sextile:
          "Practical wisdom and ability to achieve goals through steady effort",
        square:
          "Self-doubt and limitation create challenges but build character through perseverance",
        trine: "Natural authority and ability to build lasting structures",
        opposition: "Conflict between personal desires and duties/restrictions",
      },
      uranus: {
        conjunction:
          "Unique, rebellious nature with need for freedom and originality",
        sextile: "Creative innovation and ability to embrace change",
        square:
          "Erratic behavior and rebellion against authority creates instability but drives breakthrough",
        trine:
          "Natural ability to lead change and inspire others with fresh ideas",
        opposition: "Tension between individual expression and group dynamics",
      },
      neptune: {
        conjunction:
          "Highly intuitive, spiritual nature with artistic and compassionate tendencies",
        sextile: "Enhanced creativity and spiritual awareness",
        square:
          "Confusion about identity and tendency toward escapism, but deep creativity",
        trine: "Natural psychic abilities and compassionate leadership",
        opposition: "Difficulty distinguishing between reality and illusion",
      },
      pluto: {
        conjunction:
          "Intense, transformative nature with powerful will and regenerative abilities",
        sextile: "Ability to transform challenges into strengths",
        square:
          "Power struggles and compulsive behavior, but potential for profound transformation",
        trine: "Natural ability to heal and transform others",
        opposition: "Intense power dynamics in relationships",
      },
    },
    moon: {
      mercury: {
        conjunction:
          "Your emotions and thoughts are deeply connected, creating intuitive communication",
        sextile:
          "Emotional intelligence and ability to express feelings clearly",
        square:
          "Emotional thinking can cloud judgment, but brings depth to communication",
        trine: "Natural empathy and emotionally intelligent communication",
        opposition: "Split between emotional reactions and logical thinking",
      },
      venus: {
        conjunction:
          "Deep emotional need for beauty, harmony, and loving relationships",
        sextile: "Natural grace in emotional expression and relationships",
        square:
          "Emotional intensity in love relationships, tendency toward drama",
        trine: "Effortless ability to give and receive love",
        opposition: "Emotional needs conflict with relationship harmony",
      },
      mars: {
        conjunction: "Intense emotional energy and passionate reactions",
        sextile: "Ability to act on emotional instincts constructively",
        square: "Emotional volatility and impulsive reactions under stress",
        trine: "Emotional courage and ability to fight for family/security",
        opposition: "Emotional needs conflict with aggressive impulses",
      },
      jupiter: {
        conjunction:
          "Emotionally generous, optimistic, and nurturing with philosophical bent",
        sextile: "Emotional wisdom and ability to find meaning in experiences",
        square: "Emotional excess and overindulgence, but generous heart",
        trine: "Natural emotional intelligence and ability to comfort others",
        opposition: "Emotional needs conflict with philosophical beliefs",
      },
      saturn: {
        conjunction:
          "Serious emotional nature, may have experienced early restrictions or responsibilities",
        sextile: "Emotional maturity and ability to provide stable support",
        square:
          "Emotional depression or coldness, but develops inner strength through challenges",
        trine: "Reliable emotional support and practical nurturing abilities",
        opposition: "Emotional needs conflict with duties and restrictions",
      },
      uranus: {
        conjunction:
          "Emotionally unpredictable, needs freedom and unique expression",
        sextile: "Emotionally progressive and open to new experiences",
        square:
          "Emotional instability and erratic moods, but innovative feelings",
        trine: "Natural ability to emotionally inspire and liberate others",
        opposition: "Emotional needs conflict with need for independence",
      },
      neptune: {
        conjunction:
          "Highly psychic and emotionally sensitive, may absorb others' feelings",
        sextile: "Enhanced intuition and emotional creativity",
        square:
          "Emotional confusion and tendency to escape reality, but deep empathy",
        trine: "Natural healing abilities and spiritual emotional connection",
        opposition: "Difficulty distinguishing own emotions from others'",
      },
      pluto: {
        conjunction:
          "Intense emotional nature with powerful instincts and transformative experiences",
        sextile: "Ability to emotionally heal and transform",
        square:
          "Emotional extremes and compulsive feelings, but potential for deep healing",
        trine:
          "Natural ability to emotionally regenerate and help others transform",
        opposition: "Intense emotional power dynamics",
      },
    },
    mercury: {
      venus: {
        conjunction:
          "Beautiful, harmonious communication and artistic thinking",
        sextile: "Natural diplomacy and pleasant communication style",
        square: "Tension between logic and aesthetics in decision-making",
        trine: "Effortless charm in communication and artistic expression",
        opposition:
          "Difficulty balancing rational thought with aesthetic values",
      },
      mars: {
        conjunction: "Sharp, decisive communication and quick mental reactions",
        sextile: "Ability to communicate assertively and think strategically",
        square: "Argumentative tendencies and mental restlessness",
        trine: "Quick wit and ability to communicate ideas with energy",
        opposition: "Mental aggression or tendency to be overly critical",
      },
      jupiter: {
        conjunction:
          "Expansive thinking, philosophical communication, and love of learning",
        sextile: "Wise communication and ability to see the big picture",
        square:
          "Tendency to exaggerate or overlook details, but broad thinking",
        trine: "Natural teaching ability and optimistic communication",
        opposition: "Conflict between details and big picture thinking",
      },
      saturn: {
        conjunction:
          "Serious, methodical thinking with focus on structure and long-term planning",
        sextile: "Practical communication and disciplined learning",
        square:
          "Mental blocks and pessimistic thinking, but develops mental discipline",
        trine:
          "Authoritative communication and ability to organize thoughts clearly",
        opposition:
          "Mental restrictions conflict with desire to communicate freely",
      },
      uranus: {
        conjunction:
          "Original, inventive thinking with sudden insights and unconventional ideas",
        sextile: "Progressive thinking and ability to communicate innovations",
        square:
          "Erratic thinking and nervous tension, but breakthrough insights",
        trine: "Natural ability to communicate revolutionary ideas",
        opposition: "Mental tension between conventional and radical thinking",
      },
      neptune: {
        conjunction:
          "Intuitive, imaginative thinking with artistic and spiritual communication",
        sextile: "Enhanced creativity in communication and artistic thinking",
        square:
          "Confused thinking and difficulty with facts, but deep imagination",
        trine: "Natural ability to communicate spiritual and artistic concepts",
        opposition: "Difficulty distinguishing between facts and fantasy",
      },
      pluto: {
        conjunction:
          "Intense, probing mind with ability to uncover hidden truths",
        sextile: "Ability to communicate transformation and healing",
        square:
          "Obsessive thinking and compulsive communication, but penetrating insights",
        trine:
          "Natural ability to communicate profound truths and facilitate healing",
        opposition: "Mental power struggles and intense debates",
      },
    },
    venus: {
      mars: {
        conjunction: "Passionate approach to love and relationships",
        sextile: "Balanced masculine and feminine energies in relationships",
        square:
          "Tension between love and desire creates passionate but challenging relationships",
        trine: "Natural magnetism and ability to attract what you desire",
        opposition: "Conflict between relationship needs and personal desires",
      },
      jupiter: {
        conjunction:
          "Love of beauty, luxury, and expansion in relationships and values",
        sextile: "Natural charm and ability to attract abundance",
        square:
          "Overindulgence and extravagance in love and pleasure, but generous heart",
        trine: "Natural good fortune in love and artistic endeavors",
        opposition: "Conflict between personal values and higher principles",
      },
      saturn: {
        conjunction:
          "Serious approach to love with need for security and commitment",
        sextile:
          "Loyal, lasting relationships and practical artistic expression",
        square:
          "Difficulties in love and self-worth issues, but develops lasting values",
        trine: "Stable, enduring relationships and classical artistic taste",
        opposition: "Love needs conflict with duties and restrictions",
      },
      uranus: {
        conjunction:
          "Unconventional approach to love with need for freedom in relationships",
        sextile:
          "Progressive values and ability to attract unique partnerships",
        square:
          "Unstable relationships and erratic values, but innovative artistic expression",
        trine: "Natural ability to attract unusual and exciting partnerships",
        opposition: "Love needs conflict with need for independence",
      },
      neptune: {
        conjunction:
          "Idealistic, spiritual approach to love with artistic and compassionate nature",
        sextile: "Enhanced artistic abilities and spiritual love",
        square:
          "Unrealistic expectations in love and artistic confusion, but deep compassion",
        trine: "Natural artistic and healing abilities through love",
        opposition: "Difficulty with realistic expectations in relationships",
      },
      pluto: {
        conjunction:
          "Intense, transformative approach to love with powerful attractions",
        sextile: "Ability to transform through love and artistic expression",
        square:
          "Obsessive love and jealousy, but potential for deep transformation through relationships",
        trine: "Natural ability to heal and transform others through love",
        opposition: "Intense power dynamics in relationships",
      },
    },
    mars: {
      jupiter: {
        conjunction:
          "Enthusiastic action with grand ambitions and philosophical drive",
        sextile: "Confident action guided by wisdom and ethical principles",
        square:
          "Overconfident actions and tendency to overextend, but bold initiatives",
        trine: "Natural leadership ability and successful action",
        opposition: "Actions conflict with beliefs and higher principles",
      },
      saturn: {
        conjunction:
          "Disciplined action with focus on long-term goals and structured approach",
        sextile: "Practical action and ability to work steadily toward goals",
        square:
          "Frustrated action and obstacles to progress, but develops persistence",
        trine: "Efficient, well-planned action with lasting results",
        opposition:
          "Drive for action conflicts with restrictions and limitations",
      },
      uranus: {
        conjunction:
          "Revolutionary action with sudden, unconventional approaches",
        sextile: "Innovative action and ability to break new ground",
        square:
          "Erratic, impulsive action and nervous energy, but breakthrough potential",
        trine: "Natural ability to lead change and inspire action in others",
        opposition: "Actions conflict with need for freedom and independence",
      },
      neptune: {
        conjunction: "Inspired action with spiritual or artistic motivation",
        sextile: "Action guided by intuition and compassion",
        square:
          "Confused or misdirected action and lack of clear goals, but inspired creativity",
        trine: "Natural ability to act with compassion and spiritual purpose",
        opposition: "Actions conflict with spiritual ideals",
      },
      pluto: {
        conjunction:
          "Intense, transformative action with powerful will and regenerative drive",
        sextile: "Ability to act with transformative power",
        square:
          "Compulsive action and power struggles, but potential for profound change",
        trine: "Natural ability to act with healing and transformative power",
        opposition: "Actions create intense power dynamics",
      },
    },
    jupiter: {
      saturn: {
        conjunction: "Balancing expansion with discipline, creating structured growth and realistic optimism",
        sextile: "Practical wisdom combined with visionary thinking and steady progress",
        square: "Tension between growth desires and limitations creates learning through measured expansion",
        trine: "Natural ability to manifest dreams through practical application and patience",
        opposition: "Balancing optimism with realism, expansion with conservation"
      },
      uranus: {
        conjunction: "Revolutionary idealism with sudden opportunities for growth and breakthrough",
        sextile: "Progressive thinking combined with fortunate innovations and future-oriented vision",
        square: "Restless desire for change conflicts with expansion, creating erratic growth patterns",
        trine: "Natural ability to revolutionize belief systems and create positive change",
        opposition: "Tension between traditional wisdom and radical innovation"
      },
      neptune: {
        conjunction: "Spiritual idealism with compassionate vision and mystical understanding of truth",
        sextile: "Enhanced intuition in philosophical and spiritual matters",
        square: "Confusion between idealism and reality, tendency toward unrealistic expectations",
        trine: "Natural spiritual wisdom and ability to inspire others with compassionate vision",
        opposition: "Conflict between rational beliefs and mystical experiences"
      },
      pluto: {
        conjunction: "Transformative beliefs with powerful drive to regenerate philosophical systems",
        sextile: "Ability to transform through deep understanding and powerful insights",
        square: "Compulsive need to transform beliefs, power struggles over truth and meaning",
        trine: "Natural ability to heal through wisdom and transform others' belief systems",
        opposition: "Intense conflicts between personal truth and transformative forces"
      }
    },
    saturn: {
      uranus: {
        conjunction: "Revolutionary discipline with structured innovation and systematic change",
        sextile: "Practical innovation and ability to build new structures methodically",
        square: "Tension between old structures and new ideas creates breakthrough through pressure",
        trine: "Natural ability to create lasting change through disciplined innovation",
        opposition: "Conflict between security needs and desire for freedom and change"
      },
      neptune: {
        conjunction: "Disciplined spirituality with structured approach to mystical experiences",
        sextile: "Practical application of spiritual insights and grounded intuition",
        square: "Confusion about responsibilities, tendency toward escapism from duties",
        trine: "Natural ability to manifest spiritual ideals in practical form",
        opposition: "Tension between material responsibilities and spiritual aspirations"
      },
      pluto: {
        conjunction: "Transformative discipline with powerful drive to restructure foundations",
        sextile: "Ability to transform through persistent effort and structural change",
        square: "Power struggles with authority, compulsive need to control or be controlled",
        trine: "Natural ability to heal through discipline and create lasting transformation",
        opposition: "Intense conflicts between control needs and transformative forces"
      }
    },
    uranus: {
      neptune: {
        conjunction: "Revolutionary spirituality with innovative mystical insights and collective vision",
        sextile: "Progressive spiritual awareness and ability to innovate through intuition",
        square: "Confusion about ideals, tension between innovation and spiritual values",
        trine: "Natural ability to revolutionize spiritual understanding and inspire collective change",
        opposition: "Conflict between rational innovation and mystical dissolution"
      },
      pluto: {
        conjunction: "Revolutionary transformation with explosive change and radical regeneration",
        sextile: "Ability to transform through innovation and breakthrough insights",
        square: "Compulsive need for change, destructive rebellion against transformation",
        trine: "Natural ability to heal through revolution and create profound positive change",
        opposition: "Intense conflicts between individual freedom and collective transformation"
      }
    },
    neptune: {
      pluto: {
        conjunction: "Spiritual transformation with mystical regeneration and collective healing",
        sextile: "Ability to transform through spiritual insights and compassionate action",
        square: "Confusion about power, tendency toward spiritual escapism from transformation",
        trine: "Natural ability to heal through spiritual means and facilitate collective regeneration",
        opposition: "Tension between spiritual ideals and transformative realities"
      }
    }
  };

  const p1 = aspect.planet1.toLowerCase();
  const p2 = aspect.planet2.toLowerCase();

  // Try both combinations (planet1-planet2 and planet2-planet1)
  const interpretation =
    planetCombinations[p1]?.[p2]?.[aspect.aspect] ||
    planetCombinations[p2]?.[p1]?.[aspect.aspect];

  const aspectType = getAspectType(aspect.aspect);
  const icon = getAspectIcon(aspectType);
  const color = getAspectColor(aspectType);

  if (interpretation) {
    return {
      interpretation,
      type: aspectType,
      icon,
      color
    };
  }

  // Fallback to generic interpretations
  const aspectMeanings: Record<string, string> = {
    conjunction: "These energies blend and intensify each other",
    sextile: "These energies work together harmoniously and supportively",
    square: "These energies create tension that drives growth and action",
    trine: "These energies flow together naturally and easily",
    opposition: "These energies create balance through conscious integration",
    quincunx:
      "These energies require adjustment and conscious effort to integrate",
  };

  const fallbackInterpretation = aspectMeanings[aspect.aspect] ||
    "This aspect creates a unique dynamic between these planetary energies.";

  return {
    interpretation: fallbackInterpretation,
    type: aspectType,
    icon,
    color
  };
};