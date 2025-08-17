/* eslint-disable @typescript-eslint/no-unused-vars */
import { BRAND } from '@/config/brand';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'charts' | 'technical' | 'privacy' | 'community' | 'astrology';
}

export interface FAQCategory {
  id: string;
  label: string;
  count: number;
}

/**
 * Centralized FAQ data source for the entire application
 * This is the single source of truth for all FAQ content
 */
export const allFAQs: FAQ[] = [
  // General Questions
  {
    id: '1',
    category: 'general',
    question: `What is ${BRAND.name}?`,
    answer: `${BRAND.name} is a free web-based platform that provides accurate natal chart generation, astrological interpretations, and a community space for astrology enthusiasts. We use astronomy-engine for professional-grade astronomical calculations with ±1 arcminute precision.`
  },
  {
    id: '2',
    category: 'general',
    question: `Is ${BRAND.name} really free?`,
    answer: 'Yes! Our core features including natal chart generation, basic interpretations, and community discussions are completely free. We believe everyone should have access to quality astrological tools.'
  },
  {
    id: '3',
    category: 'general',
    question: 'Do I need to create an account?',
    answer: `No, you don't need to create an account to use ${BRAND.name}. Your birth data is automatically saved in your browser, and you'll get a unique anonymous identity. You can optionally sign in with Google for additional features.`
  },
  
  // Chart Questions
  {
    id: '4',
    category: 'charts',
    question: 'How accurate are your natal chart calculations?',
    answer: 'Our calculations use astronomy-engine, a modern MIT-licensed astronomical library that provides professional-grade accuracy (±1 arcminute). This ensures your natal chart is as precise as possible, suitable for serious astrological work.'
  },
  {
    id: '5',
    category: 'charts',
    question: 'What birth information do I need to provide?',
    answer: 'To generate an accurate natal chart, you need: 1) Your birth date, 2) Your birth time (as precise as possible), and 3) Your birth location (city or coordinates). The more precise your birth time, the more accurate your chart will be.'
  },
  {
    id: '6',
    category: 'charts',
    question: 'What if I don\'t know my exact birth time?',
    answer: 'If you don\'t know your exact birth time, you can still generate a chart using noon as an approximation. However, some chart elements (like your Ascendant and house positions) may not be accurate. Consider checking your birth certificate or asking family members for the precise time.'
  },
  {
    id: '7',
    category: 'charts',
    question: 'Can I generate charts for other people?',
    answer: `Currently, each browser session is associated with one person's chart data. To generate charts for others, you would need to temporarily enter their birth information (with their permission) or they can visit ${BRAND.name} themselves.`
  },
  
  // Astrology Knowledge Questions
  {
    id: '8',
    category: 'astrology',
    question: 'What is a natal chart?',
    answer: 'A natal chart, also called a birth chart, is a map of where all the planets were in their journey around the Sun at the exact moment you were born. It\'s calculated using your birth date, time, and location to create a unique astrological blueprint of your personality and life path.'
  },
  {
    id: '9',
    category: 'astrology',
    question: 'How accurate does my birth time need to be?',
    answer: 'For the most accurate natal chart, your birth time should be as precise as possible, ideally to the minute. Even a few minutes can change your rising sign and house placements. If you don\'t know your exact birth time, you can still get valuable insights from your chart, though some elements like houses and the rising sign may be less accurate.'
  },
  {
    id: '10',
    category: 'astrology',
    question: 'What are the 12 houses in astrology?',
    answer: 'The 12 houses in astrology represent different areas of life: 1st house (self/identity), 2nd house (money/values), 3rd house (communication), 4th house (home/family), 5th house (creativity/romance), 6th house (health/work), 7th house (partnerships), 8th house (transformation), 9th house (philosophy/travel), 10th house (career), 11th house (friendships/goals), and 12th house (spirituality/subconscious).'
  },
  {
    id: '11',
    category: 'astrology',
    question: 'What is astrocartography?',
    answer: 'Astrocartography is a technique that maps how your natal chart changes in different locations around the world. It shows where different planetary energies are emphasized geographically, helping you understand how moving to certain places might affect your life experiences, career, relationships, and personal growth.'
  },
  {
    id: '12',
    category: 'astrology',
    question: 'What is horary astrology?',
    answer: 'Horary astrology is a branch of astrology used to answer specific questions by creating a chart for the exact moment the question is asked. It\'s like consulting an oracle - you ask a clear, specific question and the chart provides insight into the answer. It\'s particularly useful for timing decisions and understanding specific situations.'
  },
  
  // Technical Questions
  {
    id: '13',
    category: 'technical',
    question: 'Why can\'t I find my birth location?',
    answer: 'Our location search uses the Nominatim geocoding service. Try different variations of your location (city only, city + country, or major nearby city). If you still can\'t find it, you can enter approximate coordinates manually.'
  },
  {
    id: '14',
    category: 'technical',
    question: 'Can I download or print my chart?',
    answer: 'Yes! You can download your natal chart as an SVG or PNG file. SVG files maintain quality at any size, while PNG files are great for sharing on social media or printing.'
  },
  {
    id: '15',
    category: 'technical',
    question: `Does ${BRAND.name} work on mobile devices?`,
    answer: `Absolutely! ${BRAND.name} is fully responsive and works great on smartphones, tablets, and desktop computers. The interface adapts to provide the best experience on your device.`
  },
  {
    id: '16',
    category: 'technical',
    question: 'What browsers are supported?',
    answer: `${BRAND.name} works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.`
  },
  
  // Privacy Questions
  {
    id: '17',
    category: 'privacy',
    question: 'How is my birth data stored and protected?',
    answer: 'Your birth data is primarily stored locally in your browser\'s IndexedDB. When you generate a chart, the data is temporarily sent to our servers for calculation, then immediately deleted. We use HTTPS encryption and never sell your personal information.'
  },
  {
    id: '18',
    category: 'privacy',
    question: 'Can I delete my data?',
    answer: 'Yes, you have full control over your data. You can delete your birth information and all associated data at any time through your profile settings. This action is permanent and cannot be undone.'
  },
  {
    id: '19',
    category: 'privacy',
    question: 'What information is shared in the community?',
    answer: 'Only the information you choose to share is visible to others. By default, your birth data is private. You can control what astrological information (like your sun sign) appears in your public profile through privacy settings.'
  },
  {
    id: '20',
    category: 'privacy',
    question: 'Is my birth information safe and private?',
    answer: 'Yes, your privacy is our top priority. For anonymous users, all birth data is stored locally in your browser and never sent to our servers. For registered users, birth information is encrypted and stored securely. You can delete your data at any time from your browser or account settings.'
  },
  {
    id: '21',
    category: 'privacy',
    question: 'What information do you collect about me?',
    answer: 'For anonymous users, we only collect basic usage analytics without personal identification. For registered users, we collect your email, display name, and birth information for saved charts. We use minimal data collection practices and never share personal information with third parties.'
  },
  
  // Community Questions
  {
    id: '22',
    category: 'community',
    question: 'How do I participate in discussions?',
    answer: 'Simply visit the Discussions page to browse topics or create new ones. You can reply to existing threads, start new conversations, and share your astrological insights with the community.'
  },
  {
    id: '23',
    category: 'community',
    question: 'What are the community guidelines?',
    answer: 'We ask all members to be respectful, kind, and supportive. Avoid sharing personal attacks, spam, or harmful content. Remember that astrology is for guidance and entertainment, not absolute prediction. See our Terms of Service for full guidelines.'
  },
  {
    id: '24',
    category: 'community',
    question: 'Can I share my natal chart with others?',
    answer: 'Yes! You can share your chart image directly, or share insights and interpretations in the community discussions. Always respect others\' privacy and only share your own chart unless you have explicit permission.'
  }
];

