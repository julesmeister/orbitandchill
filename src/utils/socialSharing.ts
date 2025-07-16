import { BRAND } from '@/config/brand';

export interface ShareData {
  subjectName: string;
  shareUrl: string;
  birthDate?: string;
  birthLocation?: string;
  sunSign?: string;
  dominantElement?: string;
}

export interface PlatformShareData {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

export const generateShareContent = (data: ShareData): PlatformShareData => {
  const { subjectName, shareUrl, birthDate, birthLocation, sunSign } = data;
  
  // Generate base content
  const title = `${subjectName}'s Natal Chart | ${BRAND.name}`;
  
  // Create engaging share text with emojis and context
  const shareTexts = [
    `✨ Just discovered ${subjectName}'s cosmic blueprint! ${sunSign ? `${getSunSignEmoji(sunSign)} ${sunSign}` : ''} Check out this fascinating natal chart from ${BRAND.name}! 🌟`,
    `🔮 Exploring the stars with ${subjectName}'s natal chart! ${birthDate ? `Born ${birthDate}` : ''} ${birthLocation ? `in ${birthLocation}` : ''} - see what the cosmos reveal! ✨`,
    `🌙 The universe has so much to tell us! Dive into ${subjectName}'s astrological journey with this beautiful natal chart from ${BRAND.name} 🌟`,
    `⭐ Astrology lovers, check this out! ${subjectName}'s natal chart reveals some amazing cosmic patterns ${sunSign ? `- ${sunSign} energy is strong! ${getSunSignEmoji(sunSign)}` : ''} 🔮`,
  ];
  
  // Select random share text for variety
  const selectedText = shareTexts[Math.floor(Math.random() * shareTexts.length)];
  
  const hashtags = [
    'astrology',
    'natalchart',
    'birthchart',
    'horoscope',
    'zodiac',
    'cosmic',
    'starmap',
    'astro',
    ...(sunSign ? [sunSign.toLowerCase()] : []),
  ];
  
  return {
    title,
    text: selectedText,
    url: shareUrl,
    hashtags,
  };
};

export const generatePlatformSpecificContent = (data: ShareData, platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'whatsapp' | 'generic'): PlatformShareData => {
  const baseContent = generateShareContent(data);
  
  switch (platform) {
    case 'twitter':
      return {
        ...baseContent,
        text: `${baseContent.text}\n\n#${baseContent.hashtags?.slice(0, 3).join(' #')}`,
      };
      
    case 'facebook':
      return {
        ...baseContent,
        text: `${baseContent.text}\n\nDiscover your own cosmic blueprint at ${BRAND.name}! 🌟`,
      };
      
    case 'instagram':
      return {
        ...baseContent,
        text: `${baseContent.text}\n\n#${baseContent.hashtags?.slice(0, 8).join(' #')}`,
      };
      
    case 'linkedin':
      return {
        ...baseContent,
        text: `Fascinated by the intersection of ancient wisdom and modern insights! ${data.subjectName}'s natal chart reveals interesting patterns about personality and life path. Created with ${BRAND.name}'s astrology tools.`,
      };
      
    case 'whatsapp':
      return {
        ...baseContent,
        text: `Hey! 👋 Just wanted to share ${data.subjectName}'s natal chart with you - it's really fascinating! ${data.sunSign ? `They're a ${data.sunSign} ${getSunSignEmoji(data.sunSign)}` : ''} Check it out: ${data.shareUrl}`,
      };
      
    default:
      return baseContent;
  }
};

export const getSunSignEmoji = (sunSign: string): string => {
  const signEmojis: { [key: string]: string } = {
    'aries': '♈',
    'taurus': '♉',
    'gemini': '♊',
    'cancer': '♋',
    'leo': '♌',
    'virgo': '♍',
    'libra': '♎',
    'scorpio': '♏',
    'sagittarius': '♐',
    'capricorn': '♑',
    'aquarius': '♒',
    'pisces': '♓',
  };
  
  return signEmojis[sunSign.toLowerCase()] || '⭐';
};

export const shareToSocialMedia = async (data: ShareData, platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'whatsapp'): Promise<boolean> => {
  try {
    if (platform) {
      const platformContent = generatePlatformSpecificContent(data, platform);
      
      // Platform-specific sharing URLs
      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(platformContent.text)}&url=${encodeURIComponent(platformContent.url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(platformContent.url)}&quote=${encodeURIComponent(platformContent.text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(platformContent.url)}&title=${encodeURIComponent(platformContent.title)}&summary=${encodeURIComponent(platformContent.text)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(platformContent.text)}`,
        instagram: '', // Instagram doesn't support URL sharing, would need to copy to clipboard
      };
      
      if (platform === 'instagram') {
        // Copy to clipboard for Instagram
        await navigator.clipboard.writeText(`${platformContent.text}\n\n${platformContent.url}`);
        return true;
      }
      
      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        return true;
      }
    }
    
    // Generic sharing (Web Share API or clipboard)
    const genericContent = generateShareContent(data);
    
    if (navigator.share) {
      await navigator.share({
        title: genericContent.title,
        text: genericContent.text,
        url: genericContent.url,
      });
      return true;
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${genericContent.text}\n\n${genericContent.url}`);
      return true;
    }
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
};

export const generateSocialMediaButtons = (data: ShareData) => {
  const platforms = [
    { key: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { key: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
    { key: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
    { key: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { key: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
  ];
  
  return platforms.map(platform => ({
    ...platform,
    shareData: generatePlatformSpecificContent(data, platform.key as any),
    onClick: () => shareToSocialMedia(data, platform.key as any),
  }));
};