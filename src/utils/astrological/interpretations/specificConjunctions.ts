/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Specific Conjunction Types Interpretations
 * 
 * Detailed interpretations for specific planetary conjunctions as astrological events
 * Extracts and adapts content from existing natal conjunction interpretations
 */

import { EventInterpretation } from '../eventInterpretations';

export const SPECIFIC_CONJUNCTION_INTERPRETATIONS: Record<string, EventInterpretation> = {
  'venus-mars': {
    title: "Venus-Mars Conjunction",
    subtitle: "Love Meets Passion - Desire & Attraction",
    description: "When Venus and Mars unite in the sky, love and desire merge, creating passionate and attractive energy. This conjunction brings opportunities for romance, creativity, and integrating tender affection with passionate expression.",
    advice: {
      overview: "Venus-Mars conjunctions amplify romantic and creative energy, offering opportunities to balance love with passion and beauty with action.",
      energy: "Passionate, attractive, and creative. Love and desire energies merge to create magnetic and dynamic romantic/creative potential.",
      timing: "Effects last 3-5 days around the exact conjunction, with romantic and creative themes heightened during this period.",
      dos: [
        // Extracted from natal Venus-Mars conjunction interpretation
        "Express love and affection with passion and authenticity",
        "Channel creative energy into artistic or romantic projects",
        "Balance tender affection with passionate physical expression",
        "Take action on romantic opportunities that feel genuine",
        "Create beauty through active artistic engagement",
        "Practice healthy expression of both giving and receiving love",
        "Integrate romantic ideals with realistic relationship action",
        "Use this energy for creative collaboration and partnerships",
        "Express sexuality in ways that honor both love and desire",
        "Take initiative in matters of the heart with sincerity"
      ],
      donts: [
        // Adapted from natal interpretation warnings
        "Force romantic or sexual situations that don't feel natural",
        "Separate love from physical expression completely",
        "Use charm or attraction to manipulate others",
        "Rush into relationships based solely on physical attraction",
        "Suppress either romantic feelings or passionate desires",
        "Create drama or conflict between love and sexuality",
        "Use this energy in ways that harm existing relationships",
        "Ignore the deeper emotional needs behind physical attraction",
        "Act on attractions without considering consequences",
        "Force creative expression that doesn't flow naturally"
      ],
      opportunities: [
        // Adapted for transiting conjunction context
        "Experience heightened romantic attraction and magnetism",
        "Create beautiful art that expresses passion and love",
        "Strengthen existing relationships through renewed passion",
        "Attract romantic opportunities aligned with your values",
        "Integrate masculine and feminine energies within yourself",
        "Experience breakthrough creativity in artistic endeavors",
        "Heal relationships between love and sexuality",
        "Find new ways to express affection and desire",
        "Create partnerships that balance friendship with passion",
        "Develop confident expression of romantic and creative energy"
      ],
      warnings: [
        "Romantic and sexual energy may be more intense than usual",
        "Attractions may be powerful but potentially temporary",
        "Existing relationship dynamics may be challenged or enhanced",
        "Creative inspiration may be strong but require focused action",
        "Balance passion with consideration for others' feelings",
        "Avoid making permanent decisions based solely on current attraction",
        "Channel intense energy constructively rather than destructively"
      ],
      rituals: [
        "Create art or music expressing love and passion",
        "Perform ceremonies honoring both Venus and Mars energies",
        "Practice partner meditation or creative collaboration",
        "Create romantic or aesthetic environments",
        "Engage in dance or movement that expresses both beauty and power",
        "Write poetry or create beauty that captures passionate feelings",
        "Practice rituals that integrate giving and receiving love"
      ],
      affirmations: [
        "I express love and passion with authenticity and balance",
        "I attract relationships that honor both my heart and desires",
        "I create beauty through passionate and inspired action",
        "I integrate love and sexuality in healthy, harmonious ways",
        "I am magnetic and attractive while remaining true to my values",
        "I channel creative and romantic energy for the highest good",
        "I deserve love that includes both tenderness and passion"
      ]
    }
  },
  'jupiter-saturn': {
    title: "Jupiter-Saturn Conjunction",
    subtitle: "Great Conjunction - Growth Meets Structure",
    description: "The Jupiter-Saturn conjunction, known as the Great Conjunction, occurs every 20 years and represents the balance between expansion and limitation, optimism and realism. This marks major societal and personal cycles of growth and structure-building.",
    advice: {
      overview: "Great Conjunctions mark major 20-year cycles where growth and structure unite, offering opportunities to build lasting expansion through disciplined effort.",
      energy: "Balanced between expansion and limitation, optimism and realism. Serious growth energy that builds lasting foundations for future success.",
      timing: "Effects build for months before and continue for years after, marking major societal and personal cycles. Most intense for 2-3 weeks around exact conjunction.",
      dos: [
        // Extracted from natal Jupiter-Saturn conjunction interpretation
        "Build lasting success through disciplined growth and realistic planning",
        "Balance optimism with practical consideration of actual circumstances",
        "Develop realistic optimism that accounts for both possibilities and limitations",
        "Create long-term plans that balance faith with practical steps",
        "Seek wisdom from both traditional and progressive sources",
        "Focus on quality over quantity in all expansion efforts",
        "Take responsibility for your growth and philosophical development",
        "Build structures that can support sustainable expansion",
        "Practice patience with the slow but steady progress of meaningful goals",
        "Learn from both success and failure with equal wisdom",
        "Integrate spiritual growth with practical achievement",
        "Create teachings or systems that help others grow responsibly"
      ],
      donts: [
        // Adapted from natal interpretation warnings
        "Expect quick results from efforts requiring long-term building",
        "Ignore practical limitations when making expansion plans",
        "Become overly pessimistic about growth possibilities",
        "Give up on important goals when progress feels slow",
        "Rush through the foundational work needed for lasting success",
        "Ignore either the need for growth or the importance of structure",
        "Become dogmatic about either traditional or progressive approaches",
        "Overcommit to expansion without building adequate foundations",
        "Let pessimism override healthy optimism about the future",
        "Avoid taking responsibility for both successes and failures"
      ],
      opportunities: [
        // Adapted for Great Conjunction context
        "Establish lasting foundations for the next 20-year cycle",
        "Create systems that support both growth and stability",
        "Develop wisdom that integrates optimism with realism",
        "Build authority through demonstrated competence and vision",
        "Create teachings or work that serves both individual and collective growth",
        "Establish institutions or structures that support beneficial expansion",
        "Develop leadership skills that balance inspiration with responsibility",
        "Create long-term success through patient, consistent effort",
        "Bridge differences between traditional and progressive approaches",
        "Establish your reputation through reliable delivery of quality work"
      ],
      warnings: [
        "This marks the beginning of a 20-year cycle requiring patience and persistence",
        "Conflicts between expansion and limitation may create internal tension",
        "Progress may feel frustratingly slow but will prove lasting",
        "Old structures may need to be dismantled before new ones can be built",
        "Balance is crucial - avoid extremes of either pessimism or unrealistic optimism",
        "Social and economic structures may undergo significant changes",
        "Personal authority and belief systems may be tested and refined"
      ],
      rituals: [
        "Create ceremonies marking the beginning of new 20-year cycles",
        "Build altars representing both expansion and structure",
        "Practice meditation integrating wisdom and practical knowledge",
        "Create long-term vision boards with realistic timelines",
        "Perform ceremonies honoring both teachers and students",
        "Practice gratitude for both achievements and lessons learned",
        "Create rituals that integrate spiritual and material success"
      ],
      affirmations: [
        "I build lasting success through disciplined growth and realistic planning",
        "I balance optimism with wisdom and practical consideration",
        "I create structures that support beneficial expansion and growth",
        "I am patient with the natural timing of meaningful achievement",
        "I integrate spiritual wisdom with practical accomplishment",
        "I take responsibility for creating positive change in the world",
        "I build a legacy that serves both current and future generations"
      ]
    }
  },
  'sun-mercury': {
    title: "Sun-Mercury Conjunction (Cazimi)",
    subtitle: "Mind Meets Identity - Mental Illumination",
    description: "When Mercury conjoins the Sun, especially when very close (Cazimi), the mind and identity unite, creating periods of mental clarity, inspired communication, and brilliant insights. This conjunction illuminates thinking and enhances self-expression.",
    advice: {
      overview: "Sun-Mercury conjunctions bring mental illumination and enhanced communication, offering opportunities for inspired thinking and clear self-expression.",
      energy: "Mentally illuminated, communicatively enhanced, and intellectually confident. Mind and identity work together for clear expression and brilliant insights.",
      timing: "Effects are strongest for 2-3 days around the exact conjunction, with enhanced mental clarity and communication abilities during this period.",
      dos: [
        // Extracted from natal Sun-Mercury conjunction interpretation
        "Express your thoughts and ideas with confidence and clarity",
        "Trust your mental abilities and intellectual insights",
        "Communicate your authentic perspective and unique viewpoint",
        "Write, speak, or teach about subjects you're passionate about",
        "Use this time for important communications and presentations",
        "Trust your intellectual analysis and decision-making abilities",
        "Share your knowledge and insights with others generously",
        "Focus mental energy on projects aligned with your authentic self",
        "Practice clear, direct communication without unnecessary complexity",
        "Use enhanced mental clarity for problem-solving and planning",
        "Document important insights and ideas that arise",
        "Engage in learning that supports your personal development"
      ],
      donts: [
        // Adapted from natal interpretation warnings
        "Become overly subjective or unable to see other perspectives",
        "Use enhanced mental abilities to manipulate or deceive others",
        "Dismiss others' ideas without fair consideration",
        "Become arrogant about your intellectual capabilities",
        "Force your perspective on others without listening to their input",
        "Use mental clarity to criticize or judge others harshly",
        "Ignore practical considerations in favor of intellectual ideals",
        "Overwhelm others with too much information or complex ideas",
        "Make important decisions based solely on mental analysis",
        "Ignore intuitive guidance in favor of purely logical thinking"
      ],
      opportunities: [
        // Adapted for transiting conjunction context
        "Experience breakthrough insights about your life direction and purpose",
        "Communicate your authentic self with unprecedented clarity",
        "Receive inspired ideas for creative or professional projects",
        "Develop greater confidence in your intellectual abilities",
        "Create clear plans and strategies for important goals",
        "Write, speak, or teach with enhanced effectiveness",
        "Solve problems that have been challenging you",
        "Gain mental clarity about complex situations or decisions",
        "Connect your thinking more closely with your authentic identity",
        "Experience enhanced learning and comprehension abilities"
      ],
      warnings: [
        "Mental energy may be so strong it creates information overload",
        "Enhanced confidence may lead to intellectual arrogance if not conscious",
        "Others may feel overwhelmed by your mental energy or communication",
        "Balance mental analysis with emotional and intuitive considerations",
        "Avoid making purely logical decisions that ignore other factors",
        "Be mindful of talking too much or dominating conversations",
        "Remember to listen as much as you speak during this enhanced period"
      ],
      rituals: [
        "Practice sunrise meditation to connect with solar-mental energy",
        "Write in journals to capture insights and mental breakthroughs",
        "Create study or learning rituals that honor both mind and identity",
        "Practice clear communication exercises and public speaking",
        "Create art or writing that expresses your authentic intellectual perspective",
        "Perform ceremonies honoring both wisdom and self-expression",
        "Practice mindfulness to integrate mental insights with authentic being"
      ],
      affirmations: [
        "I express my thoughts and ideas with clarity and confidence",
        "My mind and identity work together for my highest good",
        "I communicate my authentic perspective with wisdom and compassion",
        "I trust my intellectual insights and mental abilities",
        "I use my mental gifts to serve both my growth and others' benefit",
        "I balance mental analysis with intuitive wisdom in all decisions",
        "I am clear, confident, and authentic in all my communications"
      ]
    }
  },
  'moon-venus': {
    title: "Moon-Venus Conjunction",
    subtitle: "Emotional Harmony - Feelings Meet Beauty",
    description: "When the Moon and Venus unite, emotional needs and aesthetic values merge, creating natural charm, artistic sensitivity, and a desire for beauty and harmony. This conjunction enhances emotional receptivity and the ability to create comfort and beauty.",
    advice: {
      overview: "Moon-Venus conjunctions bring emotional harmony and aesthetic sensitivity, offering opportunities to create beauty and enhance relationships through emotional authenticity.",
      energy: "Emotionally harmonious, aesthetically sensitive, and relationship-oriented. Feelings and values work together to create beauty and comfort.",
      timing: "Effects last 2-3 days around the exact conjunction, with heightened emotional sensitivity and aesthetic appreciation during this period.",
      dos: [
        // Extracted from natal Moon-Venus conjunction interpretation
        "Express emotions through creative and artistic outlets",
        "Create beauty and comfort in your environment",
        "Practice emotional honesty in relationships",
        "Use this time for nurturing activities and self-care",
        "Share your natural charm and warmth with others",
        "Appreciate beauty in nature, art, and relationships",
        "Trust your emotional intuition about aesthetic choices",
        "Create harmony between personal needs and social values",
        "Practice loving kindness toward yourself and others",
        "Engage in activities that bring emotional pleasure and satisfaction"
      ],
      donts: [
        // Adapted from natal interpretation warnings
        "Become emotionally dependent on others' approval or affection",
        "Use charm to manipulate or avoid difficult conversations",
        "Suppress authentic feelings to maintain surface harmony",
        "Overindulge in comfort foods or material pleasures",
        "Avoid necessary conflicts in favor of false peace",
        "Take your natural attractiveness or charm for granted",
        "Ignore practical needs in favor of aesthetic preferences",
        "Become overly sensitive to criticism or rejection",
        "Let emotional needs override important values or boundaries",
        "Use emotional manipulation to get your way in relationships"
      ],
      opportunities: [
        "Experience heightened emotional sensitivity and artistic inspiration",
        "Create beautiful art, music, or environments that express your feelings",
        "Strengthen relationships through emotional authenticity and charm",
        "Develop greater appreciation for beauty and aesthetic harmony",
        "Find comfort and healing through creative or artistic activities",
        "Attract loving relationships and positive social connections",
        "Express emotions in ways that create beauty and harmony",
        "Develop your natural talents for creating comfort and pleasure",
        "Experience deeper emotional satisfaction in relationships",
        "Heal emotional wounds through self-care and creative expression"
      ],
      warnings: [
        "Emotional sensitivity may be heightened and require extra care",
        "Others may be drawn to your charm but misunderstand your depth",
        "Avoid using emotional appeals to get your way unfairly",
        "Balance emotional needs with practical responsibilities",
        "Don't sacrifice authenticity for the sake of being liked",
        "Be mindful of emotional eating or overindulgence",
        "Ensure relationships are based on genuine connection, not just attraction"
      ],
      rituals: [
        "Create art or music that expresses your emotional state",
        "Practice self-care rituals that nurture your emotional well-being",
        "Spend time in beautiful natural settings for emotional healing",
        "Create harmonious and beautiful living spaces",
        "Practice gratitude for the love and beauty in your life",
        "Engage in partner activities that build emotional intimacy",
        "Honor the feminine principle through goddess or moon rituals"
      ],
      affirmations: [
        "I express my emotions through beauty and creative expression",
        "I attract loving relationships that honor my authentic feelings",
        "I create harmony between my emotional needs and aesthetic values",
        "I am worthy of love, beauty, and emotional fulfillment",
        "I use my natural charm and sensitivity to help and heal others",
        "I find emotional satisfaction through creating beauty in the world",
        "I trust my feelings to guide me toward what is truly beautiful and nourishing"
      ]
    }
  },
  'mars-jupiter': {
    title: "Mars-Jupiter Conjunction",
    subtitle: "Action Meets Expansion - Enthusiastic Initiative",
    description: "When Mars and Jupiter unite, action and expansion merge to create enthusiastic initiative and optimistic energy. This conjunction brings courage, adventure, and the ability to take bold action toward growth and opportunities.",
    advice: {
      overview: "Mars-Jupiter conjunctions bring enthusiastic energy and optimistic action, offering opportunities for bold initiatives and adventurous growth.",
      energy: "Energetic, optimistic, and action-oriented. Physical energy and expansion work together to create enthusiastic momentum for growth.",
      timing: "Effects last 3-5 days around the exact conjunction, with increased energy, optimism, and desire for adventure during this period.",
      dos: [
        // Extracted from natal Mars-Jupiter conjunction interpretation  
        "Take bold action on opportunities for growth and expansion",
        "Channel enthusiasm into productive activities and meaningful goals",
        "Use increased energy for adventure, travel, or learning experiences",
        "Practice generous action and help others achieve their goals",
        "Take calculated risks that align with your values and vision",
        "Use physical energy for activities that broaden your horizons",
        "Express confidence and optimism through your actions",
        "Pursue educational or spiritual activities with vigor",
        "Take leadership in causes you believe in passionately",
        "Use this dynamic energy to overcome obstacles and limitations"
      ],
      donts: [
        // Adapted from natal interpretation warnings
        "Take excessive risks or act without considering consequences",
        "Let overconfidence lead to poor judgment or overextension",
        "Force your beliefs or opinions on others aggressively",
        "Scatter your energy across too many different pursuits",
        "Act impulsively based on temporary enthusiasm",
        "Ignore practical limitations in favor of grand gestures",
        "Use increased energy to dominate or overpower others",
        "Make promises you cannot realistically keep",
        "Let optimism override necessary caution or planning",
        "Become self-righteous about your actions or beliefs"
      ],
      opportunities: [
        "Launch new adventures, projects, or educational pursuits",
        "Take bold action on goals that require courage and initiative",
        "Experience breakthrough energy for overcoming obstacles",
        "Develop confidence through taking appropriate risks",
        "Expand your horizons through travel, study, or new experiences",
        "Build enthusiasm and motivation for long-term goals",
        "Inspire others through your optimistic action and energy",
        "Develop leadership skills through enthusiastic initiative",
        "Connect with mentors or teachers who support your growth",
        "Break through limitations that have restricted your expansion"
      ],
      warnings: [
        "Energy levels may be very high and require conscious direction",
        "Optimism may lead to overestimating your capabilities or resources",
        "Others may feel overwhelmed by your enthusiasm or energy",
        "Avoid making permanent commitments based on temporary enthusiasm",
        "Physical activity may be more intense - pace yourself appropriately",
        "Balance bold action with realistic planning and consideration",
        "Channel competitive energy constructively rather than destructively"
      ],
      rituals: [
        "Engage in vigorous physical exercise or outdoor adventures",
        "Set ambitious but achievable goals for personal growth",
        "Practice archery, martial arts, or other focused physical disciplines",
        "Create adventure plans that combine action with learning",
        "Perform fire ceremonies that honor both warrior and teacher energies",
        "Plan educational trips or journeys that expand your worldview",
        "Practice generous acts of service that require physical energy"
      ],
      affirmations: [
        "I take bold action aligned with my highest values and vision",
        "I channel my enthusiasm into meaningful and productive activities",
        "I have the courage to pursue opportunities for growth and expansion",
        "I inspire others through my optimistic energy and confident action",
        "I use my physical energy to serve my spiritual and educational goals",
        "I trust my ability to overcome obstacles and achieve my dreams",
        "I balance enthusiasm with wisdom in all my actions and decisions"
      ]
    }
  },
  'venus-jupiter': {
    title: "Venus-Jupiter Conjunction",
    subtitle: "Love Meets Abundance - Beauty & Expansion",
    description: "When Venus and Jupiter unite, love and expansion merge to create abundance in relationships, art, and values. This conjunction brings good fortune in love, enhanced creativity, and the ability to attract beauty and prosperity.",
    advice: {
      overview: "Venus-Jupiter conjunctions bring abundance and expansion in love, creativity, and values, offering opportunities for enhanced relationships and artistic expression.",
      energy: "Abundant, harmonious, and expansive. Love and growth energies combine to create beauty, prosperity, and positive relationships.",
      timing: "Effects last 3-5 days around the exact conjunction, with increased charm, creativity, and opportunities for love and abundance.",
      dos: [
        // Extracted from natal Venus-Jupiter conjunction interpretation
        "Express love and appreciation generously to others",
        "Create beautiful art that reflects your expanded consciousness",
        "Share your abundance and good fortune with those in need",
        "Pursue romantic opportunities with optimism and confidence",
        "Invest in beauty, art, or experiences that bring joy",
        "Practice gratitude for the love and beauty in your life",
        "Use your natural charm to build bridges and create harmony",
        "Seek out cultural experiences that expand your aesthetic appreciation",
        "Express your values through generous and loving actions",
        "Trust in the abundance of love and beauty available to you"
      ],
      donts: [
        // Adapted from natal interpretation warnings
        "Overindulge in luxury, food, or material pleasures",
        "Take good fortune in love or money for granted",
        "Make promises you cannot afford to keep financially or emotionally",
        "Use your charm to manipulate others for personal gain",
        "Ignore practical considerations in favor of idealistic romance",
        "Become lazy or complacent about maintaining relationships",
        "Overspend on beautiful things without considering consequences",
        "Expect others to match your level of generosity or optimism",
        "Avoid difficult conversations by using charm or distraction",
        "Let abundance make you arrogant or insensitive to others' struggles"
      ],
      opportunities: [
        "Experience increased good fortune in love and relationships",
        "Create beautiful art, music, or environments that inspire others",
        "Attract abundance and prosperity through positive relationships",
        "Develop greater appreciation for beauty, culture, and the arts",
        "Form partnerships that combine love with shared values",
        "Experience breakthrough creativity and artistic inspiration",
        "Find teachers or mentors in areas of beauty, love, or values",
        "Heal relationships through generous love and understanding",
        "Expand your social circle with positive, growth-oriented people",
        "Manifest desires related to love, beauty, and creative expression"
      ],
      warnings: [
        "Good fortune may lead to overconfidence or taking things for granted",
        "Tendency toward overindulgence in pleasure or luxury",
        "Others may be attracted to your charm but not understand your depth",
        "Romantic optimism may ignore practical relationship considerations",
        "Financial generosity may exceed your actual resources",
        "Balance appreciation for beauty with attention to substance",
        "Avoid using good fortune to avoid necessary growth challenges"
      ],
      rituals: [
        "Create abundant and beautiful altars honoring love and prosperity",
        "Practice gratitude ceremonies for the beauty and love in your life",
        "Engage in artistic creation that expresses joy and abundance",
        "Perform generosity rituals, sharing abundance with others",
        "Create romantic or aesthetic experiences that celebrate love",
        "Practice abundance meditation and visualization",
        "Honor Venus and Jupiter through beauty and wisdom ceremonies"
      ],
      affirmations: [
        "I attract and create abundance in love, beauty, and prosperity",
        "I share my good fortune generously and joyfully with others",
        "I am worthy of the love, beauty, and abundance flowing to me",
        "I create art and beauty that reflects my expanded consciousness",
        "I trust in the universe's infinite capacity for love and abundance",
        "I use my charm and attractiveness to create positive change",
        "I attract relationships that combine love with shared growth and values"
      ]
    }
  }
};