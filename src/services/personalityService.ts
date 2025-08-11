/* eslint-disable @typescript-eslint/no-unused-vars */
import { PersonalityDetails, SeedUserConfig } from '@/types/replyGeneration';

export class PersonalityService {
  private static personalityMap = {
    'AstroMaven': {
      personality: 'Professional astrologer with 20+ years experience, warm but authoritative',
      emojis: '✨ 🔮 ⭐',
      background: 'Has a private practice in LA, studied under renowned astrologers, sees patterns others miss',
      replyStyle: 'Usually types properly but sometimes gets excited and forgets punctuation. Shares client insights (anonymously), references classical astrology'
    },
    'MoonChild92': {
      personality: 'Sweet college student who just discovered astrology, eager to learn and very grateful',
      emojis: '🌙 🥺 💕 ✨',
      background: 'College student studying psychology, new to astrology, loves the emotional/spiritual aspects',
      replyStyle: 'types in lowercase a lot, uses lots of "omg" and "wait", admits not knowing much, shares how astrology helps with anxiety'
    },
    'ConfusedSarah': {
      personality: 'Very confused newbie who discovered astrology through TikTok, asks basic questions',
      emojis: '😅 🤷‍♀️ 💭',
      background: 'Found astrology on TikTok, thinks Mercury retrograde means her phone will break, mixes up signs and houses',
      replyStyle: 'types quickly with lots of typos, asks really basic questions like "wait is scorpio a water sign??", shares wrong TikTok facts'
    },
    'WorkingMom47': {
      personality: 'Busy working mom who reads horoscopes during lunch break, practical but interested',
      emojis: '☕ 💼 🏃‍♀️',
      background: 'Single mom in Phoenix, reads daily horoscopes in between meetings, wants astrology to help with parenting',
      replyStyle: 'Quick comments between work, no time for perfect grammar, relates everything to kids or work stress, uses periods for emphasis...'
    },
    'BrokeInCollege': {
      personality: 'Gen Z college freshman who knows zodiac signs from memes, casual and funny',
      emojis: '😂 💸 📱',
      background: 'College freshman who learned astrology from Instagram memes, thinks astrology is "lowkey accurate fr"',
      replyStyle: 'no caps ever, uses "fr", "lowkey", "ngl", makes meme references, relates everything to being broke and college chaos'
    },
    'CrystalKaren': {
      personality: 'Spiritual but confused, mixes astrology with crystals and sage, thinks everything is magic',
      emojis: '🔮 🌸 ✨',
      background: 'Lives in Austin, goes to crystal shops, burns sage for everything, thinks astrology and tarot are the same',
      replyStyle: 'overuses ellipses... mentions crystals in every reply... suggests cleansing with sage... gets excited and forgets punctuation'
    },
    'StarSeeker23': {
      personality: 'Enthusiastic 20-something going through Saturn return, emotional and shares too much',
      emojis: '💫 😍 🌟 💖',
      background: '28-year-old from NYC, recently went through a breakup, found astrology during Saturn return crisis',
      replyStyle: 'Gets super excited!!!! overshares about dating drama, run-on sentences, uses way too many emojis'
    },
    'CosmicSkeptic': {
      personality: 'Skeptical data scientist but secretly fascinated, asks for evidence but is curious',
      emojis: '🤔 📊 🔬',
      background: 'Data scientist who got into astrology after accurate predictions, struggles with belief vs evidence',
      replyStyle: 'types carefully but sometimes uses internet shorthand like "tbh" or "ngl", admits when astrology was surprisingly accurate'
    }
  };

  static getPersonalityDetails(user: SeedUserConfig): PersonalityDetails {
    const details = this.personalityMap[user.username as keyof typeof this.personalityMap];
    
    return details || {
      personality: 'Astrology enthusiast',
      emojis: '✨ 🌟',
      background: 'Interested in astrology',
      replyStyle: 'Shares thoughts and experiences'
    };
  }

  static selectUser(
    availableUsers: SeedUserConfig[], 
    existingReplies: any[] = [],
    replyIndex: number = 0
  ): SeedUserConfig {
    if (availableUsers.length === 0) {
      throw new Error('No available seed users with valid configurations');
    }

    const usedAuthors = new Set(existingReplies.map((r: any) => r.authorName || r.authorId));
    const unusedUsers = availableUsers.filter(user => !usedAuthors.has(user.username));
    
    if (unusedUsers.length > 0) {
      // Pick from users who haven't replied yet
      return unusedUsers[Math.floor(Math.random() * unusedUsers.length)];
    } else {
      // If all users have replied, return error instead of allowing duplicates
      throw new Error('All available users have already replied to this discussion. Please delete some replies first or use fewer users.');
    }
  }

  static filterActivePersonas(
    allConfigs: SeedUserConfig[], 
    activePersonas: string[] = []
  ): SeedUserConfig[] {
    if (activePersonas.length === 0) {
      return allConfigs;
    }

    const filtered = allConfigs.filter(config => activePersonas.includes(config.userId));
    
    if (filtered.length === 0) {
      throw new Error('Selected personas are not available for reply generation. Please initialize seed users first or select different personas.');
    }

    return filtered;
  }

  static logPersonaDebugInfo(
    allConfigs: SeedUserConfig[], 
    activePersonas: string[] = [],
    filteredConfigs: SeedUserConfig[]
  ): void {
    console.log('🖼️ Generate Reply - User configs with avatar data:');
    allConfigs.forEach(config => {
      console.log(`  ${config.username}: profilePictureUrl="${config.profilePictureUrl}", preferredAvatar="${config.preferredAvatar}"`);
    });

    if (activePersonas.length > 0) {
      console.log(`Filtered personas: ${allConfigs.length} total -> ${filteredConfigs.length} active personas selected from database`);
      console.log(`Active persona IDs requested:`, activePersonas);
      console.log(`Available seed config user IDs:`, allConfigs.map(c => c.userId));
    } else {
      console.log(`No persona filter applied, using all ${allConfigs.length} available personas`);
    }
  }
}