/**
 * Get FAQs by category
 */
export const getFAQsByCategory = (category: string): FAQ[] => {
  if (category === 'all') return allFAQs;
  return allFAQs.filter(faq => faq.category === category);
};

/**
 * Get all available categories with counts
 */
export const getFAQCategories = (): FAQCategory[] => [
  { id: 'all', label: 'All Questions', count: allFAQs.length },
  { id: 'general', label: 'General', count: allFAQs.filter(f => f.category === 'general').length },
  { id: 'astrology', label: 'Astrology Basics', count: allFAQs.filter(f => f.category === 'astrology').length },
  { id: 'charts', label: 'Charts & Calculations', count: allFAQs.filter(f => f.category === 'charts').length },
  { id: 'technical', label: 'Technical Support', count: allFAQs.filter(f => f.category === 'technical').length },
  { id: 'privacy', label: 'Privacy & Data', count: allFAQs.filter(f => f.category === 'privacy').length },
  { id: 'community', label: 'Community', count: allFAQs.filter(f => f.category === 'community').length }
];

/**
 * Get FAQs for specific purposes (used by SEO components)
 */
export const getGeneralFAQs = (): FAQ[] => getFAQsByCategory('general');
export const getAstrologyFAQs = (): FAQ[] => getFAQsByCategory('astrology');
export const getChartFAQs = (): FAQ[] => getFAQsByCategory('charts');
export const getPrivacyFAQs = (): FAQ[] => getFAQsByCategory('privacy');
export const getCommunityFAQs = (): FAQ[] => getFAQsByCategory('community');
export const getTechnicalFAQs = (): FAQ[] => getFAQsByCategory('technical');

/**
 * Search FAQs by query
 */
export const searchFAQs = (query: string, category: string = 'all'): FAQ[] => {
  const categoryFAQs = getFAQsByCategory(category);
  if (!query.trim()) return categoryFAQs;
  
  const searchTerm = query.toLowerCase();
  return categoryFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm) ||
    faq.answer.toLowerCase().includes(searchTerm)
  );
};

/**
 * Convert FAQ to structured data format for SEO
 */
export const faqToStructuredData = (faqs: FAQ[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq, index) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    },
    "position": index + 1
  }))
});

/**
 * Legacy format for backward compatibility with existing components
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export const convertToLegacyFormat = (faqs: FAQ[]): FAQItem[] => 
  faqs.map(faq => ({ question: faq.question, answer: faq.answer }));

// Export specific FAQ sets for backward compatibility
export const astrologyFAQs: FAQItem[] = convertToLegacyFormat(getAstrologyFAQs());
export const privacyFAQs: FAQItem[] = convertToLegacyFormat(getPrivacyFAQs());