/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Matrix of Destiny Interpretations Dictionary
 * 
 * This file contains detailed interpretations for each Major Arcana (1-22) 
 * in the context of specific Matrix of Destiny aspects/themes.
 */

export interface MatrixInterpretation {
  general: string;
  positive: string;
  challenge: string;
  advice: string;
}

export interface MatrixAspectInterpretations {
  [arcanaNumber: number]: MatrixInterpretation;
}

/**
 * Income Streams - How you naturally attract and generate money
 */
export const incomeStreamsInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "You manifest money through willpower and personal initiative. Natural entrepreneur.",
    positive: "Strong ability to create income from nothing, leadership in business ventures",
    challenge: "May struggle with teamwork, tendency to overwork or burn out",
    advice: "Focus your energy on one main income stream before diversifying"
  },
  2: {
    general: "Intuitive approach to money, often through helping others or spiritual work.",
    positive: "Strong psychic sense for profitable opportunities, healing/counseling income",
    challenge: "May undervalue services, difficulty with practical money management",
    advice: "Trust your intuition about financial decisions, charge what you're worth"
  },
  3: {
    general: "Creative abundance, money flows through artistic expression and nurturing others.",
    positive: "Multiple income streams through creativity, natural ability to attract resources",
    challenge: "Tendency to overspend on others, creative projects may lack focus",
    advice: "Turn your creative gifts into sustainable income, set boundaries with generosity"
  },
  4: {
    general: "Structured approach to wealth building, steady income through established systems.",
    positive: "Excellent at building long-term financial stability, reliable income streams",
    challenge: "May be too conservative, slow to adapt to new opportunities",
    advice: "Build solid foundations but remain open to innovative income methods"
  },
  5: {
    general: "Income through teaching, traditional professions, or institutional work.",
    positive: "Stable income from established fields, respect for proper financial protocols",
    challenge: "May resist unconventional income opportunities, limited by tradition",
    advice: "Honor traditional methods while exploring modern financial instruments"
  },
  6: {
    general: "Partnership-based income, money through relationships and collaboration.",
    positive: "Profitable partnerships, income through beauty/relationship industries",
    challenge: "Financial decisions influenced by emotions, dependency on others",
    advice: "Choose business partners carefully, maintain financial independence"
  },
  7: {
    general: "Dynamic income generation, money through movement and determination.",
    positive: "Ability to overcome financial obstacles, income through travel or transportation",
    challenge: "Inconsistent income, tendency to rush financial decisions",
    advice: "Channel your drive into consistent, long-term wealth-building strategies"
  },
  8: {
    general: "Gentle but persistent approach to money, income through patience and inner strength.",
    positive: "Ability to transform financial difficulties into opportunities",
    challenge: "May take too long to act on opportunities, underestimate own abilities",
    advice: "Trust in your quiet power to build wealth steadily over time"
  },
  9: {
    general: "Money comes through wisdom, guidance, and sharing knowledge with others.",
    positive: "Income from teaching, consulting, or spiritual guidance",
    challenge: "May isolate from profitable opportunities, tendency to give away knowledge freely",
    advice: "Value your wisdom and charge appropriately for guidance and expertise"
  },
  10: {
    general: "Cyclical income patterns, money through timing and recognizing opportunities.",
    positive: "Natural luck with investments, ability to time market cycles",
    challenge: "Income may be unpredictable, tendency to rely too much on luck",
    advice: "Learn to recognize and ride the natural cycles of abundance"
  },
  11: {
    general: "Fair and balanced approach to money, income through legal or justice-related work.",
    positive: "Strong ethical foundation in business, income through fairness and integrity",
    challenge: "May be too rigid about 'fair' pricing, slow decision-making process",
    advice: "Balance idealism with practical business needs, trust your moral compass"
  },
  12: {
    general: "Unconventional income path, money through sacrifice and new perspectives.",
    positive: "Ability to profit from seeing opportunities others miss",
    challenge: "May sacrifice too much for others, income requires patience",
    advice: "Sometimes waiting and changing perspective opens unexpected income doors"
  },
  13: {
    general: "Income through transformation, helping others through major changes.",
    positive: "Ability to profit from endings and new beginnings, crisis management",
    challenge: "Income may come through difficult periods, resistance to change",
    advice: "Embrace transformation as your path to financial renewal"
  },
  14: {
    general: "Balanced income approach, money through healing and moderation.",
    positive: "Sustainable income streams, ability to balance multiple financial goals",
    challenge: "May be too cautious, slow to maximize income potential",
    advice: "Find the middle path between financial security and growth"
  },
  15: {
    general: "Material focus on income, potential for high earnings but with strings attached.",
    positive: "Strong material manifestation abilities, high income potential",
    challenge: "May become trapped by money, ethical compromises for profit",
    advice: "Pursue wealth without losing your soul or freedom"
  },
  16: {
    general: "Sudden changes in income, money through breaking old patterns.",
    positive: "Ability to quickly recover from financial setbacks, innovative income",
    challenge: "Unstable income patterns, tendency toward financial shocks",
    advice: "Build emergency funds to weather sudden financial changes"
  },
  17: {
    general: "Hopeful approach to money, income through inspiration and guidance.",
    positive: "Natural optimism attracts opportunities, income through hope and healing",
    challenge: "May be too idealistic about money, unrealistic financial expectations",
    advice: "Keep faith in abundance while taking practical steps toward goals"
  },
  18: {
    general: "Intuitive but unclear income path, money through hidden or mysterious means.",
    positive: "Strong intuition about profitable opportunities, income through mysteries",
    challenge: "Unclear financial direction, tendency toward financial illusions",
    advice: "Trust your intuition but verify all financial information carefully"
  },
  19: {
    general: "Joyful abundance, money flows easily through positive energy and success.",
    positive: "Natural magnetism for wealth, income through happiness and success",
    challenge: "May take abundance for granted, overspending on pleasure",
    advice: "Share your natural abundance while maintaining financial discipline"
  },
  20: {
    general: "Income through calling and life purpose, money aligned with higher mission.",
    positive: "Profitable alignment between purpose and income, transformational work",
    challenge: "May struggle with practical aspects of monetizing purpose",
    advice: "Answer your financial calling and trust that purpose can be profitable"
  },
  21: {
    general: "Complete financial fulfillment, income through mastery and achievement.",
    positive: "Successful completion of financial goals, sustainable wealth",
    challenge: "May rest on achievements, need new financial challenges",
    advice: "Celebrate financial success while setting new meaningful goals"
  },
  22: {
    general: "Fresh start with money, income through new ventures and innocent approaches.",
    positive: "Unlimited potential for income, fresh perspectives on wealth",
    challenge: "Financial naivety, tendency toward impractical money decisions",
    advice: "Embrace new financial opportunities while learning practical skills"
  }
};

