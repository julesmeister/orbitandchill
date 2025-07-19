/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface ShowcaseEvent {
  date: string;
  title: string;
  type: 'business' | 'finance' | 'relationship' | 'creative';
  score: number;
  description: string;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
  borderRight?: boolean;
}

const FeatureCard = React.memo(({ icon, title, description, bgColor, borderRight = false }: FeatureCardProps) => (
  <div className={`group p-6 hover:bg-gray-50 transition-all duration-300 relative ${borderRight ? 'md:border-r border-black' : ''}`}>
    <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
    <div className={`w-12 h-12 ${bgColor} flex items-center justify-center mb-4 mx-auto`}>
      <span className="text-xl">{icon}</span>
    </div>
    <h4 className="text-lg font-bold text-black mb-2 text-center font-space-grotesk">{title}</h4>
    <p className="text-gray-700 text-sm text-center leading-relaxed">
      {description}
    </p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

const FeatureHighlights = React.memo(() => (
  <div className="mt-10">
    <h3 className="text-xs font-semibold text-black uppercase tracking-wider mb-6 text-center font-open-sans">Why Timing Matters</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border border-black overflow-hidden">
      <FeatureCard
        icon="💼"
        title="Business Success"
        description="Launch companies, sign contracts, and make career moves when the stars align."
        bgColor="bg-blue-100"
        borderRight={true}
      />
      <FeatureCard
        icon="💰"
        title="Financial Growth"
        description="Make investments and financial decisions during periods of cosmic abundance."
        bgColor="bg-green-100"
        borderRight={true}
      />
      <FeatureCard
        icon="💕"
        title="Love & Relationships"
        description="Start relationships or deepen connections when Venus and the Moon create harmony."
        bgColor="bg-pink-100"
      />
    </div>
  </div>
));

FeatureHighlights.displayName = 'FeatureHighlights';

const ElectionalAstrologyShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock showcase events for demonstration
  const showcaseEvents: ShowcaseEvent[] = [
    {
      date: '2025-06-16',
      title: 'Launch New Business',
      type: 'business',
      score: 9,
      description: 'Jupiter trine Mercury enhances communication and expansion'
    },
    {
      date: '2025-06-18',
      title: 'Open Bank Account',
      type: 'finance',
      score: 8,
      description: 'Venus in 2nd house strengthens financial foundations'
    },
    {
      date: '2025-06-20',
      title: 'Start Relationship',
      type: 'relationship',
      score: 9,
      description: 'Venus conjunct Moon creates emotional harmony'
    },
    {
      date: '2025-06-22',
      title: 'Creative Project',
      type: 'creative',
      score: 8,
      description: 'Mars trine Jupiter fuels artistic inspiration'
    },
    {
      date: '2025-06-25',
      title: 'Sign Contracts',
      type: 'business',
      score: 7,
      description: 'Mercury in stable earth sign supports agreements'
    },
    {
      date: '2025-06-28',
      title: 'Investment Decision',
      type: 'finance',
      score: 8,
      description: 'Saturn trine Venus provides steady growth potential'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Activities', icon: '🌟', color: 'indigo' },
    { id: 'business', label: 'Business', icon: '💼', color: 'blue' },
    { id: 'finance', label: 'Finance', icon: '💰', color: 'green' },
    { id: 'relationship', label: 'Love', icon: '💕', color: 'pink' },
    { id: 'creative', label: 'Creative', icon: '🎨', color: 'purple' }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? showcaseEvents 
    : showcaseEvents.filter(event => event.type === selectedCategory);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'business': return 'bg-white text-black border border-black';
      case 'finance': return 'bg-white text-black border border-black';
      case 'relationship': return 'bg-white text-black border border-black';
      case 'creative': return 'bg-white text-black border border-black';
      default: return 'bg-white text-black border border-black';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-black';
    if (score >= 6) return 'bg-gray-600';
    return 'bg-gray-400';
  };

  const getCategoryColor = (categoryId: string, isSelected: boolean) => {
    return isSelected 
      ? 'bg-black text-white border border-black' 
      : 'bg-white text-black border border-black hover:bg-gray-50';
  };

  return (
    <div className="bg-white py-12">
      <div className="px-[5%] xl:px-[3%] 2xl:px-[2%]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold border border-black">
              Electional Astrology
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight font-space-grotesk">
            Perfect Timing for Life Events
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover cosmic moments to launch your business, start relationships, or begin creative projects.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-black uppercase tracking-wider mb-3 font-open-sans">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  getCategoryColor(category.id, selectedCategory === category.id)
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Events Section */}
        <div className="bg-white border border-black overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 border-b border-black">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-black font-space-grotesk">June 2025</h3>
                <p className="text-gray-700 text-sm mt-1">Electional astrology recommendations</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-700 mt-3 sm:mt-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black"></div>
                  <span>Excellent (8-10)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600"></div>
                  <span>Good (6-7)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-0">
            {filteredEvents.map((event, index) => {
              // Calculate borders for each breakpoint
              const totalItems = filteredEvents.length;
              
              // For 6 items:
              // Mobile (1 col): items 0-4 get bottom border
              // LG (2 cols): items 0-3 get bottom border (rows 1-2, last row has items 4-5)
              // XL (3 cols): items 0-2 get bottom border (row 1, last row has items 3-5)  
              // 2XL (4 cols): items 0-3 get bottom border (row 1, last row has items 4-5)
              
              const mobileIsLastRow = index === totalItems - 1;
              const lgIsLastRow = index >= Math.floor((totalItems - 1) / 2) * 2;
              const xlIsLastRow = index >= Math.floor((totalItems - 1) / 3) * 3;
              const xxlIsLastRow = index >= Math.floor((totalItems - 1) / 4) * 4;
              
              const lgIsLastColumn = (index + 1) % 2 === 0;
              const xlIsLastColumn = (index + 1) % 3 === 0;
              const xxlIsLastColumn = (index + 1) % 4 === 0;
              
              return (
                <div
                  key={index}
                  className={`group p-4 hover:bg-gray-50 transition-all duration-300 relative
                    ${!mobileIsLastRow ? 'border-b border-black' : ''} 
                    ${!lgIsLastRow ? 'lg:border-b border-black' : 'lg:border-b-0'}
                    ${!xlIsLastRow ? 'xl:border-b border-black' : 'xl:border-b-0'}
                    ${!xxlIsLastRow ? '2xl:border-b border-black' : '2xl:border-b-0'}
                    ${!lgIsLastColumn ? 'lg:border-r border-black' : ''}
                    ${!xlIsLastColumn ? 'xl:border-r border-black' : ''}
                    ${!xxlIsLastColumn ? '2xl:border-r border-black' : ''}
                  `}
                >
                  {/* Hover accent */}
                  <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                  
                  <div className="flex items-start gap-4">
                    {/* Date */}
                    <div className="text-center flex-shrink-0">
                      <div className="text-2xl font-bold text-black font-space-grotesk">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wide font-open-sans font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-black text-base font-space-grotesk">{event.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold ${getTypeColor(event.type)}`}>
                          {event.type} • {event.score}/10
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="p-6 bg-gray-50 border-t border-black">
            <div className="text-center">
              <h4 className="text-lg font-bold text-black mb-2 font-space-grotesk">
                Ready to use electional astrology?
              </h4>
              <p className="text-gray-700 text-sm mb-4">
                Get personalized recommendations based on your birth chart
              </p>
              <Link
                href="/electional"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span>📅</span>
                Explore Electional Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <FeatureHighlights />

        {/* Pro Tip Section */}
        <div className="mt-10 bg-gray-50 border border-black p-6 text-center">
          <h4 className="text-lg font-bold text-black mb-3 font-space-grotesk">Pro Tip</h4>
          <p className="text-gray-700 text-sm mb-4 max-w-2xl mx-auto">
            Combine multiple favorable transits for even more powerful electional opportunities!
          </p>
          <Link
            href="/learning-center"
            className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all duration-300 text-sm"
          >
            <span>Learn more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ElectionalAstrologyShowcase;