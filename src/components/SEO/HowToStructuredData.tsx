import React from 'react';
import { BRAND } from '@/config/brand';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToStructuredDataProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: string;
  supply?: string[];
  tool?: string[];
}

export default function HowToStructuredData({
  name,
  description,
  steps,
  totalTime,
  estimatedCost,
  supply = [],
  tool = []
}: HowToStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": `${BRAND.domain}/images/logo.png`,
    ...(totalTime && { "totalTime": totalTime }),
    ...(estimatedCost && { "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": estimatedCost } }),
    ...(supply.length > 0 && { 
      "supply": supply.map(item => ({ "@type": "HowToSupply", "name": item }))
    }),
    ...(tool.length > 0 && { 
      "tool": tool.map(item => ({ "@type": "HowToTool", "name": item }))
    }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Predefined guide steps for common astrology guides
export const natalChartGuideSteps: HowToStep[] = [
  {
    name: "Gather Your Birth Information",
    text: "Collect your exact birth date, time (to the minute if possible), and location (city and country). The more precise your birth time, the more accurate your chart will be."
  },
  {
    name: "Enter Your Information",
    text: "Navigate to the Natal Chart page and enter your birth details in the form. The location search will help you find your exact birthplace for geographic coordinates."
  },
  {
    name: "Generate Your Chart",
    text: "Click 'Generate Chart' to create your personalized natal chart. The system will calculate planetary positions and house placements based on your birth data."
  },
  {
    name: "Explore Your Chart",
    text: "Review your Sun, Moon, and Rising signs, planetary positions in houses, and major aspects. Each element provides insight into different aspects of your personality and life path."
  },
  {
    name: "Save or Share Your Chart",
    text: "Optionally save your chart to your profile for future reference or generate a shareable link to discuss your chart with others in the community."
  }
];

export const astrocartographyGuideSteps: HowToStep[] = [
  {
    name: "Generate Your Natal Chart First",
    text: "Start by creating your natal chart with accurate birth information. This serves as the foundation for your astrocartography map."
  },
  {
    name: "Access Astrocartography Tools",
    text: "Navigate to the Astrocartography page from the main menu. Your birth data will automatically populate if you've already created a natal chart."
  },
  {
    name: "Explore Planetary Lines",
    text: "View the world map showing your planetary lines. Each colored line represents where different planetary energies are emphasized geographically."
  },
  {
    name: "Research Specific Locations",
    text: "Click on areas of interest to see which planetary influences are strongest there. Consider how these energies align with your goals and desired life experiences."
  },
  {
    name: "Plan Your Relocation",
    text: "Use the insights to inform decisions about travel, relocation, or where to focus your energy for different life goals like career, relationships, or spiritual growth."
  }
];

export const matrixOfDestinyGuideSteps: HowToStep[] = [
  {
    name: "Understand Matrix of Destiny Basics",
    text: "Matrix of Destiny is a numerological system that combines your birth date with tarot archetypes to reveal your life purpose, talents, and karmic lessons."
  },
  {
    name: "Enter Your Birth Date",
    text: "Provide your complete birth date. The system will calculate your personal matrix based on numerological principles derived from your birth numbers."
  },
  {
    name: "Generate Your Matrix",
    text: "Click to generate your Matrix of Destiny chart, which will display a geometric pattern with tarot card archetypes representing different life aspects."
  },
  {
    name: "Interpret Your Archetypes",
    text: "Study each position in your matrix - your central archetype (life purpose), supporting energies (talents), and challenge cards (areas for growth)."
  },
  {
    name: "Apply the Insights",
    text: "Use your Matrix of Destiny to understand your natural gifts, life challenges, and optimal paths for personal development and fulfillment."
  }
];