/**
 * Work Life Balance - How you balance career and personal life
 */
export const workLifeBalanceInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "Driven professional who needs to learn boundaries between work and personal life.",
    positive: "Strong leadership abilities, can manifest career goals quickly",
    challenge: "Tendency to overwork, difficulty delegating or relaxing",
    advice: "Schedule personal time as seriously as business meetings"
  },
  2: {
    general: "Intuitive approach to work-life balance, needs quiet time for restoration.",
    positive: "Strong ability to sense when balance is needed, intuitive career choices",
    challenge: "May withdraw too much from work demands, difficulty with confrontation",
    advice: "Trust your inner wisdom about when to engage and when to retreat"
  },
  3: {
    general: "Seeks creative fulfillment in both work and personal life, nurturing approach.",
    positive: "Ability to bring creativity to any role, nurturing work environment",
    challenge: "May struggle with structure, tendency to take on too many projects",
    advice: "Focus your creative energy and set boundaries to protect personal time"
  },
  4: {
    general: "Structured approach to balance, prefers clear boundaries between work and home.",
    positive: "Excellent at creating systems that support both career and personal goals",
    challenge: "May be too rigid, difficulty adapting when life demands flexibility",
    advice: "Build in flexibility within your structured approach to balance"
  },
  5: {
    general: "Traditional approach to work-life balance, values established routines.",
    positive: "Stable career progression, respect for proper work-life boundaries",
    challenge: "May resist new ways of working, overly dependent on external validation",
    advice: "Honor tradition while exploring modern approaches to work-life integration"
  },
  6: {
    general: "Seeks harmony and partnership in both professional and personal spheres.",
    positive: "Excellent at collaborative work, values relationships in all areas",
    challenge: "May struggle with independent decision-making, people-pleasing tendencies",
    advice: "Make choices based on your values, not just to keep others happy"
  },
  7: {
    general: "Dynamic approach to balance, able to navigate competing demands with determination.",
    positive: "Strong ability to overcome work-life conflicts, driven to succeed",
    challenge: "May push too hard in both areas, difficulty with stillness",
    advice: "Channel your drive purposefully and schedule regular periods of rest"
  },
  8: {
    general: "Gentle strength in managing work-life demands, patient approach to balance.",
    positive: "Ability to handle pressure with grace, inner strength sustains both areas",
    challenge: "May endure imbalance too long, tendency to put others' needs first",
    advice: "Use your strength to protect your own needs and boundaries"
  },
  9: {
    general: "Reflective approach to balance, needs solitude to recharge from work demands.",
    positive: "Deep wisdom about what truly matters, ability to guide others",
    challenge: "May isolate too much, tendency to overthink work-life decisions",
    advice: "Share your wisdom while maintaining healthy boundaries and social connection"
  },
  10: {
    general: "Cyclical patterns in work-life balance, recognizes natural rhythms and timing.",
    positive: "Ability to flow with changing demands, good timing for major decisions",
    challenge: "Balance may feel unpredictable, tendency to wait for perfect timing",
    advice: "Learn to work with natural cycles while taking proactive steps"
  },
  11: {
    general: "Seeks fairness and justice in work-life balance, values ethical treatment.",
    positive: "Strong sense of what's fair, ability to advocate for balanced policies",
    challenge: "May be too rigid about fairness, difficulty with necessary compromises",
    advice: "Balance your ideals with practical needs and communicate boundaries clearly"
  },
  12: {
    general: "Willing to sacrifice for either work or personal goals, unique perspective on balance.",
    positive: "Ability to see situations from new angles, wisdom through experience",
    challenge: "May sacrifice too much of one area for another, difficulty with conventional balance",
    advice: "Sometimes the most balanced choice requires temporary sacrifice"
  },
  13: {
    general: "Approach to balance involves letting go of what no longer serves.",
    positive: "Ability to transform work-life challenges, comfort with necessary endings",
    challenge: "May resist change even when current balance isn't working",
    advice: "Embrace transformation as the path to better work-life integration"
  },
  14: {
    general: "Natural ability to find middle ground between work and personal demands.",
    positive: "Excellent at moderation, healing approach to work-life stress",
    challenge: "May compromise too much, slow to make necessary changes",
    advice: "Trust your natural ability to find balance while taking decisive action"
  },
  15: {
    general: "May become obsessed with either work success or personal desires.",
    positive: "Intense focus can achieve significant results in chosen area",
    challenge: "Tendency toward addiction to work or pleasure, difficult boundaries",
    advice: "Recognize when you're out of balance and consciously choose moderation"
  },
  16: {
    general: "Sudden disruptions to work-life balance lead to new insights.",
    positive: "Ability to quickly adapt to changing circumstances, innovative solutions",
    challenge: "Unpredictable balance, tendency toward crisis-driven changes",
    advice: "Build flexibility into your life to handle unexpected changes gracefully"
  },
  17: {
    general: "Hopeful and inspiring approach to work-life balance, faith in possibilities.",
    positive: "Natural optimism helps navigate challenges, inspiring to others",
    challenge: "May be unrealistic about time and energy demands",
    advice: "Keep faith in your vision while taking practical steps toward balance"
  },
  18: {
    general: "Intuitive but sometimes unclear path to work-life balance.",
    positive: "Strong intuition about what you need, ability to navigate uncertainty",
    challenge: "May struggle with illusions about work or personal life",
    advice: "Trust your intuition while seeking clarity about your true priorities"
  },
  19: {
    general: "Joyful integration of work and personal life, natural enthusiasm.",
    positive: "Ability to find joy in both work and personal pursuits",
    challenge: "May avoid necessary but unpleasant work-life decisions",
    advice: "Maintain your positive outlook while addressing challenging balance issues"
  },
  20: {
    general: "Called to find higher purpose in work-life integration.",
    positive: "Ability to align work with personal mission, transformational approach",
    challenge: "May struggle with practical aspects of balance",
    advice: "Answer the call to meaningful work while honoring personal needs"
  },
  21: {
    general: "Successful integration of all life areas, mastery of work-life balance.",
    positive: "Achievement of sustainable balance, model for others",
    challenge: "May become complacent, need new challenges to maintain growth",
    advice: "Celebrate your success while continuing to evolve your approach"
  },
  22: {
    general: "Fresh, innocent approach to work-life balance, unlimited potential.",
    positive: "Open to new ways of integrating work and life, natural spontaneity",
    challenge: "May be naive about practical demands, tendency toward impulsiveness",
    advice: "Embrace your fresh perspective while learning from others' experience"
  }
};

