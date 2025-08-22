/* eslint-disable @typescript-eslint/no-unused-vars */

export class HumanizationService {
  private static commonTypos = [
    { from: 'experience', to: 'experiance' },
    { from: 'coming', to: 'comming' },
    { from: 'interesting', to: 'intresting' },
    { from: 'something', to: 'somthing' },
    { from: 'happening', to: 'hapening' },
    { from: 'recently', to: 'recntly' },
    { from: 'absolutely', to: 'absolutley' },
    { from: 'realized', to: 'realised' },
    { from: 'journey', to: 'journy' },
    { from: 'astrologically', to: 'astrologicaly' },
    { from: 'warrants', to: 'warants' },
    { from: "couldn't", to: 'couldnt' },
    { from: "shouldn't", to: 'shouldnt' },
    { from: "can't", to: 'cant' },
    { from: "don't", to: 'dont' },
    { from: "I'm", to: 'im' },
    { from: "you're", to: 'youre' },
    { from: "we're", to: 'were' }
  ];

  private static casualWords = [
    'like', 'tbh', 'ngl', 'literally', 'actually', 'basically', 'kinda', 
    'sorta', 'def', 'prob', 'obvi', 'fr', 'rn', 'omg', 'lol', 'wtf'
  ];

  private static hesitationMarkers = [
    'i mean...', 'like...', 'idk...', 'um...', 'well...', 'so...',
    'wait...', 'hmm...', 'uh...'
  ];

  private static selfCorrections = [
    'wait no', 'actually...', 'i mean', 'or like', 'well no', 'hang on',
    'wait hold up', 'ok but', 'nvm that', 'scratch that'
  ];

  private static emotionalReactions = [
    'ugh', 'yikes', 'lol', 'hah', 'wow', 'whoa', 'damn', 'sheesh', 
    'bruh', 'dude', 'oof', 'meh', 'huh', 'ah', 'oh'
  ];

  private static repeatableLetters = ['o', 'a', 'e', 's', 'h', 'l', 'r'];

  /**
   * Applies humanization to AI-generated text to make it sound more natural
   */
  static humanizeText(text: string, intensity: number = 0.3): string {
    if (!text || text.length < 5) return text;

    let humanized = text;

    // Apply lowercase to sentence starts (people don't capitalize on mobile/casual typing)
    humanized = this.lowercaseSentenceStarts(humanized);

    // Remove periods at the end frequently (casual typing)
    if (Math.random() < 0.7) {
      humanized = humanized.replace(/\.$/, '');
    }

    // Apply typos with moderate intensity
    humanized = this.addTypos(humanized, intensity * 0.7);

    // Add hesitation markers occasionally
    if (Math.random() < intensity * 0.3) {
      humanized = this.addHesitation(humanized);
    }

    // Add self-corrections occasionally
    if (Math.random() < intensity * 0.25) {
      humanized = this.addSelfCorrection(humanized);
    }

    // Add emotional reactions occasionally
    if (Math.random() < intensity * 0.3) {
      humanized = this.addEmotionalReaction(humanized);
    }

    // Repeat letters for emphasis occasionally
    if (Math.random() < intensity * 0.35) {
      humanized = this.addLetterRepetition(humanized);
    }

    // Drop random punctuation occasionally
    if (Math.random() < intensity * 0.4) {
      humanized = this.dropPunctuation(humanized);
    }

    // Add trailing thoughts occasionally
    if (Math.random() < intensity * 0.3) {
      humanized = this.addTrailingThoughts(humanized);
    }

    // Sometimes make the whole thing more casual
    if (Math.random() < intensity * 0.3) {
      humanized = this.makeSuperCasual(humanized);
    }

    return humanized.trim();
  }

  private static addTypos(text: string, intensity: number): string {
    const availableTypos = this.commonTypos.filter(typo => 
      text.toLowerCase().includes(typo.from.toLowerCase())
    );

    // Apply limited typos based on intensity - max 2 typos
    const maxTypos = Math.floor(intensity * 2) + 1;
    const typoCount = Math.floor(Math.random() * Math.min(maxTypos, 2)) + (Math.random() < 0.3 ? 1 : 0);
    
    for (let i = 0; i < typoCount && i < availableTypos.length; i++) {
      const typo = availableTypos[Math.floor(Math.random() * availableTypos.length)];
      const regex = new RegExp(`\\b${typo.from}\\b`, 'gi');
      
      // Moderate chance to apply typos
      text = text.replace(regex, (match) => {
        if (Math.random() < 0.5) { // 50% chance to actually apply the typo
          return match.charAt(0) === match.charAt(0).toUpperCase() 
            ? typo.to.charAt(0).toUpperCase() + typo.to.slice(1)
            : typo.to;
        }
        return match;
      });
    }

    // Add some random letter swaps/drops occasionally
    if (Math.random() < intensity * 0.25) {
      text = this.addRandomTypos(text);
    }

    return text;
  }

