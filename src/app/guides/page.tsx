/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import { BRAND } from '@/config/brand';

interface Guide {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: string;
  topics: string[];
  featured: boolean;
}

const guides: Guide[] = [
  {
    id: 'natal-chart',
    title: 'Your First Natal Chart: A Complete Beginner\'s Guide',
    description: 'Start your astrological journey with this comprehensive introduction to natal charts. Learn what each element means and how to interpret your cosmic blueprint.',
    level: 'beginner',
    category: 'Chart Basics',
    estimatedTime: '30 min',
    topics: ['Planets', 'Signs', 'Houses', 'Aspects', 'Chart Structure'],
    featured: true
  },
  {
    id: 'astrocartography',
    title: 'Astrocartography: Finding Your Perfect Places',
    description: 'Discover how different locations around the world can enhance various aspects of your life based on your natal chart\'s planetary power lines.',
    level: 'intermediate',
    category: 'Astrocartography',
    estimatedTime: '45 min',
    topics: ['Planetary Lines', 'Location Analysis', 'AC/MC Lines', 'Relocation Charts', 'Travel Planning'],
    featured: true
  },
  {
    id: '3',
    title: 'The Astrological Houses: Life\'s Twelve Stages',
    description: 'Explore the twelve houses and how they represent different areas of your life experience, from identity to spirituality.',
    level: 'intermediate',
    category: 'Houses',
    estimatedTime: '40 min',
    topics: ['Angular Houses', 'Succedent Houses', 'Cadent Houses', 'House Meanings'],
    featured: false
  },
  {
    id: 'electional-astrology',
    title: 'Electional Astrology: Timing Your Success',
    description: 'Master the art of choosing auspicious timing for important events using electional astrology. Learn to select optimal moments for launches, contracts, and life decisions.',
    level: 'intermediate',
    category: 'Electional Astrology',
    estimatedTime: '35 min',
    topics: ['Timing Principles', 'Event Planning', 'Lunar Elections', 'Planetary Hours', 'Void of Course'],
    featured: true
  },
  {
    id: '5',
    title: 'Your Big Three: Sun, Moon, and Rising Signs',
    description: 'Master the foundation of astrological interpretation by understanding your core personality trio.',
    level: 'beginner',
    category: 'Essential Signs',
    estimatedTime: '25 min',
    topics: ['Sun Sign', 'Moon Sign', 'Rising Sign', 'Integration'],
    featured: false
  },
  {
    id: '6',
    title: 'Transits and Timing: When the Planets Move',
    description: 'Understand how current planetary movements affect your natal chart and learn to track important life cycles.',
    level: 'advanced',
    category: 'Transits',
    estimatedTime: '50 min',
    topics: ['Transit Types', 'Timing Events', 'Personal Transits', 'Collective Transits'],
    featured: false
  },
  {
    id: '7',
    title: 'Retrograde Planets: Cosmic Course Corrections',
    description: 'Demystify retrograde planets in your natal chart and current transits. Learn what they really mean beyond the Mercury retrograde hype.',
    level: 'intermediate',
    category: 'Planetary Motion',
    estimatedTime: '30 min',
    topics: ['Natal Retrogrades', 'Transit Retrogrades', 'Shadow Periods'],
    featured: false
  },
  {
    id: 'horary-astrology',
    title: 'Horary Astrology: Answering Life\'s Questions',
    description: 'Learn the ancient art of horary astrology to answer specific questions using the moment a question is asked. Master traditional techniques and interpretation methods.',
    level: 'advanced',
    category: 'Horary Astrology',
    estimatedTime: '60 min',
    topics: ['Question Analysis', 'Significators', 'Traditional Rules', 'Timing Techniques', 'Judgment Methods'],
    featured: true
  },
  {
    id: '9',
    title: 'Elements and Modalities: The Building Blocks',
    description: 'Understand the four elements (Fire, Earth, Air, Water) and three modalities (Cardinal, Fixed, Mutable) that shape astrological interpretation.',
    level: 'beginner',
    category: 'Fundamentals',
    estimatedTime: '20 min',
    topics: ['Fire Element', 'Earth Element', 'Air Element', 'Water Element', 'Cardinal', 'Fixed', 'Mutable'],
    featured: false
  },
  {
    id: '10',
    title: 'The Moon Phases and Your Emotional Cycle',
    description: 'Learn how lunar cycles connect to your emotional patterns and how to work with moon energy for personal growth.',
    level: 'intermediate',
    category: 'Lunar Astrology',
    estimatedTime: '35 min',
    topics: ['New Moon', 'Full Moon', 'Waxing Moon', 'Waning Moon', 'Lunar Returns'],
    featured: false
  }
];