/**
 * Ingredients for Love - What you need to give and receive in relationships
 */
export const ingredientsForLoveInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "Love requires independence, passion, and the ability to create together.",
    positive: "Brings strong will and manifestation power to relationships",
    challenge: "May dominate or struggle with vulnerability and interdependence",
    advice: "Balance your leadership with allowing your partner to lead sometimes"
  },
  2: {
    general: "Love needs intuition, mystery, and deep emotional connection.",
    positive: "Brings psychic understanding and emotional depth to love",
    challenge: "May be too passive, difficulty expressing needs directly",
    advice: "Trust your intuition but also communicate your feelings clearly"
  },
  3: {
    general: "Love thrives on creativity, abundance, and nurturing expression.",
    positive: "Brings fertility, creativity, and generous love to relationships",
    challenge: "May mother/smother partners, difficulty receiving care",
    advice: "Balance giving with receiving, allow your partner to nurture you too"
  },
  4: {
    general: "Love requires structure, commitment, and reliable partnership.",
    positive: "Brings stability, protection, and dependable love",
    challenge: "May be too controlling or rigid, difficulty with spontaneity",
    advice: "Provide security while allowing space for growth and change"
  },
  5: {
    general: "Love needs traditional values, guidance, and spiritual connection.",
    positive: "Brings wisdom, tradition, and moral foundation to love",
    challenge: "May be too conventional, judgmental of different approaches",
    advice: "Honor your values while respecting your partner's individual path"
  },
  6: {
    general: "Love is about harmony, choice, and perfect partnership.",
    positive: "Natural ability to create beautiful, balanced relationships",
    challenge: "May struggle with conflict, tendency toward people-pleasing",
    advice: "Embrace necessary conflicts as opportunities for deeper connection"
  },
  7: {
    general: "Love requires determination, movement, and overcoming obstacles together.",
    positive: "Brings drive and determination to overcome relationship challenges",
    challenge: "May be impatient, difficulty with emotional subtlety",
    advice: "Slow down and appreciate the journey, not just the destination"
  },
  8: {
    general: "Love needs patience, inner strength, and gentle power.",
    positive: "Brings healing presence and quiet strength to relationships",
    challenge: "May endure problems too long, difficulty setting boundaries",
    advice: "Use your strength to address issues lovingly but firmly"
  },
  9: {
    general: "Love requires wisdom, solitude, and deep spiritual connection.",
    positive: "Brings profound wisdom and spiritual depth to relationships",
    challenge: "May isolate or become too introspective, difficulty with intimacy",
    advice: "Share your inner world while staying connected to your partner"
  },
  10: {
    general: "Love involves cycles, destiny, and recognizing karmic connections.",
    positive: "Understanding of relationship cycles and karmic patterns",
    challenge: "May believe too much in fate, difficulty taking responsibility",
    advice: "Work with destiny while taking active steps to improve your relationships"
  },
  11: {
    general: "Love needs fairness, balance, and ethical treatment.",
    positive: "Brings strong sense of justice and fairness to relationships",
    challenge: "May be too judgmental or rigid about right and wrong",
    advice: "Balance justice with compassion and forgiveness"
  },
  12: {
    general: "Love requires sacrifice, new perspectives, and patience.",
    positive: "Willingness to sacrifice for love, seeing from partner's perspective",
    challenge: "May sacrifice too much, difficulty maintaining self-identity",
    advice: "Healthy sacrifice enhances love; martyrdom destroys it"
  },
  13: {
    general: "Love involves transformation, letting go, and rebirth.",
    positive: "Ability to transform through love, comfort with relationship changes",
    challenge: "May fear commitment due to awareness of impermanence",
    advice: "Embrace love's transformative power while building stability"
  },
  14: {
    general: "Love needs moderation, healing, and balanced give-and-take.",
    positive: "Natural ability to heal and balance relationship energies",
    challenge: "May avoid necessary extremes, tendency toward emotional neutrality",
    advice: "Sometimes love requires passionate intensity, not just balance"
  },
  15: {
    general: "Love may involve passion, materialism, or power dynamics.",
    positive: "Brings intense passion and material abundance to relationships",
    challenge: "May become possessive, manipulative, or focused on appearances",
    advice: "Enjoy passion and material pleasures without becoming enslaved by them"
  },
  16: {
    general: "Love brings sudden revelations, breaking of patterns, and liberation.",
    positive: "Ability to break free from unhealthy patterns, sudden insights",
    challenge: "Tendency toward dramatic breakups or relationship shocks",
    advice: "Use revelations to build better relationships, not just to escape"
  },
  17: {
    general: "Love is hopeful, inspiring, and connected to higher purpose.",
    positive: "Brings hope, inspiration, and spiritual vision to love",
    challenge: "May have unrealistic expectations or avoid earthly relationship needs",
    advice: "Keep your ideals while embracing the beautiful imperfection of human love"
  },
  18: {
    general: "Love involves mystery, intuition, and navigating illusions.",
    positive: "Deep intuitive understanding of love's mysteries",
    challenge: "May struggle with deception, unclear emotional boundaries",
    advice: "Trust your intuition while maintaining clear communication"
  },
  19: {
    general: "Love is joyful, successful, and radiantly positive.",
    positive: "Brings natural joy, warmth, and success to relationships",
    challenge: "May avoid dealing with relationship shadows or difficulties",
    advice: "Maintain your joy while also addressing necessary growth areas"
  },
  20: {
    general: "Love is a calling, involving rebirth and spiritual awakening.",
    positive: "Love as spiritual awakening, ability to transform through relationships",
    challenge: "May struggle with practical aspects of love and commitment",
    advice: "Answer love's calling while attending to daily relationship needs"
  },
  21: {
    general: "Love represents completion, fulfillment, and mastery of relationship.",
    positive: "Achievement of fulfilling, mature love relationships",
    challenge: "May become complacent or need new relationship challenges",
    advice: "Celebrate your relationship success while continuing to grow together"
  },
  22: {
    general: "Love is an adventure, fresh start, and unlimited potential.",
    positive: "Brings innocence, spontaneity, and unlimited possibility to love",
    challenge: "May be naive about relationship realities, impulsive in love",
    advice: "Embrace love's adventure while learning from experience"
  }
};

