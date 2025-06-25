/* eslint-disable react/no-unescaped-entities */
"use client";

import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';

export default function LearningCenterPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Learning Center
          </h1>
          <p className="font-inter text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
            Master the features of {BRAND.name} and deepen your understanding of astrology with our comprehensive guides.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8 text-center">Master {BRAND.name}'s Features</h2>
          
          {/* Featured Guides Grid - 2x2 Connected */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-black mb-12">
            {/* Natal Chart Feature - Top Left (Blue) */}
            <div className="group p-10 transition-all duration-300 relative border-r border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-space-grotesk text-2xl font-bold text-black mb-2">Natal Chart Analysis</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white text-black text-xs font-semibold border border-black">
                    <span className="w-2 h-2 bg-black"></span>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
              
              <p className="font-inter text-black/80 mb-6 leading-relaxed">
                Your natal chart is a cosmic snapshot of the sky at your exact moment of birth. It reveals your personality traits, life purpose, and potential challenges.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-space-grotesk font-semibold text-black">How to use:</h4>
                <ol className="space-y-3 font-inter text-black/80">
                  <li className="flex">
                    <span className="font-bold text-black mr-3">1.</span>
                    <span>Enter your birth date, time, and location in the form on the homepage</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">2.</span>
                    <span>Click "Generate Chart" to create your personalized natal chart</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">3.</span>
                    <span>View your Sun sign, Moon sign, Rising sign, and planetary placements</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">4.</span>
                    <span>Explore the 12 houses to understand different life areas</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-4 border border-black">
                <p className="font-inter text-sm text-black">
                  <strong>💡 Pro tip:</strong> Save your chart data to quickly access it later and track transits affecting your birth placements.
                </p>
              </div>

              <Link
                href="/chart"
                className="inline-flex items-center gap-2 mt-6 text-black font-semibold hover:gap-3 transition-all duration-300"
              >
                <span>Try Natal Chart</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Horary Astrology Feature - Top Right (Yellow) */}
            <div className="group p-10 transition-all duration-300 relative border-b border-black" style={{ backgroundColor: '#f2e356' }}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-space-grotesk text-2xl font-bold text-black mb-2">Horary Astrology</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white text-black text-xs font-semibold border border-black">
                    <span className="w-2 h-2 bg-black animate-pulse"></span>
                    <span>New Feature!</span>
                  </div>
                </div>
              </div>
              
              <p className="font-inter text-black/80 mb-6 leading-relaxed">
                Horary astrology answers specific questions by creating a chart for the moment the question is asked. It's like consulting the cosmos for guidance.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-space-grotesk font-semibold text-black">How to use:</h4>
                <ol className="space-y-3 font-inter text-black/80">
                  <li className="flex">
                    <span className="font-bold text-black mr-3">1.</span>
                    <span>Navigate to the Horary page from the menu</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">2.</span>
                    <span>Type your sincere question (avoid yes/no questions)</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">3.</span>
                    <span>Select a category that best fits your question</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">4.</span>
                    <span>Submit to generate a horary chart and receive cosmic guidance</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-4 border border-black">
                <p className="font-inter text-sm text-black">
                  <strong>💡 Pro tip:</strong> Ask clear, specific questions about matters that genuinely concern you for the most accurate readings.
                </p>
              </div>

              <Link
                href="/guides/horary-astrology"
                className="inline-flex items-center gap-2 mt-6 text-black font-semibold hover:gap-3 transition-all duration-300"
              >
                <span>Learn Horary</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Astrocartography Feature - Bottom Left (Green) */}
            <div className="group p-10 transition-all duration-300 relative border-r border-black" style={{ backgroundColor: '#51bd94' }}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-space-grotesk text-2xl font-bold text-black mb-2">Astrocartography</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white text-black text-xs font-semibold border border-black">
                    <span className="w-2 h-2 bg-black"></span>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
              
              <p className="font-inter text-black/80 mb-6 leading-relaxed">
                Discover how different locations around the world can enhance various aspects of your life based on your birth chart's planetary lines.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-space-grotesk font-semibold text-black">How to use:</h4>
                <ol className="space-y-3 font-inter text-black/80">
                  <li className="flex">
                    <span className="font-bold text-black mr-3">1.</span>
                    <span>Generate your natal chart first (required for calculations)</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">2.</span>
                    <span>Go to the Astrocartography page</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">3.</span>
                    <span>View your planetary power lines on the world map</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">4.</span>
                    <span>Click any location to see which planetary energies are strongest there</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-4 border border-black">
                <p className="font-inter text-sm text-black">
                  <strong>💡 Pro tip:</strong> Look for Jupiter lines for luck and expansion, Venus lines for love and beauty, or Sun lines for success and vitality.
                </p>
              </div>

              <Link
                href="/astrocartography"
                className="inline-flex items-center gap-2 mt-6 text-black font-semibold hover:gap-3 transition-all duration-300"
              >
                <span>Explore Map</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Event Planning Feature - Bottom Right (Purple) */}
            <div className="group p-10 transition-all duration-300 relative" style={{ backgroundColor: '#ff91e9' }}>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🗓️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-space-grotesk text-2xl font-bold text-black mb-2">Event Planning</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white text-black text-xs font-semibold border border-black">
                    <span className="w-2 h-2 bg-black"></span>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
              
              <p className="font-inter text-black/80 mb-6 leading-relaxed">
                Use electional astrology to find the most auspicious times for important events like weddings, business launches, or major decisions.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-space-grotesk font-semibold text-black">How to use:</h4>
                <ol className="space-y-3 font-inter text-black/80">
                  <li className="flex">
                    <span className="font-bold text-black mr-3">1.</span>
                    <span>Navigate to the Events page</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">2.</span>
                    <span>Select your event type (wedding, business, travel, etc.)</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">3.</span>
                    <span>Choose your preferred date range and location</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-black mr-3">4.</span>
                    <span>View optimal timing suggestions based on planetary alignments</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white p-4 border border-black">
                <p className="font-inter text-sm text-black">
                  <strong>💡 Pro tip:</strong> Avoid Mercury retrograde for contracts and communication, and choose Venus-ruled days for weddings and social events.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center gap-2 mt-6 text-black font-semibold hover:gap-3 transition-all duration-300"
              >
                <span>Plan Events</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">More Features to Explore</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black">
            {/* Community Forum */}
            <div className="group p-8 hover:bg-gray-50 transition-all duration-300 relative border-r border-b border-black">
              <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300" style={{ backgroundColor: '#19181a' }}></div>
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-space-grotesk font-semibold text-black mb-2">Community Forum</h4>
              <p className="font-inter text-sm text-black/80 mb-4">
                Join discussions, share insights, and learn from fellow astrology enthusiasts.
              </p>
              <Link href="/discussions" className="font-inter text-black font-semibold hover:text-gray-700 text-sm transition-colors">
                Join Discussions →
              </Link>
            </div>

            {/* Chart History */}
            <div className="group p-8 hover:bg-gray-50 transition-all duration-300 relative border-r border-b border-black lg:border-r-0">
              <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300" style={{ backgroundColor: '#19181a' }}></div>
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-space-grotesk font-semibold text-black mb-2">Chart History</h4>
              <p className="font-inter text-sm text-black/80 mb-4">
                Access all your previously generated charts and horary questions.
              </p>
              <Link href="/chart" className="font-inter text-black font-semibold hover:text-gray-700 text-sm transition-colors">
                View History →
              </Link>
            </div>

            {/* Learning Resources */}
            <div className="group p-8 hover:bg-gray-50 transition-all duration-300 relative border-b border-black">
              <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300" style={{ backgroundColor: '#19181a' }}></div>
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-space-grotesk font-semibold text-black mb-2">Astrology Guides</h4>
              <p className="font-inter text-sm text-black/80 mb-4">
                Deep dive into aspects, houses, signs, and advanced astrological concepts.
              </p>
              <Link href="/guides" className="font-inter text-black font-semibold hover:text-gray-700 text-sm transition-colors">
                Read Guides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Guide Section */}
      <section className="px-[5%] py-12" style={{ backgroundColor: '#f0e3ff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-black p-8">
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">Quick Start Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="text-center p-6 border-r border-black">
                <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-space-grotesk text-white">1</span>
                </div>
                <h4 className="font-space-grotesk font-semibold text-black mb-2">Create Your Profile</h4>
                <p className="font-inter text-sm text-black/80">
                  Enter your birth details on the homepage to generate your natal chart
                </p>
              </div>
              
              <div className="text-center p-6 border-r border-black">
                <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-space-grotesk text-white">2</span>
                </div>
                <h4 className="font-space-grotesk font-semibold text-black mb-2">Explore Features</h4>
                <p className="font-inter text-sm text-black/80">
                  Try horary questions, check your astrocartography, or plan events
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-space-grotesk text-white">3</span>
                </div>
                <h4 className="font-space-grotesk font-semibold text-black mb-2">Join Community</h4>
                <p className="font-inter text-sm text-black/80">
                  Share insights and learn from others in our discussion forums
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-4">Ready to Begin Your Astrological Journey?</h3>
          <p className="font-inter text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            {BRAND.name} combines ancient wisdom with modern technology to help you understand yourself and navigate life's journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              <span>Start Exploring</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/discussions"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
            >
              <span>Join Community</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}