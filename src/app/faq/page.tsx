/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'charts' | 'technical' | 'privacy' | 'community';
}

const faqs: FAQ[] = [
  // General Questions
  {
    id: '1',
    category: 'general',
    question: 'What is Luckstrology?',
    answer: 'Luckstrology is a free web-based platform that provides accurate natal chart generation, astrological interpretations, and a community space for astrology enthusiasts. We use astronomy-engine for professional-grade astronomical calculations with ±1 arcminute precision.'
  },
  {
    id: '2',
    category: 'general',
    question: 'Is Luckstrology really free?',
    answer: 'Yes! Our core features including natal chart generation, basic interpretations, and community discussions are completely free. We believe everyone should have access to quality astrological tools.'
  },
  {
    id: '3',
    category: 'general',
    question: 'Do I need to create an account?',
    answer: 'No, you don\'t need to create an account to use Luckstrology. Your birth data is automatically saved in your browser, and you\'ll get a unique anonymous identity. You can optionally sign in with Google for additional features.'
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
    answer: 'Currently, each browser session is associated with one person\'s chart data. To generate charts for others, you would need to temporarily enter their birth information (with their permission) or they can visit Luckstrology themselves.'
  },
  
  // Technical Questions
  {
    id: '8',
    category: 'technical',
    question: 'Why can\'t I find my birth location?',
    answer: 'Our location search uses the Nominatim geocoding service. Try different variations of your location (city only, city + country, or major nearby city). If you still can\'t find it, you can enter approximate coordinates manually.'
  },
  {
    id: '9',
    category: 'technical',
    question: 'Can I download or print my chart?',
    answer: 'Yes! You can download your natal chart as an SVG or PNG file. SVG files maintain quality at any size, while PNG files are great for sharing on social media or printing.'
  },
  {
    id: '10',
    category: 'technical',
    question: 'Does Luckstrology work on mobile devices?',
    answer: 'Absolutely! Luckstrology is fully responsive and works great on smartphones, tablets, and desktop computers. The interface adapts to provide the best experience on your device.'
  },
  {
    id: '11',
    category: 'technical',
    question: 'What browsers are supported?',
    answer: 'Luckstrology works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
  },
  
  // Privacy Questions
  {
    id: '12',
    category: 'privacy',
    question: 'How is my birth data stored and protected?',
    answer: 'Your birth data is primarily stored locally in your browser\'s IndexedDB. When you generate a chart, the data is temporarily sent to our servers for calculation, then immediately deleted. We use HTTPS encryption and never sell your personal information.'
  },
  {
    id: '13',
    category: 'privacy',
    question: 'Can I delete my data?',
    answer: 'Yes, you have full control over your data. You can delete your birth information and all associated data at any time through your profile settings. This action is permanent and cannot be undone.'
  },
  {
    id: '14',
    category: 'privacy',
    question: 'What information is shared in the community?',
    answer: 'Only the information you choose to share is visible to others. By default, your birth data is private. You can control what astrological information (like your sun sign) appears in your public profile through privacy settings.'
  },
  
  // Community Questions
  {
    id: '15',
    category: 'community',
    question: 'How do I participate in discussions?',
    answer: 'Simply visit the Discussions page to browse topics or create new ones. You can reply to existing threads, start new conversations, and share your astrological insights with the community.'
  },
  {
    id: '16',
    category: 'community',
    question: 'What are the community guidelines?',
    answer: 'We ask all members to be respectful, kind, and supportive. Avoid sharing personal attacks, spam, or harmful content. Remember that astrology is for guidance and entertainment, not absolute prediction. See our Terms of Service for full guidelines.'
  },
  {
    id: '17',
    category: 'community',
    question: 'Can I share my natal chart with others?',
    answer: 'Yes! You can share your chart image directly, or share insights and interpretations in the community discussions. Always respect others\' privacy and only share your own chart unless you have explicit permission.'
  }
];

const categories = [
  { id: 'all', label: 'All Questions', count: faqs.length },
  { id: 'general', label: 'General', count: faqs.filter(f => f.category === 'general').length },
  { id: 'charts', label: 'Charts & Calculations', count: faqs.filter(f => f.category === 'charts').length },
  { id: 'technical', label: 'Technical Support', count: faqs.filter(f => f.category === 'technical').length },
  { id: 'privacy', label: 'Privacy & Data', count: faqs.filter(f => f.category === 'privacy').length },
  { id: 'community', label: 'Community', count: faqs.filter(f => f.category === 'community').length }
];

// Synapsas color palette for categories
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'general': return '#6bdbff';     // blue
    case 'charts': return '#f2e356';      // yellow
    case 'technical': return '#51bd94';   // green
    case 'privacy': return '#ff91e9';     // purple
    case 'community': return '#19181a';   // black
    default: return '#19181a';
  }
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-6 md:px-12 lg:px-20 py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
              Frequently Asked Questions
            </h1>
            <p className="font-inter text-xl text-black/80 leading-relaxed">
              Find answers to common questions about Luckstrology, natal charts, and astrology.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-8">
            <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-black placeholder-black/50 focus:outline-none border-b-2 border-black bg-transparent font-inter text-lg"
              placeholder="Search for answers..."
            />
          </div>
        </div>
          </section>
        </div>

        {/* Main Content */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 border border-black bg-white">
            <div className="p-6">
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Categories</h3>
              <div className="space-y-1">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between group relative ${
                      selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'text-black hover:pl-6'
                    }`}
                  >
                    {/* Hover accent bar */}
                    {selectedCategory !== category.id && (
                      <div 
                        className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                        style={{ backgroundColor: getCategoryColor(categories[index]?.id || 'general') }}
                      />
                    )}
                    <span className="font-inter font-medium">{category.label}</span>
                    <span className={`text-sm px-2 py-1 font-semibold ${
                      selectedCategory === category.id
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
            {filteredFAQs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 border-2 border-black flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-xl font-bold text-black mb-3">No questions found</h3>
                <p className="font-inter text-black/70">Try adjusting your search or browse different categories.</p>
              </div>
            ) : (
              <div className="divide-y divide-black">
                {filteredFAQs.map((faq, index) => (
                  <div key={faq.id} className="relative">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="pr-6">
                          {/* Category indicator */}
                          <div 
                            className="inline-block w-2 h-2 mb-3 mr-2"
                            style={{ backgroundColor: getCategoryColor(faq.category) }}
                          />
                          <h3 className="font-space-grotesk text-lg font-semibold text-black inline">
                            {faq.question}
                          </h3>
                        </div>
                        <svg
                          className={`w-6 h-6 text-black transition-transform flex-shrink-0 ${
                            expandedItems.has(faq.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {expandedItems.has(faq.id) && (
                      <div className="px-8 pb-6">
                        <div className="border-t border-black/20 pt-4">
                          <p className="font-inter text-black/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
          </section>
        </div>

        {/* Still Have Questions */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <section className="px-6 md:px-12 lg:px-20 py-16 border-t border-black">
            <div>
          <div 
            className="p-12 text-center"
            style={{ backgroundColor: '#f0e3ff' }} // Light purple from Synapsas
          >
            <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-space-grotesk text-3xl font-bold text-black mb-4">Still have questions?</h3>
            <p className="font-inter text-black/80 mb-8 text-lg">
              Can&apos;t find what you&apos;re looking for? Our team is here to help you with any questions about 
              astrology, charts, or using our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact Support</span>
              </Link>
              <Link 
                href="/discussions" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Ask Community</span>
              </Link>
            </div>
          </div>
        </div>
          </section>
        </div>
      </div>
    </div>
  );
}