/**
 * Past Life Income - How past life patterns affect your money mindset
 */
export const pastLifeIncomeInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "Past life as a leader or innovator influences current money confidence.",
    positive: "Strong innate ability to manifest wealth through personal power",
    challenge: "May have past trauma around leadership responsibilities and money",
    advice: "Trust your natural ability to create wealth through initiative"
  },
  2: {
    general: "Past life connection to mystical or healing arts affects money relationship.",
    positive: "Intuitive understanding of energy exchange and spiritual abundance",
    challenge: "May undervalue spiritual gifts or struggle with material world",
    advice: "Honor both spiritual and material needs in your financial life"
  },
  3: {
    general: "Past life abundance through creativity and nurturing influences current flow.",
    positive: "Natural ability to attract resources through creative and caring work",
    challenge: "May give away too much or struggle with scarcity from past famines",
    advice: "Balance generosity with healthy financial boundaries"
  },
  4: {
    general: "Past life structure and authority around money creates current patterns.",
    positive: "Strong foundation for building lasting wealth and financial security",
    challenge: "May be overly cautious or rigid due to past financial responsibilities",
    advice: "Build on your natural stability while embracing profitable opportunities"
  },
  5: {
    general: "Past life in religious or teaching roles affects money and spiritual values.",
    positive: "Understanding that money can serve higher purposes and spiritual growth",
    challenge: "May have vows of poverty or beliefs that money is unspiritual",
    advice: "Money is a tool for service; use it to support your highest purpose"
  },
  6: {
    general: "Past life partnerships or beauty work influences current money through relationships.",
    positive: "Natural ability to create wealth through partnerships and aesthetic work",
    challenge: "May be dependent on others financially or struggle with self-worth",
    advice: "Develop both partnership abilities and financial independence"
  },
  7: {
    general: "Past life as warrior or traveler affects current dynamic approach to money.",
    positive: "Ability to overcome financial obstacles and adapt to changing circumstances",
    challenge: "May have battle scars around money or tendency toward financial extremes",
    advice: "Channel your warrior spirit into consistent wealth-building strategies"
  },
  8: {
    general: "Past life involving inner strength or healing affects gentle money approach.",
    positive: "Ability to transform financial challenges through patience and inner power",
    challenge: "May have been persecuted for gifts or struggle with receiving abundance",
    advice: "Trust in your quiet power to build wealth through service and healing"
  },
  9: {
    general: "Past life as wise teacher or hermit influences current wisdom-based income.",
    positive: "Deep understanding of true value and ability to guide others financially",
    challenge: "May have isolated from material world or given away wealth for wisdom",
    advice: "Share your financial wisdom while building practical abundance"
  },
  10: {
    general: "Past life involving fate and cycles affects current understanding of financial timing.",
    positive: "Natural understanding of financial cycles and ability to time opportunities",
    challenge: "May have experienced extreme financial ups and downs in past lives",
    advice: "Use your understanding of cycles to create stable abundance"
  },
  11: {
    general: "Past life in legal or justice roles affects current ethical approach to money.",
    positive: "Strong moral foundation for creating wealth through fair means",
    challenge: "May have past karma around judgment or unfair financial treatment",
    advice: "Build wealth through ethical means while releasing past judgments"
  },
  12: {
    general: "Past life sacrifice or martyrdom affects current approach to financial sacrifice.",
    positive: "Understanding that sometimes financial sacrifice leads to greater abundance",
    challenge: "May have pattern of sacrificing too much or martyrdom around money",
    advice: "Wise sacrifice serves others; martyrdom serves no one"
  },
  13: {
    general: "Past life involving major transformation affects current money rebirth patterns.",
    positive: "Ability to completely transform financial circumstances",
    challenge: "May fear financial stability due to past experience of sudden loss",
    advice: "Embrace transformation as your path to greater financial freedom"
  },
  14: {
    general: "Past life in healing or balance affects current moderate approach to money.",
    positive: "Natural ability to create balanced, sustainable financial flow",
    challenge: "May avoid financial extremes even when bold action is needed",
    advice: "Trust your natural balance while taking calculated financial risks"
  },
  15: {
    general: "Past life involving material power or temptation affects current money shadows.",
    positive: "Understanding of material world's power and ability to work with it consciously",
    challenge: "May have past karma around greed, corruption, or material obsession",
    advice: "Use material power wisely without becoming enslaved by it"
  },
  16: {
    general: "Past life involving sudden change or revelation affects current financial disruptions.",
    positive: "Ability to rebuild quickly from financial setbacks",
    challenge: "May have trauma from sudden financial loss or institutional collapse",
    advice: "Build flexibility into your finances to handle unexpected changes"
  },
  17: {
    general: "Past life connection to hope and guidance affects current optimistic money approach.",
    positive: "Natural faith in abundance and ability to inspire others financially",
    challenge: "May be too idealistic about money or avoid practical financial planning",
    advice: "Combine your natural optimism with practical financial wisdom"
  },
  18: {
    general: "Past life involving mystery or illusion affects current unclear money patterns.",
    positive: "Intuitive understanding of hidden financial opportunities",
    challenge: "May have been deceived about money or struggle with financial clarity",
    advice: "Trust your intuition while seeking clear financial information"
  },
  19: {
    general: "Past life success and joy affects current positive relationship with money.",
    positive: "Natural magnetism for abundance and joyful approach to wealth",
    challenge: "May take abundance for granted or avoid financial responsibility",
    advice: "Maintain gratitude for abundance while being a wise steward"
  },
  20: {
    general: "Past life spiritual awakening affects current calling around money and purpose.",
    positive: "Understanding that financial abundance can serve spiritual awakening",
    challenge: "May struggle to integrate spiritual purpose with material needs",
    advice: "Answer your financial calling as part of your spiritual path"
  },
  21: {
    general: "Past life mastery affects current complete approach to financial fulfillment.",
    positive: "Natural wisdom about achieving lasting financial success",
    challenge: "May rest on past achievements or avoid new financial challenges",
    advice: "Use your mastery to help others while continuing your own growth"
  },
  22: {
    general: "Past life new beginning affects current fresh approach to money.",
    positive: "Unlimited potential for creating new financial paradigms",
    challenge: "May repeat past financial mistakes or be naive about money",
    advice: "Embrace fresh financial opportunities while learning from the past"
  }
};

