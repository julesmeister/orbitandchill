/* eslint-disable @typescript-eslint/no-unused-vars */

export interface TarotCard {
  id: string;
  name: string;
  suit?: 'Cups' | 'Wands' | 'Pentacles' | 'Swords';
  type: 'Major Arcana' | 'Minor Arcana';
  number?: number;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: {
    upright: string[];
    reversed: string[];
  };
  description: string;
  imageUrl?: string;
  element?: 'Fire' | 'Water' | 'Earth' | 'Air';
  astrologicalCorrespondence?: string;
}

export const tarotCards: TarotCard[] = [
  // Major Arcana (0-21)
  {
    id: 'the-fool',
    name: 'The Fool',
    type: 'Major Arcana',
    number: 0,
    uprightMeaning: 'New beginnings, innocence, spontaneity, free spirit, fresh start',
    reversedMeaning: 'Recklessness, taking risks, foolishness, lack of direction',
    keywords: {
      upright: ['new beginnings', 'innocence', 'adventure', 'free spirit', 'spontaneity'],
      reversed: ['recklessness', 'carelessness', 'risk-taking', 'foolishness', 'chaos']
    },
    description: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
    imageUrl: '/tarots/fool.jpg',
    element: 'Air',
    astrologicalCorrespondence: 'Uranus'
  },
  {
    id: 'the-magician',
    name: 'The Magician',
    type: 'Major Arcana',
    number: 1,
    uprightMeaning: 'Manifestation, resourcefulness, power, inspired action, willpower',
    reversedMeaning: 'Manipulation, poor planning, untapped talents, lack of focus',
    keywords: {
      upright: ['manifestation', 'willpower', 'desire', 'creation', 'skill'],
      reversed: ['manipulation', 'cunning', 'trickery', 'wasted talent', 'illusion']
    },
    description: 'The Magician is about making higher and better use of one\'s spiritual and material resources. You have the power to manifest your desires through focused intention.',
    imageUrl: '/tarots/magician.jpg',
    element: 'Air',
    astrologicalCorrespondence: 'Mercury'
  },
  {
    id: 'the-high-priestess',
    name: 'The High Priestess',
    type: 'Major Arcana',
    number: 2,
    uprightMeaning: 'Intuitive, subconscious mind, inner wisdom, spirituality, higher power',
    reversedMeaning: 'Lack of center, lost inner voice, repressed feelings, blocked intuition',
    keywords: {
      upright: ['intuition', 'mystery', 'subconscious', 'wisdom', 'spirituality'],
      reversed: ['confusion', 'disconnection', 'repression', 'blocked intuition', 'secrets']
    },
    description: 'The High Priestess represents wisdom, serenity, knowledge and understanding. She is often described as the guardian of the unconscious.',
    element: 'Water',
    astrologicalCorrespondence: 'Moon'
  },
  {
    id: 'the-empress',
    name: 'The Empress',
    type: 'Major Arcana',
    number: 3,
    uprightMeaning: 'Femininity, beauty, nature, nurturing, abundance, creativity',
    reversedMeaning: 'Creative block, dependence on others, smothering, lack of growth',
    keywords: {
      upright: ['abundance', 'nurturing', 'fertility', 'beauty', 'nature'],
      reversed: ['dependence', 'smothering', 'emptiness', 'nosiness', 'lack of growth']
    },
    description: 'The Empress signifies a strong connection with our femininity. She is also often interpreted as motherhood, marriage or a strong, empowering woman.',
    element: 'Earth',
    astrologicalCorrespondence: 'Venus'
  },
  {
    id: 'the-emperor',
    name: 'The Emperor',
    type: 'Major Arcana',
    number: 4,
    uprightMeaning: 'Authority, father-figure, structure, solid foundation, leadership',
    reversedMeaning: 'Domination, excessive control, rigidity, lack of discipline',
    keywords: {
      upright: ['authority', 'structure', 'control', 'fatherhood', 'leadership'],
      reversed: ['tyranny', 'rigidity', 'coldness', 'domination', 'excessive control']
    },
    description: 'The Emperor represents the masculine principle - the patriarch or father figure. It suggests structure, rules, power and authority.',
    element: 'Fire',
    astrologicalCorrespondence: 'Aries'
  },
  {
    id: 'the-hierophant',
    name: 'The Hierophant',
    type: 'Major Arcana',
    number: 5,
    uprightMeaning: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions',
    reversedMeaning: 'Personal beliefs, freedom, challenging the status quo, unconventional',
    keywords: {
      upright: ['tradition', 'conformity', 'morality', 'ethics', 'knowledge'],
      reversed: ['rebellion', 'subversiveness', 'new approaches', 'ignorance', 'freedom']
    },
    description: 'The Hierophant represents conventional wisdom and traditional values. It suggests seeking counsel from a mentor or spiritual advisor.',
    element: 'Earth',
    astrologicalCorrespondence: 'Taurus'
  },
  {
    id: 'the-lovers',
    name: 'The Lovers',
    type: 'Major Arcana',
    number: 6,
    uprightMeaning: 'Love, harmony, relationships, values alignment, choices, partnerships',
    reversedMeaning: 'Self-love, disharmony, imbalance, misalignment of values',
    keywords: {
      upright: ['love', 'harmony', 'relationships', 'values', 'choices'],
      reversed: ['disharmony', 'imbalance', 'misalignment', 'broken relationship', 'self-love']
    },
    description: 'The Lovers represent love, harmony and relationships in your life. It can also indicate important choices and the need for commitment.',
    element: 'Air',
    astrologicalCorrespondence: 'Gemini'
  },
  {
    id: 'the-chariot',
    name: 'The Chariot',
    type: 'Major Arcana',
    number: 7,
    uprightMeaning: 'Control, willpower, success, determination, direction, focus',
    reversedMeaning: 'Self-discipline, opposition, lack of direction, scattered energy',
    keywords: {
      upright: ['control', 'willpower', 'success', 'determination', 'direction'],
      reversed: ['lack of control', 'lack of direction', 'aggression', 'obstacles', 'scattered energy']
    },
    description: 'The Chariot represents a struggle which has been, or is to be, won. It suggests triumph through maintaining focus and determination.',
    element: 'Water',
    astrologicalCorrespondence: 'Cancer'
  },
  {
    id: 'strength',
    name: 'Strength',
    type: 'Major Arcana',
    number: 8,
    uprightMeaning: 'Strength, courage, persuasion, influence, compassion, self-control',
    reversedMeaning: 'Self-doubt, weakness, insecurity, lack of confidence, low energy',
    keywords: {
      upright: ['strength', 'courage', 'persuasion', 'influence', 'compassion'],
      reversed: ['self-doubt', 'weakness', 'insecurity', 'lack of confidence', 'low energy']
    },
    description: 'Strength represents inner strength, personal power, self-confidence, courage, and self-discipline. It suggests conquering challenges through quiet strength.',
    element: 'Fire',
    astrologicalCorrespondence: 'Leo'
  },
  {
    id: 'the-hermit',
    name: 'The Hermit',
    type: 'Major Arcana',
    number: 9,
    uprightMeaning: 'Soul searching, seeking inner guidance, introspection, meditation',
    reversedMeaning: 'Isolation, loneliness, withdrawal, paranoia, anti-social behavior',
    keywords: {
      upright: ['soul searching', 'introspection', 'inner guidance', 'meditation', 'contemplation'],
      reversed: ['isolation', 'loneliness', 'withdrawal', 'anti-social', 'paranoia']
    },
    description: 'The Hermit suggests that you are in a phase of introspection where you are drawing your attention inwards and looking for answers within.',
    element: 'Earth',
    astrologicalCorrespondence: 'Virgo'
  },
  {
    id: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    type: 'Major Arcana',
    number: 10,
    uprightMeaning: 'Good luck, karma, life cycles, destiny, a turning point',
    reversedMeaning: 'Bad luck, lack of control, clinging to control, bad luck',
    keywords: {
      upright: ['good luck', 'karma', 'life cycles', 'destiny', 'turning point'],
      reversed: ['bad luck', 'lack of control', 'clinging to control', 'bad karma', 'misfortune']
    },
    description: 'The Wheel of Fortune represents the cyclical nature of life and suggests that change is inevitable. What goes up must come down.',
    element: 'Fire',
    astrologicalCorrespondence: 'Jupiter'
  },
  {
    id: 'justice',
    name: 'Justice',
    type: 'Major Arcana',
    number: 11,
    uprightMeaning: 'Justice, fairness, truth, cause and effect, law, balance',
    reversedMeaning: 'Unfairness, lack of accountability, dishonesty, bias, avoiding responsibility',
    keywords: {
      upright: ['justice', 'fairness', 'truth', 'cause and effect', 'law'],
      reversed: ['unfairness', 'lack of accountability', 'dishonesty', 'bias', 'avoiding responsibility']
    },
    description: 'Justice represents fairness, balance, and truth. It suggests that you need to be accountable for your actions and decisions.',
    element: 'Air',
    astrologicalCorrespondence: 'Libra'
  },
  {
    id: 'the-hanged-man',
    name: 'The Hanged Man',
    type: 'Major Arcana',
    number: 12,
    uprightMeaning: 'Suspension, restriction, letting go, sacrifice, waiting, perspective',
    reversedMeaning: 'Delays, resistance, stalling, indecision, lack of sacrifice',
    keywords: {
      upright: ['suspension', 'restriction', 'letting go', 'sacrifice', 'waiting'],
      reversed: ['delays', 'resistance', 'stalling', 'indecision', 'lack of sacrifice']
    },
    description: 'The Hanged Man represents a need to suspend action, and as a result, gain insight and a new perspective on things.',
    element: 'Water',
    astrologicalCorrespondence: 'Neptune'
  },
  {
    id: 'death',
    name: 'Death',
    type: 'Major Arcana',
    number: 13,
    uprightMeaning: 'Endings, beginnings, change, transformation, transition, letting go',
    reversedMeaning: 'Resistance to change, personal transformation, inner purging',
    keywords: {
      upright: ['endings', 'beginnings', 'change', 'transformation', 'transition'],
      reversed: ['resistance to change', 'personal transformation', 'inner purging', 'fear of change', 'stagnation']
    },
    description: 'Death represents the end of a major phase or aspect of your life that you realize is no longer serving you, opening up the possibility of something far more valuable.',
    element: 'Water',
    astrologicalCorrespondence: 'Scorpio'
  },
  {
    id: 'temperance',
    name: 'Temperance',
    type: 'Major Arcana',
    number: 14,
    uprightMeaning: 'Balance, moderation, patience, purpose, divine guidance, harmony',
    reversedMeaning: 'Imbalance, excess, self-healing, realignment, lack of patience',
    keywords: {
      upright: ['balance', 'moderation', 'patience', 'purpose', 'divine guidance'],
      reversed: ['imbalance', 'excess', 'self-healing', 'realignment', 'lack of patience']
    },
    description: 'Temperance is about moderation, patience, and finding the middle ground. It suggests that you are learning to bring balance to your life.',
    element: 'Fire',
    astrologicalCorrespondence: 'Sagittarius'
  },
  {
    id: 'the-devil',
    name: 'The Devil',
    type: 'Major Arcana',
    number: 15,
    uprightMeaning: 'Bondage, addiction, sexuality, materialism, playfulness, commitment',
    reversedMeaning: 'Releasing limiting beliefs, exploring dark thoughts, detachment',
    keywords: {
      upright: ['bondage', 'addiction', 'sexuality', 'materialism', 'playfulness'],
      reversed: ['releasing limiting beliefs', 'exploring dark thoughts', 'detachment', 'freedom', 'revelation']
    },
    description: 'The Devil represents being bound by materialistic desires and negative thinking. It suggests examining what is holding you back.',
    element: 'Earth',
    astrologicalCorrespondence: 'Capricorn'
  },
  {
    id: 'the-tower',
    name: 'The Tower',
    type: 'Major Arcana',
    number: 16,
    uprightMeaning: 'Sudden change, upheaval, chaos, revelation, awakening, liberation',
    reversedMeaning: 'Personal transformation, fear of change, averting disaster',
    keywords: {
      upright: ['sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'],
      reversed: ['personal transformation', 'fear of change', 'averting disaster', 'delayed disaster', 'avoiding trauma']
    },
    description: 'The Tower represents change in the most radical and momentous sense. It suggests the breaking down of old forms to make way for the new.',
    element: 'Fire',
    astrologicalCorrespondence: 'Mars'
  },
  {
    id: 'the-star',
    name: 'The Star',
    type: 'Major Arcana',
    number: 17,
    uprightMeaning: 'Hope, faith, purpose, renewal, spirituality, healing, inspiration',
    reversedMeaning: 'Lack of faith, despair, self-trust, disconnection, discouragement',
    keywords: {
      upright: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'],
      reversed: ['lack of faith', 'despair', 'self-trust', 'disconnection', 'discouragement']
    },
    description: 'The Star represents hope, faith, and spiritual guidance. It suggests that you are entering a peaceful, loving phase in your life.',
    element: 'Air',
    astrologicalCorrespondence: 'Aquarius'
  },
  {
    id: 'the-moon',
    name: 'The Moon',
    type: 'Major Arcana',
    number: 18,
    uprightMeaning: 'Illusion, fear, anxiety, subconscious, intuition, dreams',
    reversedMeaning: 'Release of fear, repressed emotion, inner confusion, self-deception',
    keywords: {
      upright: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
      reversed: ['release of fear', 'repressed emotion', 'inner confusion', 'self-deception', 'blocked intuition']
    },
    description: 'The Moon represents illusions, dreams, and the subconscious. It suggests that not everything is as it appears to be.',
    element: 'Water',
    astrologicalCorrespondence: 'Pisces'
  },
  {
    id: 'the-sun',
    name: 'The Sun',
    type: 'Major Arcana',
    number: 19,
    uprightMeaning: 'Positivity, fun, warmth, success, vitality, joy, confidence',
    reversedMeaning: 'Inner child, feeling down, overly optimistic, pessimism',
    keywords: {
      upright: ['positivity', 'fun', 'warmth', 'success', 'vitality'],
      reversed: ['inner child', 'feeling down', 'overly optimistic', 'pessimism', 'lack of enthusiasm']
    },
    description: 'The Sun represents success, radiance and abundance. It suggests that you are experiencing a time of happiness and positivity.',
    element: 'Fire',
    astrologicalCorrespondence: 'Sun'
  },
  {
    id: 'judgement',
    name: 'Judgement',
    type: 'Major Arcana',
    number: 20,
    uprightMeaning: 'Judgement, rebirth, inner calling, forgiveness, second chances',
    reversedMeaning: 'Self-doubt, inner critic, ignoring the call, lack of forgiveness',
    keywords: {
      upright: ['judgement', 'rebirth', 'inner calling', 'forgiveness', 'second chances'],
      reversed: ['self-doubt', 'inner critic', 'ignoring the call', 'lack of forgiveness', 'harsh judgment']
    },
    description: 'Judgement represents rebirth, inner calling and forgiveness. It suggests that you are reaching a time of spiritual development.',
    element: 'Fire',
    astrologicalCorrespondence: 'Pluto'
  },
  {
    id: 'the-world',
    name: 'The World',
    type: 'Major Arcana',
    number: 21,
    uprightMeaning: 'Completion, accomplishment, travel, fulfillment, sense of belonging',
    reversedMeaning: 'Seeking personal closure, short-cuts, delays, personal goals',
    keywords: {
      upright: ['completion', 'accomplishment', 'travel', 'fulfillment', 'sense of belonging'],
      reversed: ['seeking personal closure', 'short-cuts', 'delays', 'personal goals', 'lack of completion']
    },
    description: 'The World represents an ending to a cycle of life, a pause in life before the next big cycle beginning with the fool.',
    element: 'Earth',
    astrologicalCorrespondence: 'Saturn'
  },

  // Minor Arcana - Cups (Water Element)
  {
    id: 'ace-of-cups',
    name: 'Ace of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 1,
    uprightMeaning: 'Love, new relationships, compassion, creativity, spirituality',
    reversedMeaning: 'Self-love, intuition, repressed emotions, spiritual awakening',
    keywords: {
      upright: ['love', 'new relationships', 'compassion', 'creativity', 'spirituality'],
      reversed: ['self-love', 'intuition', 'repressed emotions', 'spiritual awakening', 'blocked creativity']
    },
    description: 'The Ace of Cups represents new beginnings in love, relationships, and emotional fulfillment.',
    element: 'Water'
  },
  {
    id: 'two-of-cups',
    name: 'Two of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 2,
    uprightMeaning: 'Unified love, partnership, mutual attraction, relationships, connections',
    reversedMeaning: 'Self-love, break-ups, disharmony, distrust, separation',
    keywords: {
      upright: ['unified love', 'partnership', 'mutual attraction', 'relationships', 'connections'],
      reversed: ['self-love', 'break-ups', 'disharmony', 'distrust', 'separation']
    },
    description: 'The Two of Cups represents partnership, relationships, and emotional connections with others.',
    element: 'Water'
  },
  {
    id: 'three-of-cups',
    name: 'Three of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 3,
    uprightMeaning: 'Celebration, friendship, creativity, collaborations, community',
    reversedMeaning: 'Independence, alone time, hardcore partying, three\'s a crowd',
    keywords: {
      upright: ['celebration', 'friendship', 'creativity', 'collaborations', 'community'],
      reversed: ['independence', 'alone time', 'hardcore partying', 'three\'s a crowd', 'gossip']
    },
    description: 'The Three of Cups represents celebration, friendship, and creative collaborations.',
    element: 'Water'
  },
  {
    id: 'four-of-cups',
    name: 'Four of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 4,
    uprightMeaning: 'Meditation, contemplation, apathy, reevaluation, boredom',
    reversedMeaning: 'Retreat, withdrawal, checking in, new opportunities, motivation',
    keywords: {
      upright: ['meditation', 'contemplation', 'apathy', 'reevaluation', 'boredom'],
      reversed: ['retreat', 'withdrawal', 'checking in', 'new opportunities', 'motivation']
    },
    description: 'The Four of Cups represents apathy, contemplation, and missed opportunities.',
    element: 'Water'
  },
  {
    id: 'five-of-cups',
    name: 'Five of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 5,
    uprightMeaning: 'Regret, failure, disappointment, pessimism, sadness',
    reversedMeaning: 'Personal setbacks, self-forgiveness, moving on, acceptance',
    keywords: {
      upright: ['regret', 'failure', 'disappointment', 'pessimism', 'sadness'],
      reversed: ['personal setbacks', 'self-forgiveness', 'moving on', 'acceptance', 'recovery']
    },
    description: 'The Five of Cups represents regret, disappointment, and the need to focus on what remains.',
    element: 'Water'
  },
  {
    id: 'six-of-cups',
    name: 'Six of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 6,
    uprightMeaning: 'Revisiting the past, childhood memories, innocence, joy, nostalgia',
    reversedMeaning: 'Living in the past, forgiveness, lacking playfulness, unrealistic',
    keywords: {
      upright: ['revisiting the past', 'childhood memories', 'innocence', 'joy', 'nostalgia'],
      reversed: ['living in the past', 'forgiveness', 'lacking playfulness', 'unrealistic', 'stuck in past']
    },
    description: 'The Six of Cups represents nostalgia, childhood memories, and innocence.',
    element: 'Water'
  },
  {
    id: 'seven-of-cups',
    name: 'Seven of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 7,
    uprightMeaning: 'Opportunities, choices, wishful thinking, illusion, fantasy',
    reversedMeaning: 'Alignment, personal values, overwhelmed by choices, diversion',
    keywords: {
      upright: ['opportunities', 'choices', 'wishful thinking', 'illusion', 'fantasy'],
      reversed: ['alignment', 'personal values', 'overwhelmed by choices', 'diversion', 'lack of focus']
    },
    description: 'The Seven of Cups represents choices, opportunities, and the need to focus.',
    element: 'Water'
  },
  {
    id: 'eight-of-cups',
    name: 'Eight of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 8,
    uprightMeaning: 'Disappointment, abandonment, withdrawal, escapism, seeking truth',
    reversedMeaning: 'Trying one more time, indecision, aimless drifting, walking away',
    keywords: {
      upright: ['disappointment', 'abandonment', 'withdrawal', 'escapism', 'seeking truth'],
      reversed: ['trying one more time', 'indecision', 'aimless drifting', 'walking away', 'avoidance']
    },
    description: 'The Eight of Cups represents walking away from what no longer serves you.',
    element: 'Water'
  },
  {
    id: 'nine-of-cups',
    name: 'Nine of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 9,
    uprightMeaning: 'Contentment, satisfaction, gratitude, wish come true, luxury',
    reversedMeaning: 'Inner happiness, materialism, dissatisfaction, indulgence',
    keywords: {
      upright: ['contentment', 'satisfaction', 'gratitude', 'wish come true', 'luxury'],
      reversed: ['inner happiness', 'materialism', 'dissatisfaction', 'indulgence', 'greed']
    },
    description: 'The Nine of Cups represents contentment, satisfaction, and wish fulfillment.',
    element: 'Water'
  },
  {
    id: 'ten-of-cups',
    name: 'Ten of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    number: 10,
    uprightMeaning: 'Divine love, blissful relationships, harmony, alignment, family',
    reversedMeaning: 'Disconnection, misaligned values, struggling relationships, unhappy home',
    keywords: {
      upright: ['divine love', 'blissful relationships', 'harmony', 'alignment', 'family'],
      reversed: ['disconnection', 'misaligned values', 'struggling relationships', 'unhappy home', 'broken family']
    },
    description: 'The Ten of Cups represents emotional fulfillment, happiness, and harmony in relationships.',
    element: 'Water'
  },
  {
    id: 'page-of-cups',
    name: 'Page of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    uprightMeaning: 'Creative opportunities, intuitive messages, curiosity, possibility',
    reversedMeaning: 'New ideas, doubting intuition, creative blocks, emotional immaturity',
    keywords: {
      upright: ['creative opportunities', 'intuitive messages', 'curiosity', 'possibility', 'artistic'],
      reversed: ['new ideas', 'doubting intuition', 'creative blocks', 'emotional immaturity', 'escapism']
    },
    description: 'The Page of Cups represents creativity, intuition, and new emotional beginnings.',
    element: 'Water'
  },
  {
    id: 'knight-of-cups',
    name: 'Knight of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    uprightMeaning: 'Creativity, romance, charm, imagination, beauty, following your heart',
    reversedMeaning: 'Overactive imagination, unrealistic, jealousy, moodiness',
    keywords: {
      upright: ['creativity', 'romance', 'charm', 'imagination', 'beauty'],
      reversed: ['overactive imagination', 'unrealistic', 'jealousy', 'moodiness', 'disappointment']
    },
    description: 'The Knight of Cups represents romance, charm, and following your heart.',
    element: 'Water'
  },
  {
    id: 'queen-of-cups',
    name: 'Queen of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    uprightMeaning: 'Compassionate, caring, emotionally stable, intuitive, in flow',
    reversedMeaning: 'Inner feelings, self-care, self-love, co-dependency, emotional stability',
    keywords: {
      upright: ['compassionate', 'caring', 'emotionally stable', 'intuitive', 'in flow'],
      reversed: ['inner feelings', 'self-care', 'self-love', 'co-dependency', 'emotional instability']
    },
    description: 'The Queen of Cups represents compassion, emotional stability, and intuitive understanding.',
    element: 'Water'
  },
  {
    id: 'king-of-cups',
    name: 'King of Cups',
    suit: 'Cups',
    type: 'Minor Arcana',
    uprightMeaning: 'Emotionally balanced, compassionate, diplomatic, wisdom, balance',
    reversedMeaning: 'Self-compassion, inner feelings, moodiness, emotionally manipulative',
    keywords: {
      upright: ['emotionally balanced', 'compassionate', 'diplomatic', 'wisdom', 'balance'],
      reversed: ['self-compassion', 'inner feelings', 'moodiness', 'emotionally manipulative', 'volatility']
    },
    description: 'The King of Cups represents emotional balance, compassion, and diplomatic leadership.',
    element: 'Water'
  },

  // Minor Arcana - Wands (Fire Element)
  {
    id: 'ace-of-wands',
    name: 'Ace of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 1,
    uprightMeaning: 'Inspiration, new opportunities, growth, potential, creative spark',
    reversedMeaning: 'An emerging idea, lack of direction, distractions, delays',
    keywords: {
      upright: ['inspiration', 'new opportunities', 'growth', 'potential', 'creative spark'],
      reversed: ['emerging idea', 'lack of direction', 'distractions', 'delays', 'blocked creativity']
    },
    description: 'The Ace of Wands represents inspiration, new opportunities, and creative potential.',
    element: 'Fire'
  },
  {
    id: 'two-of-wands',
    name: 'Two of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 2,
    uprightMeaning: 'Future planning, making decisions, leaving comfort zone, personal power',
    reversedMeaning: 'Personal goals, inner alignment, fear of unknown, lack of planning',
    keywords: {
      upright: ['future planning', 'making decisions', 'leaving comfort zone', 'personal power', 'control'],
      reversed: ['personal goals', 'inner alignment', 'fear of unknown', 'lack of planning', 'self-doubt']
    },
    description: 'The Two of Wands represents future planning, personal power, and making important decisions.',
    element: 'Fire'
  },
  {
    id: 'three-of-wands',
    name: 'Three of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 3,
    uprightMeaning: 'Expansion, foresight, overseas opportunities, leadership, forward planning',
    reversedMeaning: 'Playing small, lack of foresight, unexpected delays, personal expansion',
    keywords: {
      upright: ['expansion', 'foresight', 'overseas opportunities', 'leadership', 'forward planning'],
      reversed: ['playing small', 'lack of foresight', 'unexpected delays', 'personal expansion', 'obstacles']
    },
    description: 'The Three of Wands represents expansion, foresight, and overseas opportunities.',
    element: 'Fire'
  },
  {
    id: 'four-of-wands',
    name: 'Four of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 4,
    uprightMeaning: 'Celebration, joy, harmony, relaxation, homecoming, achievement',
    reversedMeaning: 'Personal celebration, inner harmony, conflict with others, transition',
    keywords: {
      upright: ['celebration', 'joy', 'harmony', 'relaxation', 'homecoming'],
      reversed: ['personal celebration', 'inner harmony', 'conflict with others', 'transition', 'lack of support']
    },
    description: 'The Four of Wands represents celebration, harmony, and homecoming.',
    element: 'Fire'
  },
  {
    id: 'five-of-wands',
    name: 'Five of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 5,
    uprightMeaning: 'Conflict, disagreements, competition, tension, diversity of ideas',
    reversedMeaning: 'Inner conflict, conflict avoidance, tension release, personal struggle',
    keywords: {
      upright: ['conflict', 'disagreements', 'competition', 'tension', 'diversity of ideas'],
      reversed: ['inner conflict', 'conflict avoidance', 'tension release', 'personal struggle', 'end of conflict']
    },
    description: 'The Five of Wands represents conflict, competition, and disagreements.',
    element: 'Fire'
  },
  {
    id: 'six-of-wands',
    name: 'Six of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 6,
    uprightMeaning: 'Success, public recognition, progress, self-confidence, pride',
    reversedMeaning: 'Private achievement, personal definition of success, fall from grace',
    keywords: {
      upright: ['success', 'public recognition', 'progress', 'self-confidence', 'pride'],
      reversed: ['private achievement', 'personal definition of success', 'fall from grace', 'lack of recognition', 'egotism']
    },
    description: 'The Six of Wands represents success, recognition, and achievement.',
    element: 'Fire'
  },
  {
    id: 'seven-of-wands',
    name: 'Seven of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 7,
    uprightMeaning: 'Challenge, competition, protection, perseverance, defending your position',
    reversedMeaning: 'Exhaustion, giving up, overwhelmed, burnt out, defensive',
    keywords: {
      upright: ['challenge', 'competition', 'protection', 'perseverance', 'defending position'],
      reversed: ['exhaustion', 'giving up', 'overwhelmed', 'burnt out', 'defensive']
    },
    description: 'The Seven of Wands represents challenge, perseverance, and defending your position.',
    element: 'Fire'
  },
  {
    id: 'eight-of-wands',
    name: 'Eight of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 8,
    uprightMeaning: 'Swiftness, speed, progress, movement, quick decisions, sudden action',
    reversedMeaning: 'Delays, frustration, resisting change, internal alignment, slowing down',
    keywords: {
      upright: ['swiftness', 'speed', 'progress', 'movement', 'quick decisions'],
      reversed: ['delays', 'frustration', 'resisting change', 'internal alignment', 'slowing down']
    },
    description: 'The Eight of Wands represents swiftness, rapid action, and sudden progress.',
    element: 'Fire'
  },
  {
    id: 'nine-of-wands',
    name: 'Nine of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 9,
    uprightMeaning: 'Resilience, courage, persistence, test of faith, boundaries',
    reversedMeaning: 'Inner resources, struggle, overwhelm, defensive, paranoia',
    keywords: {
      upright: ['resilience', 'courage', 'persistence', 'test of faith', 'boundaries'],
      reversed: ['inner resources', 'struggle', 'overwhelm', 'defensive', 'paranoia']
    },
    description: 'The Nine of Wands represents resilience, persistence, and boundaries.',
    element: 'Fire'
  },
  {
    id: 'ten-of-wands',
    name: 'Ten of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    number: 10,
    uprightMeaning: 'Burden, extra responsibility, hard work, completion, achievement',
    reversedMeaning: 'Doing it all, carrying the burden, delegation, release, overwhelm',
    keywords: {
      upright: ['burden', 'extra responsibility', 'hard work', 'completion', 'achievement'],
      reversed: ['doing it all', 'carrying the burden', 'delegation', 'release', 'overwhelm']
    },
    description: 'The Ten of Wands represents burden, responsibility, and hard work leading to completion.',
    element: 'Fire'
  },
  {
    id: 'page-of-wands',
    name: 'Page of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    uprightMeaning: 'Inspiration, ideas, discovery, limitless potential, free spirit',
    reversedMeaning: 'Newly formed ideas, redirecting energy, self-doubt, lack of direction',
    keywords: {
      upright: ['inspiration', 'ideas', 'discovery', 'limitless potential', 'free spirit'],
      reversed: ['newly formed ideas', 'redirecting energy', 'self-doubt', 'lack of direction', 'hasty decisions']
    },
    description: 'The Page of Wands represents inspiration, discovery, and limitless potential.',
    element: 'Fire'
  },
  {
    id: 'knight-of-wands',
    name: 'Knight of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    uprightMeaning: 'Energy, passion, inspired action, adventure, impulsiveness',
    reversedMeaning: 'Passion project, haste, scattered energy, delays, frustration',
    keywords: {
      upright: ['energy', 'passion', 'inspired action', 'adventure', 'impulsiveness'],
      reversed: ['passion project', 'haste', 'scattered energy', 'delays', 'frustration']
    },
    description: 'The Knight of Wands represents energy, passion, and impulsive action.',
    element: 'Fire'
  },
  {
    id: 'queen-of-wands',
    name: 'Queen of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    uprightMeaning: 'Courage, confidence, independence, social butterfly, determination',
    reversedMeaning: 'Self-respect, self-confidence, introverted, re-establish sense of self',
    keywords: {
      upright: ['courage', 'confidence', 'independence', 'social butterfly', 'determination'],
      reversed: ['self-respect', 'self-confidence', 'introverted', 're-establish sense of self', 'jealousy']
    },
    description: 'The Queen of Wands represents courage, confidence, and independent leadership.',
    element: 'Fire'
  },
  {
    id: 'king-of-wands',
    name: 'King of Wands',
    suit: 'Wands',
    type: 'Minor Arcana',
    uprightMeaning: 'Natural-born leader, vision, entrepreneur, honour, inspiration',
    reversedMeaning: 'Impulsiveness, haste, ruthless, high expectations, forceful',
    keywords: {
      upright: ['natural-born leader', 'vision', 'entrepreneur', 'honour', 'inspiration'],
      reversed: ['impulsiveness', 'haste', 'ruthless', 'high expectations', 'forceful']
    },
    description: 'The King of Wands represents natural leadership, vision, and entrepreneurial spirit.',
    element: 'Fire'
  },

  // Minor Arcana - Pentacles (Earth Element)
  {
    id: 'ace-of-pentacles',
    name: 'Ace of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 1,
    uprightMeaning: 'A new financial or career opportunity, manifestation, abundance',
    reversedMeaning: 'Lost opportunity, lack of planning, poor financial decisions',
    keywords: {
      upright: ['new financial opportunity', 'manifestation', 'abundance', 'new job', 'material gain'],
      reversed: ['lost opportunity', 'lack of planning', 'poor financial decisions', 'scarcity mindset', 'delays']
    },
    description: 'The Ace of Pentacles represents new financial opportunities, manifestation, and material abundance.',
    element: 'Earth'
  },
  {
    id: 'two-of-pentacles',
    name: 'Two of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 2,
    uprightMeaning: 'Multiple priorities, time management, prioritisation, adaptability',
    reversedMeaning: 'Over-committed, disorganisation, reprioritisation, overwhelming responsibilities',
    keywords: {
      upright: ['multiple priorities', 'time management', 'prioritisation', 'adaptability', 'balance'],
      reversed: ['over-committed', 'disorganisation', 'reprioritisation', 'overwhelming responsibilities', 'imbalance']
    },
    description: 'The Two of Pentacles represents juggling priorities, time management, and adaptability.',
    element: 'Earth'
  },
  {
    id: 'three-of-pentacles',
    name: 'Three of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 3,
    uprightMeaning: 'Collaboration, learning, implementation, teamwork, skill development',
    reversedMeaning: 'Disharmony, misalignment, working alone, lack of teamwork',
    keywords: {
      upright: ['collaboration', 'learning', 'implementation', 'teamwork', 'skill development'],
      reversed: ['disharmony', 'misalignment', 'working alone', 'lack of teamwork', 'poor quality']
    },
    description: 'The Three of Pentacles represents collaboration, teamwork, and skill development.',
    element: 'Earth'
  },
  {
    id: 'four-of-pentacles',
    name: 'Four of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 4,
    uprightMeaning: 'Saving money, security, conservatism, scarcity, control',
    reversedMeaning: 'Over-spending, greed, self-protection, financial insecurity',
    keywords: {
      upright: ['saving money', 'security', 'conservatism', 'scarcity', 'control'],
      reversed: ['over-spending', 'greed', 'self-protection', 'financial insecurity', 'generosity']
    },
    description: 'The Four of Pentacles represents saving, security, and sometimes excessive control over resources.',
    element: 'Earth'
  },
  {
    id: 'five-of-pentacles',
    name: 'Five of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 5,
    uprightMeaning: 'Financial loss, poverty, lack mindset, isolation, worry',
    reversedMeaning: 'Recovery from financial loss, spiritual poverty, inner security',
    keywords: {
      upright: ['financial loss', 'poverty', 'lack mindset', 'isolation', 'worry'],
      reversed: ['recovery from financial loss', 'spiritual poverty', 'inner security', 'charity', 'improvement']
    },
    description: 'The Five of Pentacles represents financial hardship, worry, and feeling left out.',
    element: 'Earth'
  },
  {
    id: 'six-of-pentacles',
    name: 'Six of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 6,
    uprightMeaning: 'Giving, receiving, sharing wealth, generosity, charity',
    reversedMeaning: 'Self-care, unpaid debts, one-sided charity, power imbalances',
    keywords: {
      upright: ['giving', 'receiving', 'sharing wealth', 'generosity', 'charity'],
      reversed: ['self-care', 'unpaid debts', 'one-sided charity', 'power imbalances', 'strings attached']
    },
    description: 'The Six of Pentacles represents generosity, charity, and the balance between giving and receiving.',
    element: 'Earth'
  },
  {
    id: 'seven-of-pentacles',
    name: 'Seven of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 7,
    uprightMeaning: 'Sustenance, investment, effort, perseverance, diligence',
    reversedMeaning: 'Lack of long-term vision, limited success, impatience, giving up',
    keywords: {
      upright: ['sustenance', 'investment', 'effort', 'perseverance', 'diligence'],
      reversed: ['lack of long-term vision', 'limited success', 'impatience', 'giving up', 'poor planning']
    },
    description: 'The Seven of Pentacles represents perseverance, investment, and long-term planning.',
    element: 'Earth'
  },
  {
    id: 'eight-of-pentacles',
    name: 'Eight of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 8,
    uprightMeaning: 'Apprenticeship, repetitive tasks, mastery, skill development, quality focus',
    reversedMeaning: 'Self-development, perfectionism, misdirected activity, lack of motivation',
    keywords: {
      upright: ['apprenticeship', 'repetitive tasks', 'mastery', 'skill development', 'quality focus'],
      reversed: ['self-development', 'perfectionism', 'misdirected activity', 'lack of motivation', 'mediocrity']
    },
    description: 'The Eight of Pentacles represents mastery, skill development, and dedicated practice.',
    element: 'Earth'
  },
  {
    id: 'nine-of-pentacles',
    name: 'Nine of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 9,
    uprightMeaning: 'Abundance, luxury, self-sufficiency, financial independence',
    reversedMeaning: 'Self-worth, over-investment in work, hustling, self-value',
    keywords: {
      upright: ['abundance', 'luxury', 'self-sufficiency', 'financial independence', 'refinement'],
      reversed: ['self-worth', 'over-investment in work', 'hustling', 'self-value', 'superficiality']
    },
    description: 'The Nine of Pentacles represents abundance, luxury, and financial independence.',
    element: 'Earth'
  },
  {
    id: 'ten-of-pentacles',
    name: 'Ten of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    number: 10,
    uprightMeaning: 'Wealth, financial security, family, long-term success, contribution',
    reversedMeaning: 'The dark side of wealth, financial failure, loneliness, loss',
    keywords: {
      upright: ['wealth', 'financial security', 'family', 'long-term success', 'contribution'],
      reversed: ['dark side of wealth', 'financial failure', 'loneliness', 'loss', 'family conflicts']
    },
    description: 'The Ten of Pentacles represents wealth, financial security, and long-term success.',
    element: 'Earth'
  },
  {
    id: 'page-of-pentacles',
    name: 'Page of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    uprightMeaning: 'Learning, studying, new ideas, financial opportunities, skill development',
    reversedMeaning: 'Lack of progress, procrastination, learn from failure, poor concentration',
    keywords: {
      upright: ['learning', 'studying', 'new ideas', 'financial opportunities', 'skill development'],
      reversed: ['lack of progress', 'procrastination', 'learn from failure', 'poor concentration', 'perfectionism']
    },
    description: 'The Page of Pentacles represents learning, studying, and new financial opportunities.',
    element: 'Earth'
  },
  {
    id: 'knight-of-pentacles',
    name: 'Knight of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    uprightMeaning: 'Hard work, productivity, routine, conservatism, methodical',
    reversedMeaning: 'Self-discipline, boredom, feeling stuck, perfectionism, laziness',
    keywords: {
      upright: ['hard work', 'productivity', 'routine', 'conservatism', 'methodical'],
      reversed: ['self-discipline', 'boredom', 'feeling stuck', 'perfectionism', 'laziness']
    },
    description: 'The Knight of Pentacles represents hard work, productivity, and methodical progress.',
    element: 'Earth'
  },
  {
    id: 'queen-of-pentacles',
    name: 'Queen of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    uprightMeaning: 'Nurturing, practical, providing financially, a working parent',
    reversedMeaning: 'Financial independence, self-care, work-home conflict, smothering',
    keywords: {
      upright: ['nurturing', 'practical', 'providing financially', 'working parent', 'resourceful'],
      reversed: ['financial independence', 'self-care', 'work-home conflict', 'smothering', 'neglect']
    },
    description: 'The Queen of Pentacles represents nurturing, practicality, and financial provision.',
    element: 'Earth'
  },
  {
    id: 'king-of-pentacles',
    name: 'King of Pentacles',
    suit: 'Pentacles',
    type: 'Minor Arcana',
    uprightMeaning: 'Financial success, business acumen, leadership, security, discipline',
    reversedMeaning: 'Financially inept, obsessed with wealth, stubborn, self-discipline',
    keywords: {
      upright: ['financial success', 'business acumen', 'leadership', 'security', 'discipline'],
      reversed: ['financially inept', 'obsessed with wealth', 'stubborn', 'self-discipline', 'corruption']
    },
    description: 'The King of Pentacles represents financial success, business acumen, and material security.',
    element: 'Earth'
  },

  // Minor Arcana - Swords (Air Element)
  {
    id: 'ace-of-swords',
    name: 'Ace of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 1,
    uprightMeaning: 'Breakthrough, clarity, sharp mind, new ideas, mental clarity',
    reversedMeaning: 'Inner clarity, re-thinking an idea, clouded judgement, confusion',
    keywords: {
      upright: ['breakthrough', 'clarity', 'sharp mind', 'new ideas', 'mental clarity'],
      reversed: ['inner clarity', 're-thinking an idea', 'clouded judgement', 'confusion', 'chaos']
    },
    description: 'The Ace of Swords represents breakthrough moments, mental clarity, and new ideas.',
    element: 'Air'
  },
  {
    id: 'two-of-swords',
    name: 'Two of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 2,
    uprightMeaning: 'Difficult decisions, weighing up options, an impasse, avoidance',
    reversedMeaning: 'Indecision, confusion, information overload, taking action',
    keywords: {
      upright: ['difficult decisions', 'weighing up options', 'impasse', 'avoidance', 'stalemate'],
      reversed: ['indecision', 'confusion', 'information overload', 'taking action', 'emotional turmoil']
    },
    description: 'The Two of Swords represents difficult decisions, being at an impasse, and avoidance.',
    element: 'Air'
  },
  {
    id: 'three-of-swords',
    name: 'Three of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 3,
    uprightMeaning: 'Heartbreak, emotional pain, sorrow, grief, hurt, trauma',
    reversedMeaning: 'Negative self-talk, releasing pain, optimism, forgiveness',
    keywords: {
      upright: ['heartbreak', 'emotional pain', 'sorrow', 'grief', 'hurt'],
      reversed: ['negative self-talk', 'releasing pain', 'optimism', 'forgiveness', 'healing']
    },
    description: 'The Three of Swords represents heartbreak, emotional pain, and grief.',
    element: 'Air'
  },
  {
    id: 'four-of-swords',
    name: 'Four of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 4,
    uprightMeaning: 'Contemplation, meditation, rest, recovery, retreat, relaxation',
    reversedMeaning: 'Meditation, finding mental peace, spiritual enlightenment',
    keywords: {
      upright: ['contemplation', 'meditation', 'rest', 'recovery', 'retreat'],
      reversed: ['meditation', 'finding mental peace', 'spiritual enlightenment', 'restlessness', 'burnout']
    },
    description: 'The Four of Swords represents contemplation, rest, and mental recovery.',
    element: 'Air'
  },
  {
    id: 'five-of-swords',
    name: 'Five of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 5,
    uprightMeaning: 'Conflict, disagreements, competition, defeat, winning at all costs',
    reversedMeaning: 'Reconciliation, making amends, past resentment, open communication',
    keywords: {
      upright: ['conflict', 'disagreements', 'competition', 'defeat', 'winning at all costs'],
      reversed: ['reconciliation', 'making amends', 'past resentment', 'open communication', 'moving on']
    },
    description: 'The Five of Swords represents conflict, disagreements, and hollow victories.',
    element: 'Air'
  },
  {
    id: 'six-of-swords',
    name: 'Six of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 6,
    uprightMeaning: 'Transition, change, rite of passage, releasing baggage, moving forward',
    reversedMeaning: 'Personal transition, resistance to change, unfinished business',
    keywords: {
      upright: ['transition', 'change', 'rite of passage', 'releasing baggage', 'moving forward'],
      reversed: ['personal transition', 'resistance to change', 'unfinished business', 'stuck in past', 'turbulent waters']
    },
    description: 'The Six of Swords represents transition, change, and moving towards calmer waters.',
    element: 'Air'
  },
  {
    id: 'seven-of-swords',
    name: 'Seven of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 7,
    uprightMeaning: 'Betrayal, deception, getting away with something, stealth',
    reversedMeaning: 'Imposter syndrome, self-deceit, keeping secrets, getting caught',
    keywords: {
      upright: ['betrayal', 'deception', 'getting away with something', 'stealth', 'strategy'],
      reversed: ['imposter syndrome', 'self-deceit', 'keeping secrets', 'getting caught', 'coming clean']
    },
    description: 'The Seven of Swords represents betrayal, deception, and getting away with something.',
    element: 'Air'
  },
  {
    id: 'eight-of-swords',
    name: 'Eight of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 8,
    uprightMeaning: 'Negative thoughts, self-imposed restriction, imprisonment, victim mentality',
    reversedMeaning: 'Self-limiting beliefs, inner critic, releasing negative thoughts, open to new perspectives',
    keywords: {
      upright: ['negative thoughts', 'self-imposed restriction', 'imprisonment', 'victim mentality', 'powerlessness'],
      reversed: ['self-limiting beliefs', 'inner critic', 'releasing negative thoughts', 'open to new perspectives', 'self-acceptance']
    },
    description: 'The Eight of Swords represents feeling trapped by negative thoughts and self-imposed limitations.',
    element: 'Air'
  },
  {
    id: 'nine-of-swords',
    name: 'Nine of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 9,
    uprightMeaning: 'Anxiety, worry, fear, depression, nightmares, mental anguish',
    reversedMeaning: 'Inner turmoil, deep-seated fears, secrets, releasing worry, despair',
    keywords: {
      upright: ['anxiety', 'worry', 'fear', 'depression', 'nightmares'],
      reversed: ['inner turmoil', 'deep-seated fears', 'secrets', 'releasing worry', 'despair']
    },
    description: 'The Nine of Swords represents anxiety, worry, and mental anguish.',
    element: 'Air'
  },
  {
    id: 'ten-of-swords',
    name: 'Ten of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    number: 10,
    uprightMeaning: 'Painful endings, deep wounds, betrayal, loss, crisis, hitting rock bottom',
    reversedMeaning: 'Recovery, regeneration, resisting an inevitable end, refusing to learn',
    keywords: {
      upright: ['painful endings', 'deep wounds', 'betrayal', 'loss', 'crisis'],
      reversed: ['recovery', 'regeneration', 'resisting an inevitable end', 'refusing to learn', 'survival']
    },
    description: 'The Ten of Swords represents painful endings, betrayal, and hitting rock bottom.',
    element: 'Air'
  },
  {
    id: 'page-of-swords',
    name: 'Page of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    uprightMeaning: 'New ideas, curiosity, thirst for knowledge, new ways of communicating',
    reversedMeaning: 'Self-expression, all talk and no action, haste, scattered energy',
    keywords: {
      upright: ['new ideas', 'curiosity', 'thirst for knowledge', 'new ways of communicating', 'vigilance'],
      reversed: ['self-expression', 'all talk and no action', 'haste', 'scattered energy', 'cynicism']
    },
    description: 'The Page of Swords represents new ideas, curiosity, and thirst for knowledge.',
    element: 'Air'
  },
  {
    id: 'knight-of-swords',
    name: 'Knight of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    uprightMeaning: 'Ambitious, action-oriented, driven to succeed, fast-thinking',
    reversedMeaning: 'Restless, unfocused, impulsive, burn-out, scattered thoughts',
    keywords: {
      upright: ['ambitious', 'action-oriented', 'driven to succeed', 'fast-thinking', 'assertive'],
      reversed: ['restless', 'unfocused', 'impulsive', 'burn-out', 'scattered thoughts']
    },
    description: 'The Knight of Swords represents ambition, fast action, and driven energy.',
    element: 'Air'
  },
  {
    id: 'queen-of-swords',
    name: 'Queen of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    uprightMeaning: 'Independent, unbiased judgement, clear boundaries, direct communication',
    reversedMeaning: 'Overly-emotional, easily influenced, bitchy, cold-hearted',
    keywords: {
      upright: ['independent', 'unbiased judgement', 'clear boundaries', 'direct communication', 'intellectual'],
      reversed: ['overly-emotional', 'easily influenced', 'bitchy', 'cold-hearted', 'cruel']
    },
    description: 'The Queen of Swords represents independence, clear thinking, and direct communication.',
    element: 'Air'
  },
  {
    id: 'king-of-swords',
    name: 'King of Swords',
    suit: 'Swords',
    type: 'Minor Arcana',
    uprightMeaning: 'Mental clarity, intellectual power, authority, truth, structure',
    reversedMeaning: 'Quiet power, inner truth, misuse of power, manipulation',
    keywords: {
      upright: ['mental clarity', 'intellectual power', 'authority', 'truth', 'structure'],
      reversed: ['quiet power', 'inner truth', 'misuse of power', 'manipulation', 'abuse of authority']
    },
    description: 'The King of Swords represents mental clarity, intellectual power, and authoritative truth.',
    element: 'Air'
  }
];

export const getRandomCard = (): TarotCard => {
  const randomIndex = Math.floor(Math.random() * tarotCards.length);
  return tarotCards[randomIndex];
};

export const getCardById = (id: string): TarotCard | undefined => {
  return tarotCards.find(card => card.id === id);
};

export const getCardsByType = (type: 'Major Arcana' | 'Minor Arcana'): TarotCard[] => {
  return tarotCards.filter(card => card.type === type);
};

export const getCardsBySuit = (suit: 'Cups' | 'Wands' | 'Pentacles' | 'Swords'): TarotCard[] => {
  return tarotCards.filter(card => card.suit === suit);
};

export const shuffleCards = (cards: TarotCard[]): TarotCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};