const categories = ['All Guides', 'Chart Basics', 'Astrocartography', 'Houses', 'Electional Astrology', 'Essential Signs', 'Transits', 'Planetary Motion', 'Horary Astrology', 'Fundamentals', 'Lunar Astrology'];
const levels = ['All Levels', 'beginner', 'intermediate', 'advanced'];

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Guides');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'All Guides' || guide.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || guide.level === selectedLevel;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const featuredGuides = guides.filter(guide => guide.featured);

  // Options for dropdowns
  const categoryOptions = categories.map(category => ({
    value: category,
    label: category
  }));

  const levelOptions = levels.map(level => ({
    value: level,
    label: level === 'All Levels' ? level : `${level.charAt(0).toUpperCase() + level.slice(1)} Level`
  }));

  // SEO metadata
  const pageTitle = `Astrology Guides & Learning Resources | ${BRAND.name}`;
  const pageDescription = "Master astrology with our comprehensive guides covering natal charts, zodiac signs, houses, aspects, and more. From beginner to advanced tutorials.";
  const pageUrl = `${BRAND.domain}/guides`;

  // Structured data for guides
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Astrology Learning Guides",
    "description": pageDescription,
    "url": pageUrl,
    "numberOfItems": guides.length,
    "itemListElement": guides.map((guide, index) => ({
      "@type": "Article",
      "position": index + 1,
      "name": guide.title,
      "description": guide.description,
      "url": `${pageUrl}/${guide.id}`,
      "author": {
        "@type": "Organization",
        "name": BRAND.name
      },
      "publisher": {
        "@type": "Organization",
        "name": BRAND.name,
        "url": BRAND.domain
      },
      "about": {
        "@type": "Thing",
        "name": "Astrology Education"
      },
      "teaches": guide.topics,
      "educationalLevel": guide.level,
      "timeRequired": guide.estimatedTime,
      "articleSection": guide.category
    }))
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BRAND.domain
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Astrology Guides",
        "item": pageUrl
      }
    ]
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-black border border-black';
      case 'intermediate': return 'text-black border border-black';
      case 'advanced': return 'text-black border border-black';
      default: return 'text-black border border-black';
    }
  };

  const getLevelBgColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#e7fff6'; // light-green
      case 'intermediate': return '#fffbed'; // light-yellow
      case 'advanced': return '#f0e3ff'; // light-purple
      default: return 'white';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '⭐';
      case 'intermediate': return '⭐⭐';
      case 'advanced': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-2 md:mb-3 lg:mb-4">
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                  Learning Resources
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight font-space-grotesk">
                Master Astrology with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-1 lg:mt-2">
                  Expert Guides
                </span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                From natal chart basics to advanced techniques, explore our comprehensive collection of astrology guides designed for every level of expertise.
              </p>
            </div>
        </section>

        {/* Search and Filters */}
        <section className="px-6 md:px-12 lg:px-20 py-8">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search guides, topics, or concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-black placeholder-black/50 focus:outline-none border-b-2 border-black bg-transparent font-inter text-lg"
                />
              </div>
              
              <div className="flex items-end gap-4">
                <SynapsasDropdown
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  className="w-64"
                />
                
                <SynapsasDropdown
                  options={levelOptions}
                  value={selectedLevel}
                  onChange={setSelectedLevel}
                  className="w-48"
                />
              </div>
            </div>
        </section>

        {/* Featured Guides */}
        {selectedCategory === 'All Guides' && selectedLevel === 'All Levels' && !searchQuery && (
          <section aria-labelledby="featured-guides-heading" className="px-6 md:px-12 lg:px-20 py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 id="featured-guides-heading" className="text-3xl font-bold text-gray-900 font-space-grotesk">Featured Guides</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Editor's Choice</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden border border-black">
                {featuredGuides.slice(0, 4).map((guide, index) => (
                  <div
                    key={guide.id}
                    className={`group p-10 transition-all duration-300 relative
                      ${index === 0 ? 'border-b lg:border-b lg:border-r border-black hover:brightness-110' : ''}
                      ${index === 1 ? 'border-b lg:border-b lg:border-r-0 border-black hover:brightness-110' : ''}
                      ${index === 2 ? 'border-b-0 lg:border-r border-black hover:brightness-110' : ''}
                      ${index === 3 ? 'hover:brightness-110' : ''}
                    `}
                    style={{
                      backgroundColor: index === 0 ? '#6bdbff' :
                        index === 1 ? '#f2e356' :
                          index === 2 ? '#51bd94' :
                            '#ff91e9'
                    }}
                  >
                    {/* Hover accent */}
                    <div
                      className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                      style={{
                        backgroundColor: '#19181a'
                      }}
                    ></div>

                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold ${getLevelColor(guide.level)}`}
                        style={{ backgroundColor: getLevelBgColor(guide.level) }}
                      >
                        {getLevelIcon(guide.level)} {guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}
                      </span>
                      <div className={`flex items-center gap-2 text-sm ${index === 1 ? 'text-black/70' : 'text-black/70'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{guide.estimatedTime}</span>
                      </div>
                    </div>

                    <h3 className={`text-2xl font-bold mb-4 transition-colors font-space-grotesk ${index === 1 ? 'text-black hover:text-gray-800' : 'text-black hover:text-gray-800'}`}>
                      <Link href={`/guides/${guide.id}`}>
                        {guide.title}
                      </Link>
                    </h3>

                    <p className={`mb-6 leading-relaxed line-clamp-3 ${index === 1 ? 'text-black/80' : 'text-black/80'}`}>
                      {guide.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {guide.topics.slice(0, 4).map(topic => (
                        <span key={topic} className={`px-3 py-1 text-xs font-medium rounded-lg ${index === 1 ? 'bg-black/10 text-black' : 'bg-black/10 text-black'}`}>
                          {topic}
                        </span>
                      ))}
                      {guide.topics.length > 4 && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-lg ${index === 1 ? 'bg-black/5 text-black/60' : 'bg-black/5 text-black/60'}`}>
                          +{guide.topics.length - 4} more
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/guides/${guide.id}`}
                      className={`inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all duration-300 ${index === 1 ? 'text-black hover:text-gray-800' : 'text-black hover:text-gray-800'}`}
                    >
                      <span>Start Learning</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
          </section>
        )}

        {/* All Guides */}
        <section aria-labelledby="all-guides-heading" className="px-6 md:px-12 lg:px-20 py-12">
            <h2 id="all-guides-heading" className="text-3xl font-bold text-gray-900 mb-8 font-space-grotesk">
              {selectedCategory === 'All Guides' && selectedLevel === 'All Levels' && !searchQuery
                ? 'All Guides'
                : `${filteredGuides.length} Guide${filteredGuides.length !== 1 ? 's' : ''} Found`
              }
            </h2>

            {filteredGuides.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 font-space-grotesk">No guides found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Guides');
                    setSelectedLevel('All Levels');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 bg-white rounded-2xl overflow-hidden border border-black">
                {filteredGuides.map((guide, index) => {
                  const totalItems = filteredGuides.length;
                  const itemsInLastRow = totalItems % 3 === 0 ? 3 : totalItems % 3;
                  const lastRowStartIndex = totalItems - itemsInLastRow;
                  const isInLastRow = index >= lastRowStartIndex;
                  const isLastColumn = (index + 1) % 3 === 0;
                  const isLastInMdGrid = (index + 1) % 2 === 0;

                  return (
                    <div
                      key={guide.id}
                      className={`group p-8 hover:bg-gray-50 transition-all duration-300 relative
                        ${!isInLastRow ? 'border-b' : ''} 
                        ${!isLastColumn ? 'lg:border-r' : ''} 
                        ${!isLastInMdGrid ? 'md:border-r lg:border-r' : 'md:border-r-0 lg:border-r'}
                        border-black
                      `}
                    >
                      {/* Hover accent */}
                      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300" style={{ backgroundColor: '#19181a' }}></div>

                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold ${getLevelColor(guide.level)}`}
                          style={{ backgroundColor: getLevelBgColor(guide.level) }}
                        >
                          {getLevelIcon(guide.level)} {guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{guide.estimatedTime}</span>
                        </div>
                      </div>

                      <span className="inline-block px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg mb-3">
                        {guide.category}
                      </span>

                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 font-space-grotesk">
                        <Link href={`/guides/${guide.id}`}>
                          {guide.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {guide.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {guide.topics.slice(0, 3).map(topic => (
                          <span key={topic} className="px-2 py-1 bg-black text-white text-xs font-medium border border-black">
                            {topic}
                          </span>
                        ))}
                        {guide.topics.length > 3 && (
                          <span className="px-2 py-1 bg-white text-black text-xs font-medium border border-black">
                            +{guide.topics.length - 3}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/guides/${guide.id}`}
                        className="inline-flex items-center gap-2 text-black font-semibold text-sm hover:gap-3 hover:text-gray-700 transition-all duration-300"
                      >
                        <span>Read Guide</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
        </section>

        {/* Learning Path Suggestion */}
        <section aria-labelledby="learning-path-heading" className="px-6 md:px-12 lg:px-20 py-12">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 id="learning-path-heading" className="text-3xl font-bold mb-4 font-epilogue">Ready to Begin Your Journey?</h3>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Start with our beginner-friendly guides and build your knowledge step by step.
                  We recommend starting with your natal chart basics and then exploring specific areas of interest.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/guides/natal-chart"
                    className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Start with Basics</span>
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Generate Chart First</span>
                  </Link>
                </div>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
}