/**
 * Sexuality - How you express and experience sexual energy
 */
export const sexualityInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "Bold, confident sexual energy with strong initiative and creative power.",
    positive: "Natural magnetism, ability to manifest desires, passionate self-expression",
    challenge: "May be too aggressive or focused on personal satisfaction",
    advice: "Balance your powerful sexual energy with consideration for your partner"
  },
  2: {
    general: "Intuitive, mysterious sexuality with deep emotional and psychic connections.",
    positive: "Strong intuitive understanding of partner's needs, mystical sexual experiences",
    challenge: "May be too passive or withdrawn, difficulty expressing desires directly",
    advice: "Trust your intuition while also communicating your needs clearly"
  },
  3: {
    general: "Abundant, creative sexuality with nurturing and fertile energy.",
    positive: "Natural sensuality, creative sexual expression, generous lover",
    challenge: "May focus too much on giving, difficulty receiving pleasure",
    advice: "Balance giving pleasure with allowing yourself to receive fully"
  },
  4: {
    general: "Structured, reliable sexuality with preference for established patterns.",
    positive: "Dependable sexual partner, builds lasting intimate relationships",
    challenge: "May be too rigid or resistant to sexual exploration and variety",
    advice: "Build on your stability while staying open to new experiences"
  },
  5: {
    general: "Traditional approach to sexuality with respect for conventional values.",
    positive: "Honors sexual traditions and commitments, respects boundaries",
    challenge: "May be overly conservative or judgmental about sexual expression",
    advice: "Honor your values while respecting others' sexual journeys"
  },
  6: {
    general: "Harmonious sexuality focused on partnership and aesthetic beauty.",
    positive: "Natural ability to create beautiful sexual experiences, partnership-focused",
    challenge: "May avoid conflict or have difficulty with raw, intense sexuality",
    advice: "Embrace both beauty and intensity in your sexual expression"
  },
  7: {
    general: "Dynamic, goal-oriented sexuality with strong drive and determination.",
    positive: "Passionate sexual energy, ability to overcome sexual obstacles",
    challenge: "May be impatient or focused on performance rather than connection",
    advice: "Channel your sexual drive toward deeper intimacy and connection"
  },
  8: {
    general: "Gentle but powerful sexuality with patience and inner strength.",
    positive: "Healing sexual presence, ability to transform sexual challenges",
    challenge: "May suppress sexual desires or struggle with asserting sexual needs",
    advice: "Trust in your gentle power to create profound sexual connections"
  },
  9: {
    general: "Wise, introspective sexuality with need for deep spiritual connection.",
    positive: "Deep understanding of sexuality's spiritual aspects, wise sexual guidance",
    challenge: "May intellectualize sexuality or avoid physical sexual expression",
    advice: "Integrate your sexual wisdom with embodied physical experience"
  },
  10: {
    general: "Cyclical sexual energy with understanding of natural sexual rhythms.",
    positive: "Natural flow with sexual cycles, understanding of sexual timing",
    challenge: "Sexual energy may be unpredictable or dependent on external factors",
    advice: "Learn to work with your natural sexual cycles while maintaining consistency"
  },
  11: {
    general: "Balanced, fair approach to sexuality with strong ethical foundation.",
    positive: "Natural sense of sexual justice and fairness, ethical sexual behavior",
    challenge: "May be too analytical or rigid about sexual rightness and wrongness",
    advice: "Balance your ethical nature with acceptance of sexual complexity"
  },
  12: {
    general: "Self-sacrificing sexuality with unique perspective on sexual experience.",
    positive: "Willingness to explore unconventional sexual experiences, deep sexual wisdom",
    challenge: "May sacrifice own sexual needs or have martyr complex in sexuality",
    advice: "Healthy sexual sacrifice enhances intimacy; martyrdom destroys it"
  },
  13: {
    general: "Transformative sexuality involving letting go and sexual rebirth.",
    positive: "Ability to transform through sexual experience, comfort with sexual change",
    challenge: "May fear sexual commitment due to awareness of sexual impermanence",
    advice: "Embrace sexuality's transformative power while building intimate stability"
  },
  14: {
    general: "Balanced, healing sexuality with moderation and integration.",
    positive: "Natural ability to heal sexual wounds, balanced sexual expression",
    challenge: "May avoid sexual extremes or intensity, tendency toward sexual neutrality",
    advice: "Sometimes sexuality requires passionate intensity, not just balance"
  },
  15: {
    general: "Intense, material sexuality with strong physical desires and possible obsessions.",
    positive: "Powerful sexual magnetism, ability to embrace sexuality fully",
    challenge: "May become obsessed with sex or use sexuality manipulatively",
    advice: "Enjoy your sexual power without becoming enslaved by desires"
  },
  16: {
    general: "Sudden sexual awakening or disruption of sexual patterns.",
    positive: "Ability to break free from sexual limitations, sudden sexual insights",
    challenge: "Tendency toward sexual shocks, dramatic changes in sexual patterns",
    advice: "Use sexual revelations to build better intimacy, not just to escape"
  },
  17: {
    general: "Hopeful, inspiring sexuality connected to higher love and spiritual purpose.",
    positive: "Brings hope and inspiration to sexual relationships, spiritual sexuality",
    challenge: "May have unrealistic sexual expectations or avoid earthly sexual needs",
    advice: "Keep your sexual ideals while embracing the beautiful reality of physical love"
  },
  18: {
    general: "Mysterious, intuitive sexuality with hidden depths and psychic connections.",
    positive: "Deep intuitive sexual understanding, ability to navigate sexual mysteries",
    challenge: "May struggle with sexual deception or unclear sexual boundaries",
    advice: "Trust your sexual intuition while maintaining clear communication"
  },
  19: {
    general: "Joyful, radiant sexuality with natural enthusiasm and sexual success.",
    positive: "Brings natural joy and warmth to sexual relationships, magnetic sexuality",
    challenge: "May avoid dealing with sexual shadows or difficulties",
    advice: "Maintain your sexual joy while addressing necessary growth areas"
  },
  20: {
    general: "Sexuality as spiritual calling involving sexual awakening and rebirth.",
    positive: "Sexual awakening as spiritual path, ability to transform through sexuality",
    challenge: "May struggle with practical aspects of sexuality and physical needs",
    advice: "Answer sexuality's spiritual calling while honoring physical desires"
  },
  21: {
    general: "Complete sexual fulfillment and mastery of sexual expression.",
    positive: "Achievement of sexual wholeness, integration of all sexual aspects",
    challenge: "May become sexually complacent or need new sexual challenges",
    advice: "Celebrate your sexual wholeness while continuing sexual growth"
  },
  22: {
    general: "Fresh, innocent approach to sexuality with unlimited sexual potential.",
    positive: "Brings spontaneity and unlimited possibility to sexual expression",
    challenge: "May be sexually naive or impulsive in sexual relationships",
    advice: "Embrace sexual adventure while learning from experience"
  }
};

