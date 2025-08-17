/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import { allFAQs, getFAQCategories, searchFAQs, faqToStructuredData, type FAQ } from '@/data/faqData';

// Synapsas color palette for categories
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'general': return '#6bdbff';     // blue
    case 'astrology': return '#ff91e9';   // purple
    case 'charts': return '#f2e356';      // yellow
    case 'technical': return '#51bd94';   // green
    case 'privacy': return '#ff6b6b';     // red
    case 'community': return '#19181a';   // black
    default: return '#19181a';
  }
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = getFAQCategories();
  const filteredFAQs = searchFAQs(searchQuery, selectedCategory);

  // Generate structured data for SEO
  const structuredData = {
    ...faqToStructuredData(allFAQs),
    "name": `Frequently Asked Questions | ${BRAND.name}`,
    "description": `Find answers to common questions about ${BRAND.name}, natal charts, and astrology.`
  };

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
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="px-6 md:px-12 lg:px-20 py-16">
            <div className="text-center">
              <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
                Frequently Asked Questions
              </h1>
              <p className="font-open-sans text-xl text-black/80 leading-relaxed">
                Find answers to common questions about {BRAND.name}, natal charts, and astrology.
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
                    className="w-full pl-12 pr-4 py-4 text-black placeholder-black/50 focus:outline-none border-b-2 border-black bg-transparent font-open-sans text-lg"
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
                          <span className="font-open-sans font-medium">{category.label}</span>
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
                      <p className="font-open-sans text-black/70">Try adjusting your search or browse different categories.</p>
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
                                <p className="font-open-sans text-black/80 leading-relaxed">
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
                <p className="font-open-sans text-black/80 mb-8 text-lg">
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
            </section>
          </div>
        </div>
      </div>
    </>
  );
}