/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

interface GuideSection {
  id: string;
  title: string;
  type: string;
  content: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  sections: GuideSection[];
}

interface GuideLayoutProps {
  guide: Guide;
  currentSection: number;
  completedSections: Set<number>;
  onSectionChange: (sectionIndex: number) => void;
  onSectionComplete: (sectionIndex: number) => void;
  children: React.ReactNode;
  quickActions?: React.ReactNode;
}

export default function GuideLayout({
  guide,
  currentSection,
  completedSections,
  onSectionChange,
  onSectionComplete,
  children,
  quickActions
}: GuideLayoutProps) {
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

  const progressPercentage = (completedSections.size / guide.sections.length) * 100;

  return (
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
            <div className="w-40 bg-gray-200 rounded-full h-2 border border-black">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-[5%] pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-black p-6 sticky top-6">
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">Sections</h3>
              <nav className="space-y-2">
                {guide.sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => onSectionChange(index)}
                    className={`w-full text-left p-3 border border-black transition-all duration-300 group relative ${
                      currentSection === index
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {/* Hover accent bar */}
                    {currentSection !== index && (
                      <div 
                        className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300"
                        style={{ backgroundColor: '#6bdbff' }}
                      />
                    )}
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 flex items-center justify-center text-xs ${
                        completedSections.has(index)
                          ? 'bg-white text-black border border-black'
                          : currentSection === index
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
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
          <div className="lg:col-span-3 bg-white">
            {/* Section Header */}
            <div className="border-b border-black p-8">
              <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">{guide.title}</h1>
              <p className="text-black opacity-80 mb-6 text-lg leading-relaxed">{guide.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-black opacity-70">
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
              
              <div className="space-y-8">
                {children}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-black">
                <button
                  onClick={() => onSectionChange(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium border-2 transition-all duration-300 ${
                    currentSection === 0
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'text-black border-black hover:bg-black hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-3">
                  {!completedSections.has(currentSection) && (
                    <button
                      onClick={() => onSectionComplete(currentSection)}
                      className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-300 font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                  
                  {currentSection < guide.sections.length - 1 ? (
                    <button
                      onClick={() => onSectionChange(currentSection + 1)}
                      className="bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-300 font-medium flex items-center space-x-2"
                    >
                      <span>Next Section</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span className="text-black font-medium">🎉 Guide Complete!</span>
                      <Link
                        href="/guides"
                        className="bg-black text-white px-8 py-3 border-2 border-black hover:bg-white hover:text-black transition-all duration-300 font-medium flex items-center space-x-2"
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
      {quickActions && (
        <section className="px-[5%] py-12">
          {quickActions}
        </section>
      )}
    </div>
  );
}