  private static addRandomTypos(text: string): string {
    const words = text.split(' ');
    const wordIndex = Math.floor(Math.random() * words.length);
    const word = words[wordIndex];
    
    if (word.length > 3) {
      const operations = [
        // Drop a letter
        () => word.slice(0, -1),
        // Swap two letters
        () => {
          const chars = word.split('');
          if (chars.length > 2) {
            const i = Math.floor(Math.random() * (chars.length - 1));
            [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
          }
          return chars.join('');
        },
        // Double a letter
        () => {
          const i = Math.floor(Math.random() * word.length);
          return word.slice(0, i) + word[i] + word.slice(i);
        }
      ];
      
      const operation = operations[Math.floor(Math.random() * operations.length)];
      words[wordIndex] = operation();
    }
    
    return words.join(' ');
  }

  private static addHesitation(text: string): string {
    const hesitation = this.hesitationMarkers[
      Math.floor(Math.random() * this.hesitationMarkers.length)
    ];

    // Add at beginning or middle
    if (Math.random() < 0.5) {
      return `${hesitation} ${text}`;
    } else {
      const sentences = text.split('. ');
      if (sentences.length > 1) {
        const insertIndex = Math.floor(Math.random() * (sentences.length - 1));
        sentences[insertIndex] += ` ${hesitation}`;
        return sentences.join('. ');
      }
    }

    return text;
  }

  private static addSelfCorrection(text: string): string {
    const correction = this.selfCorrections[
      Math.floor(Math.random() * this.selfCorrections.length)
    ];

    const sentences = text.split('. ');
    if (sentences.length > 1) {
      const insertIndex = Math.floor(Math.random() * sentences.length);
      sentences.splice(insertIndex, 0, correction);
      return sentences.join('. ');
    }

    return `${correction}... ${text}`;
  }

  private static addEmotionalReaction(text: string): string {
    const reaction = this.emotionalReactions[
      Math.floor(Math.random() * this.emotionalReactions.length)
    ];

    // Add at beginning or end
    if (Math.random() < 0.5) {
      return `${reaction} ${text}`;
    } else {
      return `${text} ${reaction}`;
    }
  }

  private static addLetterRepetition(text: string): string {
    const words = text.split(' ');
    const repeatableWords = words.filter(word => 
      this.repeatableLetters.some(letter => word.toLowerCase().includes(letter))
    );

    if (repeatableWords.length === 0) return text;

    const targetWord = repeatableWords[Math.floor(Math.random() * repeatableWords.length)];
    const repeatableLetter = this.repeatableLetters.find(letter => 
      targetWord.toLowerCase().includes(letter)
    );

    if (repeatableLetter) {
      const repeatedWord = targetWord.replace(
        new RegExp(repeatableLetter, 'i'),
        repeatableLetter.repeat(Math.random() < 0.5 ? 2 : 3)
      );
      
      return text.replace(targetWord, repeatedWord);
    }

    return text;
  }

  private static randomlyLowercase(text: string): string {
    // Randomly lowercase the first letter sometimes
    if (Math.random() < 0.6 && text.length > 0) {
      return text.charAt(0).toLowerCase() + text.slice(1);
    }
    return text;
  }

  private static addTrailingThoughts(text: string): string {
    const trailingThoughts = [
      '...', '..', 'lol', 'idk', 'ya know?', 'right?', 'fr', 'tbh', 'ngl',
      'tho', 'rn', 'lowkey', 'highkey', 'deadass', 'no cap'
    ];

    if (Math.random() < 0.5) {
      const thought = trailingThoughts[Math.floor(Math.random() * trailingThoughts.length)];
      return `${text} ${thought}`;
    }

    return text;
  }

  private static dropPunctuation(text: string): string {
    // Remove random commas, apostrophes, etc.
    if (Math.random() < 0.4) {
      text = text.replace(/,/g, '');
    }
    if (Math.random() < 0.3) {
      text = text.replace(/'/g, '');
    }
    if (Math.random() < 0.2) {
      text = text.replace(/!/g, '');
    }
    return text;
  }

  private static makeSuperCasual(text: string): string {
    // Apply even more casual transformations
    text = text.replace(/\bgoing to\b/g, 'gonna');
    text = text.replace(/\bwant to\b/g, 'wanna');
    text = text.replace(/\bhave to\b/g, 'gotta');
    text = text.replace(/\bout of\b/g, 'outta');
    text = text.replace(/\bkind of\b/g, 'kinda');
    text = text.replace(/\bsort of\b/g, 'sorta');
    text = text.replace(/\ba lot\b/g, 'alot'); // common mistake
    text = text.replace(/\byou all\b/g, 'yall');
    text = text.replace(/\bbecause\b/g, 'bc');
    text = text.replace(/\bwithout\b/g, 'w/o');
    text = text.replace(/\bwith\b/g, 'w/');
    text = text.replace(/\band\b/g, '&');
    
    return text;
  }

  private static lowercaseSentenceStarts(text: string): string {
    // Split by sentence endings and lowercase the start of each sentence
    return text.replace(/^[A-Z]|(?<=[.!?]\s+)[A-Z]/g, (match) => {
      // 80% chance to lowercase sentence starts (casual mobile typing)
      return Math.random() < 0.8 ? match.toLowerCase() : match;
    });
  }

  /**
   * Get humanization intensity based on writing style
   */
  static getIntensityForStyle(writingStyle: string): number {
    const intensityMap: Record<string, number> = {
      'professional_educational': 0.2, // Professionals type more carefully
      'enthusiastic_personal': 0.5,   // Casual but not overly messy
      'analytical_questioning': 0.3,  // Thoughtful with minimal mistakes
      'beginner_enthusiastic': 0.6,  // More imperfections but reasonable
      'specialist_timing': 0.4        // Moderate level
    };

    return intensityMap[writingStyle] || 0.4;
  }
}