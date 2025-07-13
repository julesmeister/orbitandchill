// Utility to map tarot card IDs to their corresponding image paths

export const getCardImagePath = (cardId: string): string => {
  const cardIdToImageMap: Record<string, string> = {
    // Major Arcana
    'the-fool': '/tarots/fool.jpg',
    'the-magician': '/tarots/magician.jpg',
    'the-high-priestess': '/tarots/high_priestess.jpg',
    'the-empress': '/tarots/empress.jpg',
    'the-emperor': '/tarots/emperor.jpg',
    'the-hierophant': '/tarots/hierophant.jpg',
    'the-lovers': '/tarots/lovers.jpg',
    'the-chariot': '/tarots/chariot.jpg',
    'strength': '/tarots/strength.jpg',
    'the-hermit': '/tarots/hermit.jpg',
    'wheel-of-fortune': '/tarots/wheel_of_fortune.jpg',
    'justice': '/tarots/justice.jpg',
    'the-hanged-man': '/tarots/hanged_man.jpg',
    'death': '/tarots/death.jpg',
    'temperance': '/tarots/temperance.jpg',
    'the-devil': '/tarots/devil.jpg',
    'the-tower': '/tarots/tower.jpg',
    'the-star': '/tarots/star.jpg',
    'the-moon': '/tarots/moon.jpg',
    'the-sun': '/tarots/sun.jpg',
    'judgement': '/tarots/judgement.jpg',
    'the-world': '/tarots/world.jpg',
    
    // Cups
    'ace-of-cups': '/tarots/ace_of_cups.jpg',
    'two-of-cups': '/tarots/two_cups.jpg',
    'three-of-cups': '/tarots/three_cups.jpg',
    'four-of-cups': '/tarots/four_cups.jpg',
    'five-of-cups': '/tarots/five_cups.jpg',
    'six-of-cups': '/tarots/six_cups.jpg',
    'seven-of-cups': '/tarots/seven_cups.jpg',
    'eight-of-cups': '/tarots/eight_cups.jpg',
    'nine-of-cups': '/tarots/nine_cups.jpg',
    'ten-of-cups': '/tarots/ten_cups.jpg',
    'page-of-cups': '/tarots/page_of_cups.jpg',
    'knight-of-cups': '/tarots/knight_of_cups.jpg',
    'queen-of-cups': '/tarots/queen_of_cups.jpg',
    'king-of-cups': '/tarots/king_of_cups.jpg',
    
    // Wands
    'ace-of-wands': '/tarots/ace_of_wands.jpg',
    'two-of-wands': '/tarots/two_wands.jpg',
    'three-of-wands': '/tarots/three_wands.jpg',
    'four-of-wands': '/tarots/four_wands.jpg',
    'five-of-wands': '/tarots/five_wands.jpg',
    'six-of-wands': '/tarots/six_wands.jpg',
    'seven-of-wands': '/tarots/seven_wands.jpg',
    'eight-of-wands': '/tarots/eight_wands.jpg',
    'nine-of-wands': '/tarots/nine_wands.jpg',
    'ten-of-wands': '/tarots/ten_wands.jpg',
    'page-of-wands': '/tarots/page_of_wands.jpg',
    'knight-of-wands': '/tarots/knight_of_wands.jpg',
    'queen-of-wands': '/tarots/queen_of_wands.jpg',
    'king-of-wands': '/tarots/king_of_wands.jpg',
    
    // Pentacles
    'ace-of-pentacles': '/tarots/ace_of_pentacles.jpg',
    'two-of-pentacles': '/tarots/two_pentacles.jpg',
    'three-of-pentacles': '/tarots/three_pentacles.jpg',
    'four-of-pentacles': '/tarots/four_pentacles.jpg',
    'five-of-pentacles': '/tarots/five_pentacles.jpg',
    'six-of-pentacles': '/tarots/six_pentacles.jpg',
    'seven-of-pentacles': '/tarots/seven_pentacles.jpg',
    'eight-of-pentacles': '/tarots/eight_pentacles.jpg',
    'nine-of-pentacles': '/tarots/nine_pentacles.jpg',
    'ten-of-pentacles': '/tarots/ten_pentacles.jpg',
    'page-of-pentacles': '/tarots/page_of_pentacles.jpg',
    'knight-of-pentacles': '/tarots/knight_of_pentacles.jpg',
    'queen-of-pentacles': '/tarots/queen_of_pentacles.jpg',
    'king-of-pentacles': '/tarots/king_of_pentacles.jpg',
    
    // Swords
    'ace-of-swords': '/tarots/ace_of_swords.jpg',
    'two-of-swords': '/tarots/two_swords.jpg',
    'three-of-swords': '/tarots/three_swords.jpg',
    'four-of-swords': '/tarots/four_swords.jpg',
    'five-of-swords': '/tarots/five_swords.jpg',
    'six-of-swords': '/tarots/six_swords.jpg',
    'seven-of-swords': '/tarots/seven_swords.jpg',
    'eight-of-swords': '/tarots/eight_swords.jpg',
    'nine-of-swords': '/tarots/nine_swords.jpg',
    'ten-of-swords': '/tarots/ten_swords.jpg',
    'page-of-swords': '/tarots/page_of_swords.jpg',
    'knight-of-swords': '/tarots/knight_of_swords.jpg',
    'queen-of-swords': '/tarots/queen_of_swords.jpg',
    'king-of-swords': '/tarots/king_of_swords.jpg'
  };

  return cardIdToImageMap[cardId] || '/tarots/fool.jpg'; // fallback to fool card
};

// Alternative function to get card icon (emoji) as fallback
export const getCardIcon = (cardId: string, cardType: string, cardSuit?: string): string => {
  if (cardType === 'Major Arcana') {
    return '🔮';
  }
  
  switch (cardSuit) {
    case 'Cups': return '💧';
    case 'Wands': return '🔥';
    case 'Pentacles': return '🪙';
    case 'Swords': return '⚔️';
    default: return '🃏';
  }
};