/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Transiting Planetary Aspects Interpretations
 * 
 * Interpretations for when current planets form aspects to each other
 * Extracts and adapts content from existing natal aspect interpretations
 */

import { EventInterpretation } from '../eventInterpretations';

export const TRANSITING_ASPECTS_INTERPRETATIONS: Record<string, EventInterpretation> = {
  // Major beneficial aspects - extracted from natal interpretations
  trine: {
    title: "Planetary Trine",
    subtitle: "Harmonious Flow - Natural Ease & Support",
    description: "When planets form a trine aspect (120°) in the sky, their energies flow together harmoniously, creating periods of natural ease, support, and positive expression. This represents the most beneficial and flowing of all planetary relationships.",
    advice: {
      overview: "Trine aspects bring natural harmony between planetary energies, offering opportunities for effortless progress and positive expression without internal conflict.",
      energy: "Harmonious, flowing, and supportive. Planetary energies work together naturally without friction or resistance.",
      timing: "Effects are typically gentle and supportive, lasting 2-3 days around the exact aspect. Brings positive momentum and ease.",
      dos: [
        // Extracted from various trine interpretations in aspectInterpretations.ts
        "Take advantage of the natural flow and ease this aspect provides",
        "Express the positive qualities of both planets involved",
        "Use this harmonious energy to make progress on related goals",
        "Allow things to unfold naturally without forcing outcomes",
        "Practice gratitude for the blessings and ease this brings",
        "Share your good fortune and positive energy with others",
        "Build upon the natural talents this aspect enhances",
        "Take action on opportunities that feel effortless and right",
        "Use this supportive energy to help others or serve a cause",
        "Trust in the positive flow and timing of events"
      ],
      donts: [
        // Adapted from trine interpretation warnings
        "Take the easy flow for granted without appreciation",
        "Become lazy or complacent about making effort",
        "Ignore opportunities because they seem too easy",
        "Assume all positive energy will continue without nurturing",
        "Use this ease to avoid necessary challenges or growth",
        "Become overconfident due to temporary ease",
        "Waste the positive energy on frivolous pursuits",
        "Expect others to have the same ease you're experiencing",
        "Ignore the need for action even when things flow well",
        "Take credit for what comes naturally without effort"
      ],
      opportunities: [
        "Experience natural harmony between different life areas",
        "Make effortless progress on goals related to the planets involved",
        "Express your talents and abilities with increased ease",
        "Attract positive experiences and supportive people",
        "Find creative solutions to ongoing challenges",
        "Experience increased confidence and optimism",
        "Build upon existing strengths and natural abilities",
        "Create beauty, harmony, or positive change effortlessly",
        "Connect with others who share your values and interests",
        "Manifest desires that align with your authentic nature"
      ],
      warnings: [
        "The ease may make you complacent about necessary effort",
        "Good fortune might be taken for granted if not consciously appreciated",
        "Others may not experience the same ease and could feel envious",
        "Avoid becoming lazy when things flow too easily",
        "Don't ignore warning signs just because overall energy feels positive",
        "Balance enjoyment of ease with continued growth and challenge",
        "Remember that trines support what already exists rather than create new growth"
      ],
      rituals: [
        "Practice gratitude ceremonies for the harmony and ease in your life",
        "Create beauty or art that expresses the positive planetary energies",
        "Share your good fortune through acts of service or generosity",
        "Perform abundance meditation and appreciation practices",
        "Create harmonious environments that reflect inner ease",
        "Practice activities that naturally combine the planetary energies",
        "Honor the natural talents and gifts this aspect enhances"
      ],
      affirmations: [
        "I appreciate and make good use of the natural ease in my life",
        "I trust in the positive flow of planetary energies supporting me",
        "I express my talents and abilities with grace and confidence",
        "I attract harmony and positive experiences effortlessly",
        "I use my natural gifts to benefit both myself and others",
        "I am grateful for the blessings and support in my life",
        "I allow positive energy to flow through me to help others"
      ]
    }
  },
  sextile: {
    title: "Planetary Sextile",
    subtitle: "Supportive Opportunity - Growth Through Effort",
    description: "When planets form a sextile aspect (60°) in the sky, they create supportive opportunities that manifest through conscious effort and active engagement. This represents potential that becomes real through purposeful action.",
    advice: {
      overview: "Sextile aspects offer supportive opportunities that require conscious effort to manifest. They provide helpful energy for growth when actively engaged.",
      energy: "Supportive, opportunity-focused, and growth-oriented. Planetary energies support each other when actively engaged and developed.",
      timing: "Effects are most noticeable when you take conscious action. Lasts 2-3 days around the exact aspect with opportunities for development.",
      dos: [
        // Extracted from various sextile interpretations
        "Actively engage with opportunities that present themselves",
        "Take conscious steps to develop the potential this aspect offers",
        "Combine the planetary energies through purposeful action",
        "Seek out learning experiences related to these planetary themes",
        "Practice skills that utilize both planetary energies",
        "Network and connect with others who can support your growth",
        "Take initiative on projects that feel supportive and promising",
        "Apply effort consistently to manifest the potential available",
        "Look for ways to serve others using these combined energies",
        "Develop talents that naturally emerge during this time"
      ],
      donts: [
        // Adapted from sextile warnings
        "Wait for opportunities to develop themselves without your input",
        "Ignore the potential because it requires effort to manifest",
        "Assume things will happen automatically without conscious work",
        "Give up if progress feels slow or requires sustained effort",
        "Miss opportunities because they seem too ordinary or practical",
        "Avoid networking or connecting with others who could help",
        "Expect dramatic results without consistent application",
        "Overlook small but significant steps forward",
        "Focus only on end results rather than the learning process",
        "Dismiss the value of incremental progress and skill building"
      ],
      opportunities: [
        "Develop new skills that combine the planetary energies involved",
        "Connect with people who support your growth and development",
        "Make practical progress on goals through consistent effort",
        "Learn new approaches to existing challenges or interests",
        "Build networks and relationships that support your aspirations",
        "Discover talents and abilities you didn't know you had",
        "Find practical ways to apply theoretical knowledge or interests",
        "Create positive changes through small but consistent actions",
        "Develop confidence through successfully meeting challenges",
        "Establish foundations for longer-term growth and development"
      ],
      warnings: [
        "Opportunities require active engagement to become real benefits",
        "Progress may feel slow but is building important foundations",
        "Don't expect instant results from sextile energy - it builds over time",
        "Others may not recognize the value of what you're developing",
        "Sustained effort is needed to fully realize the potential",
        "Small steps are more effective than dramatic gestures",
        "Focus on skill-building rather than immediate achievement"
      ],
      rituals: [
        "Set specific goals for developing the opportunities presented",
        "Create study or practice schedules that engage both planetary energies",
        "Network and connect with others who share your interests",
        "Establish daily practices that build relevant skills",
        "Document your progress and learning in journals or portfolios",
        "Seek out mentors or teachers in areas of developing interest",
        "Create project plans that utilize the supportive energy available"
      ],
      affirmations: [
        "I actively engage with opportunities for growth and development",
        "I appreciate the supportive energy available to me",
        "I take consistent action to manifest my potential",
        "I connect with others who support my learning and growth",
        "I trust in my ability to develop new skills and abilities",
        "I value progress over perfection in my development",
        "I am open to learning and growing through conscious effort"
      ]
    }
  },
  square: {
    title: "Planetary Square",
    subtitle: "Dynamic Tension - Growth Through Challenge",
    description: "When planets form a square aspect (90°) in the sky, they create dynamic tension and challenging energy that demands integration and conscious work. This represents friction that leads to strength and breakthrough when properly handled.",
    advice: {
      overview: "Square aspects create challenging tension between planetary energies that requires conscious integration work. They provide opportunities for significant growth through overcoming obstacles.",
      energy: "Tense, challenging, and dynamic. Planetary energies conflict and require conscious work to integrate harmoniously.",
      timing: "Effects build tension for several days, peak during the exact aspect, and require integration work afterward. Can last 5-7 days total.",
      dos: [
        // Extracted from various square interpretations
        "Face the tension and challenges directly rather than avoiding them",
        "Work consciously to integrate the conflicting planetary energies",
        "Use the dynamic tension as motivation for personal growth",
        "Practice patience while working through the challenging energy",
        "Seek creative solutions that honor both planetary needs",
        "Channel the intensity into productive activities and goals",
        "Learn from the conflicts and obstacles that arise",
        "Develop strength and resilience through meeting challenges",
        "Practice conscious choice-making when energies feel conflicted",
        "Find healthy outlets for the increased tension and energy"
      ],
      donts: [
        // Adapted from square warnings
        "Avoid or suppress the tension without addressing its source",
        "Make impulsive decisions based on the temporary conflict",
        "Give up when facing obstacles or setbacks during this time",
        "Take conflicts with others personally rather than seeing the cosmic pattern",
        "Force outcomes without doing the inner integration work",
        "Blame external circumstances for internal conflicts",
        "Use the tension to justify harmful or destructive behavior",
        "Ignore the lessons the challenges are trying to teach",
        "Expect easy solutions to complex integration challenges",
        "Let frustration turn into anger or resentment toward others"
      ],
      opportunities: [
        "Develop strength and resilience through overcoming challenges",
        "Break through limiting patterns that have restricted growth",
        "Gain clarity about what needs integration in your life",
        "Build character through consciously handling difficult situations",
        "Discover creative solutions to seemingly impossible problems",
        "Develop skills in conflict resolution and energy management",
        "Strengthen your ability to make conscious choices under pressure",
        "Transform obstacles into stepping stones for advancement",
        "Learn valuable lessons about balance and integration",
        "Build confidence through successfully navigating challenges"
      ],
      warnings: [
        "Tension and conflicts may feel more intense than usual",
        "Patience is required as integration work takes time",
        "Others may also be affected by challenging planetary energies",
        "Avoid making permanent decisions during peak tension",
        "Physical and emotional stress levels may be elevated",
        "Old patterns may resist the changes this tension demands",
        "Creative solutions may require thinking outside conventional approaches",
        "The growth this brings may feel uncomfortable initially"
      ],
      rituals: [
        "Practice stress-reduction techniques like meditation or yoga",
        "Create creative outlets for intense or conflicted energy",
        "Journal about the tensions and conflicts to gain clarity",
        "Engage in physical exercise to channel dynamic energy constructively",
        "Practice conflict resolution and communication skills",
        "Create art or music that expresses and transforms tension",
        "Seek guidance from counselors or mentors during challenging periods"
      ],
      affirmations: [
        "I transform challenges into opportunities for growth and strength",
        "I integrate conflicting energies within myself with wisdom and patience",
        "I face obstacles with courage and find creative solutions",
        "I use tension and conflict as motivation for positive change",
        "I trust that challenges are helping me develop strength and character",
        "I remain centered and conscious when facing difficult situations",
        "I grow stronger and wiser through every challenge I overcome"
      ]
    }
  },
  opposition: {
    title: "Planetary Opposition",
    subtitle: "Polarized Awareness - Balance Through Integration",
    description: "When planets form an opposition aspect (180°) in the sky, they create polarized energy that demands conscious awareness and integration of opposing forces. This represents the need to find balance and wholeness through understanding opposites.",
    advice: {
      overview: "Opposition aspects create awareness of polarized energies that require conscious integration and balance. They offer opportunities for greater wholeness through understanding opposites.",
      energy: "Polarized, awareness-creating, and integrative. Planetary energies pull in opposite directions, demanding conscious balance and perspective.",
      timing: "Effects build for several days, culminate during the exact opposition, and require integration work afterward. Full cycle can last 5-7 days.",
      dos: [
        // Extracted from various opposition interpretations
        "Seek to understand and integrate both sides of the polarity",
        "Practice objectivity and see situations from multiple perspectives",
        "Look for the middle ground between extremes",
        "Use the tension to develop greater awareness and consciousness",
        "Practice balancing opposing needs within yourself and relationships",
        "Seek wisdom from the tension between different viewpoints",
        "Develop diplomatic skills and the ability to mediate conflicts",
        "Honor both sides of your nature without rejecting either",
        "Use the opposition to gain clarity about your values and priorities",
        "Practice conscious choice-making when pulled in different directions"
      ],
      donts: [
        // Adapted from opposition warnings
        "Choose one side and completely reject the other",
        "Get lost in indecision or paralysis from seeing both sides",
        "Project one side of the polarity onto others and reject it in yourself",
        "Make decisions based on extremes rather than integrated wisdom",
        "Blame others for conflicts that reflect your own internal oppositions",
        "Avoid making any choice because of the tension between options",
        "Force premature resolution without fully understanding both sides",
        "Use the polarity to justify destructive or harmful behavior",
        "Ignore the valuable perspective each side of the opposition offers",
        "Expect simple solutions to complex integration challenges"
      ],
      opportunities: [
        "Develop greater objectivity and perspective on life situations",
        "Learn to balance opposing forces within yourself and relationships",
        "Gain wisdom through understanding different viewpoints",
        "Develop diplomatic and mediation skills",
        "Create more wholeness by integrating rejected aspects of yourself",
        "Find creative solutions that honor multiple perspectives",
        "Build bridges between opposing groups or viewpoints",
        "Develop greater consciousness through working with polarities",
        "Strengthen relationships through better understanding of differences",
        "Create balance in areas of life that have been one-sided"
      ],
      warnings: [
        "Polarized energy may create internal or external conflicts",
        "Others may seem to embody the opposite energy you're rejecting",
        "Decision-making may feel more complex and challenging",
        "Relationships may highlight areas needing better balance",
        "Avoid swinging between extremes rather than finding integration",
        "Both sides of the polarity contain important truths",
        "Integration takes time and conscious effort",
        "The tension may feel uncomfortable but is necessary for growth"
      ],
      rituals: [
        "Practice meditation that honors both sides of the polarity",
        "Create artistic expressions that integrate opposing themes",
        "Journal about the different perspectives and find common ground",
        "Practice dialogue techniques that honor multiple viewpoints",
        "Create ceremonies that balance opposing energies or elements",
        "Engage in partner activities that require cooperation and balance",
        "Study wisdom traditions that teach about polarity and integration"
      ],
      affirmations: [
        "I honor and integrate all aspects of myself with wisdom and compassion",
        "I see value in different perspectives and find common ground",
        "I balance opposing forces within myself and my relationships",
        "I trust my ability to make wise decisions when facing complex choices",
        "I create wholeness by embracing rather than rejecting parts of myself",
        "I find strength and wisdom through working with polarities",
        "I am a bridge between different perspectives and experiences"
      ]
    }
  },
  conjunction: {
    title: "Planetary Conjunction",
    subtitle: "Unified Focus - Merged Energies & New Cycles",
    description: "When planets form a conjunction (0°) in the sky, their energies merge and focus together, creating concentrated power and new beginning energy. This represents the fusion of different planetary principles into unified expression.",
    advice: {
      overview: "Conjunction aspects merge planetary energies into unified focus, creating concentrated power and opportunities for new beginnings in the areas represented by the planets involved.",
      energy: "Unified, concentrated, and new-beginning oriented. Planetary energies merge to create focused power and fresh start potential.",
      timing: "Effects build for several days before, peak during the exact conjunction, and continue to unfold for weeks afterward as the new cycle develops.",
      dos: [
        // Extracted from various conjunction interpretations
        "Focus your energy in areas represented by the combined planetary themes",
        "Start new projects or cycles related to the planets involved",
        "Use the concentrated power for creative expression and manifestation",
        "Align with the unified energy rather than fighting internal conflicts",
        "Set intentions that honor both planetary energies working together",
        "Take advantage of the fresh start energy this conjunction provides",
        "Channel the intensity into productive and creative outlets",
        "Practice integration of the different planetary qualities",
        "Use this powerful moment for important beginnings and initiatives",
        "Trust your instincts about new directions that want to emerge"
      ],
      donts: [
        // Adapted from conjunction warnings
        "Ignore the powerful energy or waste it on trivial pursuits",
        "Let the intensity become overwhelming or destructive",
        "Force outcomes instead of working with the natural unified flow",
        "Start too many things at once because the energy feels so powerful",
        "Neglect to ground the energy in practical, achievable goals",
        "Suppress either planetary energy in favor of only one",
        "Make impulsive decisions based on the temporary intensity",
        "Expect others to understand or share your intense focus",
        "Use the power to manipulate or control rather than create",
        "Rush the process instead of allowing natural development"
      ],
      opportunities: [
        "Begin new cycles and projects with concentrated power behind them",
        "Express unified aspects of yourself that integrate different qualities",
        "Manifest goals that combine the themes of both planets involved",
        "Experience breakthrough clarity about your direction and purpose",
        "Channel intense creative or transformative energy productively",
        "Align with cosmic timing for important new beginnings",
        "Develop new aspects of personality that integrate opposing qualities",
        "Create powerful artistic or creative expressions",
        "Experience heightened intuition and spiritual insight",
        "Build momentum for long-term growth and development"
      ],
      warnings: [
        "The concentrated energy may feel overwhelming or intense",
        "Balance is needed to avoid extremes or one-sided expression",
        "Others may react strongly to your increased intensity or focus",
        "New beginnings may require releasing old patterns or attachments",
        "The power needs conscious direction to be constructive rather than destructive",
        "Integration of the planetary energies may take time to stabilize",
        "Avoid making permanent decisions during peak intensity",
        "Physical and emotional systems may need extra support during intense periods"
      ],
      rituals: [
        "Create powerful intention-setting ceremonies for new beginnings",
        "Practice meditation that focuses and unifies scattered energies",
        "Create art or music that expresses the unified planetary themes",
        "Perform planting or creation rituals that honor new growth",
        "Establish new daily practices that integrate the planetary energies",
        "Create sacred space that honors the power of unified focus",
        "Document insights and visions that arise during powerful conjunctions"
      ],
      affirmations: [
        "I channel concentrated planetary energy toward my highest good",
        "I trust in the power of new beginnings and fresh starts in my life",
        "I integrate different aspects of myself into unified, authentic expression",
        "I use cosmic timing to support my goals and creative expression",
        "I honor the power within me and direct it toward constructive purposes",
        "I am aligned with natural cycles of growth and renewal",
        "I manifest my intentions with focused energy and clear purpose"
      ]
    }
  }
};