/**
 * Power of Ancestors - How ancestral wisdom and energy supports you
 */
export const powerOfAncestorsInterpretations: MatrixAspectInterpretations = {
  1: {
    general: "Ancestral line of leaders and innovators supports your personal power and initiative.",
    positive: "Strong ancestral backing for leadership roles and creating new ventures",
    challenge: "May carry ancestral burden of having to be strong all the time",
    advice: "Honor your ancestral leadership gifts while allowing yourself to receive support"
  },
  2: {
    general: "Ancestral line of wise women, healers, and mystics supports your intuitive gifts.",
    positive: "Deep connection to ancestral wisdom and psychic abilities",
    challenge: "May carry ancestral trauma around persecution of intuitive gifts",
    advice: "Trust your inherited intuitive abilities and use them to heal ancestral wounds"
  },
  3: {
    general: "Ancestral line of creators, mothers, and nurturers supports your abundant nature.",
    positive: "Strong ancestral support for creativity, fertility, and abundance",
    challenge: "May carry ancestral patterns of over-giving or sacrificing for others",
    advice: "Channel ancestral nurturing wisdom while maintaining healthy boundaries"
  },
  4: {
    general: "Ancestral line of builders, protectors, and leaders supports your structural abilities.",
    positive: "Solid ancestral foundation for creating lasting structures and security",
    challenge: "May carry ancestral burden of responsibility or rigid expectations",
    advice: "Build on ancestral wisdom while allowing for growth and change"
  },
  5: {
    general: "Ancestral line of teachers, priests, and wisdom keepers supports your spiritual path.",
    positive: "Strong ancestral connection to spiritual traditions and moral guidance",
    challenge: "May carry ancestral religious trauma or rigid belief systems",
    advice: "Honor ancestral spiritual wisdom while finding your own authentic path"
  },
  6: {
    general: "Ancestral line of artists, diplomats, and lovers supports your relationship abilities.",
    positive: "Natural ancestral gifts for creating harmony, beauty, and loving relationships",
    challenge: "May carry ancestral patterns of avoiding conflict or people-pleasing",
    advice: "Use ancestral diplomatic gifts while maintaining authentic self-expression"
  },
  7: {
    general: "Ancestral line of warriors, travelers, and achievers supports your determined nature.",
    positive: "Strong ancestral backing for overcoming obstacles and achieving goals",
    challenge: "May carry ancestral battle trauma or tendency toward aggression",
    advice: "Channel ancestral warrior energy into purposeful action and protection"
  },
  8: {
    general: "Ancestral line of healers, shamans, and gentle strength supports your inner power.",
    positive: "Deep ancestral connection to healing abilities and quiet strength",
    challenge: "May carry ancestral trauma around persecution or suppression of gifts",
    advice: "Trust your inherited healing abilities and use them to transform ancestral pain"
  },
  9: {
    general: "Ancestral line of wise elders, hermits, and seekers supports your wisdom path.",
    positive: "Ancient ancestral wisdom available for guidance and spiritual insight",
    challenge: "May carry ancestral patterns of isolation or withdrawal from world",
    advice: "Access ancestral wisdom while maintaining connection to current life"
  },
  10: {
    general: "Ancestral line connected to fate, destiny, and cyclical wisdom supports your timing.",
    positive: "Natural understanding of life cycles and karmic patterns from ancestors",
    challenge: "May carry ancestral karma or feel bound by ancestral fate",
    advice: "Work with ancestral karma consciously to transform patterns and create new destiny"
  },
  11: {
    general: "Ancestral line of judges, lawyers, and justice seekers supports your ethical nature.",
    positive: "Strong ancestral foundation for fairness, justice, and moral decision-making",
    challenge: "May carry ancestral burden of judgment or rigid moral expectations",
    advice: "Balance ancestral sense of justice with compassion and forgiveness"
  },
  12: {
    general: "Ancestral line of martyrs, mystics, and sacrificial figures supports your selfless nature.",
    positive: "Deep ancestral understanding of sacrifice for higher purpose",
    challenge: "May carry ancestral patterns of martyrdom or unnecessary suffering",
    advice: "Transform ancestral sacrifice patterns into conscious service and wisdom"
  },
  13: {
    general: "Ancestral line experienced major transformations and supports your change abilities.",
    positive: "Strong ancestral support for navigating life transitions and transformations",
    challenge: "May carry ancestral trauma from sudden losses or dramatic changes",
    advice: "Use ancestral transformation wisdom to heal the past and embrace positive change"
  },
  14: {
    general: "Ancestral line of healers, moderators, and balanced wisdom supports your integration abilities.",
    positive: "Natural ancestral gifts for healing, balance, and bringing opposing forces together",
    challenge: "May carry ancestral avoidance of necessary conflict or extreme action",
    advice: "Use ancestral healing wisdom while embracing necessary intensity and passion"
  },
  15: {
    general: "Ancestral line experienced material power, temptation, or bondage affecting current patterns.",
    positive: "Understanding of material world's power and how to work with it consciously",
    challenge: "May carry ancestral karma around greed, addiction, or power abuse",
    advice: "Transform ancestral shadow patterns into conscious use of material power"
  },
  16: {
    general: "Ancestral line experienced sudden changes, revelations, or institutional collapse.",
    positive: "Strong ancestral resilience and ability to rebuild from dramatic setbacks",
    challenge: "May carry ancestral trauma from wars, disasters, or sudden upheavals",
    advice: "Use ancestral resilience wisdom to build stability while embracing necessary change"
  },
  17: {
    general: "Ancestral line of visionaries, hope-bringers, and spiritual guides supports your optimistic nature.",
    positive: "Strong ancestral connection to hope, inspiration, and spiritual guidance",
    challenge: "May carry ancestral disappointment or unrealistic expectations",
    advice: "Channel ancestral vision and hope into practical action for positive change"
  },
  18: {
    general: "Ancestral line of mystics, dreamers, and intuitive beings supports your psychic abilities.",
    positive: "Deep ancestral connection to dreams, intuition, and mystical experiences",
    challenge: "May carry ancestral confusion, deception, or mental health challenges",
    advice: "Use ancestral intuitive gifts while maintaining clear boundaries and discernment"
  },
  19: {
    general: "Ancestral line of successful, joyful, and radiant beings supports your positive nature.",
    positive: "Strong ancestral foundation of success, joy, and natural magnetism",
    challenge: "May carry ancestral pressure to always be positive or successful",
    advice: "Honor ancestral joy and success while allowing for full range of human experience"
  },
  20: {
    general: "Ancestral line experienced spiritual awakening and calling supports your higher purpose.",
    positive: "Strong ancestral support for spiritual awakening and fulfilling life purpose",
    challenge: "May carry ancestral burden of spiritual responsibility or mission",
    advice: "Answer ancestral calling while honoring your own unique spiritual path"
  },
  21: {
    general: "Ancestral line of masters, achievers, and fulfilled beings supports your completion abilities.",
    positive: "Strong ancestral wisdom about achieving goals and creating lasting success",
    challenge: "May carry ancestral pressure to achieve or maintain family reputation",
    advice: "Build on ancestral mastery while defining success in your own terms"
  },
  22: {
    general: "Ancestral line offers fresh start energy and unlimited potential for new beginnings.",
    positive: "Ancestral support for breaking old patterns and creating completely new paths",
    challenge: "May carry ancestral naivety or tendency to repeat past mistakes",
    advice: "Use ancestral fresh start energy while learning from ancestral wisdom and experience"
  }
};

/**
 * Get interpretation for specific arcana number in given aspect
 */
export const getMatrixInterpretation = (
  aspect: 'incomeStreams' | 'workLifeBalance' | 'ingredientsForLove' | 'pastLifeIncome' | 'sexuality' | 'powerOfAncestors',
  arcanaNumber: number
): MatrixInterpretation | null => {
  const aspectMap = {
    incomeStreams: incomeStreamsInterpretations,
    workLifeBalance: workLifeBalanceInterpretations,
    ingredientsForLove: ingredientsForLoveInterpretations,
    pastLifeIncome: pastLifeIncomeInterpretations,
    sexuality: sexualityInterpretations,
    powerOfAncestors: powerOfAncestorsInterpretations
  };

  return aspectMap[aspect]?.[arcanaNumber] || null;
};

/**
 * Get all available aspects
 */
export const getAvailableAspects = () => [
  'incomeStreams',
  'workLifeBalance', 
  'ingredientsForLove',
  'pastLifeIncome',
  'sexuality',
  'powerOfAncestors'
] as const;