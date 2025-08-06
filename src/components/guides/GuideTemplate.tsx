/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRAND } from '../../config/brand';
import { renderNatalChartContent } from '../../app/guides/natal-chart/content';

interface GuideSection {
  id: string;
  title: string;
  type: 'text' | 'interactive' | 'visual';
  content: string;
}

interface GuideData {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  sections: GuideSection[];
}

interface GuideTemplateProps {
  guide: GuideData;
  quickActions?: {
    primary: {
      title: string;
      description: string;
      href: string;
      linkText: string;
      backgroundColor: string;
    };
    secondary: {
      title: string;
      description: string;
      href: string;
      linkText: string;
      backgroundColor: string;
    };
  };
}

export default function GuideTemplate({ guide, quickActions }: GuideTemplateProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set([0]));

  // Update document title and meta tags
  useEffect(() => {
    document.title = `${guide.title} | ${BRAND.name}`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', guide.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = guide.description;
      document.head.appendChild(meta);
    }
  }, [guide.title, guide.description]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#e7fff6';    // light-green
      case 'intermediate': return '#fffbed'; // light-yellow
      case 'advanced': return '#f0e3ff';     // light-purple
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

  const handleSectionComplete = (sectionIndex: number) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionIndex);
    if (sectionIndex + 1 < guide.sections.length) {
      newCompleted.add(sectionIndex + 1);
    }
    setCompletedSections(newCompleted);
  };

  const navigateToSection = (sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    // Mark the section as completed when navigating to it
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionIndex);
    setCompletedSections(newCompleted);
  };

  const progressPercentage = (completedSections.size / guide.sections.length) * 100;

  const defaultQuickActions = {
    primary: {
      title: "Generate Your Chart",
      description: "Create your personalized natal chart to start exploring your astrological blueprint.",
      href: "/chart",
      linkText: "Create Natal Chart",
      backgroundColor: "#6bdbff"
    },
    secondary: {
      title: "Join the Discussion",
      description: "Share your insights and learn from the astrology community.",
      href: "/discussions",
      linkText: "Community Forum",
      backgroundColor: "#f2e356"
    }
  };

  const actions = quickActions || defaultQuickActions;

  // Content renderer based on guide type
  const renderSectionContent = (currentSection: number) => {
    switch (guide.id) {
      case 'natal-chart':
        return renderNatalChartContent(currentSection);
      case 'astrocartography':
        return <div className="text-black">
          <p className="mb-4">This guide covers astrocartography - the practice of using your birth chart to understand how different locations around the world might affect your life experience.</p>
          <p>Detailed content is being migrated to our new guide system. Please check back soon for the complete interactive guide.</p>
        </div>;
      default:
        return <div className="text-black">Content for this guide is being developed.</div>;
    }
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="px-[5%] py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/guides" 
                className="text-black hover:text-gray-700 font-medium flex items-center gap-2 font-open-sans"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>All Guides</span>
              </Link>
              <div className="w-1 h-6 bg-black"></div>
              <span 
                className="px-3 py-1.5 text-xs font-semibold text-black border border-black"
                style={{ backgroundColor: getLevelColor(guide.level) }}
              >
                {getLevelIcon(guide.level)} {guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-black font-open-sans">
                {guide.estimatedTime} • {completedSections.size}/{guide.sections.length} sections
              </div>
              <div className="w-32 bg-gray-200 h-2 border border-black">
                <div 
                  className="bg-black h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="px-[5%] py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 border border-black bg-white">
              <div className="p-6">
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Guide Contents</h3>
                <nav className="space-y-1">
                  {guide.sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => navigateToSection(index)}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 flex items-center justify-between group relative ${
                        currentSection === index
                          ? 'bg-black text-white'
                          : 'text-black hover:pl-6'
                      }`}
                    >
                      {/* Hover accent bar */}
                      {currentSection !== index && (
                        <div 
                          className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                          style={{ backgroundColor: '#19181a' }}
                        />
                      )}
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 flex items-center justify-center text-xs border border-black ${
                          completedSections.has(index)
                            ? 'bg-black text-white'
                            : currentSection === index
                            ? 'bg-white text-black'
                            : 'bg-white text-black'
                        }`}>
                          {completedSections.has(index) ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="flex-1 font-open-sans font-medium text-sm">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
              {/* Section Header */}
              <div className="border-b border-black p-8">
                <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-4">{guide.title}</h1>
                <p className="font-open-sans text-lg text-black/80 mb-6">{guide.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-black/70 font-open-sans">
                  <span>Section {currentSection + 1} of {guide.sections.length}</span>
                  <span>•</span>
                  <span>{guide.sections[currentSection].title}</span>
                </div>
              </div>

              {/* Section Content */}
              <div className="p-8">
                <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8">
                  {guide.sections[currentSection].title}
                </h2>
                
                <div className="max-w-none">
                  {renderSectionContent(currentSection)}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-black">
                  <button
                    onClick={() => navigateToSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold border-2 border-black transition-all duration-300 ${
                      currentSection === 0
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'text-black hover:bg-black hover:text-white hover:-translate-y-0.5'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {!completedSections.has(currentSection) && (
                      <button
                        onClick={() => handleSectionComplete(currentSection)}
                        className="px-6 py-3 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
                      >
                        Mark Complete
                      </button>
                    )}
                    
                    {currentSection < guide.sections.length - 1 ? (
                      <button
                        onClick={() => navigateToSection(currentSection + 1)}
                        className="px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 flex items-center gap-2"
                      >
                        <span>Next Section</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-black font-medium">🎉 Guide Complete!</span>
                        <Link
                          href="/guides"
                          className="px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 flex items-center gap-2"
                        >
                          <span>More Guides</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="px-[5%] py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
            <div className="p-8 border-r border-black" style={{ backgroundColor: actions.primary.backgroundColor }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-3">{actions.primary.title}</h3>
              <p className="font-open-sans text-black/80 text-sm mb-6">{actions.primary.description}</p>
              <Link
                href={actions.primary.href}
                className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all duration-300"
              >
                <span>{actions.primary.linkText}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="p-8" style={{ backgroundColor: actions.secondary.backgroundColor }}>
              <h3 className="font-space-grotesk text-xl font-bold text-black mb-3">{actions.secondary.title}</h3>
              <p className="font-open-sans text-black/80 text-sm mb-6">{actions.secondary.description}</p>
              <Link
                href={actions.secondary.href}
                className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all duration-300"
              >
                <span>{actions.secondary.linkText}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}