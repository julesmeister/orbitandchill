import React from 'react';
import { BRAND } from '@/config/brand';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
  pageTitle?: string;
}

export default function FAQStructuredData({ faqs, pageTitle = "FAQ" }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": `${pageTitle} | ${BRAND.name}`,
    "mainEntity": faqs.map((faq, index) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      },
      "position": index + 1
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Common astrology FAQs for reuse
export const astrologyFAQs: FAQItem[] = [
  {
    question: "What is a natal chart?",
    answer: "A natal chart, also called a birth chart, is a map of where all the planets were in their journey around the Sun at the exact moment you were born. It's calculated using your birth date, time, and location to create a unique astrological blueprint of your personality and life path."
  },
  {
    question: "How accurate does my birth time need to be?",
    answer: "For the most accurate natal chart, your birth time should be as precise as possible, ideally to the minute. Even a few minutes can change your rising sign and house placements. If you don't know your exact birth time, you can still get valuable insights from your chart, though some elements like houses and the rising sign may be less accurate."
  },
  {
    question: "What are the 12 houses in astrology?",
    answer: "The 12 houses in astrology represent different areas of life: 1st house (self/identity), 2nd house (money/values), 3rd house (communication), 4th house (home/family), 5th house (creativity/romance), 6th house (health/work), 7th house (partnerships), 8th house (transformation), 9th house (philosophy/travel), 10th house (career), 11th house (friendships/goals), and 12th house (spirituality/subconscious)."
  },
  {
    question: "What is astrocartography?",
    answer: "Astrocartography is a technique that maps how your natal chart changes in different locations around the world. It shows where different planetary energies are emphasized geographically, helping you understand how moving to certain places might affect your life experiences, career, relationships, and personal growth."
  },
  {
    question: "What is horary astrology?",
    answer: "Horary astrology is a branch of astrology used to answer specific questions by creating a chart for the exact moment the question is asked. It's like consulting an oracle - you ask a clear, specific question and the chart provides insight into the answer. It's particularly useful for timing decisions and understanding specific situations."
  }
];

export const privacyFAQs: FAQItem[] = [
  {
    question: "Do I need to create an account to use Orbit and Chill?",
    answer: "No, you can use Orbit and Chill completely anonymously without creating an account. Your birth data and preferences are stored locally in your browser. Creating an account is optional and allows you to save charts across devices and participate in the community forum."
  },
  {
    question: "Is my birth information safe and private?",
    answer: "Yes, your privacy is our top priority. For anonymous users, all birth data is stored locally in your browser and never sent to our servers. For registered users, birth information is encrypted and stored securely. You can delete your data at any time from your browser or account settings."
  },
  {
    question: "What information do you collect about me?",
    answer: "For anonymous users, we only collect basic usage analytics without personal identification. For registered users, we collect your email, display name, and birth information for saved charts. We use minimal data collection practices and never share personal information with third parties."
  }
];